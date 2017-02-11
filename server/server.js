import Koa from 'koa';
import config from './config.js';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import serve from 'koa-static';
import sendfile from 'koa-sendfile';
import jwt from 'jsonwebtoken-promisified';
import WhatAuth from 'whatauth';
const whatauth = new WhatAuth(config.auth);

const { Schema } = mongoose;
const { ObjectId } = Schema;
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo);

const Coder = mongoose.model('Coder', new Schema({
  display: String,
  emails:  {type: [String], default: [], unique: true},
  idents:  {type: [String], default: [], unique: true},
  avatars: {type: [String], default: []},
  roles:   {type: [String], default: []},
}));

const Post = mongoose.model('Post', new Schema({
  author:    {type: ObjectId, ref: 'Coder'},
  comments: [{type: ObjectId, ref: 'Comment'}],
  path:      {type: String, unique: true, sparse: true},
  title:     String,
  content:   String,
  image:     String,
  posted:    Date,
}));

const Comment = mongoose.model('Comment', new Schema({
  author:  {type: ObjectId, ref: 'Coder'},
  created: Date,
  content: String,
}));

const app = new Koa();
app.use(require('koa-bodyparser')());
const router = require('koa-router')({ prefix: '/s' });

router.get('/posts', async ctx => {
  if (ctx.query && ctx.query.path) {
    const post = await Post.findOne({'path': ctx.query.path});
    ctx.body = {post};
  } else {
    const posts = await Post.find();
    ctx.body = {posts};
  }
});

router.get('/posts/:post_id', async ctx => {
  ctx.body = {post: await Post.findById(ctx.params.post_id)};
});

router.post('/posts', loadCoder, async ctx => {
  const data = ctx.request.body.post;
  const post = await Post.create({
    author: ctx.state.coder._id,
    comments: [],
    posted:   new Date(),
    content:  data.content,
    path:     data.path,
    title:    data.title,
    image:    data.image,
  });
  ctx.body = {post};
});

router.get('/coders/:coder_id', async ctx => {
  let coder = await Coder.findById(ctx.params.coder_id);
  coder = coder && {
    _id:     coder._id,
    display: coder.display,
    avatar:  coder.avatars[0],
  };
  ctx.body = {coder};
});

router.get('/comments/:comment_id', async ctx => {
  const comment = await Comment.findById(ctx.params.comment_id);
  ctx.body = {comment};
});

router.post('/comments', loadCoder, async ctx => {
  const data = ctx.request.body.comment;
  const comment = await Comment.create({
    author: ctx.state.coder._id,
    created: new Date(),
    content: data.content,
  });
  const post = await Post.findById(data.post);
  post.comments.push(comment._id);
  post.save();
  ctx.body = {comment};
});

router.get('/token', async ctx => {
  const data = await whatauth.fetch(ctx.query);
  const avatar = await fetchAvatar(data.image);
  let coder = await Coder.findOne({idents: data.ident});
  if (coder) {
    if (!coder.emails.includes(data.email)) { coder.emails.push(data.email); }
    if (!coder.idents.includes(data.ident)) { coder.idents.push(data.ident); }
    if (!coder.avatars.includes(avatar))    { coder.avatars.push(avatar); }
    coder.save();
  } else {
    coder = await Coder.create({
      display:  data.name,
      emails:  [data.email],
      idents:  [data.ident],
      avatars: [avatar],
    });
  }
  const token = jwt.sign({
    sub: coder._id,
    can: coder.roles,
    exp: Math.floor(Date.now()/1000) + 28800,
  }, config.jwt_secret);
  ctx.body = { token };
});

async function loadCoder(ctx, next) {
  const token = ctx.header.authorization.split("Bearer ")[1];
  const claims = await jwt.verifyAsync(token, config.jwt_secret);
  ctx.state.coder = await Coder.findById(claims.sub);
  await next();
}

function fetchAvatar(url) {
  return new Promise(function(keep, braek) {
    const arg = "'"+url.replace(/\'/g,"'\''")+"'";
    exec("./fetch-avatar.sh " + arg, function(err, avatar, stderr) {
      if (err || stderr) { return braek(err || stderr); }
      keep(avatar);
    });
  });
}

app.use(serve('./public'));
app.use(serve('../client/dist'));
app.use(router.routes());
app.use(async ctx => {
  await sendfile(ctx, '../client/dist/index.html');
});


module.exports = app.listen(config.port);

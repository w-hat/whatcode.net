import Koa from 'koa';
import colors from 'colors';
import config from './config.js';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import serve from 'koa-static';
import sendfile from 'koa-sendfile';
import jwt from 'jsonwebtoken-promisified';
import WhatAuth from 'whatauth';
const whatauth = new WhatAuth(config.auth);

import nodemailer from 'nodemailer';

//import markdown from 'markdown-it';
//const md = markdown({linkify: true});

const app = new Koa();

let sentEmails = [];
if (config.email && (config.email.service === 'queue')) {
  app.email = {
    sendMail(mail, callback) {
      sentEmails.push(mail);
      if (callback) { callback(null, {}); }
    },
  };
} else if (config.email && (config.email.service !== 'console')) {
  app.email = nodemailer.createTransport(config.email);
} else {
  app.email = {
    sendMail(mail, callback) {
      const lines = ['',
        '=========='.yellow,
        'Sending email via console:'.yellow,
        'From: '.yellow + mail.from,
        'To: '.yellow + mail.to,
        'Subject: '.yellow + mail.subject,
        'Html: '.yellow + mail.html.replace(/\<p\>/g, '\n<p>')
                                   .replace(/\n/g, '\n|| '.yellow),
        '==========\n'.yellow,
      ];
      console.log(lines.join('\n|| '.yellow));
      const err = null;
      const info = {};
      if (callback) {
        callback(err, info);
      }
    },
  };
}

app.email.sendShareIdea = async function(idea, coder, invite) {
  const sanitize = (s) => s.replace(/[^\w \@\$\%\'\"]+/g, '');
  const coder_display = sanitize(coder.display);
  const idea_title = sanitize(idea.title);
  const message = sanitize(invite.message);
  const href = config.url + '/idea/' + idea._id + '?access=' + idea.access();
  let parts = ['<p>', coder_display, ' shared an idea with you:</p>',
               '<p><a href="', href,'">', idea_title, '</a></p>',];
  if (message) {
    parts = parts.concat(['<p><blockquote>', message, '</blockquote></p>']);
  }
  parts = parts.concat(['<p>Thanks,<br />', config.email.name, '</p>']);
  const mail = {
    'from': config.email.sender,
    'to': invite.email,
    'subject': coder_display + ' shared an idea with you: ' + idea_title,
    'html': parts.join(''),
  };
  return await app.email.sendMail(mail);
}

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

const IdeaSchema = new Schema({
  owner: {type: ObjectId, ref: 'Coder'},
  creator: {type: ObjectId, ref: 'Coder'},
  owners: {type: [{type:ObjectId, ref:'Coder'}], default: [], index: true},
  parent: {type: ObjectId, ref: 'Idea'},
  created: Date,
  target: Date,
  title: String,
  body: String,
  completed: Date,
  deadline: Date,
  placement: Number,
  importance: Number,
});

IdeaSchema.methods.removeAll = async function() {
  const cursor = Idea.find({parent: this}).cursor();
  await cursor.eachAsync(async function(child) {
    await child.removeAll();
  });
  this.remove();
};

IdeaSchema.methods.ownedBy = function(coder) {
  return coder && coder._id && this.owners.map(o => o.toString()).includes(coder._id.toString());
};

IdeaSchema.methods.access = function() {
  return this.created.getTime().toString(32).slice(4);
};

IdeaSchema.methods.share = async function(coder) {
  const cursor = Idea.find({parent: this}).cursor();
  await cursor.eachAsync(async function(child) {
    await child.share(coder);
  });
  this.owners.push(coder._id);
  this.save();
};

IdeaSchema.methods.withChildren = async function() {
  let idea = this.toJSON();
  const children = await Idea.find({parent: idea}).select('id').lean();
  idea.children = children.map(obj => obj._id);
  return idea;
};

const Idea = mongoose.model('Idea', IdeaSchema);

app.use(require('koa-bodyparser')());
const router = require('koa-router')({ prefix: '/s' });

router.get('/posts', async ctx => {
  if (ctx.query && ctx.query.path) {
    const post = await Post.findOne({'path': ctx.query.path}).lean();
    ctx.body = {post};
  } else {
    const posts = await Post.find().lean();
    ctx.body = {posts};
  }
});

router.get('/posts/:post_id', async ctx => {
  ctx.body = {post: await Post.findById(ctx.params.post_id)};
});

router.post('/posts', loadCoder, async ctx => {
  const data = ctx.request.body.post;
  const path = data.path || data.title.replace(/\s+/g, '-').toLowerCase();
  const post = await Post.create({
    author: ctx.state.coder._id,
    comments: [],
    posted:   new Date(),
    content:  data.content,
    title:    data.title,
    image:    data.image,
    path,
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
  const post = data.post && await Post.findById(data.post);
  if (!post) {
    ctx.status = 404;
    return;
  }
  const comment = await Comment.create({
    author: ctx.state.coder._id,
    created: new Date(),
    content: data.content,
  });
  post.comments.push(comment._id);
  post.save();
  ctx.body = {comment};
});

router.get('/ideas', loadCoder, async ctx => {
  if (!ctx.state.coder) {
    ctx.status = 401;
    ctx.body = {ideas: []};
    return;
  }
  if (ctx.query.id) {
    const idea = await Idea.findById(ctx.query.id);
    if (idea.ownedBy(ctx.state.coder)) {
      ctx.body = {idea: await idea.withChildren()};
    } else if (idea.access() === ctx.query.access) {
      await idea.share(ctx.state.coder);
      ctx.body = {idea: await idea.withChildren()};
    } else {
      ctx.status = 401;
    }
  } else {
    const ideas = await Idea.find({owners: ctx.state.coder._id}).lean();
    ctx.body = {ideas};
  }
});

router.get('/ideas/:idea_id', loadCoder, async ctx => {
  let idea = await Idea.findById(ctx.params.idea_id);
  if (idea && idea.ownedBy(ctx.state.coder)) {
    idea = await idea.withChildren();
    ctx.body = {idea};
  } else {
    ctx.status = 401;
  }
});

router.post('/ideas', loadCoder, async ctx => {
  const data = ctx.request.body.idea;
  let owners = [ctx.state.coder._id];
  if (data.parent) {
    const parent = await Idea.findById(data.parent);
    if (parent) {
      if (!parent.ownedBy(ctx.state.coder)) {
        ctx.status = 401;
        return;
      }
      owners = parent.owners;
    }
  }
  const idea = await Idea.create({
    owner: ctx.state.coder._id,
    creator: ctx.state.coder._id,
    owners,
    created: new Date(),
    target: data.target,
    parent: data.parent,
    title: data.title,
    body: data.body,
    completed: null,
    deadline: data.deadline,
    importance: 0,
    placement: Date.now(),
  });
  idea.save();
  ctx.body = {idea};
});

router.put('/ideas/:idea_id', loadCoder, async ctx => {
  const data = ctx.request.body.idea;
  const idea = await Idea.findById(ctx.params.idea_id);
  if (!idea.ownedBy(ctx.state.coder)) {
    ctx.status = 401;
    return;
  }
  idea.title = data.title;
  idea.body = data.body;
  idea.parent = data.parent;
  idea.target = data.target;
  idea.completed = data.completed;
  idea.deadline = data.deadline;
  idea.importance = (!data.completed) && data.importance;
  idea.placement = data.placement || (idea.created && idea.created.getTime());
  idea.save();
  ctx.body = { idea };
});

router.delete('/ideas/:idea_id', loadCoder, async ctx => {
  const idea = await Idea.findById(ctx.params.idea_id);
  if (!idea.ownedBy(ctx.state.coder)) {
    ctx.status = 401;
    return;
  }
  await idea.removeAll();
  ctx.body = { idea };
});

router.post('/share-idea', loadCoder, async ctx => {
  const body = ctx.request.body;
  const idea = await Idea.findById(body.idea_id);
  if (!idea.ownedBy(ctx.state.coder)) {
    ctx.status = 401;
    return;
  }
  const invite = { email: body.email, message: body.message};
  await app.email.sendShareIdea(idea, ctx.state.coder, invite);
  ctx.body = { idea };
});

router.get('/token', async ctx => {
  const token = await genToken(ctx.query);
  ctx.body = { token };
});

async function loadCoder(ctx, next) {
  const auth = ctx.header.authorization || ctx.header.auth;
  if (!auth) {
    ctx.status = 401;
  } else {
    const token = auth.split("Bearer ")[1];
    const claims = await jwt.verifyAsync(token, config.jwt_secret);
    ctx.state.coder = await Coder.findById(claims.sub);
    await next();
  }
}

async function genToken(query) {
  const data = await whatauth.fetch(query);
  const avatar = (data.image ? await fetchAvatar(data.image) : 'default.png');
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
  return jwt.sign({
    sub: coder._id,
    can: coder.roles,
    exp: Math.floor(Date.now()/1000) + 86400,
  }, config.jwt_secret);
}

async function fetchAvatar(url) {
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
app.use(async ctx => { await sendfile(ctx, '../client/dist/index.html'); });

const server = app.listen(config.port);
server.genToken = genToken;
server.sentEmails = sentEmails;

module.exports = server;


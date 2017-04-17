import chai from 'chai';
import server from '../server.js';
import mongoose from 'mongoose';
import nmf from 'node-mongoose-fixtures';
import fixtures from './fixtures.js';
import bearerToken from './bearer-token.js';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const request = require('supertest').agent(server);

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

describe("Javascript", () => {
  it('should be Javascript.', () => {
    assert.deepEqual(['10','10','10'].map(parseInt), [10, NaN, 2]);
  });
});

describe('Server', () => {
  
  before(done => {
    nmf.reset(mongoose, () => { nmf(fixtures, done); });
  });

  describe('GET /s/posts', () => {
    it('should be a route', done => {
      request.get('/s/posts').expect(200, done);
    });
    
    it('should return a list of posts', done => {
      request.get('/s/posts').expect(200).expect(res => {
        const posts = res.body.posts;
        expect(posts).to.have.length.of.at.least(1);
        for (let post of posts) {
          expect(post._id).to.be.a('string');
          expect(post.author).to.be.a('string');
          expect(post.title).to.be.a('string');
        }
      }).end(done);
    });
  });
  
  describe('GET /s/posts/:post_id', () => {
    it("should return posts by id", done => {
      request.get('/s/posts/' + fixtures.Post[0]._id).expect(res => {
        res.body.post.path.should.equal("life-is-like-a-sonnet");
      }).expect(200, done);
    });
  });
  
  describe('GET /s/posts?path=', () => {
    it("should return posts by path", done => {
      request.get('/s/posts?path=life-is-like-a-sonnet').expect(res => {
        res.body.post.title.should.equal("Life is like a Sonnet");
      }).expect(200, done);
    });
  });
  
  describe('POST /s/posts', () => {
    it('should not work if the coder is not logged in', done => {
      const body = {post: {title: 'spam', body: 'spam spam'}};
      request.post('/s/posts').send(body).expect(401, done);
    });
    
    it('should create a post', async () => {
      const a = await bearerToken('brain');
      const b = {post: {
        title: 'How to Take Over the World',
        content: "Pinky, are you pondering what I'm pondering?",
        image: "/images/user/two-mice.jpg",
      }};
      let posts = await Post.find();
      expect(posts).to.have.length(2);
      await request.post('/s/posts').send(b).set('auth', a).expect(200);
      posts = await Post.find();
      expect(posts).to.have.length(3);
      posts = await Post.find({title: "How to Take Over the World"});
      expect(posts).to.have.length(1);
      expect(posts[0].author.equals(fixtures.Coder[2]._id)).to.be.true;
      expect(posts[0].path).to.equal('how-to-take-over-the-world');
    });
  });
  
  describe('PUT /s/posts/:post_id', () => {
    it('should update a post');
  });
  
  describe('DELETE /s/posts/:post_id', () => {
    it('should delete a post');
  });
  
  describe('GET /s/comments/:comment_id', () => {
    it('should return a comment', done => {
      const path = '/s/comments/' + fixtures.Comment[0]._id;
      request.get(path).expect(res => {
        res.body.comment.content.should.contain('self');
      }).expect(200, done);
    });
  });
  
  describe('POST /s/comments', () => {
    it('should not work if the coder is not logged in', done => {
      const body = {comment: {content: 'spam'}};
      request.post('/s/comments').send(body).expect(401, done);
    });
    
    it('should not work if the post does not exist', async () => {
      const a = await bearerToken('pinky');
      const b = {comment: {content: 'floating text'}};
      return request.post('/s/comments').send(b).set('auth', a).expect(404);
    });
    
    it('should add a comment to a post', async () => {
      const a = await bearerToken('pinky');
      const post_id = fixtures.Post[0]._id;
      const b = {comment: {post: post_id, content: 'I love this book.'}};
      await request.post('/s/comments').send(b).set('auth', a).expect(200);
      const post = await Post.findById(post_id);
      expect(post.comments).to.have.length(2);
      const comment = await Comment.findById(post.comments[1]);
      expect(comment.content).to.equal('I love this book.');
    });
  });
  
  describe('GET /s/coders/:coder_id', () => {
    it('should return a coder', done => {
      const admin_id = fixtures.Coder[0]._id;
      request.get('/s/coders/' + admin_id).expect(200).end((err, res) => {
        if (err) { return done(err); }
        const coder = res.body.coder;
        coder.display.should.equal('Ad Minima');
        expect(coder.emails).to.be.undefined;
        assert.isUndefined(coder.idents);
        done();
      });
    });
  });
});


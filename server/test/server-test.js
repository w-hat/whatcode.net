import chai from 'chai';
import server from '../server.js';
import mongoose from 'mongoose';
import nmf from 'node-mongoose-fixtures';
import fixtures from './fixtures.js';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const request = require('supertest').agent(server);

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
  
  describe('GET /s/posts?path=', () => {
    it("should return posts by path", done => {
      request.get('/s/posts?path=life-is-like-a-sonnet').expect(res => {
        res.body.post.title.should.equal("Life is like a Sonnet");
      }).expect(200, done);
    });
  });
  
  describe('GET /s/comments/:comment_id', () => {
    it('should return a comment', done => {
      const path = '/s/comments/' + fixtures.Comment[0]._id;
      request.get(path).expect(res => {
        res.body.comment.content.should.contain('self');
      }).expect(200, done);
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

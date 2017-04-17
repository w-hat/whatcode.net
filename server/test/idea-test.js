import {expect} from 'chai';
import server from '../server.js';
import mongoose from 'mongoose';
import nmf from 'node-mongoose-fixtures';
import fixtures from './fixtures.js';
import bearerToken from './bearer-token.js';

const request = require('supertest').agent(server);

const Idea = mongoose.model('Idea');

describe('Idea', () => {
  before(done => {
    nmf.reset(mongoose, () => { nmf(fixtures, done); });
  });
  
  describe('GET /s/ideas', () => {
    it('should not return ideas if coder is not logged in', async () => {
      return request.get('/s/ideas').expect(401);
    });
    
    it('should return a list of ideas', async () => {
      const a = await bearerToken('brain');
      return request.get('/s/ideas').set('auth', a).expect(200).expect(res => {
        const ideas = res.body.ideas;
        expect(ideas).to.have.length.of.at.least(1);
        for (let idea of ideas) {
          expect(idea._id).to.be.a('string');
          expect(idea.owner).to.be.a('string');
          expect(idea.title).to.be.a('string');
        }
      });
    });
    
    it("should return only the owner's ideas", async () => {
      const bearer = await bearerToken('pinky');
      return request.get('/s/ideas').set('auth', bearer).expect(res => {
        const ideas = res.body.ideas;
        expect(ideas).to.have.length(1);
        expect(ideas[0]._id).to.be.a('string');
        expect(ideas[0].title).to.equal('Narf');
      });
    });
  });
  
  describe('GET /s/ideas/:idea_id', () => {
    it('should return an idea', async () => {
      const bearer = await bearerToken('pinky');
      const path = '/s/ideas/' + fixtures.Idea[0]._id;
      return request.get(path).set('auth', bearer).expect(res => {
        expect(res.body.idea.title).to.equal('Narf');
      }).expect(200);
    });
    
    it("should not return another coder's idea", async () => {
      const bearer = await bearerToken('pinky');
      const path = '/s/ideas/' + fixtures.Idea[1]._id;
      return request.get(path).set('auth', bearer).expect(res => {
        expect(res.body.idea).to.be.undefined;
      }).expect(401);
    });
  });
  
  describe('POST /s/ideas', () => {
    it('should not work if the coder is not logged in', done => {
      const body = {post: {title: 'sleep', body: 'sleep for eight hours.'}};
      request.post('/s/ideas').send(body).expect(401, done);
    });
    
    it('should create an idea.', async () => {
      const a = await bearerToken('brain');
      const b = {idea: {
        title: 'Make money',
        body: "Make money by winning the lottery.",
      }};
      let ideas = await Idea.find();
      expect(ideas).to.have.length(2);
      await request.post('/s/ideas').send(b).set('auth', a).expect(200);
      ideas = await Idea.find();
      expect(ideas).to.have.length(3);
      ideas = await Idea.find({title: 'Make money'});
      expect(ideas).to.have.length(1);
      expect(ideas[0].owner.equals(fixtures.Coder[2]._id)).to.be.true;
    });
    
    it('should create an idea with a parent.', async () => {
      const a = await bearerToken('brain');
      let ideas = await Idea.find({title: 'Make money'});
      expect(ideas).to.have.length(1);
      const make_money = ideas[0];
      const b = {idea: {
        title: 'Buy lottery tickets',
        body: "Buy one billion lottery tickets",
        parent: make_money._id,
      }};
      await request.post('/s/ideas').send(b).set('auth', a).expect(200);
      ideas = await Idea.find({parent: make_money});
      expect(ideas).to.have.length(1);
      expect(ideas[0].title).to.equal("Buy lottery tickets");
    });
  });
  
  describe('PUT /s/ideas/:idea_id', () => {
    it('should not work if the coder is not logged in', async () => {
      let ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
      const buy_tickets = ideas[0];
      const body = {idea: {title: 'Buy ponies', body: 'Ponies are pretty'}};
      const url = '/s/ideas/' + buy_tickets._id;
      return request.put(url).send(body).expect(401);
    });
    
    it('should not work if the coder is not the idea owner', async () => {
      const a = await bearerToken('pinky');
      let ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
      const buy_tickets = ideas[0];
      expect(buy_tickets.body).to.contain('billion');
      const b = {idea: {
        title: buy_tickets.title,
        body: "Buy balloons",
        parent: buy_tickets.parent,
      }};
      const url = '/s/ideas/' + buy_tickets._id;
      return request.put(url).send(b).set('auth', a).expect(401);
    });
    
    it('should update an idea', async () => {
      const a = await bearerToken('brain');
      let ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
      const buy_tickets = ideas[0];
      expect(buy_tickets.body).to.contain('billion');
      const b = {idea: {
        title: buy_tickets.title,
        body: "Buy ten thousand lottery tickets",
        parent: buy_tickets.parent,
      }};
      const url = '/s/ideas/' + buy_tickets._id;
      await request.put(url).send(b).set('auth', a).expect(200);
      ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
      expect(ideas[0].body).to.equal('Buy ten thousand lottery tickets');
    });
  });
  
  describe('DELETE /s/ideas/:idea_id', () => {
    it('should not work if the coder is not logged in', async () => {
      let ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
      const url = '/s/ideas/' + ideas[0]._id;
      await request.del(url).expect(401);
      ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(1);
    });
    
    it('should not work if the coder is not the idea owner', async () => {
      const pinky_auth = await bearerToken('pinky');
      const query = {title: 'Buy lottery tickets'};
      let ideas = await Idea.find(query);
      expect(ideas).to.have.length(1);
      const url = '/s/ideas/' + ideas[0]._id;
      await request.del(url).set('auth', pinky_auth).expect(401);
      ideas = await Idea.find(query);
      expect(ideas).to.have.length(1);
    });
    
    it('should delete an idea', async () => {
      const pinky_auth = await bearerToken('pinky');
      const query = {title: 'Narf'};
      let ideas = await Idea.find(query);
      expect(ideas).to.have.length(1);
      const url = '/s/ideas/' + ideas[0]._id;
      await request.del(url).set('auth', pinky_auth).expect(200);
      ideas = await Idea.find(query);
      expect(ideas).to.have.length(0);
    });
    
    it('should delete the children of the idea too', async () => {
      const brain_auth = await bearerToken('brain');
      let ideas = await Idea.find({title: 'Make money'});
      expect(ideas).to.have.length(1);
      const url = '/s/ideas/' + ideas[0]._id;
      await request.del(url).set('auth', brain_auth).expect(200);
      ideas = await Idea.find({title: 'Buy lottery tickets'});
      expect(ideas).to.have.length(0);
    });
  });
});


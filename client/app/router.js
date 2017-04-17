import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('post', { path: "/post/:path"});
  this.route('edit');
  this.route('ideas');
  this.route('idea', { path: "/idea/:id"});
});

export default Router;

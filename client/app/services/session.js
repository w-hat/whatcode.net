import Ember from 'ember';
import WhatSession from "ember-what-session/services/session";

export default WhatSession.extend({
  store: Ember.inject.service(),
  coder: Ember.computed('claims.sub', function() {
    const coder_id = this.get('claims.sub');
    if (coder_id) {
      return this.get('store').findRecord('coder', coder_id);
    } else {
      return null;
    }
  }),
  deauthenticate() {
    this._super(...arguments);
    const store = this.get('store');
    if (store) {
      store.unloadAll();
    }
  },
  ideas: Ember.computed('coder', function() {
    if (this.get('coder')) {
      return this.get('store').findAll('idea');
    } else {
      return [];
    }
  }),
  importantIdeas: Ember.computed.filterBy('ideas', 'importance'),
  rootIdeas: Ember.computed('ideas.@each.parent', function() {
    return this.get('ideas').rejectBy('parent.id');
  }),
});

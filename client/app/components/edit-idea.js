import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['edit-idea'],
  idea: {},
  callback() {},
  actions: {
    save() {
      const idea = this.get('idea');
      if (typeof idea.save === 'function') {
        idea.save();
      } else {
        this.get('store').createRecord('idea', idea).save();
      }
      this.get('callback')();
    }
  }
});

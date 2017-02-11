import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  'path': Ember.computed('post.title', function() {
    const title = this.get('post.title') || '';
    return title.replace(/\s+/g, '-').toLowerCase();
  }),
  actions: {
    publish() {
      const post = this.get('store').createRecord('post', {
        title: this.get('post.title'),
        content: this.get('post.content'),
        path: this.get('path'),
        image: this.get('post.image'),
      }).save();
      this.get('routing').router.transitionTo('post', post);
    }
  }
});

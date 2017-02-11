import Ember from 'ember';

export default Ember.Component.extend({
  comment: Ember.computed('session.coder', function() {
    return Ember.Object.create({
      post: this.get('post'),
      author: this.get('session.coder'),
      created: '▮▮▮ ▮▮▮ ▮▮ ▮▮▮▮ ▮▮:▮▮:▮▮ GMT-▮▮▮▮ (▮▮▮)',
      content: '',
    });
  }),
  store: Ember.inject.service(),
  actions: {
    showModal(bool) {
      const controller = Ember.getOwner(this).lookup('controller:application');
      controller.set('showModal', bool);
    },
    submit() {
      const comment = this.get('comment');
      this.get('store').createRecord('comment', {
        content: comment.content,
        post:    comment.post,
        author:  comment.author,
      }).save();
      this.set('comment.content', '');
    }
  }
});

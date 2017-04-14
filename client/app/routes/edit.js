import Ember from 'ember';

export default Ember.Route.extend({
  model(/* params */) {
    return {
      title: 'Untitled Post',
      author: this.get('session.coder'),
      posted: '▮▮▮ ▮▮▮ ▮▮ ▮▮▮▮ ▮▮:▮▮:▮▮ GMT-▮▮▮▮ (▮▮▮)',
      path: '/',
      image: '/ember-welcome-page/images/construction.png'
    };
  },
  titleToken: 'Edit Post'
});

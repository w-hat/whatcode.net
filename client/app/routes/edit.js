import Ember from 'ember';

export default Ember.Route.extend({
  model(/* params */) {
    const d = new Date();
    const posted = d.toDateString() + ' --:--:--' + d.toTimeString().slice(8);
    return {
      title: 'Untitled Post',
      author: this.get('session.coder'),
      image: '/ember-welcome-page/images/construction.png',
      path: '/',
      posted,
    };
  },
  titleToken: 'Edit Post'
});

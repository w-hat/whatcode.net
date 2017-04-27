import Ember from 'ember';

export default Ember.Component.extend({
  idea: null,
  email: "",
  message: "",
  callback() {},
  actions: {
    share() {
      const email = this.get('email');
      const message = this.get('message');
      const idea_id = this.get('idea.id');
      const data = {email, message, idea_id};
      Ember.$.post('/s/share-idea', data).then(() => {
        alert('An email was sent to ' + email + '.');
        this.set('email', '');
        this.set('message', '');
        this.get('callback')();
      });
    },
  },
});


import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['settings'],
  avatars: Ember.computed('session.coder.avatar', function() {
    return [this.get('session.coder.avatar'), this.get('session.coder.avatar')];
  }),
});


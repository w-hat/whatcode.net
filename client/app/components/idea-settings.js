import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['idea-settings'],
  toggle: Ember.computed('session.showCompletedIdeas', function() {
    return this.get('session.showCompletedIdeas') ? 'toggle-on' : 'toggle-off';
  }),
  showCompletedText: Ember.computed('session.showCompletedIdeas', function() {
    return this.get('session.showCompletedIdeas') ? 'Hide Completed' : 'Show All';
  }),
  actions: {
    toggleShowCompleted() {
      this.toggleProperty('session.showCompletedIdeas');
    }
  },
});

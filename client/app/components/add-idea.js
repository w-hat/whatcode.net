import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['add-idea'],
  parent: null,
  idea: Ember.computed('parent', function() {
    return { parent: this.get('parent') };
  }),
  isOpen: false,
  actions: {
    toggleOpen() {
      this.toggleProperty('isOpen');
    },
    clearIdea() {
      this.set('idea', { parent: this.get('parent') });
      this.set('isOpen', false);
    }
  }
});

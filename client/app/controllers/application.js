import Ember from 'ember';

export default Ember.Controller.extend({
  showModal: false,
  actions: {
    showModal(bool) { this.set('showModal', bool); },
  },
  size: Ember.computed('currentPath', function() {
    return this.get('currentPath') === 'index' ? 'big' : 'small';
  })
});

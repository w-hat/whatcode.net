import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['view-coder'],
  coder: null,
  activity: Ember.computed('coder', function() {
    return [];
  }),
});


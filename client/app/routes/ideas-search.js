import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('idea').catch(function(/* err */) {
      return [];
    });
  },
  titleToken: 'Search Ideas',
});

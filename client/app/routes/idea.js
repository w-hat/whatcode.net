import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').find('idea', params.id).catch(function(/* err */) {
      return null;
    });
  },
});

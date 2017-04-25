import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    if ((!params.id) || (params.id === 'me')) {
      return this.get('session.coder');
    } else {
      return this.get('store').findRecord('coder', params.id);
    }
  }
});

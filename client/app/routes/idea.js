import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: { access: '' },
  model(params) {
    const store = this.get('store');
    // TODO Clean up?
    if (params.access) {
      return store.queryRecord('idea', {id: params.id, access: params.access}).catch(function(/* err */) {
        return null;
      });
    }
    return store.findRecord('idea', params.id).catch(function(/* err */) {
      return null;
    });
  },
  titleToken(model) {
    return (model ? model.get('title') + ' - Ideas' : 'Ideas');
  },
});

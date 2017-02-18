import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('store').queryRecord('post', {path: params.path});
  },
  titleToken(model) {
    return model.get('title');
  }
});

import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  model(params) {
    return new Date((params.date !== 'today' && params.date) || Date.now());
  },
  titleToken(model) {
    if (model) {
      return moment(model).format('MMMM YYYY') + ' Ideas';
    } else {
      return 'Ideas Calendar';
    }
  }
});

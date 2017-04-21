import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  model(params) {
    const date = new Date((params.date !== 'today' && params.date)||Date.now());
    const ideas = this.get('store').findAll('idea').catch(function(/* err */) {
      return [];
    });
    return Ember.RSVP.hash({date, ideas});
  },
  titleToken(model) {
    if (model) {
      const date = model.date;
      return moment(date).format('MMMM YYYY') + ' Ideas';
    } else {
      return 'Ideas Calendar';
    }
  }
});

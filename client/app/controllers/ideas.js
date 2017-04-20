import Ember from 'ember';

export default Ember.Controller.extend({
  importantIdeas: Ember.computed.filterBy('model', 'important'),
  rootIdeas: Ember.computed('model.@each.parent', function() {
    return this.get('model').rejectBy('parent.id');
  }),
});

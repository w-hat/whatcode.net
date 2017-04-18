import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['view-ideas'],
  ideas: [],
  importantIdeas: Ember.computed.filterBy('ideas', 'important'),
});

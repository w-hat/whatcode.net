import Ember from 'ember';

export default Ember.Component.extend({
  ideas: [],
  ideaSorting: ['created'],
  rootIdeas: Ember.computed.filter('ideas', (idea) => {
    return !idea.get('parent');
  }),
  sortedRootIdeas: Ember.computed.sort('rootIdeas', 'ideaSorting'),
  showIdeas: Ember.computed('sortedRootIdeas.@each.completed',
                            'session.showCompletedIdeas', function() {
    if (this.get('session.showCompletedIdeas')) {
      return this.get('sortedRootIdeas');
    } else {
      return this.get('sortedRootIdeas').rejectBy('completed');
    }
  }),
});

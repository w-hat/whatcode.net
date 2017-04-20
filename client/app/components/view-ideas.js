import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['view-ideas'],
  ideas: [],
  unhiddenIdeas: Ember.computed('ideas.@each.completed',
                                'session.showCompletedIdeas', function() {
    const show = this.get('session.showCompletedIdeas');
    const ideas = this.get('ideas');
    return (show ? ideas : ideas.rejectBy('completed'));
  }),
  ideaSorting: ['placement:desc'],
  sortedIdeas: Ember.computed.sort('unhiddenIdeas', 'ideaSorting'),
});

import Ember from 'ember';

export default Ember.Controller.extend({
  query: '',
  unhiddenIdeas: Ember.computed('session.ideas.@each.completed',
                                'session.showCompletedIdeas', function() {
    const show = this.get('session.showCompletedIdeas');
    const ideas = this.get('session.ideas');
    return (show ? ideas : ideas.rejectBy('completed'));
  }),
  matches: Ember.computed('unhiddenIdeas', 'query', function () {
    const query = this.get('query').trim();
    if (!query) { return []; }
    const ideas = this.get('unhiddenIdeas');
    const words = query.toLowerCase().split(" ");
    return ideas.filter(function(idea) {
      const text = idea.get('title').toLowerCase();
      for (let word of words) {
        if (text.indexOf(word) === -1) { return false; }
      }
      return true;
    });
  }),
});


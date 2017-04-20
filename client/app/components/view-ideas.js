import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['view-ideas'],
  ideas: [],
  parent: null,
  unhiddenIdeas: Ember.computed('ideas.@each.completed',
                                'session.showCompletedIdeas', function() {
    const show = this.get('session.showCompletedIdeas');
    const ideas = this.get('ideas');
    return (show ? ideas : ideas.rejectBy('completed'));
  }),
  ideaSorting: Ember.computed('parent', function() {
    const parent = this.get('parent');
    return (parent === 'short-list' ? ['importance:desc'] : ['placement:desc']);
  }),
  sortedIdeas: Ember.computed.sort('unhiddenIdeas', 'ideaSorting'),
  nextValue(idea, property) {
    const ideas = this.get('sortedIdeas');
    if (ideas.length === 0) { return Date.now(); }
    if (!idea) { return ideas.get('lastObject.' + property) / 2; }
    if (idea === ideas.get('firstObject')) { return Date.now(); }
    for (let i = ideas.length - 1; i > 0; i--) {
      if (ideas[i] === idea) {
        return (ideas[i].get(property) + ideas[i-1].get(property)) / 2;
      }
    }
  },
  actions: {
    dragIdea(target) {
      const dragging = this.get('session.draggingIdea');
      if (!dragging || (dragging === target)) { return; }
      if (this.get('parent') === 'short-list') {
        const importance = this.get('nextValue').call(this,target,'importance');
        dragging.set('importance', importance);
      } else {
        const placement = this.get('nextValue').call(this, target, 'placement');
        dragging.set('placement', placement);
        dragging.set('parent', this.get('parent'));
      }
      dragging.save();
    },
  },
});

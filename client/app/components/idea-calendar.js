import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  routing: Ember.inject.service('-routing'),
  classNames: ['idea-calendar'],
  ideas: [],
  unhiddenIdeas: Ember.computed('ideas.@each.completed',
                                'session.showCompletedIdeas', function() {
    const show = this.get('session.showCompletedIdeas');
    const ideas = this.get('ideas');
    return (show ? ideas : ideas.rejectBy('completed'));
  }),
  dueIdeas: Ember.computed.filterBy('unhiddenIdeas', 'deadline'),
  events: Ember.computed.map('dueIdeas', function(idea) {
    const color = (idea.get('importance') ? '#e90' : (idea.get('completed') ? 'green' : 'black'));
    return {
      title: idea.get('title'),
      start: idea.get('deadline'),
      allDay: true,
      ideaId: idea.get('id'),
      editable: true,
      color,
    };
  }),
  actions: {
    eventClick(event) {
      this.get('routing').router.transitionTo('idea', event.ideaId);
    },
    eventDragStop(event /*, jsEvent, ui, view */) {
      const idea = this.get('store').peekRecord('idea', event.ideaId);
      const utcOffset = (new Date()).getTimezoneOffset();
      idea.set('deadline', event.start.add(utcOffset, 'minute').toDate());
      idea.save();
    },
  }
});

import Ember from 'ember';
import markdown from 'markdown-it';

const md = markdown({linkify: true});

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['view-idea'],
  classNameBindings: ['idea.completed', 'idea.important'],
  idea: null,
  isExpanded: false,
  isEditing: false,
  caret: Ember.computed('isExpanded', function() {
    return (this.get('isExpanded') ? 'caret-down' : 'caret-right');
  }),
  check: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "undo" : "check");
  }),
  checkText: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "Mark uncompleted" : "Mark completed");
  }),
  children: Ember.computed('idea', function() {
    const idea = this.get('idea');
    return (idea ? idea.get('children') : []);
  }),
  showIdeas: Ember.computed('children.@each.completed',
                            'session.showCompletedIdeas', function() {
    const children = this.get('children');
    if (this.get('session.showCompletedIdeas')) {
      return children;
    } else {
      return children.rejectBy('completed');
    }
  }),
  enabled: ['youtube-video', 'arimaa-position'],
  sanitizer(s) {
    return Ember.String.htmlSafe(md.render(s));
  },
  actions: {
    toggleExpanded() {
      this.toggleProperty('isExpanded');
    },
    deleteIdea() {
      this.get('idea').deleteAll();
    },
    toggleCompleted() {
      this.toggleProperty('idea.completed');
      this.get('idea').save();
    },
    toggleEditing() {
      this.set('isExpanded', true);
      this.toggleProperty('isEditing');
    },
    toggleImportant() {
      this.toggleProperty('idea.important');
      this.get('idea').save();
    },
    startDrag() {
      this.set('isExpanded', false);
      // TODO Drag.
      // TODO Save after drag somehow.
    },
  },
});

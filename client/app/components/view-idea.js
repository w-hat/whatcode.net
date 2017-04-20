import Ember from 'ember';
import markdown from 'markdown-it';

const md = markdown({linkify: true});

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['view-idea'],
  classNameBindings: ['idea.completed:completed', 'idea.importance:important'],
  idea: null,
  isEditing: false,
  caret: Ember.computed('idea.isExpanded', function() {
    return (this.get('idea.isExpanded') ? 'caret-down' : 'caret-right');
  }),
  check: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "undo" : "check");
  }),
  checkText: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "Mark uncompleted" : "Mark completed");
  }),
  enabled: ['youtube-video', 'arimaa-position'],
  sanitizer(s) {
    return Ember.String.htmlSafe(md.render(s));
  },
  dragIdea() {},
  actions: {
    toggleExpanded() {
      this.toggleProperty('idea.isExpanded');
    },
    deleteIdea() {
      this.get('idea').deleteAll();
    },
    toggleCompleted() {
      const idea = this.get('idea');
      idea.set('completed', (idea.get('completed') ? null : new Date()));
      idea.save();
    },
    toggleEditing() {
      this.set('idea.isExpanded', true);
      this.toggleProperty('isEditing');
    },
    toggleImportant() {
      this.set('idea.importance', this.get('idea.importance') ? 0 : Date.now());
      this.get('idea').save();
    },
    startDrag() {
      this.set('idea.isExpanded', false);
      this.set('session.draggingIdea', this.get('idea'));
    },
    endDrag() {
      this.set('session.draggingIdea', null);
    },
    dragOver() {
      this.get('dragIdea')(this.get('idea'));
    },
  },
});

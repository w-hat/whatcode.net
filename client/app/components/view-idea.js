import Ember from 'ember';
import moment from 'moment';
import markdown from 'markdown-it';

const md = markdown({linkify: true});

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['view-idea'],
  classNameBindings: ['idea.completed:completed', 'idea.importance:important'],
  idea: null,
  isEditing: false,
  isSharing: false,
  ownersString: Ember.computed('idea.owners.@each.display', function() {
    const owners = this.get('idea.owners');
    //if (owners.length > 1) {
      return owners.map(owner => owner.get('display')).join(", ");
    //} else {
    //  return "";
    //}
  }),
  caret: Ember.computed('isExpanded', function() {
    return (this.get('isExpanded') ? 'caret-down' : 'caret-right');
  }),
  check: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "undo" : "check");
  }),
  checkText: Ember.computed('idea.completed', function() {
    return (this.get('idea.completed') ? "Mark uncompleted" : "Mark completed");
  }),
  isExpanded: false,
  unexpand: Ember.observer('idea.isExpanded', function() {
    if (!this.get('idea.isExpanded')) { this.set('isExpanded', false); }
  }),
  enabled: ['youtube-video', 'arimaa-position'],
  sanitizer(s) {
    return Ember.String.htmlSafe(md.render(s));
  },
  date: Ember.computed('idea.deadline', function() {
    const deadline = this.get('idea.deadline');
    return moment(deadline).format('YYYY-MM-DD');
  }),
  dragIdea() {},
  actions: {
    toggleExpanded() {
      this.toggleProperty('isExpanded');
      if (this.get('isExpanded')) { this.set('idea.isExpanded', true); }
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
      this.set('isExpanded', true);
      this.set('isSharing', false);
      this.toggleProperty('isEditing');
    },
    toggleImportant() {
      this.set('idea.importance', this.get('idea.importance') ? 0 : Date.now());
      this.get('idea').save();
    },
    toggleSharing() {
      this.set('isExpanded', true);
      this.set('isEditing', false);
      this.toggleProperty('isSharing');
    },
    startDrag() {
      this.set('isExpanded', false);
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

import Ember from 'ember';
import markdown from 'markdown-it';

const md = markdown({linkify: true});

export default Ember.Component.extend({
  classNames: ['view-post'],
  enabled:  ['youtube-video', 'arimaa-position'],
  sanitizer(s) {
    return Ember.String.htmlSafe(md.render(s));
  }
});


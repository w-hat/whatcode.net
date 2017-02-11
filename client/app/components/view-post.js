import Ember from 'ember';
import markdown from 'markdown-it';

const md = markdown({linkify: true});

export default Ember.Component.extend({
  classNames: ['view-post'],
  enabled:  ['youtube-video'],
  sanitizer(s) {
    return Ember.String.htmlSafe(md.render(s));
  }
});

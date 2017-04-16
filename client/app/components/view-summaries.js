import Ember from 'ember';

export default Ember.Component.extend({
  posts: [],
  postSorting: ['posted:desc'],
  sortedPosts: Ember.computed.sort('posts', 'postSorting'),
});

import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.belongsTo('coder'),
  post: DS.belongsTo('post'),
  created: DS.attr('date'),
  content: DS.attr()
});

import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.belongsTo('coder'),
  comments: DS.hasMany('comment'),
  posted: DS.attr('date'),
  title: DS.attr(),
  content: DS.attr(),
  image: DS.attr(),
  path: DS.attr()
});

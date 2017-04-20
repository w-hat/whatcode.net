import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.belongsTo('coder'),
  parent: DS.belongsTo('idea', { inverse: 'children', async: true }),
  children: DS.hasMany('idea', { inverse: 'parent', async: true }),
  created: DS.attr('date'),
  target: DS.attr('date'),
  title: DS.attr(),
  body: DS.attr(),
  completed: DS.attr('date'),
  deadline: DS.attr('date'),
  placement: DS.attr(),
  importance: DS.attr('number', { defaultValue: 0 }),
  deleteAll() {
    this.get('children').forEach(child => { child.deleteAll(); });
    this.destroyRecord();
  },
});

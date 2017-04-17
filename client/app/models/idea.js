import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.belongsTo('coder'),
  parent: DS.belongsTo('idea', { inverse: 'children', async: false }),
  children: DS.hasMany('idea', { inverse: 'parent', async: false }),
  created: DS.attr('date'),
  target: DS.attr('date'),
  title: DS.attr(),
  body: DS.attr(),
  completed: DS.attr('boolean', { defaultValue: false }),
  deleteAll() {
    this.get('children').forEach(child => { child.deleteAll(); });
    this.destroyRecord();
  },
});

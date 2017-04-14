import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('arimaa-piece', 'Integration | Component | arimaa piece', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{arimaa-piece}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#arimaa-piece}}
      template block text
    {{/arimaa-piece}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('view-post', 'Integration | Component | view post', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('post', {posted: 'just now', author: {display: 'Hanzack'}});

  this.render(hbs`{{view-post post=post}}`);

  assert.equal(this.$().text().trim(), 'Posted just now by Hanzack');

});

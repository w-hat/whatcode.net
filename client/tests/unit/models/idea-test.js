import { moduleForModel, test } from 'ember-qunit';

moduleForModel('idea', 'Unit | Model | idea', {
  // Specify the other units that are required for this test.
  needs: ['model:coder']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
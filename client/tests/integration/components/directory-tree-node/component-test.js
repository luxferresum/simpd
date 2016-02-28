import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('directory-tree-node', 'Integration | Component | directory tree node', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{directory-tree-node}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#directory-tree-node}}
      template block text
    {{/directory-tree-node}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

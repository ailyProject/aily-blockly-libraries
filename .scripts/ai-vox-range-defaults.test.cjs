'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('AI-VOX Number parameter creates native shadows immediately and preserves explicitly wired bounds', () => {
  const root = path.join(__dirname, '..', 'ai-vox');
  const program = fs.readFileSync(path.join(root, 'generator.js'), 'utf8');
  const extension = program.match(/Blockly\.Extensions\.register\('aivox3_mcp_control_param_extension'[\s\S]*?(?=\/\/ AIVOX wifi init)/)[0];
  const parameter = JSON.parse(fs.readFileSync(path.join(root, 'block.json'), 'utf8'))
    .find(definition => definition.type === 'aivox_mcp_control_param');
  let initialize;
  vm.runInNewContext(extension, {
    Blockly: { Extensions: { register(name, callback) { initialize = callback; } } },
    setTimeout() { assert.fail('Native model defaults cannot be created after initialization'); },
  });
  const inputs = new Map();
  let validate;
  const selector = { getValue: () => 'Boolean', setValidator(callback) { validate = callback; } };
  const block = {
    getField: () => selector,
    getInput: name => inputs.get(name),
    removeInput: name => inputs.delete(name),
    appendValueInput(name) {
      const input = { connection: { setShadowState(state) { this.shadow = JSON.parse(JSON.stringify(state)); } },
        setCheck(type) { assert.equal(type, 'Number'); return this; }, appendField() { return this; } };
      inputs.set(name, input);
      return input;
    },
  };
  initialize.call(block);
  assert.equal(inputs.size, 0);
  assert.equal(validate('Number'), 'Number');
  const [shape] = parameter.ailyFieldShape;
  assert.equal(shape.field, 'TYPE');
  assert.deepEqual(shape.values, ['Number']);
  assert.deepEqual([...inputs.keys()], shape.args.map(argument => argument.name));
  for (const argument of shape.args) assert.deepEqual(inputs.get(argument.name).connection.shadow, argument.default);
  const minimum = inputs.get('MIN');
  minimum.connection.target = { id: 'own-explicit-minimum' };
  validate('Number');
  assert.equal(inputs.get('MIN'), minimum);
  assert.equal(inputs.get('MIN').connection.target.id, 'own-explicit-minimum');
  validate('Boolean');
  assert.equal(inputs.size, 0);
});

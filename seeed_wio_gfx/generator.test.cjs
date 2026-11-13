const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const blocks = require('./block.json');

test('all display references accept the type registered by both initializers', () => {
  const registrations = [];
  const Arduino = { forBlock: {} };
  vm.runInNewContext(fs.readFileSync(__dirname + '/generator.js', 'utf8'), {
    Arduino, Blockly: { Extensions: { isRegistered: () => false, register() {} } },
    registerVariableToBlockly: (name, type) => registrations.push({ name, type }),
    window: { parent: { postMessage() {} } }, console: { log() {} }
  });
  const block = { getFieldValue: name => name === 'VAR' ? 'display' : undefined, getField() {} };
  const generator = { addLibrary() {}, addVariable() {}, addObject() {}, addMacro() {} };
  Arduino.forBlock.seeed_gfx_create_tft(block, generator);
  Arduino.forBlock.seeed_gfx_init(block, generator);
  assert.equal(registrations.length, 2);
  for (const definition of blocks) {
    for (const field of Object.values(definition).flat().filter(value => value?.type === 'field_variable')) {
      for (const { type } of registrations) assert.ok(field.variableTypes.includes(type), definition.type);
      assert.equal(field.defaultType, 'TFT_eSPI', definition.type);
      assert.ok(field.variableTypes.includes('TFT'), 'saved legacy TFT models remain accepted');
    }
  }
});

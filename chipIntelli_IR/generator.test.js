'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const definitions = JSON.parse(fs.readFileSync(path.join(__dirname, 'block.json'), 'utf8'));
const Arduino = { forBlock: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8'), { Arduino });

function newBuild() {
  const macros = new Map();
  const generator = {
    ORDER_ATOMIC: 0,
    addMacro: (key, code) => macros.set(key, code),
    addLibrary() {},
    addVariable() {},
    addFunction() {},
    valueToCode: () => '',
    statementToCode: () => '',
  };
  return {
    macros,
    emit(type, fields = {}) {
      const block = { getFieldValue: name => fields[name] };
      return Arduino.forBlock[type](block, generator);
    },
  };
}

test('only air initialization requests the database; raw/NEC and diagnostics do not', () => {
  for (const definition of definitions) {
    const build = newBuild();
    const fields = Object.fromEntries(Object.keys(definition)
      .filter(key => /^args\d+$/.test(key))
      .flatMap(key => definition[key])
      .filter(arg => arg.type === 'field_dropdown')
      .map(arg => [arg.name, arg.options[0][1]]));
    build.emit(definition.type, fields);
    assert.equal(build.macros.size, definition.type === 'chipintelli_ir_init_air' ? 1 : 0,
      definition.type);
  }
  const air = newBuild();
  air.emit('chipintelli_ir_init_default', { MODE: 'AirConditioner' });
  assert.deepEqual([...air.macros.values()], ['#define CHIPINTELLI_IR_DATABASE 1']);
});

test('both air initializers share one macro and rebuilding in raw mode removes it', () => {
  const air = newBuild();
  air.emit('chipintelli_ir_init_air');
  air.emit('chipintelli_ir_init_default', { MODE: 'AirConditioner' });
  air.emit('chipintelli_ir_init_air');
  assert.deepEqual([...air.macros.values()], ['#define CHIPINTELLI_IR_DATABASE 1']);

  const raw = newBuild();
  raw.emit('chipintelli_ir_init_default', { MODE: 'Raw' });
  raw.emit('chipintelli_ir_init_raw');
  assert.equal(raw.macros.size, 0);
});

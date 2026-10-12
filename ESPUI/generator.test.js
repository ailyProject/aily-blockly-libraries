'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const libraryDir = __dirname;
const blockDefinitions = JSON.parse(fs.readFileSync(path.join(libraryDir, 'block.json'), 'utf8'));

const Arduino = { forBlock: Object.create(null) };
vm.runInNewContext(
  fs.readFileSync(path.join(libraryDir, 'generator.js'), 'utf8'),
  { Arduino },
  { filename: 'ESPUI/generator.js' }
);

function newBuild() {
  const variables = new Map();
  const generator = {
    ORDER_ATOMIC: 0,
    variables,
    addLibrary() {},
    addFunction() {},
    addVariable(tag, code, overwrite = false) {
      if (!variables.has(tag) || overwrite) {
        variables.set(tag, code);
      }
    },
    valueToCode: () => '',
    statementToCode: () => '',
  };
  return {
    generator,
    emit(type, fields = {}, id = 'block1') {
      const block = {
        id,
        getFieldValue: name => fields[name],
        getField: () => undefined,
      };
      return Arduino.forBlock[type](block, generator);
    },
  };
}

test('every ESPUI block definition has a matching forBlock generator', () => {
  const blockTypes = blockDefinitions.map(b => b.type).sort();
  const generatorTypes = Object.keys(Arduino.forBlock).sort();
  assert.equal(blockTypes.length, 42);
  assert.deepEqual(blockTypes.filter(type => !generatorTypes.includes(type)), []);
});

test('distinct case-sensitive identifiers Int and _Int do not collide', () => {
  const { generator, emit } = newBuild();
  const codeInt = emit('espui_create_label', { VAR: 'Int' });
  const codeUnderscoreInt = emit('espui_create_label', { VAR: '_Int' });

  assert.equal(generator.variables.size, 2);
  assert.equal(generator.variables.get('espui_control_Int'), 'uint16_t Int = 0;');
  assert.equal(generator.variables.get('espui_control__Int'), 'uint16_t _Int = 0;');
  assert.match(codeInt, /^Int = ESPUI\.addControl/);
  assert.match(codeUnderscoreInt, /^_Int = ESPUI\.addControl/);
});

test('distinct case-sensitive identifiers String and _String do not collide', () => {
  const { generator, emit } = newBuild();
  const codeString = emit('espui_create_text', { VAR: 'String' });
  const codeUnderscoreString = emit('espui_create_text', { VAR: '_String' });

  assert.equal(generator.variables.size, 2);
  assert.equal(generator.variables.get('espui_control_String'), 'uint16_t String = 0;');
  assert.equal(generator.variables.get('espui_control__String'), 'uint16_t _String = 0;');
  assert.match(codeString, /^String = ESPUI\.addControl/);
  assert.match(codeUnderscoreString, /^_String = ESPUI\.addControl/);
});

test('reserved C++ keywords are prefixed, not emitted raw', () => {
  for (const keyword of ['int', 'return', 'class']) {
    const { generator, emit } = newBuild();
    const code = emit('espui_create_label', { VAR: keyword });
    const declKey = 'espui_control__' + keyword;

    assert.ok(generator.variables.has(declKey), keyword);
    assert.equal(generator.variables.get(declKey), 'uint16_t _' + keyword + ' = 0;', keyword);
    assert.match(code, new RegExp('^_' + keyword + ' = ESPUI\\.addControl'), keyword);
  }
});

test('two blocks sharing the same identifier still dedup to a single declaration', () => {
  const { generator, emit } = newBuild();
  emit('espui_create_button', { VAR: 'button1' });
  emit('espui_create_button', { VAR: 'button1' });

  assert.equal(generator.variables.size, 1);
  assert.equal(generator.variables.get('espui_control_button1'), 'uint16_t button1 = 0;');
});

test('reference blocks sanitize VAR consistently with declare blocks', () => {
  const { emit } = newBuild();
  const declCode = emit('espui_create_label', { VAR: 'int' });
  const updateCode = emit('espui_update_value', { VAR: 'int' });

  assert.match(declCode, /^_int = ESPUI\.addControl/);
  assert.equal(updateCode, 'ESPUI.updateControlValue(_int, String(""));\n');
});

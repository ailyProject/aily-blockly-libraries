'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const definitions = JSON.parse(fs.readFileSync(path.join(__dirname, 'block.json'), 'utf8'));
const source = fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8');
const blockType = 'bme280_set_sampling';
const enumValue = (name) => `Adafruit_BME280::${name}`;
const supported = {
  MODE: ['MODE_NORMAL', 'MODE_SLEEP', 'MODE_FORCED'],
  TEMP_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  PRESS_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  HUM_SAMPLING: ['SAMPLING_NONE', 'SAMPLING_X1', 'SAMPLING_X2', 'SAMPLING_X4', 'SAMPLING_X8', 'SAMPLING_X16'],
  FILTER: ['FILTER_OFF', 'FILTER_X2', 'FILTER_X4', 'FILTER_X8', 'FILTER_X16'],
  STANDBY: ['STANDBY_MS_0_5', 'STANDBY_MS_10', 'STANDBY_MS_20', 'STANDBY_MS_62_5', 'STANDBY_MS_125', 'STANDBY_MS_250', 'STANDBY_MS_500', 'STANDBY_MS_1000'],
};
const defaults = Object.fromEntries(Object.entries(supported).map(([name, values]) => [name, enumValue(values[0])]));
const legacy = {
  MODE: { '0': 'MODE_NORMAL', '1': 'MODE_SLEEP', '2': 'MODE_FORCED' },
  TEMP_SAMPLING: { '0': 'SAMPLING_NONE', '1': 'SAMPLING_X1', '2': 'SAMPLING_X2' },
  PRESS_SAMPLING: { '0': 'SAMPLING_NONE', '1': 'SAMPLING_X1', '2': 'SAMPLING_X2' },
  HUM_SAMPLING: { '0': 'SAMPLING_NONE', '1': 'SAMPLING_X1', '2': 'SAMPLING_X2' },
  FILTER: { '0': 'FILTER_OFF', '2': 'FILTER_X2', '4': 'FILTER_X4', '8': 'FILTER_X8', '16': 'FILTER_X16' },
  STANDBY: { '0.5': 'STANDBY_MS_0_5', '10': 'STANDBY_MS_10', '20': 'STANDBY_MS_20', '62.5': 'STANDBY_MS_62_5', '125': 'STANDBY_MS_125', '250': 'STANDBY_MS_250', '500': 'STANDBY_MS_500' },
};

function register(Blockly) {
  const Arduino = { forBlock: Object.create(null) };
  const context = vm.createContext({ Arduino, Blockly });
  vm.runInContext(source, context, { filename: 'adafruit_BME280/generator.js' });
  return { Arduino, reload: () => vm.runInContext(source, context) };
}

const extensionCallbacks = new Map();
const registered = register({
  Extensions: {
    isRegistered: (name) => extensionCallbacks.has(name),
    unregister: (name) => extensionCallbacks.delete(name),
    register(name, callback) {
      assert.ok(!extensionCallbacks.has(name), `Duplicate extension: ${name}`);
      extensionCallbacks.set(name, callback);
    },
  },
});
const emit = (fields) => registered.Arduino.forBlock[blockType]({ getFieldValue: (name) => fields[name] }, {});
const expectedCode = (fields) => `bme.setSampling(${Object.keys(supported).map((name) => fields[name]).join(', ')});\n`;

test('all named options generate six correctly typed BME280 arguments', () => {
  assert.equal(emit(defaults), expectedCode(defaults));
  for (const [field, names] of Object.entries(supported)) {
    for (const name of names) {
      const fields = { ...defaults, [field]: enumValue(name) };
      assert.equal(emit(fields), expectedCode(fields), `${field}: ${name}`);
    }
  }
});

test('legacy field values retain their original option meaning in generated code', () => {
  for (const [field, values] of Object.entries(legacy)) {
    for (const [oldValue, name] of Object.entries(values)) {
      assert.equal(emit({ ...defaults, [field]: oldValue }), expectedCode({ ...defaults, [field]: enumValue(name) }), `${field}: ${oldValue}`);
    }
  }
  const oldFields = { MODE: '2', TEMP_SAMPLING: '0', PRESS_SAMPLING: '1', HUM_SAMPLING: '2', FILTER: '16', STANDBY: '62.5' };
  const newFields = Object.fromEntries(Object.entries(oldFields).map(([field, value]) => [field, enumValue(legacy[field][value])]));
  assert.equal(emit(oldFields), expectedCode(newFields));
});

test('invalid or wrong-kind enums fail before emitting invalid C++', () => {
  for (const field of Object.keys(supported)) {
    for (const value of ['INVALID', '0; injected()', 'Adafruit_BME280::INVALID']) {
      assert.throws(() => emit({ ...defaults, [field]: value }), `${field}: ${value}`);
    }
  }
  assert.throws(() => emit({ ...defaults, MODE: enumValue('SAMPLING_X2') }));
  assert.throws(() => emit({ ...defaults, TEMP_SAMPLING: enumValue('FILTER_X2') }));
  assert.throws(() => emit({ ...defaults, FILTER: enumValue('SAMPLING_X2') }));
});

test('generator can be registered repeatedly without duplicate extension errors', () => {
  assert.doesNotThrow(() => registered.reload());
  assert.equal(typeof registered.Arduino.forBlock[blockType], 'function');
});

test('all eleven locales use the same complete enum dropdown values as block.json', () => {
  const definition = definitions.find((block) => block.type === blockType);
  const files = fs.readdirSync(path.join(__dirname, 'i18n')).filter((file) => file.endsWith('.json'));
  assert.equal(files.length, 11);
  for (const [index, field] of Object.keys(supported).entries()) {
    const expected = supported[field].map(enumValue);
    assert.equal(definition.args0[index].name, field);
    assert.deepEqual(definition.args0[index].options.map((option) => option[1]), expected, `block.json: ${field}`);
    for (const file of files) {
      const locale = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', file), 'utf8'));
      assert.deepEqual(locale[blockType].args0[index].options.map((option) => option[1]), expected, `${file}: ${field}`);
    }
  }
});

// Use the same Blockly installation as the app when available. The standalone
// library repository does not install Blockly; AILY_BLOCKLY_ROOT supports CI.
let Blockly;
let integrationSkip = false;
try {
  const appRoot = process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly');
  Blockly = createRequire(path.join(appRoot, 'package.json'))('blockly/core');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  integrationSkip = 'Blockly is unavailable; set AILY_BLOCKLY_ROOT to an app installation';
}

let realRegistered;
if (Blockly) {
  realRegistered = register(Blockly);
  Blockly.defineBlocksWithJsonArray(definitions);
}

const readFields = (block) => Object.fromEntries(Object.keys(supported).map((name) => [name, block.getFieldValue(name)]));
const loaders = {
  JSON: (workspace, fields) => Blockly.serialization.blocks.append({ type: blockType, fields }, workspace),
  XML: (workspace, fields) => Blockly.Xml.domToBlock(Blockly.utils.xml.textToDom(
    `<block type="${blockType}">${Object.entries(fields).map(([name, value]) => `<field name="${name}">${value}</field>`).join('')}</block>`
  ), workspace),
};

test('new real Blockly blocks preserve defaults and permit repeated generator registration', { skip: integrationSkip }, () => {
  const workspace = new Blockly.Workspace();
  try {
    assert.doesNotThrow(() => realRegistered.reload());
    const block = workspace.newBlock(blockType);
    assert.deepEqual(readFields(block), defaults);
    assert.equal(realRegistered.Arduino.forBlock[blockType](block, {}), expectedCode(defaults));
  } finally {
    workspace.dispose();
  }
});

test('real Blockly field setters migrate legacy values and repeated extension application preserves setters', { skip: integrationSkip }, () => {
  const workspace = new Blockly.Workspace();
  try {
    const block = workspace.newBlock(blockType);
    const setters = Object.fromEntries(Object.keys(supported).map((name) => [name, block.getField(name).setValue]));
    Blockly.Extensions.apply('bme280_sampling_legacy_values', block, false);
    Blockly.Extensions.apply('bme280_sampling_legacy_values', block, false);
    for (const [field, values] of Object.entries(legacy)) {
      assert.equal(block.getField(field).setValue, setters[field]);
      for (const [oldValue, name] of Object.entries(values)) {
        block.setFieldValue(oldValue, field);
        assert.equal(block.getFieldValue(field), enumValue(name), `${field}: ${oldValue}`);
      }
      block.setFieldValue(defaults[field], field);
    }
    assert.deepEqual(readFields(block), defaults);
  } finally {
    workspace.dispose();
  }
});

for (const [format, load] of Object.entries(loaders)) {
  test(`${format} loading migrates every legacy field before dropdown validation and saves canonical values`, { skip: integrationSkip }, () => {
    const workspace = new Blockly.Workspace();
    const oldDefaults = Object.fromEntries(Object.keys(supported).map((name) => [name, name === 'STANDBY' ? '0.5' : '0']));
    try {
      for (const [field, values] of Object.entries(legacy)) {
        for (const [oldValue, name] of Object.entries(values)) {
          const expected = { ...defaults, [field]: enumValue(name) };
          const block = load(workspace, { ...oldDefaults, [field]: oldValue });
          assert.deepEqual(readFields(block), expected, `${field}: ${oldValue}`);
          assert.equal(realRegistered.Arduino.forBlock[blockType](block, {}), expectedCode(expected));
          const saved = Blockly.serialization.blocks.save(block);
          assert.deepEqual({ ...saved.fields }, expected);
          const xml = Blockly.Xml.blockToDom(block);
          for (const element of xml.querySelectorAll('field')) {
            assert.equal(element.textContent, expected[element.getAttribute('name')]);
          }
          block.dispose();
        }
      }
    } finally {
      workspace.dispose();
    }
  });

  test(`${format} loading and serialization round-trip every canonical enum`, { skip: integrationSkip }, () => {
    const workspace = new Blockly.Workspace();
    try {
      for (const [field, names] of Object.entries(supported)) {
        for (const name of names) {
          const expected = { ...defaults, [field]: enumValue(name) };
          const block = load(workspace, expected);
          assert.deepEqual(readFields(block), expected);
          const jsonCopy = Blockly.serialization.blocks.append(Blockly.serialization.blocks.save(block), workspace);
          assert.deepEqual(readFields(jsonCopy), expected);
          const xmlCopy = Blockly.Xml.domToBlock(Blockly.Xml.blockToDom(block), workspace);
          assert.deepEqual(readFields(xmlCopy), expected);
          assert.equal(realRegistered.Arduino.forBlock[blockType](xmlCopy, {}), expectedCode(expected));
          block.dispose();
          jsonCopy.dispose();
          xmlCopy.dispose();
        }
      }
    } finally {
      workspace.dispose();
    }
  });
}

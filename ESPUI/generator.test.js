'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const libraryDir = __dirname;
const blockDefinitions = JSON.parse(fs.readFileSync(path.join(libraryDir, 'block.json'), 'utf8'));

// Minimal stand-in for the host's typed variable map (case-insensitive lookup, like Blockly).
class FakeWorkspace {
  constructor() {
    this.models = new Map();
    this.nextId = 1;
  }
  createVariable(name, type) {
    const model = { name, type, id: 'v' + this.nextId++, getId() { return this.id; } };
    this.models.set(model.id, model);
    return model;
  }
  getVariable(name, type) {
    return [...this.models.values()].find(m => m.type === type && m.name.toLowerCase() === name.toLowerCase()) || null;
  }
  getVariableById(id) {
    return this.models.get(id) || null;
  }
  renameVariableById(id, newName) {
    this.models.get(id).name = newName;
  }
}

// Behaves like Blockly.Names: ids resolve to the variable's name, names are allocated distinct.
class FakeNames {
  constructor(workspace) {
    this.workspace = workspace;
    this.reset();
  }
  reset() {
    this.db = new Map();
    this.used = new Set();
  }
  safeName(name) {
    let safe = String(name).replace(/[^A-Za-z0-9_]/g, '_');
    return /^[0-9]/.test(safe) ? 'my_' + safe : safe;
  }
  getDistinctName(name) {
    const safe = this.safeName(name);
    let candidate = safe;
    for (let i = 2; this.used.has(candidate); i++) candidate = safe + i;
    this.used.add(candidate);
    return candidate;
  }
  getName(nameOrId) {
    const model = this.workspace.getVariableById(nameOrId);
    const name = model ? model.name : nameOrId;
    const key = name.toLowerCase();
    if (!this.db.has(key)) this.db.set(key, this.getDistinctName(name));
    return this.db.get(key);
  }
}

const host = { workspace: null };
const Arduino = { forBlock: Object.create(null) };
vm.runInNewContext(
  fs.readFileSync(path.join(libraryDir, 'generator.js'), 'utf8'),
  {
    Arduino,
    registerVariableToBlockly: (name, type) => {
      if (!host.workspace.getVariable(name, type)) host.workspace.createVariable(name, type);
    },
    renameVariableInBlockly: (block, oldName, newName, type) => {
      const model = host.workspace.getVariable(oldName, type);
      if (model) host.workspace.renameVariableById(model.id, newName);
    },
  },
  { filename: 'ESPUI/generator.js' }
);

function newBuild() {
  const workspace = new FakeWorkspace();
  host.workspace = workspace;
  const generator = {
    ORDER_ATOMIC: 0,
    nameDB_: new FakeNames(workspace),
    definitions_: {},
    variables: new Map(),
    functions: new Map(),
    addLibrary() {},
    addFunction(name, code) { this.functions.set(name, code); },
    addVariable(tag, code) { if (!this.variables.has(tag)) this.variables.set(tag, code); },
    valueToCode: () => '',
    statementToCode: () => '',
  };
  const build = { workspace, generator };

  // Same lifecycle as the host: the name database is reset and definitions are recreated per run.
  build.restart = () => {
    generator.nameDB_.reset();
    generator.definitions_ = {};
    generator.variables = new Map();
    generator.functions = new Map();
  };

  // A creation block: VAR is a plain text input holding the name the user typed.
  build.declare = (raw, type = 'espui_create_label', id = 'decl_' + raw) => {
    const field = { onFinishEditing_: null };
    const block = {
      id,
      workspace,
      getFieldValue: name => (name === 'VAR' ? field.text : undefined),
      getField: name => (name === 'VAR' ? field : undefined),
    };
    field.text = raw;
    build.lastField = field;
    build.lastBlock = block;
    return { block, field, emit: () => Arduino.forBlock[type](block, generator) };
  };

  // A reference block: VAR/SELECT is a field_variable, so getValue() is the model ID and
  // getText() is the registered model name.
  build.ref = (type, raw, fieldName = 'VAR') => {
    const model = workspace.getVariable(raw, 'ESPUIControl');
    const field = {
      getValue: () => model.id,
      getText: () => model.name,
    };
    const block = {
      id: 'ref_' + raw,
      workspace,
      getFieldValue: name => (name === fieldName ? model.id : undefined),
      getField: name => (name === fieldName ? field : undefined),
    };
    return Arduino.forBlock[type](block, generator);
  };

  build.control = raw => workspace.getVariable(raw, 'ESPUIControl');
  return build;
}

const target = code => code.split(' = ')[0];
const updateTarget = code => /updateControlValue\((\w+),/.exec(code)[1];

test('every ESPUI block definition has a matching forBlock generator', () => {
  const blockTypes = blockDefinitions.map(b => b.type).sort();
  const generatorTypes = Object.keys(Arduino.forBlock).sort();
  assert.equal(blockTypes.length, 42);
  assert.deepEqual(blockTypes.filter(type => !generatorTypes.includes(type)), []);
});

test('reference field shows the registered model name and still binds to the declaration', () => {
  const b = newBuild();
  const declCode = b.declare('int').emit();
  const refField = b.control('int');
  assert.equal(refField.name, 'int', 'the model keeps the name the user typed');

  const updateCode = b.ref('espui_update_value', 'int');
  assert.match(declCode, /^_int = ESPUI\.addControl/);
  assert.equal(updateCode, 'ESPUI.updateControlValue(_int, String(""));\n');
  assert.deepEqual([...b.generator.variables.values()], ['uint16_t _int = 0;']);
});

test('int and _int coexist: declarations and references agree in either order', () => {
  for (const order of [['int', '_int'], ['_int', 'int']]) {
    const b = newBuild();
    const decl = {};
    order.forEach((raw, i) => { decl[raw] = target(b.declare(raw, 'espui_create_label', 'b' + i).emit()); });
    const refs = {};
    order.forEach(raw => { refs[raw] = updateTarget(b.ref('espui_update_value', raw)); });

    assert.notEqual(decl.int, decl._int, order.join());
    assert.equal(refs.int, decl.int, order.join());
    assert.equal(refs._int, decl._int, order.join());
    assert.equal(b.generator.variables.size, 2, order.join());
    assert.ok(!Object.values(decl).includes('int'), 'keyword never emitted raw');
  }
});

test('references emitted before declarations still agree', () => {
  const b = newBuild();
  // Models already exist (they were registered when the workspace was loaded or edited).
  b.workspace.createVariable('int', 'ESPUIControl');
  b.workspace.createVariable('_int', 'ESPUIControl');
  const declInt = b.declare('int');
  const declUnderscore = b.declare('_int');
  const refInt = updateTarget(b.ref('espui_update_value', 'int'));
  const refUnderscore = updateTarget(b.ref('espui_update_value', '_int'));
  assert.equal(target(declInt.emit()), refInt);
  assert.equal(target(declUnderscore.emit()), refUnderscore);
  assert.notEqual(refInt, refUnderscore);
});

test('regenerating gives identical output and registered models are not touched', () => {
  const b = newBuild();
  const run = () => {
    b.restart();
    const outputs = [
      b.declare('int', 'espui_create_label', 'b1').emit(),
      b.declare('_int', 'espui_create_label', 'b2').emit(),
      b.ref('espui_update_value', 'int'),
      b.ref('espui_update_value', '_int'),
    ];
    return { outputs, vars: [...b.generator.variables.values()].sort() };
  };
  const first = run();
  const second = run();
  assert.deepEqual(second, first);
  assert.deepEqual([...b.workspace.models.values()].map(m => m.name).sort(), ['_int', 'int']);
});

test('adding and deleting a colliding control keeps declarations and references bound', () => {
  const b = newBuild();
  const intBlock = b.declare('int', 'espui_create_label', 'b1');

  b.restart();
  assert.match(intBlock.emit(), /^_int = /);
  assert.equal(updateTarget(b.ref('espui_update_value', 'int')), '_int');

  // A legal control named _int appears; the registered `int` model must not be reassigned.
  const underscoreBlock = b.declare('_int', 'espui_create_label', 'b2');
  b.restart();
  const declUnderscore = target(underscoreBlock.emit());
  const declInt = target(intBlock.emit());
  assert.notEqual(declInt, declUnderscore);
  assert.equal(updateTarget(b.ref('espui_update_value', 'int')), declInt);
  assert.equal(updateTarget(b.ref('espui_update_value', '_int')), declUnderscore);
  assert.equal(b.control('int').name, 'int');

  // The colliding control is deleted again.
  b.workspace.models.delete(b.control('_int').id);
  b.restart();
  assert.match(intBlock.emit(), /^_int = /);
  assert.equal(updateTarget(b.ref('espui_update_value', 'int')), '_int');
  assert.equal(b.generator.variables.size, 1);
});

test('renaming keeps existing references bound to the same model', () => {
  const b = newBuild();
  const decl = b.declare('status', 'espui_create_label', 'b1');
  b.restart();
  decl.emit();
  const modelId = b.control('status').id;
  const refBefore = updateTarget(b.ref('espui_update_value', 'status'));

  decl.field.text = 'int';
  decl.field.onFinishEditing_('int');

  assert.equal(b.workspace.models.size, 1, 'renamed, not duplicated');
  assert.equal(b.workspace.getVariableById(modelId).name, 'int');

  b.restart();
  const declAfter = target(decl.emit());
  const refAfter = updateTarget(b.ref('espui_update_value', 'int'));
  assert.equal(refBefore, 'status');
  assert.equal(declAfter, '_int');
  assert.equal(refAfter, declAfter);
});

test('rename to a colliding name keeps declaration and references in agreement', () => {
  const b = newBuild();
  const other = b.declare('_int', 'espui_create_label', 'b0');
  const decl = b.declare('status', 'espui_create_label', 'b1');
  b.restart();
  other.emit();
  decl.emit();

  decl.field.text = 'int';
  decl.field.onFinishEditing_('int');

  b.restart();
  const declOther = target(other.emit());
  const declRenamed = target(decl.emit());
  assert.notEqual(declOther, declRenamed);
  assert.equal(updateTarget(b.ref('espui_update_value', 'int')), declRenamed);
  assert.equal(updateTarget(b.ref('espui_update_value', '_int')), declOther);
});

test('the rename hook is attached once and chains the original handler', () => {
  const b = newBuild();
  const decl = b.declare('a', 'espui_create_label', 'b1');
  let original = 0;
  decl.field.onFinishEditing_ = () => { original++; };
  decl.emit();
  decl.emit();
  decl.field.onFinishEditing_('b');
  assert.equal(original, 1);
});

test('distinct case-sensitive identifiers Int and _Int do not collide', () => {
  const b = newBuild();
  const codeInt = b.declare('Int', 'espui_create_label', 'b1').emit();
  const codeUnderscoreInt = b.declare('_Int', 'espui_create_label', 'b2').emit();
  assert.equal(b.generator.variables.get('espui_control_Int'), 'uint16_t Int = 0;');
  assert.equal(b.generator.variables.get('espui_control__Int'), 'uint16_t _Int = 0;');
  assert.match(codeInt, /^Int = ESPUI\.addControl/);
  assert.match(codeUnderscoreInt, /^_Int = ESPUI\.addControl/);
});

test('string and _string label controls stay distinct', () => {
  const b = newBuild();
  const first = b.declare('string', 'espui_create_label', 'b1').emit();
  const second = b.declare('_string', 'espui_create_label', 'b2').emit();
  assert.deepEqual([...b.generator.variables.values()].sort(), ['uint16_t _string = 0;', 'uint16_t string = 0;']);
  assert.match(first, /^string = /);
  assert.match(second, /^_string = /);
});

test('C++ keywords are never emitted raw', () => {
  for (const keyword of ['int', 'return', 'class', 'constexpr', 'nullptr', 'static_cast', 'and']) {
    const b = newBuild();
    const code = b.declare(keyword).emit();
    assert.match(code, new RegExp('^_' + keyword + ' = ESPUI\\.addControl'), keyword);
    assert.equal(b.generator.variables.get('espui_control__' + keyword), 'uint16_t _' + keyword + ' = 0;', keyword);
  }
});

test('two blocks sharing the same name dedup to a single declaration', () => {
  const b = newBuild();
  b.declare('button1', 'espui_create_button', 'b1').emit();
  b.declare('button1', 'espui_create_button', 'b2').emit();
  assert.equal(b.generator.variables.size, 1);
  assert.equal(b.generator.variables.get('espui_control_button1'), 'uint16_t button1 = 0;');
});

test('invalid characters map to unique names and references agree', () => {
  const b = newBuild();
  const a = target(b.declare('a-b', 'espui_create_label', 'b1').emit());
  const c = target(b.declare('a_b', 'espui_create_label', 'b2').emit());
  assert.notEqual(a, c);
  assert.equal(b.generator.variables.size, 2);
  assert.equal(updateTarget(b.ref('espui_update_value', 'a-b')), a);
});

test('SELECT references and callbacks use the same model-derived name', () => {
  const b = newBuild();
  const select = b.declare('int', 'espui_create_select', 'sel1');
  const selectName = target(select.emit());
  const option = b.ref('espui_add_option', 'int', 'SELECT');
  assert.match(option, new RegExp('ControlColor::None, ' + selectName + '\\);'));
  assert.deepEqual([...b.generator.functions.keys()], ['espui_select_' + selectName + '_sel1']);
});

test('without a host name database the name falls back to a sanitized identifier', () => {
  const b = newBuild();
  delete b.generator.nameDB_;
  assert.match(b.declare('int').emit(), /^_int = /);
  assert.equal(updateTarget(b.ref('espui_update_value', 'int')), '_int');
});

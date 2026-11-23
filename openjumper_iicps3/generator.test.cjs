const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let Blockly;
try { require(require.resolve('blockly/core', { paths: [process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly')] })); Blockly = require(require.resolve('blockly', { paths: [process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly')] })); } catch {}

test('copies, reloads, renames and multiple receivers keep typed references', { skip: !Blockly && 'requires Blockly from AILY_BLOCKLY_ROOT or sibling aily-blockly' }, () => {
  let workspace = new Blockly.Workspace();
  const Arduino = { forBlock: {} };
  vm.runInNewContext(fs.readFileSync(__dirname + '/generator.js', 'utf8'), {
    Arduino, Blockly, registerVariableToBlockly: (name, type) => workspace.getVariableMap().getVariable(name, type) || workspace.getVariableMap().createVariable(name, type)
  });
  Blockly.defineBlocksWithJsonArray(require('./block.json'));
  const declarations = new Map();
  let names;
  const generator = { ORDER_FUNCTION_CALL: 2, addLibrary() {}, addSetupBegin() {},
    addVariable: (name, code) => declarations.set(name, code),
    getValue: (block, field) => names.getName(block.getFieldValue(field), 'VARIABLE') };
  function reset() {
    names = new Blockly.Names('loop,setup,int');
    names.setVariableMap(workspace.getVariableMap());
    generator.nameDB_ = names;
    declarations.clear();
  }
  try {
    const init = workspace.newBlock('openjumper_iicps3_init');
    const run = workspace.newBlock('openjumper_iicps3_run');
    const button = workspace.newBlock('openjumper_iicps3_butstate');
    const xy = workspace.newBlock('openjumper_iicps3_xy');
    reset();
    Arduino.forBlock.openjumper_iicps3_init(init, generator);
    const model = run.getField('PS3_NAME').getVariable();
    assert.equal(model.type, 'OpenJumperPS3');
    assert.equal(workspace.getVariableMap().getAllVariables().length, 1);
    const copy = Blockly.serialization.blocks.append(Blockly.serialization.blocks.save(run), workspace);
    assert.equal(copy.getFieldValue('PS3_NAME'), model.getId());
    init.setFieldValue('my receiver', 'PS3_NAME');
    init.getField('PS3_NAME').onFinishEditing_('my receiver');
    reset();
    Arduino.forBlock.openjumper_iicps3_init(init, generator);
    assert.equal(run.getField('PS3_NAME').getText(), 'my receiver');
    const name = names.getName(model.getId(), 'VARIABLE');
    assert.equal(declarations.get(name), 'OpenJumperPS3 ' + name + ';');
    for (const block of [run, button, xy, copy]) {
      const code = Arduino.forBlock[block.type](block, generator);
      assert.ok((Array.isArray(code) ? code[0] : code).startsWith(name + '.'));
    }
    const second = workspace.newBlock('openjumper_iicps3_init');
    second.setFieldValue('int', 'PS3_NAME');
    Arduino.forBlock.openjumper_iicps3_init(second, generator);
    assert.equal(declarations.size, 2);
    assert.ok([...declarations.values()].every(code => !code.includes(' int;')));
    const state = Blockly.serialization.workspaces.save(workspace);
    workspace.dispose();
    workspace = new Blockly.Workspace();
    Blockly.serialization.workspaces.load(state, workspace);
    reset();
    for (const block of workspace.getAllBlocks(false).filter(block => block.type.endsWith('_init'))) Arduino.forBlock[block.type](block, generator);
    for (const block of workspace.getAllBlocks(false).filter(block => !block.type.endsWith('_init'))) {
      const code = Arduino.forBlock[block.type](block, generator);
      assert.ok((Array.isArray(code) ? code[0] : code).startsWith(name + '.'));
    }
    const legacy = Blockly.serialization.blocks.append({ type: 'openjumper_iicps3_run', fields: { PS3_NAME: 'receiver' } }, workspace);
    assert.equal(legacy.getField('PS3_NAME').getText(), 'receiver');
    assert.equal(legacy.getField('PS3_NAME').getVariable().type, 'OpenJumperPS3');
    const xml = Blockly.utils.xml.textToDom('<xml><block type="openjumper_iicps3_run"><field name="PS3_NAME">xmlReceiver</field></block></xml>');
    Blockly.Xml.domToWorkspace(xml, workspace);
    assert.ok(workspace.getVariableMap().getVariable('xmlReceiver', 'OpenJumperPS3'));
  } finally { workspace.dispose(); }
});

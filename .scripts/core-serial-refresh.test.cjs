const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createRequire} = require('node:module');

// Exercise actual Blockly fields from the host's installed package.
const root = process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly');
const Blockly = createRequire(path.join(root, 'package.json'))('blockly/core');
const source = fs.readFileSync(path.join(__dirname, '../core-serial/generator.js'), 'utf8');

function runtime(t) {
  const workspace = new Blockly.Workspace();
  const timers = [];
  const window = {boardConfig: {serialPort: [['Primary', 'Serial'], ['Secondary', 'Serial1']]}};
  const validator = Blockly.FieldDropdown.prototype.doClassValidation_;
  const installed = Blockly.FieldDropdown.prototype._serialValidatorInstalled;
  const context = vm.createContext({
    Blockly: {...Blockly, getMainWorkspace: () => workspace},
    Arduino: {forBlock: {}}, window, console,
    setTimeout: fn => timers.push(fn),
  });
  new vm.Script(source, {filename: 'core-serial/generator.js'}).runInContext(context);
  Blockly.Blocks.serial_refresh_test = {init() {
    this.appendDummyInput().appendField(new Blockly.FieldDropdown([
      ['Primary', 'Serial'], ['Secondary', 'Serial1'],
    ]), 'SERIAL');
  }};
  const blocks = Array.from({length: 20}, () => workspace.newBlock('serial_refresh_test'));
  let rerenders = 0;
  for (const block of blocks) {
    block.render = () => assert.fail('serial refresh must not force a synchronous block render');
    const field = block.getField('SERIAL');
    const rerender = field.forceRerender.bind(field);
    field.forceRerender = () => {rerenders++; rerender();};
  }
  t.after(() => {
    workspace.dispose();
    delete Blockly.Blocks.serial_refresh_test;
    Blockly.FieldDropdown.prototype.doClassValidation_ = validator;
    if (installed === undefined) delete Blockly.FieldDropdown.prototype._serialValidatorInstalled;
    else Blockly.FieldDropdown.prototype._serialValidatorInstalled = installed;
  });
  return {workspace, window, blocks, context, rerenders: () => rerenders,
    reset: () => {rerenders = 0;},
    flush() {while (timers.length) timers.shift()();},
  };
}

test('startup and repeated unchanged serial refreshes perform no field or synchronous block renders', t => {
  const r = runtime(t);
  r.flush();
  for (let i = 0; i < 10; i++) {
    r.window.updateSerialCustomPorts();
    vm.runInContext('updateAllSerialBlocksInWorkspace()', r.context);
  }
  assert.equal(r.rerenders(), 0);
  assert.equal(r.workspace.getAllBlocks(false).length, 20);
});

test('custom option add, selected label update and removal preserve the correct field value', t => {
  const r = runtime(t);
  const field = r.blocks[0].getField('SERIAL');
  r.window.customSerialPorts = {Custom: {serialPort: 'UART1', rxPin: '1', txPin: '2'}};
  r.window.updateSerialCustomPorts();
  assert.equal(r.rerenders(), 0, 'adding an unselected option does not change displayed text');
  field.setValue('Custom');
  assert.match(field.getText(), /UART1 RX:1, TX:2/);
  r.reset();
  r.window.customSerialPorts.Custom.txPin = '9';
  r.window.updateSerialCustomPorts();
  assert.equal(field.getValue(), 'Custom');
  assert.match(field.getText(), /UART1 RX:1, TX:9/);
  assert.equal(r.rerenders(), 1, 'only the selected changed label requests a batched render');
  assert.equal(Blockly.serialization.workspaces.save(r.workspace).blocks.blocks[0].fields.SERIAL, 'Custom');
  delete r.window.customSerialPorts.Custom;
  r.window.updateSerialCustomPorts();
  assert.equal(field.getValue(), 'Serial');
  assert.equal(field.getText(), 'Primary');
  r.reset();
  r.window.updateSerialCustomPorts();
  assert.equal(r.rerenders(), 0);
});

test('board pin-label changes refresh selected text without changing its stored serial port', t => {
  const r = runtime(t);
  r.blocks[0].setFieldValue('Serial1', 'SERIAL');
  r.reset();
  r.window.boardConfig.serialPins = {Serial1: [['RX', '18'], ['TX', '17']]};
  r.window.updateSerialCustomPorts();
  assert.equal(r.blocks[0].getFieldValue('SERIAL'), 'Serial1');
  assert.equal(r.blocks[0].getField('SERIAL').getText(), 'Secondary(RX:18, TX:17)');
  assert.equal(r.rerenders(), 1);
});

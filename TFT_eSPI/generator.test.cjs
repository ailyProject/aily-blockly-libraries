const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let Blockly;
try { require(require.resolve('blockly/core', { paths: [process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly')] })); Blockly = require(require.resolve('blockly', { paths: [process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly')] })); } catch {}

function harness() {
  const timers = [], Arduino = { forBlock: {} };
  const workspace = new Blockly.Workspace();
  vm.runInNewContext(fs.readFileSync(__dirname + '/generator.js', 'utf8'), {
    Arduino, Blockly, window: { boardConfig: { core: 'esp32' }, projectService: { addMacro: async () => {}, removeMacro: async () => {} }, parent: { postMessage() {} } },
    setTimeout: callback => timers.push(callback), console: { log() {}, error() {} },
    registerVariableToBlockly() {}
  });
  delete Blockly.Blocks.tftespi_setup;
  Blockly.defineBlocksWithJsonArray(require('./block.json').filter(block => block.type === 'tftespi_setup'));
  const macros = new Map();
  const generator = { ORDER_ATOMIC: 0, addLibrary() {}, addVariable() {}, addObject() {}, addSetupBegin() {},
    addMacro: (name, code) => macros.set(name, code),
    valueToCode: (block, name) => String(block.getInputTargetBlock(name)?.getFieldValue('NUM') ?? '') };
  return { workspace, Arduino, macros, generator, flush: () => { while (timers.length) timers.shift()(); } };
}

test('loads all nine old setup connections and saves migrated fields', { skip: !Blockly && 'requires Blockly from AILY_BLOCKLY_ROOT or sibling aily-blockly' }, () => {
  const h = harness();
  try {
    const values = { WIDTH: 172, HEIGHT: 320, MISO: -1, MOSI: 10, SCLK: 12, CS: 13, DC: 11, RST: 14, BL: 3 };
    const state = { type: 'tftespi_setup', fields: { VAR: 'tft', MODEL: 'ST7789_DRIVER' },
      inputs: Object.fromEntries(Object.entries(values).map(([name, number]) => [name, { shadow: { type: 'math_number', fields: { NUM: number } } }])) };
    const block = Blockly.serialization.blocks.append(state, h.workspace);
    // Immediate generation before the deferred migration still reads old values.
    h.Arduino.forBlock.tftespi_setup(block, h.generator);
    assert.equal(h.macros.get('TFT_WIDTH'), '#define TFT_WIDTH 172');
    h.flush();
    for (const [name, number] of Object.entries(values)) {
      assert.equal(block.getFieldValue(name), String(number));
      assert.equal(block.getInputTargetBlock(name), null);
    }
    const saved = Blockly.serialization.blocks.save(block);
    assert.equal(saved.inputs, undefined);
    block.dispose();
    const restored = Blockly.serialization.blocks.append(saved, h.workspace);
    h.flush();
    for (const [name, number] of Object.entries(values)) assert.equal(restored.getFieldValue(name), String(number));
    h.Arduino.forBlock.tftespi_setup(restored, h.generator);
    assert.equal(h.macros.get('TFT_MOSI'), '#define TFT_MOSI 10');
  } finally { h.workspace.dispose(); }
});

test('retains editable non-shadow legacy values and current QSPI fields', { skip: !Blockly && 'requires Blockly from AILY_BLOCKLY_ROOT or sibling aily-blockly' }, () => {
  const h = harness();
  try {
    const block = Blockly.serialization.blocks.append({ type: 'tftespi_setup', fields: { VAR: 'tft', WIDTH: '240', MODEL: 'ST7789_DRIVER' },
      inputs: { WIDTH: { block: { type: 'math_number', fields: { NUM: 135 } } } } }, h.workspace);
    h.flush();
    assert.ok(block.getInputTargetBlock('WIDTH'));
    assert.ok(block.getInput('WIDTH').isVisible());
    h.Arduino.forBlock.tftespi_setup(block, h.generator);
    assert.equal(h.macros.get('TFT_WIDTH'), '#define TFT_WIDTH 135');
    const qspi = Blockly.serialization.blocks.append({ type: 'tftespi_setup', fields: { MODEL: 'CH13613_DRIVER', WIDTH: '466', HEIGHT: '466', QSPI_CS: '9', QSPI_SCLK: '10', D0: '11' } }, h.workspace);
    h.flush();
    h.Arduino.forBlock.tftespi_setup(qspi, h.generator);
    assert.equal(h.macros.get('TFT_WIDTH'), '#define TFT_WIDTH 466');
    assert.equal(h.macros.get('TFT_CS'), '#define TFT_CS 9');
  } finally { h.workspace.dispose(); }
});

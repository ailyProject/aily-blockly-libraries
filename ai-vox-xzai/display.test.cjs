const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Uses the same Blockly installation as the sibling editor checkout.
const hostRoot = process.env.AILY_BLOCKLY_ROOT || path.resolve(__dirname, '../../aily-blockly');
const Blockly = require(require.resolve('blockly', { paths: [hostRoot] }));
const Arduino = { forBlock: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'generator.js'), 'utf8'),
  { Blockly, Arduino, window: {}, console, setTimeout, clearTimeout });
const definition = JSON.parse(fs.readFileSync(path.join(__dirname, 'block.json'), 'utf8'))
  .find(block => block.type === 'esp32ai_init_display');
Blockly.defineBlocksWithJsonArray([definition]);

function generate(block) {
  const variables = {};
  Arduino.forBlock.esp32ai_init_display(block, {
    addLibrary() {}, addMacro() {}, addVariable(key, code) { variables[key] = code; },
  });
  return variables.lcdPin_defines;
}

test('built-in ST7789 display accepts 240x320 and retains dimensions on save/load', () => {
  const workspace = new Blockly.Workspace();
  try {
    const block = workspace.newBlock('esp32ai_init_display');
    assert.equal(block.getFieldValue('WIDTH'), 240);
    assert.equal(block.getFieldValue('HEIGHT'), 240);
    block.setFieldValue(320, 'HEIGHT');
    assert.match(generate(block), /kDisplayWidth = 240;/);
    assert.match(generate(block), /kDisplayHeight = 320;/);
    const state = Blockly.serialization.workspaces.save(workspace);
    Blockly.serialization.workspaces.load(state, workspace);
    const loaded = workspace.getAllBlocks(false)[0];
    assert.equal(loaded.getFieldValue('HEIGHT'), 320);
    assert.match(generate(loaded), /kDisplayHeight = 320;/);
  } finally { workspace.dispose(); }
});

test('legacy projects without size fields preserve each display default', () => {
  const workspace = new Blockly.Workspace();
  try {
    for (const [display, width, height] of [['ST7789', 240, 240], ['SSD1306', 128, 64]]) {
      Blockly.serialization.workspaces.load({ blocks: { blocks: [
        { type: 'esp32ai_init_display', fields: { DISPLAY_TYPE: display } },
      ] } }, workspace);
      const block = workspace.getAllBlocks(false)[0];
      assert.equal(block.getFieldValue('WIDTH'), width);
      assert.equal(block.getFieldValue('HEIGHT'), height);
      assert.match(generate(block), new RegExp('kDisplayWidth = ' + width + ';'));
      assert.match(generate(block), new RegExp('kDisplayHeight = ' + height + ';'));
    }
  } finally { workspace.dispose(); }
});

test('changing display type recreates the correct size fields without duplicates', () => {
  const workspace = new Blockly.Workspace();
  try {
    const block = workspace.newBlock('esp32ai_init_display');
    block.setFieldValue('SSD1306', 'DISPLAY_TYPE');
    block.setFieldValue(32, 'HEIGHT');
    assert.match(generate(block), /kDisplayHeight = 32;/);
    const state = Blockly.serialization.workspaces.save(workspace);
    Blockly.serialization.workspaces.load(state, workspace);
    const loaded = workspace.getAllBlocks(false)[0];
    assert.equal(loaded.getFieldValue('HEIGHT'), 32);
    loaded.setFieldValue('ST7789', 'DISPLAY_TYPE');
    assert.equal(loaded.getFieldValue('HEIGHT'), 240);
    assert.equal(loaded.inputList.filter(input => input.name === 'DISPLAY_SIZE').length, 1);
    loaded.setFieldValue(0, 'WIDTH');
    loaded.setFieldValue(99999, 'HEIGHT');
    assert.equal(loaded.getFieldValue('WIDTH'), 1);
    assert.equal(loaded.getFieldValue('HEIGHT'), 4096);
  } finally { workspace.dispose(); }
});

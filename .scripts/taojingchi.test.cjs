'use strict';

// Run with: node --test .scripts/taojingchi.test.cjs
// Uses the actual Blockly workspace and Arduino generator from a sibling host
// checkout (or AILY_BLOCKLY_ROOT), including its real deduplication/reset rules.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

const root = path.resolve(__dirname, '..');
const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(root, '../aily-blockly'));
const hostRequire = createRequire(path.join(host, 'package.json'));
const Blockly = hostRequire('blockly');
const { JSDOM } = hostRequire('jsdom');
const { document, DOMParser, XMLSerializer } = new JSDOM().window;
Blockly.utils.xml.injectDependencies({ document, DOMParser, XMLSerializer });
const { buildSync } = hostRequire('esbuild');
const compiled = buildSync({
  entryPoints: [path.join(host, 'src/app/editors/blockly-editor/components/blockly/generators/arduino/arduino.ts')],
  bundle: true, packages: 'external', platform: 'node', format: 'cjs', write: false,
}).outputFiles[0].text;
const hostModule = { exports: {} };
vm.runInNewContext(compiled, { module: hostModule, exports: hostModule.exports, require: hostRequire, TextEncoder });
const { createArduinoGenerator } = hostModule.exports;

for (const [library, types] of [
  ['core-loop', ['arduino_setup', 'arduino_loop']],
  ['core-math', ['math_number']],
  ['core-text', ['text']],
  ['taojingchi', null],
]) {
  const definitions = JSON.parse(fs.readFileSync(path.join(root, library, 'block.json'), 'utf8'));
  const selected = types ? definitions.filter(block => types.includes(block.type)) : definitions;
  for (const definition of selected) delete Blockly.Blocks[definition.type];
  Blockly.defineBlocksWithJsonArray(selected);
}

function fixture(boardConfig) {
  const generator = createArduinoGenerator();
  const window = { boardConfig };
  const context = vm.createContext({ Arduino: generator, Blockly, window, console, setTimeout });
  for (const library of ['core-loop', 'core-math', 'core-text', 'taojingchi']) {
    vm.runInContext(fs.readFileSync(path.join(root, library, 'generator.js'), 'utf8'), context,
      { filename: library + '/generator.js' });
  }
  const workspace = new Blockly.Workspace();
  const setup = workspace.newBlock('arduino_setup');
  const loop = workspace.newBlock('arduino_loop');

  function block(type, values = {}, fields = {}) {
    const result = workspace.newBlock(type);
    for (const [name, value] of Object.entries(fields)) result.setFieldValue(String(value), name);
    for (const [name, value] of Object.entries(values)) {
      const child = workspace.newBlock(typeof value === 'string' ? 'text' : 'math_number');
      child.setFieldValue(String(value), typeof value === 'string' ? 'TEXT' : 'NUM');
      result.getInput(name).connection.connect(child.outputConnection);
    }
    return result;
  }

  function chain(container, input, blocks) {
    let connection = container.getInput(input).connection;
    for (const child of blocks) {
      connection.connect(child.previousConnection);
      connection = child.nextConnection;
    }
  }

  return {
    generator, window, workspace, setup, loop, block,
    inSetup: blocks => chain(setup, 'ARDUINO_SETUP', blocks),
    inLoop: blocks => chain(loop, 'ARDUINO_LOOP', blocks),
    code: () => generator.workspaceToCode(workspace),
  };
}

const operations = [
  ['taojingchi_backlight', { BRIGHTNESS: 75 }, {}, 'print("dim=" + String(75));'],
  ['taojingchi_display_page', { PAGE: 1 }, {}, 'print("page " + String(1));'],
  ['taojingchi_set_var', { VALUE: 42 }, { VARNAME: 'data02' }, 'print("data02=" + String((int)42));'],
  // page0 here is a component path, so adding a space would break it.
  ['taojingchi_display_image', { PAGE: 0, IMG: 2, ID: 7 }, {}, 'print("page" + String(0) + ".p" + String(2) + ".pic=" + String(7));'],
  ['taojingchi_send_command', { COMMAND: 'page 2' }, {}, 'print("page 2");'],
  ['taojingchi_send_data', { COMMAND: 'n0.val', VALUE: 23 }, {}, 'print("n0.val");'],
];

function assertSerial(code, esp32, baud = 9600, rx = 2, tx = 3) {
  const port = esp32 ? 'Serial1' : 'taojingchiSerial';
  const initialization = esp32
    ? `Serial1.begin(${baud}, SERIAL_8N1, ${rx}, ${tx});`
    : `taojingchiSerial.begin(${baud});`;
  assert.ok(code.includes(initialization), initialization);
  assert.equal((code.match(/\.begin\(/g) || []).length, 1, 'initialize once');
  assert.ok(code.indexOf(initialization) < code.indexOf(port + '.print('), 'initialize before sending');
  if (esp32) {
    assert.doesNotMatch(code, /SoftwareSerial|taojingchiSerial/);
  } else {
    assert.ok(code.includes('#include <SoftwareSerial.h>'));
    assert.ok(code.includes(`SoftwareSerial taojingchiSerial(${rx}, ${tx});`));
    assert.equal((code.match(/SoftwareSerial taojingchiSerial\(/g) || []).length, 1);
    assert.doesNotMatch(code, /Serial1/);
  }
  return port;
}

for (const esp32 of [false, true]) {
  const board = esp32 ? 'esp32:esp32:esp32' : 'arduino:avr:uno';
  test(`${board}: toolbox init defaults match automatic initialization`, () => {
    const f = fixture({ core: board });
    try {
      const toolbox = JSON.parse(fs.readFileSync(path.join(root, 'taojingchi/toolbox.json'), 'utf8'));
      const state = toolbox.contents.find(item => item.type === 'taojingchi_init');
      const init = Blockly.serialization.blocks.append(state, f.workspace);
      assert.equal(init.getFieldValue('BAUD'), '9600');
      f.inSetup([init]);
      f.inLoop([f.block('taojingchi_display_page', { PAGE: 1 })]);
      assertSerial(f.code(), esp32);
    } finally { f.workspace.dispose(); }
  });

  for (const [type, values, fields, command] of operations) {
    test(`${board}: ${type} works without an init block`, () => {
      const f = fixture({ core: board });
      try {
        f.inLoop([f.block(type, values, fields)]);
        const code = f.code();
        const port = assertSerial(code, esp32);
        assert.ok(code.includes(port + '.' + command), command);
        assert.equal((code.match(/\.write\(0xFF\);/g) || []).length, 3, 'three terminator bytes');
        assert.equal((code.match(/delay\(10\);/g) || []).length, 1);
      } finally { f.workspace.dispose(); }
    });
  }

  for (const initFirst of [false, true]) {
    test(`${board}: explicit pins/baud win, init first=${initFirst}`, () => {
      const f = fixture({ core: board });
      try {
        const init = f.block('taojingchi_init', { RXPIN: 4, TXPIN: 5 }, { BAUD: 115200 });
        const page = f.block('taojingchi_display_page', { PAGE: 1 });
        f.inSetup(initFirst ? [init, page] : [page, init]);
        const first = f.code();
        assertSerial(first, esp32, 115200, 4, 5);
        assert.equal(f.code(), first, 'regeneration must keep explicit settings');

        init.getInputTargetBlock('RXPIN').setFieldValue('6', 'NUM');
        init.getInputTargetBlock('TXPIN').setFieldValue('7', 'NUM');
        init.setFieldValue('57600', 'BAUD');
        const edited = f.code();
        assertSerial(edited, esp32, 57600, 6, 7);
        assert.doesNotMatch(edited, /115200|SERIAL_8N1, 4, 5|taojingchiSerial\(4, 5\)/);

        init.dispose(true);
        const deleted = f.code();
        assertSerial(deleted, esp32);
        assert.doesNotMatch(deleted, /57600|SERIAL_8N1, 6, 7|taojingchiSerial\(6, 7\)/);
        assert.equal(f.code(), deleted);
      } finally { f.workspace.dispose(); }
    });
  }
}

for (const config of [undefined, {}, { core: '' }]) {
  test(`missing board metadata uses one consistent serial, config=${JSON.stringify(config)}`, () => {
    const f = fixture(config);
    try {
      f.inSetup([f.block('taojingchi_init', { RXPIN: 8, TXPIN: 9 }, { BAUD: 9600 })]);
      f.inLoop([f.block('taojingchi_display_page', { PAGE: 1 })]);
      assertSerial(f.code(), false, 9600, 8, 9);
    } finally { f.workspace.dispose(); }
  });
}

test('all operations share initialization and preserve framing when the board changes', () => {
  const f = fixture({ core: 'esp32' });
  try {
    f.inLoop(operations.map(([type, values, fields]) => f.block(type, values, fields)));
    for (const core of ['esp32', 'arduino:avr', 'esp32:esp32:esp32c3']) {
      f.window.boardConfig = { core };
      const code = f.code();
      const port = assertSerial(code, core.includes('esp32'));
      assert.equal((code.match(/\.write\(0xFF\);/g) || []).length, 18);
      assert.equal((code.match(/delay\(10\);/g) || []).length, 6);
      assert.ok(code.includes(`${port}.print("=");`));
      assert.ok(code.includes(`${port}.print(String((int)23));`));
      assert.equal(f.code(), code);
    }
  } finally { f.workspace.dispose(); }
});

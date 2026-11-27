import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../../seeed_mmwave/generator.js', import.meta.url), 'utf8');

function generate(parent) {
  const Arduino = { forBlock: {} };
  vm.runInNewContext(source, {
    Arduino,
    Blockly: { Extensions: { isRegistered: () => false, register() {} } },
    registerVariableToBlockly() {},
  });
  const preamble = [];
  const block = {
    type: 'mmwave_init',
    getSurroundParent: () => parent,
    getField: () => null,
    getFieldValue: key => ({ VAR: 'radar', SERIAL_TYPE: 'ROUTED1', RX_PIN: 'D7', TX_PIN: 'D6' })[key],
  };
  const code = Arduino.forBlock.mmwave_init(block, {
    addLibrary() {}, addVariable() {},
    addSetupBegin: (name, lines) => preamble.push([name, lines]),
  });
  return { code, preamble };
}

test('an initialization within setup runs at its statement position', () => {
  const { code, preamble } = generate({ type: 'controls_if', getSurroundParent: () => ({ type: 'arduino_setup' }) });
  assert.match(code, /radarSerial\.begin\(9600, SERIAL_8N1, D7, D6\)/);
  assert.deepEqual(preamble, []);
});

test('a legacy initialization outside setup is emitted once in the setup preamble', () => {
  const { code, preamble } = generate(null);
  assert.equal(code, '');
  assert.equal(preamble.length, 1);
  assert.equal(preamble[0][0], 'mmwave_begin_radar');
  assert.match(preamble[0][1], /radarSerial\.begin\(/);
});

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Point SENSOR_SAMPLING_ROOT at a checkout to test its emitted C++ helpers.
const root = process.env.SENSOR_SAMPLING_ROOT || path.resolve(__dirname, '..');

function generate(library, blockType) {
  const sections = { variables: {}, functions: {} };
  const Arduino = { forBlock: {}, ORDER_FUNCTION_CALL: 2, valueToCode: () => '10' };
  for (const method of ['addLibrary', 'addLoopBegin']) Arduino[method] = () => {};
  Arduino.addVariable = (name, code) => { sections.variables[name] = code; };
  Arduino.addFunction = (name, code) => { sections.functions[name] = code; };
  const context = { Arduino, window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, library, 'generator.js'), 'utf8'), context);
  const block = { getField: () => ({ getText: () => 'gauge' }), getFieldValue: () => 'LOW' };
  Arduino.forBlock[blockType](block, Arduino);
  return { sections, Arduino, block };
}

function unsignedElapsed(code) {
  // Preserve C++ uint32_t subtraction semantics while executing the emitted guard.
  return code
    .replace(/const uint32_t /g, 'const ')
    .replace(/\(uint32_t\)\((now - (?:e\.at|\w+_at))\)/g, '(($1) >>> 0)')
    .replace(/millis\(\) - (e\.at|\w+_at)/g, '((millis() - $1) >>> 0)');
}

for (const [library, block, prefix, span, ioStart] of [
  ['QMI8658', 'qmi8658_read', 'qmi8658', 10, 'QMI8658Data d;'],
  ['QMC6309', 'qmc6309_read', 'qmc6309', 10, 'int16_t x, y, z;'],
  ['LTR303', 'ltr303_read', 'ltr303', 100, 'uint16_t ch0, ch1;'],
]) {
  for (const start of [0, 1000, 1001, 0xfffffffc]) {
    test(`${library}: one sample per ${span}ms starting at ${start}`, () => {
      const { sections } = generate(library, block);
      const emitted = sections.functions[`${prefix}_update`];
      const guard = unsignedElapsed(emitted.slice(emitted.indexOf('{') + 1, emitted.indexOf(ioStart)));
      const update = new Function('state', 'millis', `with (state) { ${guard} reads++; }`);
      const state = { [`${prefix}_at`]: 0, [`${prefix}_sampled`]: false, reads: 0 };
      const sample = time => update(state, () => time >>> 0);
      for (let i = 0; i < 30; i++) sample(start);
      assert.equal(state.reads, 1, 'repeated calls at one timestamp must share a sample');
      sample(start + span - 1);
      assert.equal(state.reads, 1, 'interval has not expired');
      sample(start + span);
      assert.equal(state.reads, 2, 'interval expires, including across uint32 rollover');
    });
  }
}

function bqUpdate() {
  const { sections } = generate('bq27220', 'bq27220_battery_state');
  const emitted = sections.functions.bq27220_estimate_update;
  const body = unsignedElapsed(emitted.slice(emitted.indexOf('{') + 1, emitted.lastIndexOf('}')))
    .replace('const int mv', 'const mv')
    .replace(/\(float\)/g, '')
    .replace('const int smooth = (int)(e.avg + 0.5f);', 'const smooth = Math.trunc(e.avg + 0.5);')
    .replace(/static const int ([VP])\[\] = \{([^}]+)\};/g, 'const $1 = [$2];')
    .replace(/\bint pct\b/g, 'let pct')
    .replace(/\bint i\b/g, 'let i')
    .replace(/([0-9])f\b/g, '$1');
  return new Function('gauge', 'e', 'millis', body);
}

for (const start of [0, 1000, 1001, 0xfffffffc]) {
  test(`BQ27220: fast calls do not accelerate shutdown starting at ${start}`, () => {
    const update = bqUpdate();
    const state = { avg: 0, pct: -1, lowCount: 0, at: 0, sampled: false };
    let reads = 0;
    const gauge = { getVoltage: () => { reads++; return 3200; } };
    const sample = time => update(gauge, state, () => time >>> 0);
    for (let i = 0; i < 30; i++) sample(start);
    assert.equal(reads, 1);
    assert.equal(state.lowCount, 1);
    sample(start + 99);
    assert.equal(state.lowCount, 1);
    for (let i = 1; i < 29; i++) sample(start + i * 100);
    assert.equal(state.lowCount, 29, 'shutdown must remain false before 30 scheduled samples');
    sample(start + 2900);
    assert.equal(state.lowCount, 30, 'sustained low voltage still reaches the shutdown threshold');
  });
}

test('QMC6309 calibration invalidates its cached sample', () => {
  const { Arduino, sections, block } = generate('QMC6309', 'qmc6309_calibrate');
  assert.ok(Arduino.forBlock.qmc6309_calibrate);
  assert.match(sections.functions.qmc6309_calibrate, /qmc6309_sampled = false;/);
});

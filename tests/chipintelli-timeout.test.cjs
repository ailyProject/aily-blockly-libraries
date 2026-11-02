const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const fixtures = path.join(__dirname, 'fixtures', 'chipintelli-timeout');
const output = path.join(__dirname, '.output', 'chipintelli-timeout');
const cases = [
  { library: 'chipIntelli_ASR', blockType: 'chipintelli_asr_keep_awake_for', fallback: '15',
    key: 'chipintelli_asr_timeout_ms', helper: 'ailyChipIntelliASRTimeoutMs', call: 'ChipIntelliASR.keepAwakeFor' },
  { library: 'chipIntelli_CWSL', blockType: 'chipintelli_cwsl_init', fallback: '10000',
    key: 'chipintelli_cwsl_timeout_ms', helper: 'ailyChipIntelliCWSLTimeoutMs', call: 'ChipIntelliCWSL.begin' },
];

function runtime() {
  const Arduino = { forBlock: {} };
  const functions = new Map();
  const libraries = new Map();
  const context = vm.createContext({ Arduino });
  for (const item of cases) {
    const filename = path.join(root, item.library, 'generator.js');
    new vm.Script(fs.readFileSync(filename, 'utf8'), { filename }).runInContext(context);
  }
  const generator = {
    ORDER_ATOMIC: 0,
    addLibrary: (key, source) => libraries.set(key, source),
    addFunction: (key, source) => functions.set(key, source),
  };
  return {
    functions, libraries,
    generate(item, expression) {
      generator.valueToCode = (_block, name, order) => {
        assert.equal(name, 'TIMEOUT');
        assert.equal(order, generator.ORDER_ATOMIC);
        return expression;
      };
      const entry = { id: 'timeout-test-setup', type: 'arduino_setup', getParent: () => null };
      const block = { id: 'timeout-test', type: item.blockType, isInFlyout: false,
        getParent: () => entry, getSurroundParent: () => entry };
      return Arduino.forBlock[item.blockType](block, generator);
    },
  };
}

function expectedCall(item, expression) {
  return item.call + '(' + item.helper + '((long)(' + expression + ')));\n';
}

for (const item of cases) {
  test(item.library + ' keeps the default input and registers one reusable helper', () => {
    const r = runtime();
    assert.equal(r.generate(item, ''), expectedCall(item, item.fallback));
    assert.equal(r.generate(item, undefined), expectedCall(item, item.fallback));
    assert.equal(r.functions.size, 1);
    assert.deepEqual([...r.functions.keys()], [item.key]);
    assert.match(r.functions.get(item.key), new RegExp('static constexpr uint32_t ' + item.helper + '\\(long '));
    assert.equal(r.libraries.size, 1);
  });

  test(item.library + ' emits each runtime expression once without an unqualified max', () => {
    const r = runtime();
    for (const expression of ['-5', '0', '15', '1.9', 'nextTimeout(counter)']) {
      const code = r.generate(item, expression);
      assert.equal(code, expectedCall(item, expression));
      assert.equal(code.split(expression).length - 1, 1);
      assert.doesNotMatch(code + r.functions.get(item.key), /\bmax\s*\(/);
    }
    assert.equal(r.functions.size, 1);
  });
}

test('ASR and CWSL can generate multiple calls together without sharing a helper', () => {
  const r = runtime();
  for (let i = 0; i < 3; i++) {
    for (const item of cases) r.generate(item, 'nextTimeout(counter)');
  }
  assert.deepEqual([...r.functions.keys()], cases.map(item => item.key));
  assert.equal(r.libraries.size, 2);
});

function findCompiler() {
  const configured = process.env.AILY_TEST_CXX || process.env.CXX;
  if (configured) {
    const result = spawnSync(configured, ['--version'], { encoding: 'utf8', timeout: 10000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return configured;
  }
  for (const candidate of ['clang++', 'g++']) {
    const result = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 10000 });
    if (!result.error && result.status === 0) return candidate;
  }
  return null;
}

function compile(compiler, filename, source) {
  fs.mkdirSync(output, { recursive: true });
  const sourcePath = path.join(output, filename);
  fs.writeFileSync(sourcePath, source);
  const result = spawnSync(compiler, [
    '-std=c++17', '-fsyntax-only', '-I', fixtures, sourcePath,
  ], { encoding: 'utf8', timeout: 30000 });
  assert.ifError(result.error);
  return result;
}

function generatedScenario() {
  const r = runtime();
  const calls = [];
  for (const [item, counter] of [[cases[0], 'asrSeconds'], [cases[1], 'cwslMilliseconds']]) {
    for (const expression of ['', 'nextTimeout(' + counter + ')', 'nextTimeout(' + counter + ')', '-1.9', '0', '1.9']) {
      calls.push(r.generate(item, expression));
    }
  }
  return [
    'using uint32_t = unsigned int;',
    'static_assert(sizeof(uint32_t) == 4, "timeout uses 32-bit milliseconds");',
    [...r.functions.values()].join('\n'),
    'struct TimeoutTarget {',
    '  uint32_t received[6] = {};',
    '  unsigned count = 0;',
    '  constexpr void keepAwakeFor(uint32_t value) { received[count++] = value; }',
    '  constexpr void begin(uint32_t value) { received[count++] = value; }',
    '};',
    'constexpr long nextTimeout(long &value) { return value++; }',
    'constexpr bool checkGeneratedCalls() {',
    '  TimeoutTarget ChipIntelliASR, ChipIntelliCWSL;',
    '  long asrSeconds = 15;',
    '  long cwslMilliseconds = 10000;',
    calls.join(''),
    '  return asrSeconds == 17 && cwslMilliseconds == 10002',
    '      && ChipIntelliASR.count == 6 && ChipIntelliCWSL.count == 6',
    '      && ChipIntelliASR.received[0] == 15000',
    '      && ChipIntelliASR.received[1] == 15000',
    '      && ChipIntelliASR.received[2] == 16000',
    '      && ChipIntelliASR.received[3] == 0',
    '      && ChipIntelliASR.received[4] == 0',
    '      && ChipIntelliASR.received[5] == 1000',
    '      && ChipIntelliCWSL.received[0] == 10000',
    '      && ChipIntelliCWSL.received[1] == 10000',
    '      && ChipIntelliCWSL.received[2] == 10001',
    '      && ChipIntelliCWSL.received[3] == 0',
    '      && ChipIntelliCWSL.received[4] == 0',
    '      && ChipIntelliCWSL.received[5] == 1;',
    '}',
    'static_assert(checkGeneratedCalls(), "timeouts preserve units, clamp and single evaluation");',
    '',
  ].join('\n');
}

test('generated C++ compiles with both CI13xx/FastLED include orders and preserves timeout behavior', t => {
  const compiler = findCompiler();
  if (!compiler) {
    t.skip('Set AILY_TEST_CXX to a GNU-compatible host or board C++ compiler.');
    return;
  }
  for (const headers of [
    ['arduino-max.h', 'fastled-max.h'],
    ['fastled-max.h', 'arduino-max.h'],
  ]) {
    const includes = headers.map(header => '#include "' + header + '"').join('\n') + '\n';
    const order = headers[0].startsWith('arduino') ? 'arduino-first' : 'fastled-first';
    const original = compile(compiler, order + '-original.cpp', includes + 'long originalTimeout() { return max(0L, (long)(15)); }\n');
    assert.notEqual(original.status, 0, 'fixture must reproduce the original overload conflict');
    assert.match(original.stderr, /ambiguous/i);
    const fixed = compile(compiler, order + '-fixed.cpp', includes + generatedScenario());
    assert.equal(fixed.status, 0, fixed.stderr || fixed.stdout);
  }
});

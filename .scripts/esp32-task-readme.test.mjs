import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const library = fileURLToPath(new URL('../esp32_task/', import.meta.url));
const readme = fs.readFileSync(path.join(library, 'readme_ai.md'), 'utf8');
const blocks = new Map(JSON.parse(fs.readFileSync(path.join(library, 'block.json'), 'utf8')).map(block => [block.type, block]));
const examples = [...readme.matchAll(/```abs\r?\n([\s\S]*?)```/g)].map(match => match[1]);
const Arduino = { forBlock: {} };
new vm.Script(fs.readFileSync(path.join(library, 'generator.js'), 'utf8'), { filename: 'esp32_task/generator.js' })
  .runInNewContext({ Arduino }, { timeout: 1000 });

function validateExample(example) {
  const lines = example.split(/\r?\n/);
  const definitions = new Set();
  let root, serialInitialized = false, starts = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    if (/^\S/.test(line)) {
      root = line.match(/^(\w+)\(/)?.[1];
      if (root === 'arduino_setup') serialInitialized = false;
    }
    const definition = line.match(/^\s*esp32_task_new\("([^"\n]+)"\)$/);
    if (definition) {
      assert.match(line, /^esp32_task_new\(/, 'Task Hat must be at the ABS root');
      assert.match(definition[1], /^[A-Za-z_]\w*$/, 'Task name must be a C++ identifier');
      assert.ok(!definitions.has(definition[1]), 'Task names must be unique');
      definitions.add(definition[1]);
    }
    if (/^\s+serial_begin\(Serial,/.test(line) && root === 'arduino_setup') serialInitialized = true;
    const start = line.match(/^\s+esp32_task_start\(text\("([^"\n]+)"\)\)$/);
    if (start) {
      assert.equal(root, 'arduino_setup', 'Example starts tasks from main setup');
      assert.ok(serialInitialized, 'Shared serial must be initialized before the task starts');
      assert.ok(definitions.has(start[1]), 'Start must name a defined task');
      starts++;
    }
  }
  assert.ok(definitions.size && starts, 'Example must define and start a task');
}

function generate(type, { name = 'task1', value = '', statements = {} } = {}) {
  const functions = new Map();
  const code = Arduino.forBlock[type]({ getFieldValue: field => field === 'TASK_NAME' ? name : undefined }, {
    ORDER_ATOMIC: 0,
    addLibrary() {},
    valueToCode: () => value,
    statementToCode: (_block, input) => statements[input] ?? '',
    addFunction: (key, body) => functions.set(key, body),
  });
  return { code, functions };
}

test('README Hat and statement contracts match the actual block definitions', () => {
  const definition = blocks.get('esp32_task_new');
  for (const property of ['previousStatement', 'nextStatement', 'output']) assert.ok(!Object.hasOwn(definition, property));
  assert.deepEqual([...definition.args1, ...definition.args2].map(input => [input.type, input.name]),
    [['input_statement', 'SETUP'], ['input_statement', 'LOOP']]);
  assert.match(readme, /\| `esp32_task_new` \| Hat \|/);
  for (const type of ['esp32_task_start', 'esp32_task_free', 'esp32_task_delay']) {
    assert.ok(Object.hasOwn(blocks.get(type), 'previousStatement'));
    assert.ok(Object.hasOwn(blocks.get(type), 'nextStatement'));
  }
});

test('documented ABS defines root tasks and initializes shared serial before matching starts', () => {
  assert.ok(examples.length, 'Keep a runnable ABS example');
  examples.forEach(validateExample);
});

for (const [name, example] of [
  ['nested Hat', 'arduino_loop()\n    esp32_task_new("task1")'],
  ['mismatched start name', 'esp32_task_new("task1")\narduino_setup()\n    serial_begin(Serial, 9600)\n    esp32_task_start(text("other"))'],
  ['start before shared initialization', 'esp32_task_new("task1")\narduino_setup()\n    esp32_task_start(text("task1"))\n    serial_begin(Serial, 9600)'],
]) test(`example checker rejects ${name}`, () => assert.throws(() => validateExample(example)));

test('Hat generator emits global setup/loop functions without a statement return', () => {
  const result = generate('esp32_task_new', { statements: { SETUP: '  setupMarker();\n', LOOP: '  loopMarker();\n' } });
  assert.equal(result.code, '');
  assert.equal(result.functions.size, 1);
  assert.equal(result.functions.get('task_task1'), 'newTask(task1);\nvoid task1::setup() {\n  setupMarker();\n}\n\nvoid task1::loop() {\n  loopMarker();\n}\n\n');
});

test('README delay value agrees with actual generated milliseconds and the default', () => {
  const row = readme.split(/\r?\n/).find(line => line.startsWith('| `esp32_task_delay` |'));
  const milliseconds = row?.match(/esp32_task_delay\(math_number\((\d+)\)\)/)?.[1];
  assert.equal(milliseconds, '1000');
  const generated = generate('esp32_task_delay', { value: milliseconds }).code.trim();
  assert.ok(row.includes('`' + generated + '`'));
  assert.equal(generated, 'delay(1000);');
  assert.equal(generate('esp32_task_delay').code, 'delay(1000);\n');
});

test('documented named start and free agree with the generator', () => {
  for (const [type, native] of [['esp32_task_start', 'taskStart'], ['esp32_task_free', 'taskFree']]) {
    const code = generate(type, { value: '"task1"' }).code.trim();
    const row = readme.split(/\r?\n/).find(line => line.startsWith('| `' + type + '` |'));
    assert.equal(code, native + '(task1);');
    assert.ok(row.includes(type + '(text("task1"))'));
    assert.ok(row.includes('`' + code + '`'));
  }
});

test('README preserves explicit capability and lifecycle boundaries', () => {
  for (const contract of [/ESP32-C3 is single-core/, /priority to 1/, /stack to 2048 bytes/,
    /neither is configurable through these blocks/, /does not return a creation status/,
    /does not automatically free user allocations/, /does not guarantee that serial buffers cannot overflow/])
    assert.match(readme, contract);
});

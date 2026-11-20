const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const host = path.resolve(process.env.AILY_BLOCKLY_ROOT || path.join(__dirname, '../../aily-blockly'));
const Blockly = createRequire(path.join(host, 'package.json'))('blockly');
const generatorScript = fs.readFileSync(path.join(__dirname, '../esp32_freertos/generator.js'), 'utf8');

function generateTasks(labels, ordinaryNames = []) {
  const native = new Blockly.Workspace();
  const variables = native.getVariableMap();
  const objects = new Map();
  const functions = new Map();
  const generator = {
    codeDict: {}, forBlock: {},
    nameDB_: new Blockly.Names('if,while,void'),
    addLibrary() {},
    addFunction(key, code) { functions.set(key, code); },
    addObject(key, code) { objects.set(key, code); },
    statementToCode(block) { return '    // body: ' + block.label + '\n'; },
  };
  const invoke = (block, kind = block.type) => generator.forBlock[kind](block, generator);
  const task = (label, operation, model = undefined) => ({
    workspace, label,
    type: 'esp32_freertos_task_' + operation,
    getFieldValue(field) { return field === 'VAR' ? label : undefined; },
    getField: () => ({ getText: () => label, getVariable: () => model }),
  });
  const workspace = { getVariableMap: () => variables, getAllBlocks: () => declarations };
  const declarations = [];
  for (const label of ordinaryNames) variables.createVariable(label);
  const taskModels = labels.map(label => variables.createVariable(label, 'ESP32FreeRTOSTask'));
  const creates = labels.map(label => task(label, 'create'));
  const bodies = labels.map((label, index) => task(label, 'function', taskModels[index]));
  declarations.push(...creates, ...bodies);
  vm.runInNewContext(generatorScript, { Arduino: generator, Blockly });

  try {
    // Deliberately generate function bodies in a different order from creation.
    bodies.slice().reverse().forEach(block => invoke(block));
    return creates.map((block, index) => {
      const code = invoke(block);
      const [, callback, label] = /^xTaskCreate\(\n\s+(\w+),\n\s+"([^"]+)",/.exec(code);
      const [, handle] = /&(\w+)\n/.exec(code);
      const body = [...functions.values()].find(value => value.startsWith('void ' + callback + '(void *pvParameters) {'));
      assert.ok(body?.includes('// body: ' + labels[index]));
      assert.ok([...objects.values()].includes('TaskHandle_t ' + handle + ' = NULL;'));
      const reference = task(labels[index], 'suspend', taskModels[index]);
      assert.equal(invoke(reference), 'vTaskSuspend(' + handle + ');\n');
      assert.equal(invoke(reference, 'esp32_freertos_task_resume'), 'vTaskResume(' + handle + ');\n');
      assert.equal(invoke(reference, 'esp32_freertos_task_notify'), 'xTaskNotifyGive(' + handle + ');\n');
      return { callback, label, handle };
    });
  } finally {
    native.dispose();
  }
}

test('distinct Unicode and punctuation labels retain their own ESP32 FreeRTOS C++ identity', () => {
  const labels = ['回流焊任务', '蜂鸣器任务', 'Send-Task', 'Send Task', 'Send_Task'];
  const generated = generateTasks(labels);
  assert.deepEqual(generated.map(item => item.label), labels);
  assert.equal(new Set(generated.map(item => item.callback)).size, labels.length);
  assert.equal(new Set(generated.map(item => item.handle)).size, labels.length);
});

test('unambiguous ASCII symbols stay stable and callback collisions use a distinct identity', () => {
  const [ordinary, colliding] = generateTasks(['TaskBlink', 'TaskControl'], ['TaskControl', 'TaskControlHandle']);
  assert.deepEqual(ordinary, { callback: 'TaskBlink', label: 'TaskBlink', handle: 'TaskBlinkHandle' });
  assert.match(colliding.callback, /^ailyRtos_esp32_task_/);
  assert.match(colliding.handle, /^ailyRtos_esp32_handle_/);
});

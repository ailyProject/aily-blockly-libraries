const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('DS1302 ships the verified upstream driver and its license', () => {
  const folder = path.join(root, 'ds1302');
  const manifest = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
  assert.notEqual(manifest.version, '1.0.0');
  assert.equal(manifest.license, 'BSD-2-Clause');
  assert.ok(manifest.files.includes('src/') && manifest.files.includes('LICENSE'));
  assert.equal(sha(fs.readFileSync(path.join(folder, 'src/DS1302.h'))),
    'b8739f8519feee542b74c49fd977aedd50ddb4a8c25fb260aceeec1c04d65482');
  assert.equal(sha(fs.readFileSync(path.join(folder, 'src/DS1302.cpp'))),
    '749ff2dc30d5b95d3cb64e8d583b1284e2757977e1fb8fc218a7827cadb00b0f');
  assert.match(fs.readFileSync(path.join(folder, 'LICENSE'), 'utf8'), /Copyright \(c\) 2009, Matt Sparks/);
});

function mqttGenerator() {
  const functions = new Map();
  const context = { Arduino: { forBlock: {} }, Blockly: {}, window: {}, registerVariableToBlockly() {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'pubsubclient/generator.js'), 'utf8'), context);
  const api = { ORDER_ATOMIC: 0, addLibrary() {}, addObject() {}, addLoopEnd() {},
    addFunction: (key, value) => { if (!functions.has(key)) functions.set(key, value); },
    valueToCode: (block, field) => block.values[field] };
  const block = values => ({ values, getFieldValue: () => 'mqttClient',
    getField: () => ({ getText: () => 'mqttClient' }),
    workspace: { getVariablesOfType: () => [{ name: 'mqttClient' }] } });
  return { functions, api, block, handlers: context.Arduino.forBlock };
}

test('publish emits one shared overload group and evaluates each text input once', () => {
  const { functions, api, block, handlers } = mqttGenerator();
  const first = handlers.pubsub_publish(block({ TOPIC: 'nextTopic()', PAYLOAD: 'nextPayload()' }), api);
  const second = handlers.pubsub_publish(block({ TOPIC: '"topic"', PAYLOAD: 'payload' }), api);
  assert.equal(functions.size, 1);
  assert.match(functions.get('aily_mqtt_cstr'), /const char\* value/);
  assert.match(functions.get('aily_mqtt_cstr'), /const String& value/);
  assert.equal(first.split('nextTopic()').length - 1, 1);
  assert.equal(first.split('nextPayload()').length - 1, 1);
  assert.match(second, /publish\(aily_mqtt_cstr\("topic"\), aily_mqtt_cstr\(payload\)\)/);
});

test('server configuration does not borrow a temporary string through the publish adapter', () => {
  const { functions, api, block, handlers } = mqttGenerator();
  const code = handlers.pubsub_create(block({ SERVER: 'hostname', PORT: '1883' }), api);
  assert.equal(functions.size, 0);
  assert.match(code, /\.setServer\(hostname, 1883\)/);
});

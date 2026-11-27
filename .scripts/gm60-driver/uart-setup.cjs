const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Arduino = { forBlock: {}, ORDER_ATOMIC: 0 };
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../../dfrobot_gm60/generator.js'), 'utf8'), { Arduino });
for (const type of ['arduino_setup', 'arduino_loop']) {
  const before = [];
  const container = { type };
  const block = { getField: () => null, getFieldValue: key => key === 'VAR' ? 'reader' : 'UART1',
    getSurroundParent: () => container };
  const output = Arduino.forBlock.gm60_init_uart(block, { valueToCode: (_b, p) => p === 'RX' ? 'D7' : 'D6',
    addObject() {}, addLibrary() {}, addSetupBegin(_id, value) { before.push(value); } });
  assert.equal(before.length, type === 'arduino_setup' ? 0 : 1);
  assert.match(output || before[0], /readerSerial.begin\(9600, SERIAL_8N1, D7, D6\)/);
  assert.match(output || before[0], /reader.begin\(readerSerial\)/);
}

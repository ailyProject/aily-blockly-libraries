const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const [root, output] = process.argv.slice(2);
const context = {Arduino: {forBlock: {}}};
vm.runInNewContext(fs.readFileSync(root + '/generator.js', 'utf8'), context);
const declarations = [new Map(), new Map(), new Map()];
const generator = {
  addLibrary: (k, v) => declarations[0].set(k, v),
  addVariable: (k, v) => declarations[1].set(k, v),
  addFunction: (k, v) => declarations[2].set(k, v),
  valueToCode: () => '', ORDER_ATOMIC: 0,
};
const functions = {};
for (const def of JSON.parse(fs.readFileSync(root + '/block.json'))) {
  const result = context.Arduino.forBlock[def.type]({getFieldValue: () => ''}, generator);
  functions[def.type] = Array.isArray(result) ? 'return ' + result[0] + ';' : result;
}
assert.equal(Object.keys(functions).length, 8);
fs.writeFileSync(output, [...declarations.flatMap(d => [...d.values()]),
  ...Object.entries(functions).map(([type, body]) => 'auto block_' + type + '() { ' + body + ' }'),
].join('\n'));

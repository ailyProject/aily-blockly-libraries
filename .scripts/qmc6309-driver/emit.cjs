const fs = require('node:fs'), vm = require('node:vm');
const context = { Arduino: {forBlock:{}} };
vm.runInNewContext(fs.readFileSync(process.argv[2], 'utf8'), context);
const declarations = new Map(), functions = new Map();
context.Arduino.qmc6309SampleEnsure({
  addVariable: (name,source) => declarations.set(name,source),
  addLibrary: () => {}, addFunction: (name,source) => functions.set(name,source),
});
process.stdout.write([...declarations.values(),...functions.values()].join('\n'));

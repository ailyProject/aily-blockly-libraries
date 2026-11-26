const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../MMA8653');
const scope = { Arduino: { forBlock: {}, ORDER_FUNCTION_CALL: 2 }, addVariableToToolbox() {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'generator.js'), 'utf8'), scope);
const groups = {Library: {}, Variable: {}, Function: {}, SetupBegin: {}};
const generator = { nameDB_: { getName: name => name } };
for (const [name, group] of Object.entries(groups))
    generator['add' + name] = (key, code) => { group[key] = code; };
const fields = { RANGE: 'MMA8653_4G_RANGE', RESOLUTION: 'MMA8653_10BIT_RES', DATA_RATE: 'MMA8653_ODR_50',
    MODE: 'MMA8653_MODS_LOW_POWER', VAR_X: 'vx', VAR_Y: 'vy', VAR_Z: 'vz' };
const blocks = {};
for (const {type} of JSON.parse(fs.readFileSync(path.join(root, 'block.json')))) {
    const out = scope.Arduino.forBlock[type]({ getFieldValue: name => fields[name] }, generator);
    blocks[type] = Array.isArray(out) ? out[0] : out;
}
assert.equal(Object.keys(blocks).length, 15);
assert.doesNotMatch(groups.SetupBegin.mma8653_init, /while\s*\(/);
for (const group of ['Library','Variable','Function']) console.log(Object.values(groups[group]).join('\n'));
console.log('void generatedSetup(){' + groups.SetupBegin.mma8653_init + '}');
for (const [name, code] of Object.entries(blocks)) {
    if (name.endsWith('_init')) continue;
    const statement = name.endsWith('_begin') || name.endsWith('_read_xyz') || name.includes('_set_');
    console.log('auto ' + name + '(){' + (statement ? code : 'return ' + code + ';') + '}');
}

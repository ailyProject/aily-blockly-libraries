// Generate the helpers from the actual shipped Blockly definitions.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const packagePath = path.join(__dirname,'../../LSM303AGR');
const context = {Arduino:{forBlock:{}}, registerVariableToBlockly(){}};
vm.runInNewContext(fs.readFileSync(path.join(packagePath,'generator.js'),'utf8'),context);
const generators = context.Arduino.forBlock;
const fields = {
  acc_init:{VAR:'accelerometer',WIRE:'wire'}, mag_init:{VAR:'magnetometer',WIRE:'wire'},
  acc_get_axis:{VAR:'accelerometer',AXIS:'2'}, mag_get_axis:{VAR:'magnetometer',AXIS:'0'},
  acc_get_temperature:{VAR:'accelerometer'}, ahrs_update:{ACC_VAR:'accelerometer',MAG_VAR:'magnetometer'},
  ahrs_get_angle:{ANGLE:'ROLL'},
};
assert.deepEqual(Object.keys(generators).sort(),Object.keys(fields).map(k=>'lsm303agr_'+k).sort());
const gen = {
  libraries_:{}, setupCodes_:{}, objects:{}, functions:{}, ORDER_FUNCTION_CALL:2, ORDER_ATOMIC:0,
  addLibrary(k,v){this.libraries_[k]=v;}, addObject(k,v){this.objects[k]=v;},
  addSetup(k,v){this.setupCodes_[k]=v;}, addFunction(k,v){this.functions[k]=v;},
};
function emit(key) {
  const values=fields[key];
  const block={getFieldValue:k=>values[k],getField:k=>({getText:()=>values[k]})};
  const code=generators['lsm303agr_'+key](block,gen);
  return Array.isArray(code)?code[0]:code;
}
const angle=emit('ahrs_get_angle');
assert(gen.objects._lsm303agr_ahrs_filter && gen.objects._lsm303agr_ahrs_valid);
const code=Object.fromEntries(Object.keys(fields).map(k=>[k,emit(k)]));
const join=o=>Object.values(o).join('\n');
process.stdout.write(`#include "Arduino.h"
${join(gen.libraries_)}
#include <cassert>
TwoWire wire;
${join(gen.objects)}
${join(gen.functions)}
static void testGeneratedCode() {
  assert(std::isnan(${angle}));
  ${join(gen.setupCodes_)}
  ${code.acc_init}
  ${code.mag_init}
  wire.regs[0][0x2d]=0x40;
  wire.regs[1][0x68]=10;
  assert(${code.acc_get_axis} > 0 && ${code.mag_get_axis} == 15);
  wire.regs[0][7]=4;
  wire.regs[0][0x0d]=10;
  assert(${code.acc_get_temperature} == 35);
  ${code.ahrs_update}
  assert(std::isfinite(${angle}));
  wire.present[1]=false;
  assert(${code.mag_get_axis} == INT32_MIN && ${code.acc_get_axis} > 0);
  ${code.ahrs_update}
  assert(std::isnan(${angle}));
  wire.present[1]=true;
  ${code.ahrs_update}
  assert(std::isfinite(${angle}));
  wire.present[0]=false;
  assert(${code.acc_get_axis} == INT32_MIN && std::isnan(${code.acc_get_temperature}));
  assert(${code.mag_get_axis} == 15);
}
`);

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../../dfrobot_rainfall_sensor');
const ctx = {Arduino:{forBlock:{}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'generator.js'),'utf8'),ctx);
const objects = new Map(), setup = new Map();
const generator = {addLibrary(){}, addObject:(k,v)=>objects.set(k,v), addSetupBegin:(k,v)=>setup.set(k,v)};
for (const name of ['rain','garden','rain']) {
  const fields = {VAR:name,WIRE:'Wire'};
  ctx.Arduino.forBlock.dfrobot_rainfall_sensor_init({getFieldValue:k=>fields[k], getField:()=>null},generator);
}
assert.deepEqual([...objects.values()],['DFRobot_RainfallSensor_I2C rain(&Wire);','DFRobot_RainfallSensor_I2C garden(&Wire);']);
assert.deepEqual([...setup.values()],['rain.begin();','garden.begin();']);

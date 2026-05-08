function mpu9250EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('MPU9250_DMP', '#include <SparkFun_MPU-9250-DMP_Arduino_Library/SparkFunMPU9250-DMP.h>');
}

function mpu9250GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu');
}

function mpu9250AttachVar(block) {
  if (block._mpu9250VarAttached) return;
  block._mpu9250VarAttached = true;
  block._mpu9250VarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._mpu9250VarLastName, 'MPU9250_DMP');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._mpu9250VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._mpu9250VarLastName, newName, 'MPU9250_DMP');
      block._mpu9250VarLastName = newName;
    }
  };
}

Arduino.forBlock['mpu9250_init'] = function(block, generator) {
  mpu9250AttachVar(block);
  mpu9250EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  generator.addVariable(varName, 'MPU9250_DMP ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['mpu9250_set_sensors'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var accel = block.getFieldValue('ACCEL') || '1';
  var gyro = block.getFieldValue('GYRO') || '1';
  var compass = block.getFieldValue('COMPASS') || '1';
  var sensors = [];
  if (accel === '1') sensors.push('INV_XYZ_ACCEL');
  if (gyro === '1') sensors.push('INV_XYZ_GYRO');
  if (compass === '1') sensors.push('INV_XYZ_COMPASS');
  var mask = sensors.length > 0 ? sensors.join(' | ') : '0';
  return varName + '.setSensors(' + mask + ');\n';
};

Arduino.forBlock['mpu9250_set_gyro_fsr'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var fsr = block.getFieldValue('FSR') || '2000';
  return varName + '.setGyroFSR(' + fsr + ');\n';
};

Arduino.forBlock['mpu9250_set_accel_fsr'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var fsr = block.getFieldValue('FSR') || '2';
  return varName + '.setAccelFSR(' + fsr + ');\n';
};

Arduino.forBlock['mpu9250_set_lpf'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var lpf = block.getFieldValue('LPF') || '5';
  return varName + '.setLPF(' + lpf + ');\n';
};

Arduino.forBlock['mpu9250_set_sample_rate'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var rate = generator.valueToCode(block, 'RATE', generator.ORDER_NONE) || '10';
  return varName + '.setSampleRate(' + rate + ');\n';
};

Arduino.forBlock['mpu9250_data_ready'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  return [mpu9250GetVar(block) + '.dataReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mpu9250_update'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  return mpu9250GetVar(block) + '.update(UPDATE_ACCEL | UPDATE_GYRO | UPDATE_COMPASS);\n';
};

Arduino.forBlock['mpu9250_get_accel'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'ax';
  return [varName + '.' + axis, generator.ORDER_MEMBER];
};

Arduino.forBlock['mpu9250_get_gyro'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'gx';
  return [varName + '.' + axis, generator.ORDER_MEMBER];
};

Arduino.forBlock['mpu9250_get_compass'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  var varName = mpu9250GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'mx';
  return [varName + '.' + axis, generator.ORDER_MEMBER];
};

Arduino.forBlock['mpu9250_get_temperature'] = function(block, generator) {
  mpu9250EnsureLibrary(generator);
  return [mpu9250GetVar(block) + '.temperature', generator.ORDER_MEMBER];
};

function lsm9ds1EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('SparkFunLSM9DS1', '#include <SparkFunLSM9DS1.h>');
}

function lsm9ds1GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu');
}

function lsm9ds1AttachVar(block) {
  if (block._lsm9ds1VarAttached) return;
  block._lsm9ds1VarAttached = true;
  block._lsm9ds1VarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lsm9ds1VarLastName, 'LSM9DS1');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lsm9ds1VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lsm9ds1VarLastName, newName, 'LSM9DS1');
      block._lsm9ds1VarLastName = newName;
    }
  };
}

// calcGyro / calcAccel / calcMag helper — converts raw to float
function lsm9ds1AddCalcHelpers(varName, generator) {
  // nothing needed; library provides calcGyro(gx) etc.
}

Arduino.forBlock['lsm9ds1_init'] = function(block, generator) {
  lsm9ds1AttachVar(block);
  lsm9ds1EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  generator.addVariable(varName, 'LSM9DS1 ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['lsm9ds1_read_gyro'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  return lsm9ds1GetVar(block) + '.readGyro();\n';
};

Arduino.forBlock['lsm9ds1_read_accel'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  return lsm9ds1GetVar(block) + '.readAccel();\n';
};

Arduino.forBlock['lsm9ds1_read_mag'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  return lsm9ds1GetVar(block) + '.readMag();\n';
};

Arduino.forBlock['lsm9ds1_get_gyro_axis'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  var varName = lsm9ds1GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var rawMap = { 'X': 'gx', 'Y': 'gy', 'Z': 'gz' };
  return [varName + '.calcGyro(' + varName + '.' + rawMap[axis] + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm9ds1_get_accel_axis'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  var varName = lsm9ds1GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var rawMap = { 'X': 'ax', 'Y': 'ay', 'Z': 'az' };
  return [varName + '.calcAccel(' + varName + '.' + rawMap[axis] + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm9ds1_get_mag_axis'] = function(block, generator) {
  lsm9ds1EnsureLib(generator);
  var varName = lsm9ds1GetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var rawMap = { 'X': 'mx', 'Y': 'my', 'Z': 'mz' };
  return [varName + '.calcMag(' + varName + '.' + rawMap[axis] + ')', generator.ORDER_FUNCTION_CALL];
};

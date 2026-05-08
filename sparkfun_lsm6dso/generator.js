function lsm6dsoEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunLSM6DSO', '#include <SparkFunLSM6DSO.h>');
}

function lsm6dsoGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu');
}

function lsm6dsoAttachVar(block) {
  if (block._lsm6dsoVarAttached) return;
  block._lsm6dsoVarAttached = true;
  block._lsm6dsoVarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lsm6dsoVarLastName, 'LSM6DSO');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lsm6dsoVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lsm6dsoVarLastName, newName, 'LSM6DSO');
      block._lsm6dsoVarLastName = newName;
    }
  };
}

Arduino.forBlock['lsm6dso_init'] = function(block, generator) {
  lsm6dsoAttachVar(block);
  lsm6dsoEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  generator.addVariable(varName, 'LSM6DSO ' + varName + ';');
  return varName + '.begin();\n' + varName + '.initialize(BASIC_SETTINGS);\n';
};

Arduino.forBlock['lsm6dso_get_accel'] = function(block, generator) {
  lsm6dsoEnsureLib(generator);
  var varName = lsm6dsoGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var fnMap = { 'X': 'readFloatAccelX', 'Y': 'readFloatAccelY', 'Z': 'readFloatAccelZ' };
  return [varName + '.' + fnMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm6dso_get_gyro'] = function(block, generator) {
  lsm6dsoEnsureLib(generator);
  var varName = lsm6dsoGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var fnMap = { 'X': 'readFloatGyroX', 'Y': 'readFloatGyroY', 'Z': 'readFloatGyroZ' };
  return [varName + '.' + fnMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm6dso_get_temp_c'] = function(block, generator) {
  lsm6dsoEnsureLib(generator);
  var varName = lsm6dsoGetVar(block);
  return [varName + '.readTempC()', generator.ORDER_FUNCTION_CALL];
};

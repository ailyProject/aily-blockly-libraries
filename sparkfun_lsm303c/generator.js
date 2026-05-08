function lsm303cEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFunLSM303C', '#include <SparkFunLSM303C.h>');
}

function lsm303cGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu6');
}

function lsm303cAttachVar(block) {
  if (block._lsm303cVarAttached) return;
  block._lsm303cVarAttached = true;
  block._lsm303cVarLastName = block.getFieldValue('VAR') || 'imu6';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lsm303cVarLastName, 'LSM303C');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lsm303cVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lsm303cVarLastName, newName, 'LSM303C');
      block._lsm303cVarLastName = newName;
    }
  };
}

Arduino.forBlock['lsm303c_init'] = function(block, generator) {
  lsm303cAttachVar(block);
  lsm303cEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu6';
  generator.addVariable(varName, 'LSM303C ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['lsm303c_read_accel'] = function(block, generator) {
  lsm303cEnsureLib(generator);
  var varName = lsm303cGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var fnMap = { 'X': 'readAccelX', 'Y': 'readAccelY', 'Z': 'readAccelZ' };
  return [varName + '.' + fnMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm303c_read_mag'] = function(block, generator) {
  lsm303cEnsureLib(generator);
  var varName = lsm303cGetVar(block);
  var axis = block.getFieldValue('AXIS') || 'X';
  var fnMap = { 'X': 'readMagX', 'Y': 'readMagY', 'Z': 'readMagZ' };
  return [varName + '.' + fnMap[axis] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lsm303c_read_temp_c'] = function(block, generator) {
  lsm303cEnsureLib(generator);
  return [lsm303cGetVar(block) + '.readTempC()', generator.ORDER_FUNCTION_CALL];
};

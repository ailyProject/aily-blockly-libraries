function zxSensorEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_ZX_Sensor', '#include <ZX_Sensor.h>');
}

function zxSensorGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'gesture');
}

function zxSensorAttachVar(block) {
  if (block._zxSensorVarAttached) return;
  block._zxSensorVarAttached = true;
  block._zxSensorVarLastName = block.getFieldValue('VAR') || 'gesture';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._zxSensorVarLastName, 'ZX_Sensor');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._zxSensorVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._zxSensorVarLastName, newName, 'ZX_Sensor');
      block._zxSensorVarLastName = newName;
    }
  };
}

Arduino.forBlock['zx_sensor_init'] = function(block, generator) {
  zxSensorAttachVar(block);
  zxSensorEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'gesture';
  generator.addVariable(varName, 'ZX_Sensor ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.init();\n';
};

Arduino.forBlock['zx_sensor_position_available'] = function(block, generator) {
  zxSensorEnsureLib(generator);
  return [zxSensorGetVar(block) + '.positionAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zx_sensor_gesture_available'] = function(block, generator) {
  zxSensorEnsureLib(generator);
  return [zxSensorGetVar(block) + '.gestureAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zx_sensor_read_x'] = function(block, generator) {
  zxSensorEnsureLib(generator);
  return [zxSensorGetVar(block) + '.readX()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zx_sensor_read_z'] = function(block, generator) {
  zxSensorEnsureLib(generator);
  return [zxSensorGetVar(block) + '.readZ()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zx_sensor_read_gesture'] = function(block, generator) {
  zxSensorEnsureLib(generator);
  return [zxSensorGetVar(block) + '.readGesture()', generator.ORDER_FUNCTION_CALL];
};

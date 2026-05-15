function vl53l1xEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_VL53L1X', '#include <SparkFun_VL53L1X.h>');
}

function vl53l1xGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'tof');
}

function vl53l1xAttachVar(block) {
  if (block._vl53l1xVarAttached) return;
  block._vl53l1xVarAttached = true;
  block._vl53l1xVarLastName = block.getFieldValue('VAR') || 'tof';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._vl53l1xVarLastName, 'SFEVL53L1X');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._vl53l1xVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._vl53l1xVarLastName, newName, 'SFEVL53L1X');
      block._vl53l1xVarLastName = newName;
    }
  };
}

Arduino.forBlock['vl53l1x_init'] = function(block, generator) {
  vl53l1xAttachVar(block);
  vl53l1xEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'tof';
  generator.addVariable(varName, 'SFEVL53L1X ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['vl53l1x_start_ranging'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return vl53l1xGetVar(block) + '.startRanging();\n';
};

Arduino.forBlock['vl53l1x_stop_ranging'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return vl53l1xGetVar(block) + '.stopRanging();\n';
};

Arduino.forBlock['vl53l1x_data_ready'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return [vl53l1xGetVar(block) + '.checkForDataReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vl53l1x_get_distance'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return [vl53l1xGetVar(block) + '.getDistance()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['vl53l1x_clear_interrupt'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return vl53l1xGetVar(block) + '.clearInterrupt();\n';
};

Arduino.forBlock['vl53l1x_set_distance_mode'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  var varName = vl53l1xGetVar(block);
  var mode = block.getFieldValue('MODE') || 'SHORT';
  return varName + (mode === 'SHORT' ? '.setDistanceModeShort()' : '.setDistanceModeLong()') + ';\n';
};

Arduino.forBlock['vl53l1x_get_range_status'] = function(block, generator) {
  vl53l1xEnsureLib(generator);
  return [vl53l1xGetVar(block) + '.getRangeStatus()', generator.ORDER_FUNCTION_CALL];
};

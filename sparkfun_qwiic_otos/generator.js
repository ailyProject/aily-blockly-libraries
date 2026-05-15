function qwiicOTOSEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_OTOS', '#include <SparkFun_Qwiic_OTOS_Arduino_Library.h>');
}

function qwiicOTOSGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'otos');
}

function qwiicOTOSAttachVar(block) {
  if (block._otosVarAttached) return;
  block._otosVarAttached = true;
  block._otosVarLastName = block.getFieldValue('VAR') || 'otos';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._otosVarLastName, 'QwiicOTOS');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._otosVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._otosVarLastName, newName, 'QwiicOTOS');
      block._otosVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_otos_init'] = function(block, generator) {
  qwiicOTOSAttachVar(block);
  qwiicOTOSEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'otos';
  generator.addVariable(varName, 'QwiicOTOS ' + varName + ';');
  // Declare position struct at top level
  generator.addVariable('_otos_pos_' + varName, 'sfe_otos_pose2d_t _otos_pos_' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_otos_calibrate_imu'] = function(block, generator) {
  qwiicOTOSEnsureLib(generator);
  return qwiicOTOSGetVar(block) + '.calibrateImu();\n';
};

Arduino.forBlock['qwiic_otos_reset_tracking'] = function(block, generator) {
  qwiicOTOSEnsureLib(generator);
  return qwiicOTOSGetVar(block) + '.resetTracking();\n';
};

// Helper: ensure position is read before accessing x/y/h
function qwiicOTOSGetPosCode(varName, axis) {
  var posVar = '_otos_pos_' + varName;
  // We read position and return the field
  return varName + '.getPosition(' + posVar + ');\n' + posVar + '.' + axis;
}

Arduino.forBlock['qwiic_otos_get_pos_x'] = function(block, generator) {
  qwiicOTOSEnsureLib(generator);
  var varName = qwiicOTOSGetVar(block);
  var posVar = '_otos_pos_' + varName;
  // inline: read position then return x
  var code = '([&](){ ' + varName + '.getPosition(' + posVar + '); return ' + posVar + '.x; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_otos_get_pos_y'] = function(block, generator) {
  qwiicOTOSEnsureLib(generator);
  var varName = qwiicOTOSGetVar(block);
  var posVar = '_otos_pos_' + varName;
  var code = '([&](){ ' + varName + '.getPosition(' + posVar + '); return ' + posVar + '.y; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_otos_get_heading'] = function(block, generator) {
  qwiicOTOSEnsureLib(generator);
  var varName = qwiicOTOSGetVar(block);
  var posVar = '_otos_pos_' + varName;
  var code = '([&](){ ' + varName + '.getPosition(' + posVar + '); return ' + posVar + '.h; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

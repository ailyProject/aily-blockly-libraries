function xm125EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_XM125', '#include <SparkFun_Qwiic_XM125_Arduino_Library.h>');
}

function xm125GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'radar');
}

function xm125AttachVar(block) {
  if (block._xm125VarAttached) return;
  block._xm125VarAttached = true;
  block._xm125VarLastName = block.getFieldValue('VAR') || 'radar';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._xm125VarLastName, 'XM125Radar');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._xm125VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._xm125VarLastName, newName, 'XM125Radar');
      block._xm125VarLastName = newName;
    }
  };
}

Arduino.forBlock['xm125_presence_init'] = function(block, generator) {
  xm125AttachVar(block);
  xm125EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'radar';
  var startMM = generator.valueToCode(block, 'START_MM', generator.ORDER_NONE) || '500';
  var endMM = generator.valueToCode(block, 'END_MM', generator.ORDER_NONE) || '3000';
  generator.addVariable(varName, 'SparkFunXM125Presence ' + varName + ';');
  generator.addVariable('_xm125_presence_' + varName, 'uint32_t _xm125_presence_' + varName + ' = 0;');
  generator.addVariable('_xm125_dist_' + varName, 'uint32_t _xm125_dist_' + varName + ' = 0;');
  return varName + '.begin();\n' + varName + '.detectorStart(' + startMM + ', ' + endMM + ');\n';
};

Arduino.forBlock['xm125_is_detected'] = function(block, generator) {
  xm125EnsureLib(generator);
  var varName = xm125GetVar(block);
  var presVar = '_xm125_presence_' + varName;
  var code = '([&](){ ' + varName + '.getDetectorPresenceDetected(' + presVar + '); return ' + presVar + ' != 0; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xm125_get_distance'] = function(block, generator) {
  xm125EnsureLib(generator);
  var varName = xm125GetVar(block);
  var distVar = '_xm125_dist_' + varName;
  var code = '([&](){ ' + varName + '.getDistance(' + distVar + '); return (int)' + distVar + '; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

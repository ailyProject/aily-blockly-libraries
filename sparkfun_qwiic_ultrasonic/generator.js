function qwiicUltrasonicEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Ultrasonic', '#include <SparkFun_Qwiic_Ultrasonic_Arduino_Library.h>');
}

function qwiicUltrasonicGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'sonar');
}

function qwiicUltrasonicAttachVar(block) {
  if (block._ultrasonicVarAttached) return;
  block._ultrasonicVarAttached = true;
  block._ultrasonicVarLastName = block.getFieldValue('VAR') || 'sonar';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ultrasonicVarLastName, 'QwiicUltrasonic');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ultrasonicVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ultrasonicVarLastName, newName, 'QwiicUltrasonic');
      block._ultrasonicVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_ultrasonic_init'] = function(block, generator) {
  qwiicUltrasonicAttachVar(block);
  qwiicUltrasonicEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'sonar';
  generator.addVariable(varName, 'QwiicUltrasonic ' + varName + ';');
  generator.addVariable('_ultrasonic_dist_' + varName, 'uint16_t _ultrasonic_dist_' + varName + ' = 0;');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_ultrasonic_read'] = function(block, generator) {
  qwiicUltrasonicEnsureLib(generator);
  var varName = qwiicUltrasonicGetVar(block);
  var distVar = '_ultrasonic_dist_' + varName;
  var code = '([&](){ ' + varName + '.triggerAndRead(' + distVar + '); return ' + distVar + '; })()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

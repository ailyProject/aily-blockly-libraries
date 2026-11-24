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
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['qwiic_ultrasonic_read'] = function(block, generator) {
  qwiicUltrasonicEnsureLib(generator);
  var varName = qwiicUltrasonicGetVar(block);
  var code = '([](QwiicUltrasonic &sensor) -> long { uint16_t mm = 0; ' +
    'if (!sensor.isConnected() || sensor.triggerAndRead(mm) != ksfTkErrOk) return -1L; return mm; })(' + varName + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

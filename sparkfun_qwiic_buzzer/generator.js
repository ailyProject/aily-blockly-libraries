function qwiicBuzzerEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Buzzer', '#include <SparkFun_Qwiic_Buzzer_Arduino_Library.h>');
}

function qwiicBuzzerGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'buzzer');
}

function qwiicBuzzerAttachVar(block) {
  if (block._buzzerVarAttached) return;
  block._buzzerVarAttached = true;
  block._buzzerVarLastName = block.getFieldValue('VAR') || 'buzzer';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._buzzerVarLastName, 'QwiicBuzzer');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._buzzerVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._buzzerVarLastName, newName, 'QwiicBuzzer');
      block._buzzerVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_buzzer_init'] = function(block, generator) {
  qwiicBuzzerAttachVar(block);
  qwiicBuzzerEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'buzzer';
  generator.addVariable(varName, 'QwiicBuzzer ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_buzzer_on'] = function(block, generator) {
  qwiicBuzzerEnsureLib(generator);
  return qwiicBuzzerGetVar(block) + '.on();\n';
};

Arduino.forBlock['qwiic_buzzer_off'] = function(block, generator) {
  qwiicBuzzerEnsureLib(generator);
  return qwiicBuzzerGetVar(block) + '.off();\n';
};

Arduino.forBlock['qwiic_buzzer_configure'] = function(block, generator) {
  qwiicBuzzerEnsureLib(generator);
  var varName = qwiicBuzzerGetVar(block);
  var freq = generator.valueToCode(block, 'FREQ', generator.ORDER_NONE) || '2730';
  var dur  = generator.valueToCode(block, 'DURATION', generator.ORDER_NONE) || '0';
  var vol  = block.getFieldValue('VOLUME') || '4';
  return varName + '.configureBuzzer(' + freq + ', ' + dur + ', ' + vol + ');\n';
};

Arduino.forBlock['qwiic_buzzer_sound_effect'] = function(block, generator) {
  qwiicBuzzerEnsureLib(generator);
  var varName = qwiicBuzzerGetVar(block);
  var effect = generator.valueToCode(block, 'EFFECT', generator.ORDER_NONE) || '0';
  var vol    = block.getFieldValue('VOLUME') || '4';
  return varName + '.playSoundEffect(' + effect + ', ' + vol + ');\n';
};

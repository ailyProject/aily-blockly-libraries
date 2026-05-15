function qwiicTwistEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Twist', '#include <SparkFun_Qwiic_Twist_Arduino_Library.h>');
}

function qwiicTwistGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'twist');
}

function qwiicTwistAttachVar(block) {
  if (block._twistVarAttached) return;
  block._twistVarAttached = true;
  block._twistVarLastName = block.getFieldValue('VAR') || 'twist';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._twistVarLastName, 'QwiicTwist');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._twistVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._twistVarLastName, newName, 'QwiicTwist');
      block._twistVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_twist_init'] = function(block, generator) {
  qwiicTwistAttachVar(block);
  qwiicTwistEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'twist';
  generator.addVariable(varName, 'TWIST ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_twist_get_count'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var code = qwiicTwistGetVar(block) + '.getCount()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_twist_set_count'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var varName = qwiicTwistGetVar(block);
  var count = generator.valueToCode(block, 'COUNT', generator.ORDER_NONE) || '0';
  return varName + '.setCount(' + count + ');\n';
};

Arduino.forBlock['qwiic_twist_is_moved'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var code = qwiicTwistGetVar(block) + '.isMoved()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_twist_is_clicked'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var code = qwiicTwistGetVar(block) + '.isClicked()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_twist_is_pressed'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var code = qwiicTwistGetVar(block) + '.isPressed()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_twist_set_color'] = function(block, generator) {
  qwiicTwistEnsureLib(generator);
  var varName = qwiicTwistGetVar(block);
  var r = generator.valueToCode(block, 'RED', generator.ORDER_NONE) || '0';
  var g = generator.valueToCode(block, 'GREEN', generator.ORDER_NONE) || '0';
  var b = generator.valueToCode(block, 'BLUE', generator.ORDER_NONE) || '0';
  return varName + '.setColor(' + r + ', ' + g + ', ' + b + ');\n';
};

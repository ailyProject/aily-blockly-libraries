function qwiicJoystickEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SparkFun_Qwiic_Joystick', '#include <SparkFun_Qwiic_Joystick_Arduino_Library.h>');
}

function qwiicJoystickGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'joystick');
}

function qwiicJoystickAttachVar(block) {
  if (block._joystickVarAttached) return;
  block._joystickVarAttached = true;
  block._joystickVarLastName = block.getFieldValue('VAR') || 'joystick';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._joystickVarLastName, 'QwiicJoystick');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._joystickVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._joystickVarLastName, newName, 'QwiicJoystick');
      block._joystickVarLastName = newName;
    }
  };
}

Arduino.forBlock['qwiic_joystick_init'] = function(block, generator) {
  qwiicJoystickAttachVar(block);
  qwiicJoystickEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'joystick';
  generator.addVariable(varName, 'JOYSTICK ' + varName + ';');
  return varName + '.begin();\n';
};

Arduino.forBlock['qwiic_joystick_get_horizontal'] = function(block, generator) {
  qwiicJoystickEnsureLib(generator);
  return [qwiicJoystickGetVar(block) + '.getHorizontal()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_joystick_get_vertical'] = function(block, generator) {
  qwiicJoystickEnsureLib(generator);
  return [qwiicJoystickGetVar(block) + '.getVertical()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwiic_joystick_get_button'] = function(block, generator) {
  qwiicJoystickEnsureLib(generator);
  return [qwiicJoystickGetVar(block) + '.checkButton()', generator.ORDER_FUNCTION_CALL];
};

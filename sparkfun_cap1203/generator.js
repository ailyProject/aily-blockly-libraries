function cap1203EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('CAP1203', '#include <SparkFun_CAP1203.h>');
}

function cap1203GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'cap1203');
}

function cap1203AttachVar(block) {
  if (block._cap1203VarAttached) return;
  block._cap1203VarAttached = true;
  block._cap1203VarLastName = block.getFieldValue('VAR') || 'cap1203';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._cap1203VarLastName, 'CAP1203');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._cap1203VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._cap1203VarLastName, newName, 'CAP1203');
      block._cap1203VarLastName = newName;
    }
  };
}

Arduino.forBlock['cap1203_init'] = function(block, generator) {
  cap1203AttachVar(block);
  cap1203EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'cap1203';
  var address = block.getFieldValue('ADDRESS') || 'CAP1203_I2C_ADDR';
  generator.addVariable(varName, 'CAP1203 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire, ' + address + ');\n';
};

Arduino.forBlock['cap1203_is_ready'] = function(block, generator) {
  return [cap1203GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cap1203_is_connected'] = function(block, generator) {
  return [cap1203GetVar(block) + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cap1203_touched'] = function(block, generator) {
  var methods = { ANY: 'isTouched', LEFT: 'isLeftTouched', MIDDLE: 'isMiddleTouched', RIGHT: 'isRightTouched' };
  return [cap1203GetVar(block) + '.' + methods[block.getFieldValue('PAD') || 'ANY'] + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cap1203_swipe'] = function(block, generator) {
  var method = (block.getFieldValue('DIRECTION') || 'LEFT') === 'RIGHT' ? 'isRightSwipePulled' : 'isLeftSwipePulled';
  return [cap1203GetVar(block) + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cap1203_set_sensitivity'] = function(block) {
  return cap1203GetVar(block) + '.setSensitivity(' + (block.getFieldValue('SENSITIVITY') || 'SENSITIVITY_32X') + ');\n';
};

Arduino.forBlock['cap1203_get_sensitivity'] = function(block, generator) {
  return [cap1203GetVar(block) + '.getSensitivity()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cap1203_set_interrupt'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ENABLE') === 'ENABLE' ? 'setInterruptEnabled' : 'setInterruptDisabled';
  return cap1203GetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['cap1203_clear_interrupt'] = function(block) {
  return cap1203GetVar(block) + '.clearInterrupt();\n';
};

Arduino.forBlock['cap1203_set_power_button_pad'] = function(block) {
  return cap1203GetVar(block) + '.setPowerButtonPad(' + (block.getFieldValue('PAD') || 'PWR_CS1') + ');\n';
};

Arduino.forBlock['cap1203_set_power_button_time'] = function(block) {
  return cap1203GetVar(block) + '.setPowerButtonTime(' + (block.getFieldValue('TIME') || 'PWR_TIME_1120_MS') + ');\n';
};

Arduino.forBlock['cap1203_set_power_button_enabled'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ENABLE') === 'ENABLE' ? 'setPowerButtonEnabled' : 'setPowerButtonDisabled';
  return cap1203GetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['cap1203_power_button_touched'] = function(block, generator) {
  return [cap1203GetVar(block) + '.isPowerButtonTouched()', generator.ORDER_FUNCTION_CALL];
};
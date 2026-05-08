function lp55231EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('LP55231', '#include <lp55231.h>');
}

function lp55231GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ledDriver');
}

function lp55231AttachVar(block) {
  if (block._lp55231VarAttached) return;
  block._lp55231VarAttached = true;
  block._lp55231VarLastName = block.getFieldValue('VAR') || 'ledDriver';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._lp55231VarLastName, 'LP55231');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._lp55231VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._lp55231VarLastName, newName, 'LP55231');
      block._lp55231VarLastName = newName;
    }
  };
}

Arduino.forBlock['lp55231_init'] = function(block, generator) {
  lp55231AttachVar(block);
  lp55231EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'ledDriver';
  var addr = block.getFieldValue('ADDR') || '0x32';
  generator.addVariable(varName, 'Lp55231 ' + varName + '(' + addr + ');');
  return varName + '.Begin();\n' + varName + '.Enable();\n';
};

Arduino.forBlock['lp55231_set_channel_pwm'] = function(block, generator) {
  lp55231EnsureLib(generator);
  var varName = lp55231GetVar(block);
  var ch = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  var val = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return varName + '.SetChannelPWM(' + ch + ', ' + val + ');\n';
};

Arduino.forBlock['lp55231_set_master_fader'] = function(block, generator) {
  lp55231EnsureLib(generator);
  var varName = lp55231GetVar(block);
  var fader = block.getFieldValue('FADER') || '0';
  var val = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return varName + '.SetMasterFader(' + fader + ', ' + val + ');\n';
};

Arduino.forBlock['lp55231_enable'] = function(block, generator) {
  lp55231EnsureLib(generator);
  return lp55231GetVar(block) + '.Enable();\n';
};

Arduino.forBlock['lp55231_disable'] = function(block, generator) {
  lp55231EnsureLib(generator);
  return lp55231GetVar(block) + '.Disable();\n';
};

function drv2605lEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DRV2605L', '#include <SparkFun_Haptic_Motor_Driver_Arduino_Library/Sparkfun_DRV2605L.h>');
}

function drv2605lGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'haptic');
}

function drv2605lAttachVar(block) {
  if (block._drv2605lVarAttached) return;
  block._drv2605lVarAttached = true;
  block._drv2605lVarLastName = block.getFieldValue('VAR') || 'haptic';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._drv2605lVarLastName, 'DRV2605L');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._drv2605lVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._drv2605lVarLastName, newName, 'DRV2605L');
      block._drv2605lVarLastName = newName;
    }
  };
}

Arduino.forBlock['drv2605l_init'] = function(block, generator) {
  drv2605lAttachVar(block);
  drv2605lEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'haptic';
  generator.addVariable(varName, 'SFE_HMD_DRV2605L ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin();\n';
};

Arduino.forBlock['drv2605l_mode'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  var mode = block.getFieldValue('MODE') || '0x00';
  return drv2605lGetVar(block) + '.Mode(' + mode + ');\n';
};

Arduino.forBlock['drv2605l_motor_select'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  var type = block.getFieldValue('TYPE') || '0x00';
  return drv2605lGetVar(block) + '.MotorSelect(' + type + ');\n';
};

Arduino.forBlock['drv2605l_library'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  var lib = block.getFieldValue('LIB') || '1';
  return drv2605lGetVar(block) + '.Library(' + lib + ');\n';
};

Arduino.forBlock['drv2605l_waveform'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  var seq = block.getFieldValue('SEQ') || '0';
  var wav = block.getFieldValue('WAV') || '1';
  return drv2605lGetVar(block) + '.Waveform(' + seq + ', ' + wav + ');\n';
};

Arduino.forBlock['drv2605l_go'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  return drv2605lGetVar(block) + '.go();\n';
};

Arduino.forBlock['drv2605l_stop'] = function(block, generator) {
  drv2605lEnsureLib(generator);
  return drv2605lGetVar(block) + '.stop();\n';
};

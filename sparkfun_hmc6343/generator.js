function hmc6343EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('HMC6343', '#include <SparkFun_HMC6343_Arduino_Library/SFE_HMC6343.h>');
}

function hmc6343GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'compass');
}

function hmc6343AttachVar(block) {
  if (block._hmc6343VarAttached) return;
  block._hmc6343VarAttached = true;
  block._hmc6343VarLastName = block.getFieldValue('VAR') || 'compass';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._hmc6343VarLastName, 'HMC6343');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._hmc6343VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._hmc6343VarLastName, newName, 'HMC6343');
      block._hmc6343VarLastName = newName;
    }
  };
}

Arduino.forBlock['hmc6343_init'] = function(block, generator) {
  hmc6343AttachVar(block);
  hmc6343EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'compass';
  generator.addVariable(varName, 'SFE_HMC6343 ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.init();\n';
};

Arduino.forBlock['hmc6343_read_heading'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  return hmc6343GetVar(block) + '.readHeading();\n';
};

Arduino.forBlock['hmc6343_read_mag'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  return hmc6343GetVar(block) + '.readMag();\n';
};

Arduino.forBlock['hmc6343_read_accel'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  return hmc6343GetVar(block) + '.readAccel();\n';
};

Arduino.forBlock['hmc6343_get_value'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  var fieldName = block.getFieldValue('FIELD') || 'heading';
  return [hmc6343GetVar(block) + '.' + fieldName, generator.ORDER_MEMBER];
};

Arduino.forBlock['hmc6343_set_orientation'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  var orient = block.getFieldValue('ORIENT') || '0';
  return hmc6343GetVar(block) + '.setOrientation(' + orient + ');\n';
};

Arduino.forBlock['hmc6343_sleep_control'] = function(block, generator) {
  hmc6343EnsureLib(generator);
  var mode = block.getFieldValue('MODE') || 'sleep';
  if (mode === 'sleep') {
    return hmc6343GetVar(block) + '.enterSleep();\n';
  } else {
    return hmc6343GetVar(block) + '.exitSleep();\n';
  }
};

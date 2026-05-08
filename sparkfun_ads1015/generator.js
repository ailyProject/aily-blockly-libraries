function ads1015EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('ADS1015', '#include <SparkFun_ADS1015_Arduino_Library/SparkFun_ADS1015_Arduino_Library.h>');
}

function ads1015GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ads1015');
}

function ads1015AttachVar(block) {
  if (block._ads1015VarAttached) return;
  block._ads1015VarAttached = true;
  block._ads1015VarLastName = block.getFieldValue('VAR') || 'ads1015';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ads1015VarLastName, 'ADS1015');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ads1015VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ads1015VarLastName, newName, 'ADS1015');
      block._ads1015VarLastName = newName;
    }
  };
}

Arduino.forBlock['ads1015_init'] = function(block, generator) {
  ads1015AttachVar(block);
  ads1015EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ads1015';
  var address = block.getFieldValue('ADDRESS') || 'ADS1015_ADDRESS_GND';
  generator.addVariable(varName, 'ADS1015 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(' + address + ');\n';
};

Arduino.forBlock['ads1015_is_ready'] = function(block, generator) {
  return [ads1015GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ads1015_read_single'] = function(block, generator) {
  ads1015EnsureLibrary(generator);
  return [ads1015GetVar(block) + '.getSingleEnded(' + (block.getFieldValue('CHANNEL') || '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1015_read_millivolts'] = function(block, generator) {
  ads1015EnsureLibrary(generator);
  return [ads1015GetVar(block) + '.getSingleEndedMillivolts(' + (block.getFieldValue('CHANNEL') || '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1015_read_differential'] = function(block, generator) {
  ads1015EnsureLibrary(generator);
  return [ads1015GetVar(block) + '.getDifferential(' + (block.getFieldValue('MUX') || 'ADS1015_CONFIG_MUX_DIFF_P0_N1') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1015_read_differential_mv'] = function(block, generator) {
  ads1015EnsureLibrary(generator);
  return [ads1015GetVar(block) + '.getDifferentialMillivolts(' + (block.getFieldValue('MUX') || 'ADS1015_CONFIG_MUX_DIFF_P0_N1') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1015_set_gain'] = function(block) {
  return ads1015GetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || 'ADS1015_CONFIG_PGA_2') + ');\n';
};

Arduino.forBlock['ads1015_set_sample_rate'] = function(block) {
  return ads1015GetVar(block) + '.setSampleRate(' + (block.getFieldValue('RATE') || 'ADS1015_CONFIG_RATE_1600HZ') + ');\n';
};

Arduino.forBlock['ads1015_set_mode'] = function(block) {
  return ads1015GetVar(block) + '.setMode(' + (block.getFieldValue('MODE') || 'ADS1015_CONFIG_MODE_CONT') + ');\n';
};

Arduino.forBlock['ads1015_conversion_ready'] = function(block, generator) {
  return [ads1015GetVar(block) + '.available()', generator.ORDER_FUNCTION_CALL];
};
function ads1219EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('ADS1219', '#include <SparkFun_ADS1219.h>');
}

function ads1219GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ads1219');
}

function ads1219AttachVar(block) {
  if (block._ads1219VarAttached) return;
  block._ads1219VarAttached = true;
  block._ads1219VarLastName = block.getFieldValue('VAR') || 'ads1219';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ads1219VarLastName, 'SfeADS1219ArdI2C');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ads1219VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ads1219VarLastName, newName, 'SfeADS1219ArdI2C');
      block._ads1219VarLastName = newName;
    }
  };
}

function ads1219Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ads1219EnsureHelpers(generator) {
  generator.addFunction('ads1219_wait_ready_helper', 'bool ads1219WaitReady(SfeADS1219ArdI2C &adc, unsigned long timeoutMs) {\n  unsigned long start = millis();\n  while (!adc.dataReady()) {\n    if (millis() - start >= timeoutMs) return false;\n    delay(1);\n  }\n  return true;\n}\n');
  generator.addFunction('ads1219_read_mv_helper', 'float ads1219ReadMillivolts(SfeADS1219ArdI2C &adc, float referenceMillivolts) {\n  if (!adc.startSync()) return 0.0f;\n  if (!ads1219WaitReady(adc, 1100)) return 0.0f;\n  if (!adc.readConversion()) return 0.0f;\n  return adc.getConversionMillivolts(referenceMillivolts);\n}\n');
  generator.addFunction('ads1219_read_raw_helper', 'int32_t ads1219ReadRaw(SfeADS1219ArdI2C &adc) {\n  if (!adc.startSync()) return 0;\n  if (!ads1219WaitReady(adc, 1100)) return 0;\n  if (!adc.readConversion()) return 0;\n  return adc.getConversionRaw();\n}\n');
}

Arduino.forBlock['ads1219_init'] = function(block, generator) {
  ads1219AttachVar(block);
  ads1219EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ads1219';
  var address = block.getFieldValue('ADDRESS') || '0x40';
  generator.addVariable(varName, 'SfeADS1219ArdI2C ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire, ' + address + ');\n';
};

Arduino.forBlock['ads1219_is_ready'] = function(block, generator) {
  return [ads1219GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ads1219_read_millivolts'] = function(block, generator) {
  ads1219EnsureLibrary(generator);
  ads1219EnsureHelpers(generator);
  var reference = ads1219Value(block, generator, 'REFERENCE', '2048.0');
  return ['ads1219ReadMillivolts(' + ads1219GetVar(block) + ', ' + reference + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1219_read_raw'] = function(block, generator) {
  ads1219EnsureLibrary(generator);
  ads1219EnsureHelpers(generator);
  return ['ads1219ReadRaw(' + ads1219GetVar(block) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1219_start_sync'] = function(block) {
  return ads1219GetVar(block) + '.startSync();\n';
};

Arduino.forBlock['ads1219_data_ready'] = function(block, generator) {
  return [ads1219GetVar(block) + '.dataReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1219_set_mux'] = function(block) {
  return ads1219GetVar(block) + '.setInputMultiplexer(' + (block.getFieldValue('MUX') || 'ADS1219_CONFIG_MUX_DIFF_P0_N1') + ');\n';
};

Arduino.forBlock['ads1219_set_gain'] = function(block) {
  return ads1219GetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || 'ADS1219_GAIN_1') + ');\n';
};

Arduino.forBlock['ads1219_set_data_rate'] = function(block) {
  return ads1219GetVar(block) + '.setDataRate(' + (block.getFieldValue('RATE') || 'ADS1219_DATA_RATE_20SPS') + ');\n';
};

Arduino.forBlock['ads1219_set_mode'] = function(block) {
  return ads1219GetVar(block) + '.setConversionMode(' + (block.getFieldValue('MODE') || 'ADS1219_CONVERSION_SINGLE_SHOT') + ');\n';
};

Arduino.forBlock['ads1219_set_vref'] = function(block) {
  return ads1219GetVar(block) + '.setVoltageReference(' + (block.getFieldValue('VREF') || 'ADS1219_VREF_INTERNAL') + ');\n';
};

Arduino.forBlock['ads1219_power_down'] = function(block) {
  return ads1219GetVar(block) + '.powerDown();\n';
};
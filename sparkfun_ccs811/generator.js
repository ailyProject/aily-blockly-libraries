function ccs811EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('CCS811', '#include <SparkFunCCS811.h>');
}

function ccs811GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ccs811');
}

function ccs811AttachVar(block) {
  if (block._ccs811VarAttached) return;
  block._ccs811VarAttached = true;
  block._ccs811VarLastName = block.getFieldValue('VAR') || 'ccs811';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._ccs811VarLastName, 'CCS811');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._ccs811VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._ccs811VarLastName, newName, 'CCS811');
      block._ccs811VarLastName = newName;
    }
  };
}

Arduino.forBlock['ccs811_init'] = function(block, generator) {
  ccs811AttachVar(block);
  ccs811EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ccs811';
  var address = block.getFieldValue('ADDRESS') || '0x5B';
  generator.addVariable(varName, 'CCS811 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '.setI2CAddress(' + address + ');\n' + varName + '_ready = ' + varName + '.begin();\n';
};

Arduino.forBlock['ccs811_is_ready'] = function(block, generator) {
  return [ccs811GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['ccs811_data_available'] = function(block, generator) {
  return [ccs811GetVar(block) + '.dataAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ccs811_read_results'] = function(block) {
  return ccs811GetVar(block) + '.readAlgorithmResults();\n';
};

Arduino.forBlock['ccs811_get_co2'] = function(block, generator) {
  return [ccs811GetVar(block) + '.getCO2()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ccs811_get_tvoc'] = function(block, generator) {
  return [ccs811GetVar(block) + '.getTVOC()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ccs811_set_drive_mode'] = function(block) {
  return ccs811GetVar(block) + '.setDriveMode(' + (block.getFieldValue('MODE') || '1') + ');\n';
};

Arduino.forBlock['ccs811_set_environmental_data'] = function(block, generator) {
  var humidity = generator.valueToCode(block, 'HUMIDITY', generator.ORDER_ATOMIC) || '50.0';
  var temperature = generator.valueToCode(block, 'TEMPERATURE', generator.ORDER_ATOMIC) || '25.0';
  return ccs811GetVar(block) + '.setEnvironmentalData(' + humidity + ', ' + temperature + ');\n';
};

Arduino.forBlock['ccs811_get_baseline'] = function(block, generator) {
  return [ccs811GetVar(block) + '.getBaseline()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ccs811_set_baseline'] = function(block, generator) {
  var baseline = generator.valueToCode(block, 'BASELINE', generator.ORDER_ATOMIC) || '0';
  return ccs811GetVar(block) + '.setBaseline(' + baseline + ');\n';
};

Arduino.forBlock['ccs811_has_error'] = function(block, generator) {
  return [ccs811GetVar(block) + '.checkForStatusError()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ccs811_error_register'] = function(block, generator) {
  return [ccs811GetVar(block) + '.getErrorRegister()', generator.ORDER_FUNCTION_CALL];
};
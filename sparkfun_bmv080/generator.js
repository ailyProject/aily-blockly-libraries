function bmv080EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('BMV080', '#include <SparkFun_BMV080_Arduino_Library.h>');
}

function bmv080GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bmv080');
}

function bmv080AttachVar(block) {
  if (block._bmv080VarAttached) return;
  block._bmv080VarAttached = true;
  block._bmv080VarLastName = block.getFieldValue('VAR') || 'bmv080';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._bmv080VarLastName, 'SparkFunBMV080');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._bmv080VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._bmv080VarLastName, newName, 'SparkFunBMV080');
      block._bmv080VarLastName = newName;
    }
  };
}

function bmv080Bool(value) {
  return value === 'TRUE' ? 'true' : 'false';
}

Arduino.forBlock['bmv080_init_i2c'] = function(block, generator) {
  bmv080AttachVar(block);
  bmv080EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'bmv080';
  var address = block.getFieldValue('ADDRESS') || 'SF_BMV080_DEFAULT_ADDRESS';
  var mode = block.getFieldValue('MODE') || 'SF_BMV080_MODE_CONTINUOUS';
  generator.addVariable(varName, 'SparkFunBMV080 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(' + address + ', Wire);\nif (' + varName + '_ready) {\n  ' + varName + '_ready = ' + varName + '.init();\n}\nif (' + varName + '_ready) {\n  ' + varName + '_ready = ' + varName + '.setMode(' + mode + ');\n}\n';
};

Arduino.forBlock['bmv080_is_ready'] = function(block, generator) {
  return [bmv080GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bmv080_read_sensor'] = function(block, generator) {
  bmv080EnsureLibrary(generator);
  return [bmv080GetVar(block) + '.readSensor()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_pm1'] = function(block, generator) {
  return [bmv080GetVar(block) + '.PM1()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_pm25'] = function(block, generator) {
  return [bmv080GetVar(block) + '.PM25()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_pm10'] = function(block, generator) {
  return [bmv080GetVar(block) + '.PM10()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_is_obstructed'] = function(block, generator) {
  return [bmv080GetVar(block) + '.isObstructed()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmv080_set_mode'] = function(block) {
  return bmv080GetVar(block) + '.setMode(' + (block.getFieldValue('MODE') || 'SF_BMV080_MODE_CONTINUOUS') + ');\n';
};

Arduino.forBlock['bmv080_set_duty_cycle'] = function(block, generator) {
  var seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '30';
  return bmv080GetVar(block) + '.setDutyCyclingPeriod(' + seconds + ');\n';
};

Arduino.forBlock['bmv080_set_obstruction_detection'] = function(block) {
  return bmv080GetVar(block) + '.setDoObstructionDetection(' + bmv080Bool(block.getFieldValue('STATE') || 'TRUE') + ');\n';
};

Arduino.forBlock['bmv080_set_vibration_filtering'] = function(block) {
  return bmv080GetVar(block) + '.setDoVibrationFiltering(' + bmv080Bool(block.getFieldValue('STATE') || 'TRUE') + ');\n';
};
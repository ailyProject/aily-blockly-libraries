function as7265xEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('AS7265X', '#include <SparkFun_AS7265X.h>');
}

function as7265xGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'as7265x');
}

function as7265xAttachVar(block) {
  if (block._as7265xVarAttached) return;
  block._as7265xVarAttached = true;
  block._as7265xVarLastName = block.getFieldValue('VAR') || 'as7265x';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._as7265xVarLastName, 'AS7265X');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._as7265xVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._as7265xVarLastName, newName, 'AS7265X');
      block._as7265xVarLastName = newName;
    }
  };
}

function as7265xValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['as7265x_init'] = function(block, generator) {
  as7265xAttachVar(block);
  as7265xEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'as7265x';
  generator.addVariable(varName, 'AS7265X ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire);\n';
};

Arduino.forBlock['as7265x_is_ready'] = function(block, generator) {
  return [as7265xGetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['as7265x_is_connected'] = function(block, generator) {
  return [as7265xGetVar(block) + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7265x_take_measurements'] = function(block) {
  var method = (block.getFieldValue('BULB') || 'NO') === 'YES' ? 'takeMeasurementsWithBulb' : 'takeMeasurements';
  return as7265xGetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['as7265x_data_available'] = function(block, generator) {
  return [as7265xGetVar(block) + '.dataAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7265x_read_calibrated'] = function(block, generator) {
  return [as7265xGetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'getCalibratedA') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7265x_read_raw'] = function(block, generator) {
  return [as7265xGetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'getA') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7265x_read_temperature'] = function(block, generator) {
  return [as7265xGetVar(block) + '.getTemperature(' + (block.getFieldValue('DEVICE') || 'AS72651_NIR') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as7265x_set_gain'] = function(block) {
  return as7265xGetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || 'AS7265X_GAIN_64X') + ');\n';
};

Arduino.forBlock['as7265x_set_measurement_mode'] = function(block) {
  return as7265xGetVar(block) + '.setMeasurementMode(' + (block.getFieldValue('MODE') || 'AS7265X_MEASUREMENT_MODE_6CHAN_ONE_SHOT') + ');\n';
};

Arduino.forBlock['as7265x_set_integration_cycles'] = function(block, generator) {
  return as7265xGetVar(block) + '.setIntegrationCycles(' + as7265xValue(block, generator, 'CYCLES', '50') + ');\n';
};

Arduino.forBlock['as7265x_bulb'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ON') === 'ON' ? 'enableBulb' : 'disableBulb';
  return as7265xGetVar(block) + '.' + method + '(' + (block.getFieldValue('DEVICE') || 'AS72651_NIR') + ');\n';
};

Arduino.forBlock['as7265x_set_bulb_current'] = function(block) {
  return as7265xGetVar(block) + '.setBulbCurrent(' + (block.getFieldValue('CURRENT') || 'AS7265X_LED_CURRENT_LIMIT_12_5MA') + ', ' + (block.getFieldValue('DEVICE') || 'AS72651_NIR') + ');\n';
};
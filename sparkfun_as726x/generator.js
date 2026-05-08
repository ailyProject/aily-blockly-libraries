function as726xEnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('AS726X', '#include <SparkFun_AS726X_Arduino_Library/AS726X.h>');
}

function as726xGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'as726x');
}

function as726xAttachVar(block) {
  if (block._as726xVarAttached) return;
  block._as726xVarAttached = true;
  block._as726xVarLastName = block.getFieldValue('VAR') || 'as726x';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._as726xVarLastName, 'AS726X');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._as726xVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._as726xVarLastName, newName, 'AS726X');
      block._as726xVarLastName = newName;
    }
  };
}

function as726xValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['as726x_init'] = function(block, generator) {
  as726xAttachVar(block);
  as726xEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'as726x';
  var gain = block.getFieldValue('GAIN') || '3';
  var mode = block.getFieldValue('MODE') || '3';
  generator.addVariable(varName, 'AS726X ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '_ready = ' + varName + '.begin(Wire, ' + gain + ', ' + mode + ');\n';
};

Arduino.forBlock['as726x_take_measurements'] = function(block) {
  var method = (block.getFieldValue('BULB') || 'NO') === 'YES' ? 'takeMeasurementsWithBulb' : 'takeMeasurements';
  return as726xGetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['as726x_data_available'] = function(block, generator) {
  return [as726xGetVar(block) + '.dataAvailable()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as726x_read_raw'] = function(block, generator) {
  return [as726xGetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'getViolet') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as726x_read_calibrated'] = function(block, generator) {
  return [as726xGetVar(block) + '.' + (block.getFieldValue('CHANNEL') || 'getCalibratedViolet') + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as726x_read_temperature'] = function(block, generator) {
  return [as726xGetVar(block) + '.getTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['as726x_set_gain'] = function(block) {
  return as726xGetVar(block) + '.setGain(' + (block.getFieldValue('GAIN') || '3') + ');\n';
};

Arduino.forBlock['as726x_set_measurement_mode'] = function(block) {
  return as726xGetVar(block) + '.setMeasurementMode(' + (block.getFieldValue('MODE') || '3') + ');\n';
};

Arduino.forBlock['as726x_set_integration_time'] = function(block, generator) {
  return as726xGetVar(block) + '.setIntegrationTime(' + as726xValue(block, generator, 'TIME', '50') + ');\n';
};

Arduino.forBlock['as726x_bulb'] = function(block) {
  var method = (block.getFieldValue('STATE') || 'ON') === 'ON' ? 'enableBulb' : 'disableBulb';
  return as726xGetVar(block) + '.' + method + '();\n';
};
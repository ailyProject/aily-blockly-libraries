function bme280EnsureI2C(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('BME280', '#include <SparkFunBME280.h>');
}

function bme280EnsureSPI(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('BME280', '#include <SparkFunBME280.h>');
}

function bme280GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bme280');
}

function bme280AttachVar(block) {
  if (block._bme280VarAttached) return;
  block._bme280VarAttached = true;
  block._bme280VarLastName = block.getFieldValue('VAR') || 'bme280';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._bme280VarLastName, 'BME280');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._bme280VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._bme280VarLastName, newName, 'BME280');
      block._bme280VarLastName = newName;
    }
  };
}

Arduino.forBlock['bme280_init_i2c'] = function(block, generator) {
  bme280AttachVar(block);
  bme280EnsureI2C(generator);
  var varName = block.getFieldValue('VAR') || 'bme280';
  var address = block.getFieldValue('ADDRESS') || '0x77';
  generator.addVariable(varName, 'BME280 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'Wire.begin();\n' + varName + '.setI2CAddress(' + address + ');\n' + varName + '_ready = ' + varName + '.beginI2C();\n';
};

Arduino.forBlock['bme280_init_spi'] = function(block, generator) {
  bme280AttachVar(block);
  bme280EnsureSPI(generator);
  var varName = block.getFieldValue('VAR') || 'bme280';
  var cs = block.getFieldValue('CS') || '10';
  generator.addVariable(varName, 'BME280 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return 'SPI.begin();\n' + varName + '_ready = ' + varName + '.beginSPI(' + cs + ');\n';
};

Arduino.forBlock['bme280_is_ready'] = function(block, generator) {
  return [bme280GetVar(block) + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bme280_read_temperature'] = function(block, generator) {
  var method = (block.getFieldValue('UNIT') || 'C') === 'F' ? 'readTempF' : 'readTempC';
  return [bme280GetVar(block) + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme280_read_pressure'] = function(block, generator) {
  return [bme280GetVar(block) + '.readFloatPressure()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme280_read_humidity'] = function(block, generator) {
  return [bme280GetVar(block) + '.readFloatHumidity()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme280_read_altitude'] = function(block, generator) {
  var method = (block.getFieldValue('UNIT') || 'M') === 'FT' ? 'readFloatAltitudeFeet' : 'readFloatAltitudeMeters';
  return [bme280GetVar(block) + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme280_dew_point'] = function(block, generator) {
  var method = (block.getFieldValue('UNIT') || 'C') === 'F' ? 'dewPointF' : 'dewPointC';
  return [bme280GetVar(block) + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme280_set_mode'] = function(block) {
  return bme280GetVar(block) + '.setMode(' + (block.getFieldValue('MODE') || 'MODE_NORMAL') + ');\n';
};

Arduino.forBlock['bme280_set_oversampling'] = function(block) {
  var methods = { TEMP: 'setTempOverSample', PRESSURE: 'setPressureOverSample', HUMIDITY: 'setHumidityOverSample' };
  var method = methods[block.getFieldValue('SENSOR') || 'TEMP'];
  return bme280GetVar(block) + '.' + method + '(' + (block.getFieldValue('OVERSAMPLE') || '1') + ');\n';
};

Arduino.forBlock['bme280_set_filter'] = function(block) {
  return bme280GetVar(block) + '.setFilter(' + (block.getFieldValue('FILTER') || '0') + ');\n';
};

Arduino.forBlock['bme280_is_measuring'] = function(block, generator) {
  return [bme280GetVar(block) + '.isMeasuring()', generator.ORDER_FUNCTION_CALL];
};
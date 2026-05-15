function bmp180EnsureLibraries(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SFE_BMP180', '#include <SFE_BMP180.h>');
}

function bmp180GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bmp180');
}

function bmp180AttachVar(block) {
  if (block._bmp180VarAttached) return;
  block._bmp180VarAttached = true;
  block._bmp180VarLastName = block.getFieldValue('VAR') || 'bmp180';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._bmp180VarLastName, 'SFE_BMP180');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._bmp180VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._bmp180VarLastName, newName, 'SFE_BMP180');
      block._bmp180VarLastName = newName;
    }
  };
}

function bmp180EnsureHelpers(generator) {
  generator.addFunction('bmp180_read_temperature_helper', 'double bmp180ReadTemperature(SFE_BMP180 &sensor) {\n  char status = sensor.startTemperature();\n  if (status == 0) return 0.0;\n  delay(status);\n  double temperature = 0.0;\n  if (sensor.getTemperature(temperature) == 0) return 0.0;\n  return temperature;\n}\n');
  generator.addFunction('bmp180_read_pressure_helper', 'double bmp180ReadPressure(SFE_BMP180 &sensor, byte oversampling) {\n  double temperature = bmp180ReadTemperature(sensor);\n  char status = sensor.startPressure(oversampling);\n  if (status == 0) return 0.0;\n  delay(status);\n  double pressure = 0.0;\n  if (sensor.getPressure(pressure, temperature) == 0) return 0.0;\n  return pressure;\n}\n');
}

Arduino.forBlock['bmp180_init'] = function(block, generator) {
  bmp180AttachVar(block);
  var varName = block.getFieldValue('VAR') || 'bmp180';
  bmp180EnsureLibraries(generator);
  generator.addVariable(varName, 'SFE_BMP180 ' + varName + ';');
  generator.addVariable(varName + '_ready', 'bool ' + varName + '_ready = false;');
  return varName + '_ready = ' + varName + '.begin();\n';
};

Arduino.forBlock['bmp180_is_ready'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  return [varName + '_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bmp180_read_temperature'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  bmp180EnsureLibraries(generator);
  bmp180EnsureHelpers(generator);
  return ['bmp180ReadTemperature(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp180_read_pressure'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  var oversampling = block.getFieldValue('OVERSAMPLING') || '3';
  bmp180EnsureLibraries(generator);
  bmp180EnsureHelpers(generator);
  return ['bmp180ReadPressure(' + varName + ', ' + oversampling + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp180_sea_level'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  var pressure = generator.valueToCode(block, 'PRESSURE', generator.ORDER_ATOMIC) || '1013.25';
  var altitude = generator.valueToCode(block, 'ALTITUDE', generator.ORDER_ATOMIC) || '0';
  return [varName + '.sealevel(' + pressure + ', ' + altitude + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp180_altitude'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  var pressure = generator.valueToCode(block, 'PRESSURE', generator.ORDER_ATOMIC) || '1013.25';
  var baseline = generator.valueToCode(block, 'BASELINE', generator.ORDER_ATOMIC) || '1013.25';
  return [varName + '.altitude(' + pressure + ', ' + baseline + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp180_get_error'] = function(block, generator) {
  var varName = bmp180GetVar(block);
  return [varName + '.getError()', generator.ORDER_FUNCTION_CALL];
};
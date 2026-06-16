function lis3dhtrEnsureSensor(generator) {
  generator.addLibrary('LIS3DHTR', '#include <LIS3DHTR.h>\n#include <Wire.h>');
  generator.addObject('accel_sensor', 'LIS3DHTR<TwoWire> accel_sensor;');
}

Arduino.forBlock['lis3dhtr_init'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';

  generator.addLibrary('Wire_lib', '#include <Wire.h>');
  var wireBeginKey = 'wire_' + wire + '_begin';
  if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
    generator.addSetup(wireBeginKey, wire + '.begin();\n');
  }

  var code = 'accel_sensor.begin(' + wire + ', ' + address + ');\n';
  return code;
};

Arduino.forBlock['lis3dhtr_init_simplified'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || 'LIS3DHTR_DEFAULT_ADDRESS';
  var dataRate = block.getFieldValue('DATARATE') || 'LIS3DHTR_DATARATE_25HZ';
  var range = block.getFieldValue('RANGE') || 'LIS3DHTR_RANGE_2G';
  var highRes = block.getFieldValue('HIGHRES') || 'true';

  generator.addLibrary('Wire_lib', '#include <Wire.h>');
  var wireBeginKey = 'wire_' + wire + '_begin';
  if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
    generator.addSetup(wireBeginKey, wire + '.begin();\n');
  }

  ensureSerialBegin('Serial', generator);

  var code = 'accel_sensor.begin(' + wire + ', ' + address + ');\n';
  code += 'if (!accel_sensor.isConnection()) {\n';
  code += '  Serial.println("LIS3DHTR not detected!");\n';
  code += '} else {\n';
  code += '  Serial.println("LIS3DHTR OK!");\n';
  code += '}\n';
  code += 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
  code += 'accel_sensor.setFullScaleRange(' + range + ');\n';
  code += 'accel_sensor.setHighSolution(' + highRes + ');\n';
  return code;
};

Arduino.forBlock['lis3dhtr_set_datarate'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var dataRate = block.getFieldValue('DATARATE');
  return 'accel_sensor.setOutputDataRate(' + dataRate + ');\n';
};

Arduino.forBlock['lis3dhtr_set_full_scale_range'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var range = block.getFieldValue('RANGE');
  return 'accel_sensor.setFullScaleRange(' + range + ');\n';
};

Arduino.forBlock['lis3dhtr_set_resolution'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var enable = block.getFieldValue('ENABLE');
  return 'accel_sensor.setHighSolution(' + enable + ');\n';
};

Arduino.forBlock['lis3dhtr_set_power_mode'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var mode = block.getFieldValue('MODE');
  return 'accel_sensor.setPowerMode(' + mode + ');\n';
};

Arduino.forBlock['lis3dhtr_get_acceleration'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var axis = block.getFieldValue('AXIS');
  var code;
  switch (axis) {
    case 'X': code = 'accel_sensor.getAccelerationX()'; break;
    case 'Y': code = 'accel_sensor.getAccelerationY()'; break;
    case 'Z': code = 'accel_sensor.getAccelerationZ()'; break;
    default: code = 'accel_sensor.getAccelerationX()';
  }
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_get_acceleration_x'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.getAccelerationX()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_get_acceleration_y'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.getAccelerationY()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_get_acceleration_z'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.getAccelerationZ()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_get_acceleration_xyz'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var varX = generator.nameDB_.getName(block.getFieldValue('X_VAR'), 'VARIABLE');
  var varY = generator.nameDB_.getName(block.getFieldValue('Y_VAR'), 'VARIABLE');
  var varZ = generator.nameDB_.getName(block.getFieldValue('Z_VAR'), 'VARIABLE');

  generator.addVariable(varX, 'float ' + varX + ';');
  generator.addVariable(varY, 'float ' + varY + ';');
  generator.addVariable(varZ, 'float ' + varZ + ';');

  return 'accel_sensor.getAcceleration(&' + varX + ', &' + varY + ', &' + varZ + ');\n';
};

Arduino.forBlock['lis3dhtr_available'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_open_temp'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return 'accel_sensor.openTemp();\n';
};

Arduino.forBlock['lis3dhtr_close_temp'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return 'accel_sensor.closeTemp();\n';
};

Arduino.forBlock['lis3dhtr_get_temperature'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.getTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_read_adc'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var channel = block.getFieldValue('CHANNEL');
  var code;
  switch (channel) {
    case '1': code = 'accel_sensor.readbitADC1()'; break;
    case '2': code = 'accel_sensor.readbitADC2()'; break;
    case '3': code = 'accel_sensor.readbitADC3()'; break;
    default: code = 'accel_sensor.readbitADC1()';
  }
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_is_connection'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.isConnection()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_get_device_id'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return ['accel_sensor.getDeviceID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['lis3dhtr_reset'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  return 'accel_sensor.reset();\n';
};

Arduino.forBlock['lis3dhtr_on_tap'] = function(block, generator) {
  lis3dhtrEnsureSensor(generator);
  var clickType = block.getFieldValue('CLICK_TYPE') || '1';
  var intPin = block.getFieldValue('INT_PIN') || '2';
  var threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '40';
  var handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  var suffix = String(block.id || 'tap').replace(/[^A-Za-z0-9_]/g, '_');
  var callbackName = 'lis3dhtr_tap_isr_' + suffix;

  var functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  var setupCode = 'accel_sensor.click(' + clickType + ', ' + threshold + ');\n' +
    'pinMode(' + intPin + ', INPUT);\n' +
    'attachInterrupt(digitalPinToInterrupt(' + intPin + '), ' + callbackName + ', RISING);\n';
  generator.addSetupEnd(callbackName + '_setup', setupCode);

  return '';
};

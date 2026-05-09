// BME68x环境传感器 generator.js

Arduino.forBlock['bme68x_init'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  var address = block.getFieldValue('ADDRESS') || '0x76';
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(' + address + ');');
  return 'Wire.begin();\nbme68x_sensor.init();\n';
};

Arduino.forBlock['bme68x_update'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(0x76);');
  return 'bme68x_sensor.read_sensor_data();\n';
};

Arduino.forBlock['bme68x_read_temperature'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(0x76);');
  return ['bme68x_sensor.read_temperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme68x_read_humidity'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(0x76);');
  return ['bme68x_sensor.read_humidity()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme68x_read_pressure'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(0x76);');
  return ['(bme68x_sensor.read_pressure() / 100.0)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bme68x_read_gas'] = function(block, generator) {
  generator.addLibrary('BME68X_H', '#include <seeed_bme680.h>\n#include <Wire.h>');
  generator.addVariable('bme68x_sensor', 'Seeed_BME680 bme68x_sensor(0x76);');
  return ['bme68x_sensor.read_gas()', generator.ORDER_FUNCTION_CALL];
};

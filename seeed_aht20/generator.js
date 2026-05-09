// AHT20温湿度传感器 generator.js

Arduino.forBlock['aht20_init'] = function(block, generator) {
  generator.addLibrary('AHT20_H', '#include <AHT20.h>\n#include <Wire.h>');
  generator.addVariable('aht20_sensor', 'AHT20 aht20_sensor;');
  return 'Wire.begin();\naht20_sensor.begin();\n';
};

Arduino.forBlock['aht20_read_temperature'] = function(block, generator) {
  generator.addLibrary('AHT20_H', '#include <AHT20.h>\n#include <Wire.h>');
  generator.addVariable('aht20_sensor', 'AHT20 aht20_sensor;');

  generator.addFunction('aht20_getTemperature', [
    'float aht20_getTemperature() {',
    '  float t = 0;',
    '  aht20_sensor.getTemperature(&t);',
    '  return t;',
    '}'
  ].join('\n'));

  return ['aht20_getTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['aht20_read_humidity'] = function(block, generator) {
  generator.addLibrary('AHT20_H', '#include <AHT20.h>\n#include <Wire.h>');
  generator.addVariable('aht20_sensor', 'AHT20 aht20_sensor;');

  generator.addFunction('aht20_getHumidity', [
    'float aht20_getHumidity() {',
    '  float h = 0;',
    '  aht20_sensor.getHumidity(&h);',
    '  return h;',
    '}'
  ].join('\n'));

  return ['aht20_getHumidity()', generator.ORDER_FUNCTION_CALL];
};

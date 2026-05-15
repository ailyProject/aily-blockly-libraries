// Grove DHT温湿度传感器 generator.js

Arduino.forBlock['dht_init'] = function(block, generator) {
  generator.addLibrary('DHT_H', '#include <DHT.h>');
  var pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '2';
  var type = block.getFieldValue('TYPE') || 'DHT11';

  generator.addVariable('dht_sensor_type', 'uint8_t dht_sensor_type = ' + type + ';');
  generator.addVariable('dht_sensor', 'DHT dht_sensor(' + pin + ', ' + type + ');');

  return 'dht_sensor.begin();\n';
};

Arduino.forBlock['dht_read_temperature'] = function(block, generator) {
  generator.addLibrary('DHT_H', '#include <DHT.h>');
  generator.addVariable('dht_sensor', 'DHT dht_sensor(2, DHT11);');
  var unit = block.getFieldValue('UNIT') || 'C';
  var isFahrenheit = (unit === 'F') ? 'true' : 'false';
  return ['dht_sensor.readTemperature(' + isFahrenheit + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dht_read_humidity'] = function(block, generator) {
  generator.addLibrary('DHT_H', '#include <DHT.h>');
  generator.addVariable('dht_sensor', 'DHT dht_sensor(2, DHT11);');
  return ['dht_sensor.readHumidity()', generator.ORDER_FUNCTION_CALL];
};

function ds3234EnsureLib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('DS3234RTC', '#include <SparkFun_DS3234_RTC_Arduino_Library/SparkFunDS3234RTC.h>');
}

Arduino.forBlock['ds3234_begin'] = function(block, generator) {
  ds3234EnsureLib(generator);
  var csPin = block.getFieldValue('CS_PIN') || '10';
  return 'rtc.begin(' + csPin + ');\n';
};

Arduino.forBlock['ds3234_auto_time'] = function(block, generator) {
  ds3234EnsureLib(generator);
  return 'rtc.autoTime();\n';
};

Arduino.forBlock['ds3234_set_time'] = function(block, generator) {
  ds3234EnsureLib(generator);
  var sec = generator.valueToCode(block, 'SEC', generator.ORDER_ATOMIC) || '0';
  var min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  var hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
  var day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  var date = generator.valueToCode(block, 'DATE', generator.ORDER_ATOMIC) || '1';
  var month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  var year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '24';
  return 'rtc.setTime(' + sec + ', ' + min + ', ' + hour + ', ' + day + ', ' + date + ', ' + month + ', ' + year + ');\n';
};

Arduino.forBlock['ds3234_update'] = function(block, generator) {
  ds3234EnsureLib(generator);
  return 'rtc.update();\n';
};

Arduino.forBlock['ds3234_get_time'] = function(block, generator) {
  ds3234EnsureLib(generator);
  var field = block.getFieldValue('FIELD') || 'second';
  return ['rtc.' + field + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ds3234_get_temperature'] = function(block, generator) {
  ds3234EnsureLib(generator);
  return ['rtc.temperature()', generator.ORDER_FUNCTION_CALL];
};

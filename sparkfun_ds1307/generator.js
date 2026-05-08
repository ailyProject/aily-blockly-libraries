function ds1307EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DS1307RTC', '#include <SparkFun_DS1307_RTC_Arduino_Library/SparkFunDS1307RTC.h>');
}

Arduino.forBlock['ds1307_begin'] = function(block, generator) {
  ds1307EnsureLib(generator);
  return 'Wire.begin();\nrtc.begin();\n';
};

Arduino.forBlock['ds1307_auto_time'] = function(block, generator) {
  ds1307EnsureLib(generator);
  return 'rtc.autoTime();\n';
};

Arduino.forBlock['ds1307_set_time'] = function(block, generator) {
  ds1307EnsureLib(generator);
  var sec = generator.valueToCode(block, 'SEC', generator.ORDER_ATOMIC) || '0';
  var min = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0';
  var hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
  var day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  var date = generator.valueToCode(block, 'DATE', generator.ORDER_ATOMIC) || '1';
  var month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  var year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '24';
  return 'rtc.setTime(' + sec + ', ' + min + ', ' + hour + ', ' + day + ', ' + date + ', ' + month + ', ' + year + ');\n';
};

Arduino.forBlock['ds1307_update'] = function(block, generator) {
  ds1307EnsureLib(generator);
  return 'rtc.update();\n';
};

Arduino.forBlock['ds1307_get_time'] = function(block, generator) {
  ds1307EnsureLib(generator);
  var field = block.getFieldValue('FIELD') || 'second';
  return ['rtc.' + field + '()', generator.ORDER_FUNCTION_CALL];
};

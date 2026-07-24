'use strict';

Arduino.forBlock['esp8266_system_info_number'] = function(block, generator) {
  const method = block.getFieldValue('INFO') || 'getChipId';
  return ['ESP.' + method + '()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp8266_system_info_text'] = function(block, generator) {
  const method = block.getFieldValue('INFO') || 'getSdkVersion';
  return ['String(ESP.' + method + '())', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp8266_system_restart'] = function() { return 'ESP.restart();\n'; };
Arduino.forBlock['esp8266_system_erase_config'] = function(block, generator) { return ['ESP.eraseConfig()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_system_deep_sleep'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || '1000000';
  const mode = block.getFieldValue('MODE') || 'RF_DEFAULT';
  return 'ESP.deepSleep((uint64_t)(' + time + '), ' + mode + ');\n';
};
Arduino.forBlock['esp8266_system_deep_sleep_instant'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || '1000000';
  const mode = block.getFieldValue('MODE') || 'RF_DEFAULT';
  return 'ESP.deepSleepInstant((uint64_t)(' + time + '), ' + mode + ');\n';
};
Arduino.forBlock['esp8266_system_deep_sleep_max'] = function(block, generator) { return ['ESP.deepSleepMax()', generator.ORDER_FUNCTION_CALL]; };

'use strict';

function esp8266EepromInclude(generator) {
  generator.addLibrary('ESP8266_EEPROM', '#include <EEPROM.h>');
}
Arduino.forBlock['esp8266_eeprom_begin'] = function(block, generator) {
  esp8266EepromInclude(generator);
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '512';
  return 'EEPROM.begin(' + size + ');\n';
};
Arduino.forBlock['esp8266_eeprom_read'] = function(block, generator) {
  esp8266EepromInclude(generator);
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  return ['EEPROM.read(' + address + ')', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp8266_eeprom_write'] = function(block, generator) {
  esp8266EepromInclude(generator);
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return 'EEPROM.write(' + address + ', (uint8_t)(' + value + '));\n';
};
Arduino.forBlock['esp8266_eeprom_commit'] = function(block, generator) {
  esp8266EepromInclude(generator);
  return ['EEPROM.commit()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp8266_eeprom_length'] = function(block, generator) {
  esp8266EepromInclude(generator);
  return ['EEPROM.length()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['esp8266_eeprom_end'] = function(block, generator) {
  esp8266EepromInclude(generator);
  return ['EEPROM.end()', generator.ORDER_FUNCTION_CALL];
};

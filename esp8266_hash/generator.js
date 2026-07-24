'use strict';

Arduino.forBlock['esp8266_hash_sha1'] = function(block, generator) { generator.addLibrary('ESP8266_Hash', '#include <Hash.h>'); const d = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""'; return ['sha1(String(' + d + '))', generator.ORDER_FUNCTION_CALL]; };

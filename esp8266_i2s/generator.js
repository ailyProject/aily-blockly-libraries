'use strict';

function esp8266I2sInclude(generator) { generator.addLibrary('ESP8266_I2S', '#include <I2S.h>'); }
Arduino.forBlock['esp8266_i2s_begin'] = function(block, generator) { esp8266I2sInclude(generator); const r = generator.valueToCode(block, 'RATE', generator.ORDER_ATOMIC) || '8000'; const b = block.getFieldValue('BITS') || '16'; return ['I2S.begin(I2S_PHILIPS_MODE, ' + r + ', ' + b + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_i2s_end'] = function(block, generator) { esp8266I2sInclude(generator); return 'I2S.end();\n'; };
Arduino.forBlock['esp8266_i2s_available'] = function(block, generator) { esp8266I2sInclude(generator); return ['I2S.available()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_i2s_available_for_write'] = function(block, generator) { esp8266I2sInclude(generator); return ['I2S.availableForWrite()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_i2s_read'] = function(block, generator) { esp8266I2sInclude(generator); return ['I2S.read()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_i2s_peek'] = function(block, generator) { esp8266I2sInclude(generator); return ['I2S.peek()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_i2s_write'] = function(block, generator) { esp8266I2sInclude(generator); const s = generator.valueToCode(block, 'SAMPLE', generator.ORDER_ATOMIC) || '0'; return 'I2S.write((int32_t)(' + s + '));\n'; };
Arduino.forBlock['esp8266_i2s_flush'] = function(block, generator) { esp8266I2sInclude(generator); return 'I2S.flush();\n'; };

'use strict';

function esp8266SdFatVar(block) { const f = block.getField('VAR'); return f ? f.getText() : 'sd'; }
function esp8266SdFatInclude(generator) { generator.addLibrary('ESP8266_SdFat', '#include <SdFat.h>'); }
Arduino.forBlock['esp8266_sdfat_create'] = function(block, generator) { const n = block.getFieldValue('VAR') || 'sd'; esp8266SdFatInclude(generator); registerVariableToBlockly(n, 'SdFs'); generator.addObject('esp8266_sdfat_' + n, 'SdFs ' + n + ';'); return ''; };
Arduino.forBlock['esp8266_sdfat_begin'] = function(block, generator) { esp8266SdFatInclude(generator); const cs = block.getFieldValue('CS') || 'SS'; const mhz = generator.valueToCode(block, 'MHZ', generator.ORDER_ATOMIC) || '4'; return [esp8266SdFatVar(block) + '.begin(' + cs + ', SD_SCK_MHZ(' + mhz + '))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_sdfat_exists'] = function(block, generator) { esp8266SdFatInclude(generator); const p = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""'; return [esp8266SdFatVar(block) + '.exists(String(' + p + ').c_str())', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_sdfat_mkdir'] = function(block, generator) { const p = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""'; return esp8266SdFatVar(block) + '.mkdir(String(' + p + ').c_str());\n'; };
Arduino.forBlock['esp8266_sdfat_remove'] = function(block, generator) { const p = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""'; return esp8266SdFatVar(block) + '.remove(String(' + p + ').c_str());\n'; };
Arduino.forBlock['esp8266_sdfat_rename'] = function(block, generator) { const a = generator.valueToCode(block, 'OLD', generator.ORDER_ATOMIC) || '""'; const b = generator.valueToCode(block, 'NEW', generator.ORDER_ATOMIC) || '""'; return esp8266SdFatVar(block) + '.rename(String(' + a + ').c_str(), String(' + b + ').c_str());\n'; };
Arduino.forBlock['esp8266_sdfat_sector_count'] = function(block, generator) { return [esp8266SdFatVar(block) + '.card()->sectorCount()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_sdfat_fat_type'] = function(block, generator) { return [esp8266SdFatVar(block) + '.vol()->fatType()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_sdfat_format'] = function(block, generator) { ensureSerialBegin('Serial', generator); return [esp8266SdFatVar(block) + '.format(&Serial)', generator.ORDER_FUNCTION_CALL]; };

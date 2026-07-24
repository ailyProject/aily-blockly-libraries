'use strict';

function esp8266SsdpInclude(generator) { generator.addLibrary('ESP8266SSDP', '#include <ESP8266SSDP.h>'); }
Arduino.forBlock['esp8266_ssdp_set_text'] = function(block, generator) { esp8266SsdpInclude(generator); const method = block.getFieldValue('FIELD') || 'setName'; const v = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""'; return 'SSDP.' + method + '(String(' + v + '));\n'; };
Arduino.forBlock['esp8266_ssdp_set_http_port'] = function(block, generator) { esp8266SsdpInclude(generator); return 'SSDP.setHTTPPort(' + (generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80') + ');\n'; };
Arduino.forBlock['esp8266_ssdp_set_ttl'] = function(block, generator) { esp8266SsdpInclude(generator); return 'SSDP.setTTL(' + (generator.valueToCode(block, 'TTL', generator.ORDER_ATOMIC) || '2') + ');\n'; };
Arduino.forBlock['esp8266_ssdp_set_interval'] = function(block, generator) { esp8266SsdpInclude(generator); return 'SSDP.setInterval(' + (generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '1200') + ');\n'; };
Arduino.forBlock['esp8266_ssdp_begin'] = function(block, generator) { esp8266SsdpInclude(generator); return ['SSDP.begin()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_ssdp_end'] = function(block, generator) { esp8266SsdpInclude(generator); return 'SSDP.end();\n'; };
Arduino.forBlock['esp8266_ssdp_schema'] = function(block, generator) { esp8266SsdpInclude(generator); const f = block.getField('SERVER'); const s = f ? f.getText() : 'server'; return 'SSDP.schema(' + s + '.client());\n'; };

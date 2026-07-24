'use strict';

function esp8266NetbiosInclude(generator) { generator.addLibrary('ESP8266NetBIOS', '#include <ESP8266NetBIOS.h>'); }
Arduino.forBlock['esp8266_netbios_begin'] = function(block, generator) { esp8266NetbiosInclude(generator); const n = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"ESP8266"'; return ['NBNS.begin(String(' + n + ').c_str())', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_netbios_end'] = function(block, generator) { esp8266NetbiosInclude(generator); return 'NBNS.end();\n'; };

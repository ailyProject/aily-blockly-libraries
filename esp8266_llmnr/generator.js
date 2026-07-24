'use strict';

function esp8266LlmnrInclude(generator) { generator.addLibrary('ESP8266LLMNR', '#include <ESP8266LLMNR.h>'); }
Arduino.forBlock['esp8266_llmnr_begin'] = function(block, generator) { esp8266LlmnrInclude(generator); const h = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '"esp8266"'; return ['LLMNR.begin(String(' + h + ').c_str())', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_llmnr_notify_ap_change'] = function(block, generator) { esp8266LlmnrInclude(generator); return 'LLMNR.notify_ap_change();\n'; };

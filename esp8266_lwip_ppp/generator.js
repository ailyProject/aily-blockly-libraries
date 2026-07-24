'use strict';

function esp8266PppVar(block) { const f = block.getField('VAR'); return f ? f.getText() : 'ppp'; }
function esp8266PppInclude(generator) { generator.addLibrary('ESP8266_PPPServer', '#include <PPPServer.h>'); }
Arduino.forBlock['esp8266_lwip_ppp_create'] = function(block, generator) { const n = block.getFieldValue('VAR') || 'ppp'; const serial = block.getFieldValue('SERIAL') || 'Serial'; esp8266PppInclude(generator); registerVariableToBlockly(n, 'PPPServer'); generator.addObject('esp8266_ppp_' + n, 'PPPServer ' + n + '(&' + serial + ');'); return ''; };
Arduino.forBlock['esp8266_lwip_ppp_begin'] = function(block, generator) { esp8266PppInclude(generator); const l = generator.valueToCode(block, 'LOCAL', generator.ORDER_ATOMIC) || '"192.168.4.1"'; const p = generator.valueToCode(block, 'PEER', generator.ORDER_ATOMIC) || '"172.31.255.254"'; generator.addFunction('esp8266_ppp_parse_ip', 'IPAddress esp8266PppParseIP(const String &text) {\n  IPAddress ip;\n  ip.fromString(text);\n  return ip;\n}'); return [esp8266PppVar(block) + '.begin(esp8266PppParseIP(String(' + l + ')), esp8266PppParseIP(String(' + p + ')))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ppp_stop'] = function(block) { return esp8266PppVar(block) + '.stop();\n'; };

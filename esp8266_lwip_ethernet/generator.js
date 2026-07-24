'use strict';

function esp8266LwipEthVar(block) { const f = block.getField('VAR'); return f ? f.getText() : 'eth'; }
function esp8266LwipEthInclude(generator) { generator.addLibrary('ESP8266_LwipEthernet', '#include <LwipEthernet.h>'); }
function esp8266LwipEthIpHelper(generator) { generator.addFunction('esp8266_lwip_parse_ip', 'IPAddress esp8266LwipParseIP(const String &text) {\n  IPAddress ip;\n  ip.fromString(text);\n  return ip;\n}'); }
Arduino.forBlock['esp8266_lwip_ethernet_create'] = function(block, generator) { const n = block.getFieldValue('VAR') || 'eth'; const d = block.getFieldValue('DRIVER') || 'Wiznet5500lwIP'; const cs = block.getFieldValue('CS') || '15'; esp8266LwipEthInclude(generator); registerVariableToBlockly(n, 'LwipEthernet'); generator.addObject('esp8266_lwip_eth_' + n, d + ' ' + n + '(' + cs + ');'); return ''; };
Arduino.forBlock['esp8266_lwip_ethernet_begin_dhcp'] = function(block, generator) { esp8266LwipEthInclude(generator); return ['ethInitDHCP(' + esp8266LwipEthVar(block) + ')', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_begin_static'] = function(block, generator) { esp8266LwipEthInclude(generator); esp8266LwipEthIpHelper(generator); const names = ['IP','GATEWAY','MASK','DNS']; const v = names.map(n => generator.valueToCode(block, n, generator.ORDER_ATOMIC) || '"0.0.0.0"'); return ['ethInitStatic(' + esp8266LwipEthVar(block) + ', esp8266LwipParseIP(String(' + v[0] + ')), esp8266LwipParseIP(String(' + v[1] + ')), esp8266LwipParseIP(String(' + v[2] + ')), esp8266LwipParseIP(String(' + v[3] + ')))', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_connected'] = function(block, generator) { return [esp8266LwipEthVar(block) + '.connected()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_local_ip'] = function(block, generator) { return [esp8266LwipEthVar(block) + '.localIP().toString()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_linked'] = function(block, generator) { return [esp8266LwipEthVar(block) + '.isLinked()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_link_detectable'] = function(block, generator) { return [esp8266LwipEthVar(block) + '.isLinkDetectable()', generator.ORDER_FUNCTION_CALL]; };
Arduino.forBlock['esp8266_lwip_ethernet_set_default'] = function(block) { return esp8266LwipEthVar(block) + '.setDefault(' + (block.getFieldValue('ENABLE') || 'true') + ');\n'; };

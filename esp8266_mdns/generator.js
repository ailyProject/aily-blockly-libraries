'use strict';

function ensureMDNSLib(generator) {
  generator.addLibrary('ESPmDNS', '#include <ESP8266mDNS.h>');
}

Arduino.forBlock['esp8266_mdns_begin'] = function(block, generator) {
  const hostname = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '"esp8266"';
  ensureMDNSLib(generator);
  ensureSerialBegin("Serial", generator);
  let code = 'if (!MDNS.begin(' + hostname + ')) {\n';
  code += '  Serial.println("Error starting mDNS");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp8266_mdns_end'] = function(block, generator) {
  ensureMDNSLib(generator);
  return 'MDNS.end();\n';
};

Arduino.forBlock['esp8266_mdns_add_service'] = function(block, generator) {
  const service = generator.valueToCode(block, 'SERVICE', generator.ORDER_ATOMIC) || '"http"';
  const proto = block.getFieldValue('PROTO') || 'tcp';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  ensureMDNSLib(generator);
  return 'MDNS.addService(' + service + ', "' + proto + '", ' + port + ');\n';
};

Arduino.forBlock['esp8266_mdns_add_service_txt'] = function(block, generator) {
  const service = generator.valueToCode(block, 'SERVICE', generator.ORDER_ATOMIC) || '"http"';
  const proto = block.getFieldValue('PROTO') || 'tcp';
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"board"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '"esp8266"';
  ensureMDNSLib(generator);
  return 'MDNS.addServiceTxt(' + service + ', "' + proto + '", ' + key + ', ' + value + ');\n';
};



Arduino.forBlock['esp8266_mdns_query_service'] = function(block, generator) {
  const service = generator.valueToCode(block, 'SERVICE', generator.ORDER_ATOMIC) || '"http"';
  const proto = block.getFieldValue('PROTO') || 'tcp';
  ensureMDNSLib(generator);
  return ['MDNS.queryService(' + service + ', "' + proto + '")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_mdns_result'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const attr = block.getFieldValue('ATTR') || 'hostname';
  ensureMDNSLib(generator);

  let code = '';
  switch (attr) {
    case 'hostname':
      code = 'MDNS.hostname(' + index + ')';
      break;
    case 'address':
      code = 'MDNS.IP(' + index + ').toString()';
      break;
    case 'port':
      code = 'String(MDNS.port(' + index + '))';
      break;
    default:
      code = '""';
  }
  return [code, generator.ORDER_FUNCTION_CALL];
};

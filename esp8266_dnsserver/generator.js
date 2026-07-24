'use strict';

function ensureDNSServerLib(generator) {
  generator.addLibrary('DNSServer', '#include <DNSServer.h>');
  generator.addObject('dnsServer_obj', 'DNSServer dnsServer;');
}

Arduino.forBlock['esp8266_dnsserver_start'] = function(block, generator) {
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '53';
  const domain = generator.valueToCode(block, 'DOMAIN', generator.ORDER_ATOMIC) || '"*"';
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '"192.168.4.1"';
  ensureDNSServerLib(generator);

  let code = '';
  code += '{\n';
  code += '  IPAddress resolvedIP;\n';
  code += '  resolvedIP.fromString(' + ip + ');\n';
  code += '  dnsServer.start(' + port + ', ' + domain + ', resolvedIP);\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp8266_dnsserver_start_captive'] = function(block, generator) {
  ensureDNSServerLib(generator);
  generator.addLibrary('WiFi', '#include <ESP8266WiFi.h>');
  return 'dnsServer.start(53, "*", WiFi.softAPIP());\n';
};

Arduino.forBlock['esp8266_dnsserver_stop'] = function(block, generator) {
  ensureDNSServerLib(generator);
  return 'dnsServer.stop();\n';
};

Arduino.forBlock['esp8266_dnsserver_process'] = function(block, generator) {
  ensureDNSServerLib(generator);
  return 'dnsServer.processNextRequest();\n';
};

Arduino.forBlock['esp8266_dnsserver_set_ttl'] = function(block, generator) {
  const ttl = generator.valueToCode(block, 'TTL', generator.ORDER_ATOMIC) || '300';
  ensureDNSServerLib(generator);
  return 'dnsServer.setTTL(' + ttl + ');\n';
};

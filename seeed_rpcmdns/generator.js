'use strict';

function seeedRpcMdnsEnsure(generator) {
  generator.addLibrary('Seeed_rpcWiFi', '#include <rpcWiFi.h>');
  generator.addLibrary('Seeed_rpcmDNS', '#include <RPCmDNS.h>');
}

function seeedRpcMdnsBoolField(block, name) {
  return block.getFieldValue(name) === 'TRUE' ? 'true' : 'false';
}

function seeedRpcMdnsStringArg(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function seeedRpcMdnsAddTxtHelper(generator) {
  generator.addFunction('seeedRpcMdnsAddServiceTxt',
    'bool seeedRpcMdnsAddServiceTxt(String service, String proto, String key, String value) {\n' +
    '  return MDNS.addServiceTxt((char *)service.c_str(), (char *)proto.c_str(), (char *)key.c_str(), (char *)value.c_str());\n' +
    '}\n'
  );
}

Arduino.forBlock['seeed_rpcmdns_begin'] = function(block, generator) {
  const hostname = seeedRpcMdnsStringArg(generator, block, 'HOSTNAME', '"WioTerminal"');
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.begin(String(' + hostname + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_begin_or_print'] = function(block, generator) {
  const hostname = seeedRpcMdnsStringArg(generator, block, 'HOSTNAME', '"WioTerminal"');
  seeedRpcMdnsEnsure(generator);
  ensureSerialBegin('Serial', generator);
  let code = 'if (!MDNS.begin(String(' + hostname + ').c_str())) {\n';
  code += '  Serial.println("Error starting RPC mDNS");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['seeed_rpcmdns_end'] = function(block, generator) {
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.end();\n';
};

Arduino.forBlock['seeed_rpcmdns_set_instance_name'] = function(block, generator) {
  const name = seeedRpcMdnsStringArg(generator, block, 'NAME', '"Wio Terminal"');
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.setInstanceName(String(' + name + '));\n';
};

Arduino.forBlock['seeed_rpcmdns_add_service'] = function(block, generator) {
  const service = seeedRpcMdnsStringArg(generator, block, 'SERVICE', '"http"');
  const proto = block.getFieldValue('PROTO') || 'tcp';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.addService(String(' + service + '), "' + proto + '", ' + port + ');\n';
};

Arduino.forBlock['seeed_rpcmdns_add_service_txt'] = function(block, generator) {
  const service = seeedRpcMdnsStringArg(generator, block, 'SERVICE', '"http"');
  const proto = block.getFieldValue('PROTO') || 'tcp';
  const key = seeedRpcMdnsStringArg(generator, block, 'KEY', '"board"');
  const value = seeedRpcMdnsStringArg(generator, block, 'VALUE', '"Wio Terminal"');
  seeedRpcMdnsEnsure(generator);
  seeedRpcMdnsAddTxtHelper(generator);
  return ['seeedRpcMdnsAddServiceTxt(String(' + service + '), "' + proto + '", String(' + key + '), String(' + value + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_enable_arduino'] = function(block, generator) {
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '3232';
  const auth = seeedRpcMdnsBoolField(block, 'AUTH');
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.enableArduino(' + port + ', ' + auth + ');\n';
};

Arduino.forBlock['seeed_rpcmdns_disable_arduino'] = function(block, generator) {
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.disableArduino();\n';
};

Arduino.forBlock['seeed_rpcmdns_enable_workstation'] = function(block, generator) {
  const interfaceName = block.getFieldValue('INTERFACE') || 'ESP_IF_WIFI_STA';
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.enableWorkstation(' + interfaceName + ');\n';
};

Arduino.forBlock['seeed_rpcmdns_disable_workstation'] = function(block, generator) {
  seeedRpcMdnsEnsure(generator);
  return 'MDNS.disableWorkstation();\n';
};

Arduino.forBlock['seeed_rpcmdns_query_host'] = function(block, generator) {
  const host = seeedRpcMdnsStringArg(generator, block, 'HOST', '"WioTerminal"');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '2000';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.queryHost(String(' + host + '), ' + timeout + ').toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_query_service'] = function(block, generator) {
  const service = seeedRpcMdnsStringArg(generator, block, 'SERVICE', '"http"');
  const proto = block.getFieldValue('PROTO') || 'tcp';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.queryService(String(' + service + '), "' + proto + '")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_hostname'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.hostname(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_ip'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.IP(' + index + ').toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_port'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.port(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_txt_count'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.numTxt(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_has_txt'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const key = seeedRpcMdnsStringArg(generator, block, 'KEY', '"board"');
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.hasTxt(' + index + ', String(' + key + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_txt_by_key'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const key = seeedRpcMdnsStringArg(generator, block, 'KEY', '"board"');
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.txt(' + index + ', String(' + key + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcmdns_result_txt_by_index'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const txtIndex = generator.valueToCode(block, 'TXT_INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcMdnsEnsure(generator);
  return ['MDNS.txt(' + index + ', ' + txtIndex + ')', generator.ORDER_FUNCTION_CALL];
};

if (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].core) {
  const seeedRpcMdnsCore = String(window['boardConfig'].core);
  if (seeedRpcMdnsCore.indexOf('samd') === -1 && seeedRpcMdnsCore.indexOf('Seeeduino') === -1) {
    console.warn('Seeed RPC mDNS is intended for Wio Terminal / Seeed SAMD boards.');
  }
}

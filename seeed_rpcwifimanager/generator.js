'use strict';

function seeedRpcWiFiManagerEnsure(generator) {
  generator.addLibrary('Seeed_rpcWiFi', '#include <rpcWiFi.h>');
  generator.addLibrary('Seeed_DNSServer', '#include <DNSServer.h>');
  generator.addLibrary('Seeed_WebServer', '#include <WebServer.h>');
  generator.addLibrary('Seeed_rpcWiFiManager', '#include <WiFiManager.h>');
}

function seeedRpcWiFiManagerGetVar(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function seeedRpcWiFiManagerAttachVarMonitor(block, varType, defaultName, flagName) {
  const varName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(varName, varType);

  if (block[flagName]) {
    return varName;
  }

  block[flagName] = true;
  block._varMonitorAttached = true;
  block[flagName + 'LastName'] = varName;
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const oldName = block[flagName + 'LastName'];
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, varType);
        block[flagName + 'LastName'] = newName;
      }
    };
  }

  return varName;
}

function seeedRpcWiFiManagerBoolField(block, name) {
  return block.getFieldValue(name) === 'TRUE' ? 'true' : 'false';
}

function seeedRpcWiFiManagerStringArg(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function seeedRpcWiFiManagerCString(value, fallback) {
  const text = value == null || value === '' ? fallback : String(value);
  return JSON.stringify(text);
}

function seeedRpcWiFiManagerSanitizeName(value, fallback) {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  return cleaned || fallback;
}

function seeedRpcWiFiManagerAddParseIP(generator) {
  generator.addFunction('seeedRpcWiFiManagerParseIP',
    'IPAddress seeedRpcWiFiManagerParseIP(String address) {\n' +
    '  IPAddress ip;\n' +
    '  ip.fromString(address);\n' +
    '  return ip;\n' +
    '}\n'
  );
}

Arduino.forBlock['seeed_rpcwifimanager_create'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerAttachVarMonitor(block, 'WiFiManager', 'wifiManager', '_seeedRpcWiFiManagerVarMonitor');
  seeedRpcWiFiManagerEnsure(generator);
  generator.addObject(varName, 'WiFiManager ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifimanager_auto_connect'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const apName = seeedRpcWiFiManagerStringArg(generator, block, 'AP_NAME', '"WioConfig"');
  const apPassword = seeedRpcWiFiManagerStringArg(generator, block, 'AP_PASSWORD', '"12345678"');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.autoConnect(String(' + apName + ').c_str(), String(' + apPassword + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_auto_connect_default'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.autoConnect()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_start_portal'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const apName = seeedRpcWiFiManagerStringArg(generator, block, 'AP_NAME', '"WioConfig"');
  const apPassword = seeedRpcWiFiManagerStringArg(generator, block, 'AP_PASSWORD', '"12345678"');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.startConfigPortal(String(' + apName + ').c_str(), String(' + apPassword + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_start_portal_default'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.startConfigPortal()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_reset_settings'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.resetSettings();\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_portal_timeout'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '180';
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.setConfigPortalTimeout(' + seconds + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_connect_timeout'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '30';
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.setConnectTimeout(' + seconds + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_debug_output'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const enabled = seeedRpcWiFiManagerBoolField(block, 'ENABLE');
  seeedRpcWiFiManagerEnsure(generator);
  if (enabled === 'true') {
    ensureSerialBegin('Serial', generator);
  }
  return varName + '.setDebugOutput(' + enabled + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_min_quality'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const quality = generator.valueToCode(block, 'QUALITY', generator.ORDER_ATOMIC) || '8';
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.setMinimumSignalQuality(' + quality + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_remove_duplicate_aps'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.setRemoveDuplicateAPs(' + seeedRpcWiFiManagerBoolField(block, 'REMOVE') + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_break_after_save'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return varName + '.setBreakAfterConfig(' + seeedRpcWiFiManagerBoolField(block, 'ENABLE') + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_ap_static_ip'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const ip = seeedRpcWiFiManagerStringArg(generator, block, 'IP', '"192.168.4.1"');
  const gateway = seeedRpcWiFiManagerStringArg(generator, block, 'GATEWAY', '"192.168.4.1"');
  const subnet = seeedRpcWiFiManagerStringArg(generator, block, 'SUBNET', '"255.255.255.0"');
  seeedRpcWiFiManagerEnsure(generator);
  seeedRpcWiFiManagerAddParseIP(generator);
  return varName + '.setAPStaticIPConfig(seeedRpcWiFiManagerParseIP(String(' + ip + ')), seeedRpcWiFiManagerParseIP(String(' + gateway + ')), seeedRpcWiFiManagerParseIP(String(' + subnet + ')));\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_sta_static_ip'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const ip = seeedRpcWiFiManagerStringArg(generator, block, 'IP', '"192.168.1.80"');
  const gateway = seeedRpcWiFiManagerStringArg(generator, block, 'GATEWAY', '"192.168.1.1"');
  const subnet = seeedRpcWiFiManagerStringArg(generator, block, 'SUBNET', '"255.255.255.0"');
  seeedRpcWiFiManagerEnsure(generator);
  seeedRpcWiFiManagerAddParseIP(generator);
  return varName + '.setSTAStaticIPConfig(seeedRpcWiFiManagerParseIP(String(' + ip + ')), seeedRpcWiFiManagerParseIP(String(' + gateway + ')), seeedRpcWiFiManagerParseIP(String(' + subnet + ')));\n';
};

Arduino.forBlock['seeed_rpcwifimanager_set_custom_head'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const html = seeedRpcWiFiManagerCString(block.getFieldValue('HTML'), '<style>body{font-family:sans-serif;}</style>');
  const objectName = 'seeedRpcWiFiManagerHead_' + seeedRpcWiFiManagerSanitizeName(varName, 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  generator.addObject(objectName, 'const char ' + objectName + '[] = ' + html + ';');
  return varName + '.setCustomHeadElement(' + objectName + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_get_portal_ssid'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.getConfigPortalSSID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_get_ssid'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.getSSID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_get_password'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  seeedRpcWiFiManagerEnsure(generator);
  return [varName + '.getPassword()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_create'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerAttachVarMonitor(block, 'WiFiManagerParameter', 'mqttServerParam', '_seeedRpcWiFiManagerParamVarMonitor');
  const id = seeedRpcWiFiManagerCString(block.getFieldValue('ID'), 'server');
  const label = seeedRpcWiFiManagerCString(block.getFieldValue('LABEL'), 'MQTT server');
  const defaultValue = seeedRpcWiFiManagerCString(block.getFieldValue('DEFAULT_VALUE'), 'iot.eclipse.org');
  const length = block.getFieldValue('LENGTH') || '40';
  seeedRpcWiFiManagerEnsure(generator);
  generator.addObject(varName, 'WiFiManagerParameter ' + varName + '(' + id + ', ' + label + ', ' + defaultValue + ', ' + length + ');');
  return '';
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_create_html'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerAttachVarMonitor(block, 'WiFiManagerParameter', 'noticeParam', '_seeedRpcWiFiManagerHtmlParamVarMonitor');
  const html = seeedRpcWiFiManagerCString(block.getFieldValue('HTML'), '<p>Device settings</p>');
  seeedRpcWiFiManagerEnsure(generator);
  generator.addObject(varName, 'WiFiManagerParameter ' + varName + '(' + html + ');');
  return '';
};

Arduino.forBlock['seeed_rpcwifimanager_add_parameter'] = function(block, generator) {
  const managerName = seeedRpcWiFiManagerGetVar(block, 'MANAGER', 'wifiManager');
  const paramName = seeedRpcWiFiManagerGetVar(block, 'PARAM', 'mqttServerParam');
  seeedRpcWiFiManagerEnsure(generator);
  return managerName + '.addParameter(&' + paramName + ');\n';
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_value'] = function(block, generator) {
  const paramName = seeedRpcWiFiManagerGetVar(block, 'PARAM', 'mqttServerParam');
  seeedRpcWiFiManagerEnsure(generator);
  return ['String(' + paramName + '.getValue())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_id'] = function(block, generator) {
  const paramName = seeedRpcWiFiManagerGetVar(block, 'PARAM', 'mqttServerParam');
  seeedRpcWiFiManagerEnsure(generator);
  return ['String(' + paramName + '.getID())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_placeholder'] = function(block, generator) {
  const paramName = seeedRpcWiFiManagerGetVar(block, 'PARAM', 'mqttServerParam');
  seeedRpcWiFiManagerEnsure(generator);
  return ['String(' + paramName + '.getPlaceholder())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_parameter_length'] = function(block, generator) {
  const paramName = seeedRpcWiFiManagerGetVar(block, 'PARAM', 'mqttServerParam');
  seeedRpcWiFiManagerEnsure(generator);
  return [paramName + '.getValueLength()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifimanager_on_portal_start'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'seeedRpcWiFiManagerPortal_' + seeedRpcWiFiManagerSanitizeName(varName, 'wifiManager');
  const functionDef = 'void ' + callbackName + '(WiFiManager *manager) {\n' +
    '  (void)manager;\n' +
    handlerCode +
    '}\n';
  seeedRpcWiFiManagerEnsure(generator);
  generator.addFunction(callbackName, functionDef);
  const code = varName + '.setAPCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  return '';
};

Arduino.forBlock['seeed_rpcwifimanager_on_save_success'] = function(block, generator) {
  const varName = seeedRpcWiFiManagerGetVar(block, 'VAR', 'wifiManager');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'seeedRpcWiFiManagerSave_' + seeedRpcWiFiManagerSanitizeName(varName, 'wifiManager');
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  seeedRpcWiFiManagerEnsure(generator);
  generator.addFunction(callbackName, functionDef);
  const code = varName + '.setSaveConfigCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  return '';
};

if (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].core) {
  const seeedRpcWiFiManagerCore = String(window['boardConfig'].core);
  if (seeedRpcWiFiManagerCore.indexOf('samd') === -1 && seeedRpcWiFiManagerCore.indexOf('Seeeduino') === -1) {
    console.warn('Seeed RPC WiFiManager is intended for Wio Terminal / Seeed SAMD boards.');
  }
}

'use strict';

function seeedRpcWiFiEnsureWiFi(generator) {
  generator.addLibrary('Seeed_rpcWiFi', '#include <rpcWiFi.h>');
}

function seeedRpcWiFiEnsureWiFiMulti(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_WiFiMulti', '#include <WiFiMulti.h>');
}

function seeedRpcWiFiEnsureClientSecure(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_WiFiClientSecure', '#include <WiFiClientSecure.h>');
}

function seeedRpcWiFiEnsureUDP(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_WiFiUDP', '#include <WiFiUdp.h>');
}

function seeedRpcWiFiEnsureHTTP(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_HTTPClient', '#include <HTTPClient.h>');
}

function seeedRpcWiFiEnsureWebServer(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_WebServer', '#include <WebServer.h>');
}

function seeedRpcWiFiEnsureDNS(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_DNSServer', '#include <DNSServer.h>');
}

function seeedRpcWiFiEnsureMDNS(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_RPCmDNS', '#include <RPCmDNS.h>');
}

function seeedRpcWiFiEnsureWiFiManager(generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_DNSServer', '#include <DNSServer.h>');
  generator.addLibrary('Seeed_WebServer', '#include <WebServer.h>');
  generator.addLibrary('Seeed_WiFiManager', '#include <WiFiManager.h>');
}

function seeedRpcWiFiGetVar(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function seeedRpcWiFiAttachVarMonitor(block, varType, defaultName, flagName) {
  const varName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(varName, varType);

  if (block[flagName]) {
    return varName;
  }

  block[flagName] = true;
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

function seeedRpcWiFiBoolField(block, name) {
  return block.getFieldValue(name) === 'TRUE' ? 'true' : 'false';
}

function seeedRpcWiFiIpLiteral(ipText) {
  const parts = String(ipText || '0.0.0.0').split('.').map(function(part) {
    const value = parseInt(part, 10);
    if (isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(255, value));
  });
  while (parts.length < 4) {
    parts.push(0);
  }
  return 'IPAddress(' + parts.slice(0, 4).join(', ') + ')';
}

function seeedRpcWiFiSanitizeName(value, fallback) {
  const cleaned = String(value || '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  return cleaned || fallback;
}

function seeedRpcWiFiAddParseIP(generator) {
  generator.addFunction('seeedRpcWiFiParseIP',
    'IPAddress seeedRpcWiFiParseIP(String address) {\n' +
    '  IPAddress ip;\n' +
    '  ip.fromString(address);\n' +
    '  return ip;\n' +
    '}\n'
  );
}

Arduino.forBlock['seeed_rpcwifi_set_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE') || 'WIFI_STA';
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.mode(' + mode + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_begin'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.begin(String(' + ssid + ').c_str(), String(' + password + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcwifi_connect_wait'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '15000';
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addFunction('seeedRpcWiFiConnectWait',
    'bool seeedRpcWiFiConnectWait(String ssid, String password, unsigned long timeoutMs) {\n' +
    '  WiFi.mode(WIFI_STA);\n' +
    '  WiFi.begin(ssid.c_str(), password.c_str());\n' +
    '  unsigned long started = millis();\n' +
    '  while (WiFi.status() != WL_CONNECTED && (millis() - started) < timeoutMs) {\n' +
    '    delay(500);\n' +
    '  }\n' +
    '  return WiFi.status() == WL_CONNECTED;\n' +
    '}\n'
  );
  return 'seeedRpcWiFiConnectWait(String(' + ssid + '), String(' + password + '), ' + timeout + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_disconnect'] = function(block, generator) {
  const wifiOff = seeedRpcWiFiBoolField(block, 'WIFI_OFF');
  const eraseAp = seeedRpcWiFiBoolField(block, 'ERASE_AP');
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.disconnect(' + wifiOff + ', ' + eraseAp + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_reconnect'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.reconnect()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_status'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.status()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_status_type'] = function(block, generator) {
  return [block.getFieldValue('STATUS') || 'WL_CONNECTED', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcwifi_is_connected'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_wait_for_connect_result'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.waitForConnectResult()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_local_ip'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.localIP().toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_mac_address'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.macAddress()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_current_ssid'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.SSID()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_rssi'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.RSSI()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_set_auto_reconnect'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.setAutoReconnect(' + seeedRpcWiFiBoolField(block, 'ENABLE') + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_mode_value'] = function(block, generator) {
  return [block.getFieldValue('MODE') || 'WIFI_MODE_STA', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcwifi_firmware_version'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  generator.addLibrary('Seeed_erpc_port', '#include <erpc/erpc_port.h>');
  generator.addFunction('seeedRpcWiFiFirmwareVersion',
    'String seeedRpcWiFiFirmwareVersion() {\n' +
    '  char *version = rpc_system_version();\n' +
    '  String result = String(version);\n' +
    '  erpc_free(version);\n' +
    '  return result;\n' +
    '}\n'
  );
  return ['seeedRpcWiFiFirmwareVersion()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scan_networks'] = function(block, generator) {
  const asyncScan = seeedRpcWiFiBoolField(block, 'ASYNC');
  const showHidden = seeedRpcWiFiBoolField(block, 'SHOW_HIDDEN');
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.scanNetworks(' + asyncScan + ', ' + showHidden + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scan_complete'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.scanComplete()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scan_delete'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.scanDelete();\n';
};

Arduino.forBlock['seeed_rpcwifi_scanned_ssid'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.SSID(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scanned_rssi'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.RSSI(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scanned_encryption'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.encryptionType(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_scanned_channel'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.channel(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_encryption_type'] = function(block, generator) {
  return [block.getFieldValue('TYPE') || 'WIFI_AUTH_OPEN', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcwifi_multi_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'WiFiMulti', 'wifiMulti', '_seeedRpcWiFiMultiVarMonitor');
  seeedRpcWiFiEnsureWiFiMulti(generator);
  generator.addObject(varName, 'WiFiMulti ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_multi_add_ap'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wifiMulti');
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureWiFiMulti(generator);
  return varName + '.addAP(String(' + ssid + ').c_str(), String(' + password + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcwifi_multi_run'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wifiMulti');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
  seeedRpcWiFiEnsureWiFiMulti(generator);
  return [varName + '.run(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_softap'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"WioAP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '"12345678"';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '11';
  const hidden = block.getFieldValue('HIDDEN') === 'TRUE' ? '1' : '0';
  const maxConn = generator.valueToCode(block, 'MAX_CONN', generator.ORDER_ATOMIC) || '4';
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.softAP(String(' + ssid + ').c_str(), String(' + password + ').c_str(), ' + channel + ', ' + hidden + ', ' + maxConn + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_softap_config'] = function(block, generator) {
  const ip = seeedRpcWiFiIpLiteral(block.getFieldValue('IP') || '192.168.1.1');
  const gateway = seeedRpcWiFiIpLiteral(block.getFieldValue('GATEWAY') || '192.168.1.1');
  const subnet = seeedRpcWiFiIpLiteral(block.getFieldValue('SUBNET') || '255.255.255.0');
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.softAPConfig(' + ip + ', ' + gateway + ', ' + subnet + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_softap_disconnect'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return 'WiFi.softAPdisconnect(' + seeedRpcWiFiBoolField(block, 'WIFI_OFF') + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_softap_station_count'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.softAPgetStationNum()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_softap_ip'] = function(block, generator) {
  seeedRpcWiFiEnsureWiFi(generator);
  return ['WiFi.softAPIP().toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_client_create'] = function(block, generator) {
  const secure = block.getFieldValue('SECURE') === 'SECURE';
  const varType = secure ? 'WiFiClientSecure' : 'WiFiClient';
  const defaultName = secure ? 'secureClient' : 'client';
  const varName = seeedRpcWiFiAttachVarMonitor(block, varType, defaultName, '_seeedRpcWiFiClientVarMonitor');
  if (secure) {
    seeedRpcWiFiEnsureClientSecure(generator);
    generator.addObject(varName, 'WiFiClientSecure ' + varName + ';');
  } else {
    seeedRpcWiFiEnsureWiFi(generator);
    generator.addObject(varName, 'WiFiClient ' + varName + ';');
  }
  return '';
};

Arduino.forBlock['seeed_rpcwifi_client_connect'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '"example.com"';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  seeedRpcWiFiEnsureWiFi(generator);
  return [varName + '.connect(String(' + host + ').c_str(), ' + port + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_secure_set_ca'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'secureClient');
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureClientSecure(generator);
  return varName + '.setCACert(String(' + caCert + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcwifi_client_print'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  const method = block.getFieldValue('NEWLINE') === 'TRUE' ? 'println' : 'print';
  seeedRpcWiFiEnsureWiFi(generator);
  return varName + '.' + method + '(' + data + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_client_available'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  seeedRpcWiFiEnsureWiFi(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_client_read_string'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  seeedRpcWiFiEnsureWiFi(generator);
  return [varName + '.readString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_client_connected'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  seeedRpcWiFiEnsureWiFi(generator);
  return [varName + '.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_client_stop'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'client');
  seeedRpcWiFiEnsureWiFi(generator);
  return varName + '.stop();\n';
};

Arduino.forBlock['seeed_rpcwifi_udp_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'WiFiUDP', 'udp', '_seeedRpcWiFiUdpVarMonitor');
  seeedRpcWiFiEnsureUDP(generator);
  generator.addObject(varName, 'WiFiUDP ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_udp_begin'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'udp');
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '2390';
  seeedRpcWiFiEnsureUDP(generator);
  return varName + '.begin(' + port + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_udp_send'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'udp');
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '"192.168.1.255"';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '3333';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureUDP(generator);
  generator.addFunction('seeedRpcWiFiUdpSend',
    'void seeedRpcWiFiUdpSend(WiFiUDP &udp, String host, uint16_t port, String data) {\n' +
    '  udp.beginPacket(host.c_str(), port);\n' +
    '  udp.print(data);\n' +
    '  udp.endPacket();\n' +
    '}\n'
  );
  return 'seeedRpcWiFiUdpSend(' + varName + ', String(' + host + '), ' + port + ', String(' + data + '));\n';
};

Arduino.forBlock['seeed_rpcwifi_udp_parse_packet'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'udp');
  seeedRpcWiFiEnsureUDP(generator);
  return [varName + '.parsePacket()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_udp_read_string'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'udp');
  seeedRpcWiFiEnsureUDP(generator);
  generator.addFunction('seeedRpcWiFiUdpReadString',
    'String seeedRpcWiFiUdpReadString(WiFiUDP &udp) {\n' +
    '  String result = "";\n' +
    '  while (udp.available()) {\n' +
    '    result += (char)udp.read();\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n'
  );
  return ['seeedRpcWiFiUdpReadString(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_http_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'HTTPClient', 'http', '_seeedRpcWiFiHttpVarMonitor');
  seeedRpcWiFiEnsureHTTP(generator);
  generator.addObject(varName, 'HTTPClient ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_http_begin'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"http://www.example.com/index.html"';
  seeedRpcWiFiEnsureHTTP(generator);
  return varName + '.begin(String(' + url + '));\n';
};

Arduino.forBlock['seeed_rpcwifi_http_begin_https'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"https://www.example.com/index.html"';
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureHTTP(generator);
  seeedRpcWiFiEnsureClientSecure(generator);
  return varName + '.begin(String(' + url + '), String(' + caCert + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcwifi_http_add_header'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Content-Type"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '"text/plain"';
  seeedRpcWiFiEnsureHTTP(generator);
  return varName + '.addHeader(String(' + name + '), String(' + value + '));\n';
};

Arduino.forBlock['seeed_rpcwifi_http_request'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  const method = block.getFieldValue('METHOD') || 'GET';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureHTTP(generator);
  if (method === 'GET') {
    return [varName + '.GET()', generator.ORDER_FUNCTION_CALL];
  }
  return [varName + '.' + method + '(String(' + data + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_http_get_string'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  seeedRpcWiFiEnsureHTTP(generator);
  return ['String(' + varName + '.getString())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_http_end'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'http');
  seeedRpcWiFiEnsureHTTP(generator);
  return varName + '.end();\n';
};

Arduino.forBlock['seeed_rpcwifi_webserver_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'WebServer', 'server', '_seeedRpcWiFiWebServerVarMonitor');
  const port = block.getFieldValue('PORT') || '80';
  seeedRpcWiFiEnsureWebServer(generator);
  generator.addObject(varName, 'WebServer ' + varName + '(' + port + ');');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_webserver_begin'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'server');
  seeedRpcWiFiEnsureWebServer(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['seeed_rpcwifi_webserver_on'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'server');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const method = block.getFieldValue('METHOD') || 'HTTP_GET';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'seeedRpcWiFiHandle_' + seeedRpcWiFiSanitizeName(varName, 'server') + '_' + seeedRpcWiFiSanitizeName(path, 'root') + '_' + method.toLowerCase();
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';

  seeedRpcWiFiEnsureWebServer(generator);
  generator.addFunction(callbackName, functionDef);

  let code = '';
  if (method === 'HTTP_ANY') {
    code = varName + '.on(' + path + ', ' + callbackName + ');\n';
  } else {
    code = varName + '.on(' + path + ', ' + method + ', ' + callbackName + ');\n';
  }
  generator.addSetupEnd(code, code);
  return '';
};

Arduino.forBlock['seeed_rpcwifi_webserver_send'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'server');
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '200';
  const type = generator.valueToCode(block, 'TYPE', generator.ORDER_ATOMIC) || '"text/plain"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureWebServer(generator);
  return varName + '.send(' + code + ', String(' + type + '), String(' + content + '));\n';
};

Arduino.forBlock['seeed_rpcwifi_webserver_handle_client'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'server');
  seeedRpcWiFiEnsureWebServer(generator);
  return varName + '.handleClient();\n';
};

Arduino.forBlock['seeed_rpcwifi_dns_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'DNSServer', 'dns', '_seeedRpcWiFiDnsVarMonitor');
  seeedRpcWiFiEnsureDNS(generator);
  generator.addObject(varName, 'DNSServer ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_dns_start'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'dns');
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '53';
  const domain = generator.valueToCode(block, 'DOMAIN', generator.ORDER_ATOMIC) || '"*"';
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '"192.168.1.1"';
  seeedRpcWiFiEnsureDNS(generator);
  seeedRpcWiFiAddParseIP(generator);
  return varName + '.start(' + port + ', String(' + domain + '), seeedRpcWiFiParseIP(String(' + ip + ')));\n';
};

Arduino.forBlock['seeed_rpcwifi_dns_start_captive'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'dns');
  seeedRpcWiFiEnsureDNS(generator);
  return varName + '.start(53, "*", WiFi.softAPIP());\n';
};

Arduino.forBlock['seeed_rpcwifi_dns_process'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'dns');
  seeedRpcWiFiEnsureDNS(generator);
  return varName + '.processNextRequest();\n';
};

Arduino.forBlock['seeed_rpcwifi_mdns_begin'] = function(block, generator) {
  const hostname = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '"WioTerminal"';
  seeedRpcWiFiEnsureMDNS(generator);
  ensureSerialBegin('Serial', generator);
  let code = 'if (!MDNS.begin(String(' + hostname + ').c_str())) {\n';
  code += '  Serial.println("Error starting mDNS");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['seeed_rpcwifi_mdns_add_service'] = function(block, generator) {
  const service = generator.valueToCode(block, 'SERVICE', generator.ORDER_ATOMIC) || '"http"';
  const proto = block.getFieldValue('PROTO') || 'tcp';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  seeedRpcWiFiEnsureMDNS(generator);
  return 'MDNS.addService(String(' + service + ').c_str(), "' + proto + '", ' + port + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_mdns_query_host'] = function(block, generator) {
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '"WioTerminal"';
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '2000';
  seeedRpcWiFiEnsureMDNS(generator);
  return ['MDNS.queryHost(String(' + host + ').c_str(), ' + timeout + ').toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_mdns_query_service'] = function(block, generator) {
  const service = generator.valueToCode(block, 'SERVICE', generator.ORDER_ATOMIC) || '"http"';
  const proto = block.getFieldValue('PROTO') || 'tcp';
  seeedRpcWiFiEnsureMDNS(generator);
  return ['MDNS.queryService(String(' + service + ').c_str(), "' + proto + '")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_create'] = function(block, generator) {
  const varName = seeedRpcWiFiAttachVarMonitor(block, 'WiFiManager', 'wm', '_seeedRpcWiFiManagerVarMonitor');
  seeedRpcWiFiEnsureWiFiManager(generator);
  generator.addObject(varName, 'WiFiManager ' + varName + ';');
  return '';
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_auto_connect'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wm');
  const apName = generator.valueToCode(block, 'AP_NAME', generator.ORDER_ATOMIC) || '"AutoConnectAP"';
  const apPassword = generator.valueToCode(block, 'AP_PASSWORD', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureWiFiManager(generator);
  return [varName + '.autoConnect(String(' + apName + ').c_str(), String(' + apPassword + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_start_portal'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wm');
  const apName = generator.valueToCode(block, 'AP_NAME', generator.ORDER_ATOMIC) || '"ConfigPortal"';
  const apPassword = generator.valueToCode(block, 'AP_PASSWORD', generator.ORDER_ATOMIC) || '""';
  seeedRpcWiFiEnsureWiFiManager(generator);
  return [varName + '.startConfigPortal(String(' + apName + ').c_str(), String(' + apPassword + ').c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_reset'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wm');
  seeedRpcWiFiEnsureWiFiManager(generator);
  return varName + '.resetSettings();\n';
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_set_timeout'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wm');
  const type = block.getFieldValue('TYPE') || 'CONFIG';
  const seconds = generator.valueToCode(block, 'SECONDS', generator.ORDER_ATOMIC) || '120';
  seeedRpcWiFiEnsureWiFiManager(generator);
  if (type === 'CONNECT') {
    return varName + '.setConnectTimeout(' + seconds + ');\n';
  }
  return varName + '.setConfigPortalTimeout(' + seconds + ');\n';
};

Arduino.forBlock['seeed_rpcwifi_wifimanager_get_info'] = function(block, generator) {
  const varName = seeedRpcWiFiGetVar(block, 'VAR', 'wm');
  const info = block.getFieldValue('INFO') || 'SSID';
  seeedRpcWiFiEnsureWiFiManager(generator);
  if (info === 'PORTAL_SSID') {
    return [varName + '.getConfigPortalSSID()', generator.ORDER_FUNCTION_CALL];
  }
  if (info === 'PASSWORD') {
    return [varName + '.getPassword()', generator.ORDER_FUNCTION_CALL];
  }
  return [varName + '.getSSID()', generator.ORDER_FUNCTION_CALL];
};
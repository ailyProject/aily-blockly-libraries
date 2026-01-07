// WiFiS3 Blockly Generator
// 全局WiFi对象无需创建，直接使用WiFi全局变量

Arduino.forBlock['wifis3_begin'] = function(block, generator) {
  // 参数提取
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const pass = generator.valueToCode(block, 'PASS', generator.ORDER_ATOMIC) || '""';

  // 添加必要库
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  // 确保Serial初始化（用于调试输出）
  ensureSerialBegin('Serial', generator);

  // 生成代码
  let code = 'int wifi_status = WiFi.begin(' + ssid + ', ' + pass + ');\n';
  code += 'while (wifi_status != WL_CONNECTED) {\n';
  code += '  Serial.println("Connecting to WiFi...");\n';
  code += '  delay(1000);\n';
  code += '  wifi_status = WiFi.status();\n';
  code += '}\n';
  code += 'Serial.println("WiFi Connected!");\n';

  return code;
};

Arduino.forBlock['wifis3_begin_open'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  ensureSerialBegin('Serial', generator);

  let code = 'int wifi_status = WiFi.begin(' + ssid + ');\n';
  code += 'while (wifi_status != WL_CONNECTED) {\n';
  code += '  Serial.println("Connecting to WiFi...");\n';
  code += '  delay(1000);\n';
  code += '  wifi_status = WiFi.status();\n';
  code += '}\n';
  code += 'Serial.println("WiFi Connected!");\n';

  return code;
};

Arduino.forBlock['wifis3_begin_ap'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const pass = generator.valueToCode(block, 'PASS', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';

  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  ensureSerialBegin('Serial', generator);

  let code = 'uint8_t ap_status = WiFi.beginAP(' + ssid + ', ' + pass + ', ' + channel + ');\n';
  code += 'if (ap_status == 1) {\n';
  code += '  Serial.println("WiFi AP Started!");\n';
  code += '} else {\n';
  code += '  Serial.println("WiFi AP Failed!");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['wifis3_disconnect'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  return 'WiFi.disconnect();\n';
};

Arduino.forBlock['wifis3_status'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  return ['WiFi.status()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_is_connected'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  return ['(WiFi.status() == WL_CONNECTED)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_local_ip'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  // 创建辅助函数将IPAddress转换为字符串
  const funcCode = `String ipToString(IPAddress ip) {
  return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}`;
  
  generator.addFunction('ipToString_func', funcCode);
  return ['ipToString(WiFi.localIP())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_mac_address'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  const funcCode = `String macToString() {
  uint8_t mac[6];
  WiFi.macAddress(mac);
  String result = "";
  for (int i = 0; i < 6; i++) {
    if (mac[i] < 16) result += "0";
    result += String(mac[i], HEX);
    if (i < 5) result += ":";
  }
  return result;
}`;
  
  generator.addFunction('macToString_func', funcCode);
  return ['macToString()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_gateway_ip'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  const funcCode = `String ipToString(IPAddress ip) {
  return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}`;
  
  generator.addFunction('ipToString_func', funcCode);
  return ['ipToString(WiFi.gatewayIP())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_subnet_mask'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  const funcCode = `String ipToString(IPAddress ip) {
  return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}`;
  
  generator.addFunction('ipToString_func', funcCode);
  return ['ipToString(WiFi.subnetMask())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_dns_ip'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const dnsIndex = block.getFieldValue('DNS_INDEX') || '0';
  
  const funcCode = `String ipToString(IPAddress ip) {
  return String(ip[0]) + "." + String(ip[1]) + "." + String(ip[2]) + "." + String(ip[3]);
}`;
  
  generator.addFunction('ipToString_func', funcCode);
  return ['ipToString(WiFi.dnsIP(' + dnsIndex + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_set_dns'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const dns1 = generator.valueToCode(block, 'DNS1', generator.ORDER_ATOMIC) || '""';
  const dns2 = generator.valueToCode(block, 'DNS2', generator.ORDER_ATOMIC) || '""';
  
  return 'WiFi.setDNS(' + dns1 + ', ' + dns2 + ');\n';
};

Arduino.forBlock['wifis3_config_ip'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '""';
  const gw = generator.valueToCode(block, 'GW', generator.ORDER_ATOMIC) || '""';
  const subnet = generator.valueToCode(block, 'SUBNET', generator.ORDER_ATOMIC) || '""';
  
  // 添加字符串转IPAddress的辅助函数
  const funcCode = `IPAddress stringToIP(String ipStr) {
  IPAddress ip;
  ip.fromString(ipStr);
  return ip;
}`;
  generator.addFunction('stringToIP_func', funcCode);
  
  return 'WiFi.config(stringToIP(' + ip + '), stringToIP(' + gw + '), stringToIP(' + subnet + '));\n';
};

Arduino.forBlock['wifis3_set_hostname'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const hostname = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '""';
  
  return 'WiFi.setHostname(' + hostname + ');\n';
};

Arduino.forBlock['wifis3_scan_networks'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  ensureSerialBegin('Serial', generator);
  
  let code = 'Serial.println("Scanning WiFi networks...");\n';
  code += 'int networksFound = WiFi.scanNetworks();\n';
  code += 'Serial.print("Networks found: ");\n';
  code += 'Serial.println(networksFound);\n';
  
  return code;
};

Arduino.forBlock['wifis3_ssid_by_index'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  return ['WiFi.SSID(' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_rssi_by_index'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  return ['WiFi.RSSI(' + index + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_scanned_networks_count'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  return ['WiFi.scanNetworks()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_ping'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const ttl = generator.valueToCode(block, 'TTL', generator.ORDER_ATOMIC) || '128';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';
  
  return ['WiFi.ping(' + host + ', ' + ttl + ', ' + count + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_firmware_version'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  
  return ['WiFi.firmwareVersion()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wifis3_wait_for_connection'] = function(block, generator) {
  generator.addLibrary('WiFiS3', '#include <WiFiS3.h>');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '30000';
  
  let code = 'unsigned long startTime = millis();\n';
  code += 'while (WiFi.status() != WL_CONNECTED && (millis() - startTime) < ' + timeout + ') {\n';
  code += '  Serial.println("Waiting for WiFi connection...");\n';
  code += '  delay(500);\n';
  code += '}\n';
  code += 'if (WiFi.status() == WL_CONNECTED) {\n';
  code += '  Serial.println("WiFi connected!");\n';
  code += '} else {\n';
  code += '  Serial.println("WiFi connection timeout!");\n';
  code += '}\n';
  
  return code;
};

// ============ 辅助函数 ============

/**
 * 确保Serial.begin被调用
 */
function ensureSerialBegin(port, generator) {
  if (!generator._serialInitialized) {
    generator._serialInitialized = true;
    generator.addSetupStart('Serial.begin(9600);', 'serial_begin');
  }
}

'use strict';

// 智能板卡适配函数
function ensureWiFiLib(generator) {
  // 获取开发板配置
  const boardConfig = window['boardConfig'];

  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    // ESP32系列开发板
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    // Arduino UNO R4 WiFi
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    // 默认使用ESP32的库
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// WiFi连接块
Arduino.forBlock['esp32_wifi_begin'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.begin(' + ssid + ', ' + password + ');\n';
  
  return code;
};

// WiFi高级连接块
Arduino.forBlock['esp32_wifi_begin_advanced'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const bssid = generator.valueToCode(block, 'BSSID', generator.ORDER_ATOMIC) || 'NULL';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.begin(' + ssid + ', ' + password + ', ' + channel + ', ' + bssid + ');\n';
  
  return code;
};

// WiFi断开连接块
Arduino.forBlock['esp32_wifi_disconnect'] = function(block, generator) {
  const eraseAp = block.getFieldValue('ERASE_AP') === 'TRUE';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.disconnect(' + (eraseAp ? 'true' : 'false') + ');\n';
  
  return code;
};

// WiFi状态块
Arduino.forBlock['esp32_wifi_status'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.status()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_wifi_status_type'] = function(block, generator) {
  const status = block.getFieldValue('STATUS');
  
  let code = status;
  
  return [code, generator.ORDER_ATOMIC];
}

// WiFi连接状态块
Arduino.forBlock['esp32_wifi_is_connected'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.isConnected()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 本机IP地址块
Arduino.forBlock['esp32_wifi_local_ip'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.localIP().toString()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// MAC地址块
Arduino.forBlock['esp32_wifi_mac_address'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.macAddress()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 信号强度块
Arduino.forBlock['esp32_wifi_rssi'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.RSSI()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 当前WiFi名称块
Arduino.forBlock['esp32_wifi_ssid'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.SSID()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 扫描WiFi网络块
Arduino.forBlock['esp32_wifi_scan_networks'] = function(block, generator) {
  const async = block.getFieldValue('ASYNC') === 'TRUE';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.scanNetworks(' + (async ? 'true' : 'false') + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取网络SSID块
Arduino.forBlock['esp32_wifi_get_ssid'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.SSID(' + index + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取网络信号强度块
Arduino.forBlock['esp32_wifi_get_rssi'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.RSSI(' + index + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取网络加密类型块
Arduino.forBlock['esp32_wifi_get_encryption_type'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.encryptionType(' + index + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_wifi_encryption_type'] = function(block, generator) {
  const type = block.getFieldValue('TYPE');
  
  let code = type;
  
  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['esp32_wifi_scan_complete'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.scanComplete()';

  return [code, generator.ORDER_FUNCTION_CALL];
}

Arduino.forBlock['esp32_wifi_scan_delete'] = function(block, generator) {
  ensureWiFiLib(generator);

  let code = 'WiFi.scanDelete();\n';

  return code;
}

// 创建WiFi热点块
Arduino.forBlock['esp32_wifi_softap'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.softAP(' + ssid + ', ' + password + ', ' + channel + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

// 配置热点IP块
Arduino.forBlock['esp32_wifi_softap_config'] = function(block, generator) {
  // 从field_input获取IP地址字符串
  const ipStr = block.getFieldValue('IP') || '192.168.4.1';
  const gatewayStr = block.getFieldValue('GATEWAY') || '192.168.4.1';
  const subnetStr = block.getFieldValue('SUBNET') || '255.255.255.0';
  
  // 将IP字符串转换为IPAddress格式
  const ipParts = ipStr.split('.').map(part => parseInt(part) || 0);
  const gatewayParts = gatewayStr.split('.').map(part => parseInt(part) || 0);
  const subnetParts = subnetStr.split('.').map(part => parseInt(part) || 0);
  
  // 确保每个部分都在0-255范围内
  const validateIP = (parts) => parts.map(p => Math.min(255, Math.max(0, p)));
  
  const ip = `IPAddress(${validateIP(ipParts).join(', ')})`;
  const gateway = `IPAddress(${validateIP(gatewayParts).join(', ')})`;
  const subnet = `IPAddress(${validateIP(subnetParts).join(', ')})`;
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.softAPConfig(' + ip + ', ' + gateway + ', ' + subnet + ');\n';
  
  return code;
};

// 关闭WiFi热点块
Arduino.forBlock['esp32_wifi_softap_disconnect'] = function(block, generator) {
  const wifiOff = block.getFieldValue('WIFI_OFF') === 'TRUE';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.softAPdisconnect(' + (wifiOff ? 'true' : 'false') + ');\n';
  
  return code;
};

// 热点连接设备数块
Arduino.forBlock['esp32_wifi_softap_station_count'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.softAPgetStationNum()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 热点IP地址块
Arduino.forBlock['esp32_wifi_softap_ip'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.softAPIP().toString()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 设置WiFi模式块
Arduino.forBlock['esp32_wifi_set_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.mode(' + mode + ');\n';

  return code;
};

// 获取WiFi模式块
Arduino.forBlock['esp32_wifi_get_mode'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.getMode()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_wifi_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  
  let code = mode;
  
  return [code, generator.ORDER_ATOMIC];
}

// 设置自动重连块
Arduino.forBlock['esp32_wifi_set_auto_reconnect'] = function(block, generator) {
  const autoReconnect = block.getFieldValue('AUTO_RECONNECT') === 'TRUE';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.setAutoReconnect(' + (autoReconnect ? 'true' : 'false') + ');\n';
  
  return code;
};

// 等待连接结果块
Arduino.forBlock['esp32_wifi_wait_for_connect_result'] = function(block, generator) {
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '60000';
  
  ensureWiFiLib(generator);
  
  let code = 'WiFi.waitForConnectResult(' + timeout + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_wifi_smartconfig_start'] = function(block, generator) {
  ensureWiFiLib(generator);

  let code = 'WiFi.beginSmartConfig();\n';
  
  return code;
}

Arduino.forBlock['esp32_wifi_smartconfig_stop'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.stopSmartConfig();\n';
  
  return code;
}

Arduino.forBlock['esp32_wifi_smartconfig_done'] = function(block, generator) {
  ensureWiFiLib(generator);
  
  let code = 'WiFi.smartConfigDone()';

  return [code, generator.ORDER_FUNCTION_CALL];
};
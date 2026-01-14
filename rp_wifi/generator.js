'use strict';

// 确保WiFi库引用（针对RP2040/Pico W）
function ensureRPWiFiLib(generator) {
  generator.addLibrary('WiFi', '#include <WiFi.h>');
}

// 将IP字符串转换为IPAddress格式的辅助函数
function ipStringToIPAddress(ipStr) {
  const parts = ipStr.split('.').map(part => parseInt(part) || 0);
  const validated = parts.map(p => Math.min(255, Math.max(0, p)));
  return `IPAddress(${validated.join(', ')})`;
}

// WiFi连接块（阻塞模式）
Arduino.forBlock['rp_wifi_begin'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.begin(' + ssid + ', ' + password + ');\n';
};

// WiFi连接开放网络块
Arduino.forBlock['rp_wifi_begin_open'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.begin(' + ssid + ');\n';
};

// WiFi连接块（非阻塞模式）
Arduino.forBlock['rp_wifi_begin_noblock'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.beginNoBlock(' + ssid + ', ' + password + ');\n';
};

// WiFi断开连接块
Arduino.forBlock['rp_wifi_disconnect'] = function(block, generator) {
  const wifiOff = block.getFieldValue('WIFI_OFF') === 'TRUE';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.disconnect(' + (wifiOff ? 'true' : 'false') + ');\n';
};

// 关闭WiFi块
Arduino.forBlock['rp_wifi_end'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return 'WiFi.end();\n';
};

// WiFi已连接状态块
Arduino.forBlock['rp_wifi_connected'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.connected()', generator.ORDER_FUNCTION_CALL];
};

// WiFi状态码块
Arduino.forBlock['rp_wifi_status'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.status()', generator.ORDER_FUNCTION_CALL];
};

// WiFi状态常量块
Arduino.forBlock['rp_wifi_status_type'] = function(block, generator) {
  const status = block.getFieldValue('STATUS');
  
  return [status, generator.ORDER_ATOMIC];
};

// 等待连接结果块
Arduino.forBlock['rp_wifi_wait_for_connect'] = function(block, generator) {
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '60000';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.waitForConnectResult(' + timeout + ')', generator.ORDER_FUNCTION_CALL];
};

// 本机IP地址块
Arduino.forBlock['rp_wifi_local_ip'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.localIP().toString()', generator.ORDER_FUNCTION_CALL];
};

// 子网掩码块
Arduino.forBlock['rp_wifi_subnet_mask'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.subnetMask().toString()', generator.ORDER_FUNCTION_CALL];
};

// 网关IP地址块
Arduino.forBlock['rp_wifi_gateway_ip'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.gatewayIP().toString()', generator.ORDER_FUNCTION_CALL];
};

// DNS服务器IP块
Arduino.forBlock['rp_wifi_dns_ip'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.dnsIP().toString()', generator.ORDER_FUNCTION_CALL];
};

// MAC地址块
Arduino.forBlock['rp_wifi_mac_address'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.macAddress()', generator.ORDER_FUNCTION_CALL];
};

// 当前WiFi SSID块
Arduino.forBlock['rp_wifi_ssid'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.SSID()', generator.ORDER_FUNCTION_CALL];
};

// 信号强度块
Arduino.forBlock['rp_wifi_rssi'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.RSSI()', generator.ORDER_FUNCTION_CALL];
};

// 当前WiFi通道块
Arduino.forBlock['rp_wifi_channel'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.channel()', generator.ORDER_FUNCTION_CALL];
};

// 当前加密类型块
Arduino.forBlock['rp_wifi_encryption_type'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.encryptionType()', generator.ORDER_FUNCTION_CALL];
};

// 设置主机名块
Arduino.forBlock['rp_wifi_set_hostname'] = function(block, generator) {
  const hostname = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '"pico"';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.setHostname(' + hostname + ');\n';
};

// 获取主机名块
Arduino.forBlock['rp_wifi_get_hostname'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.getHostname()', generator.ORDER_FUNCTION_CALL];
};

// 配置静态IP块
Arduino.forBlock['rp_wifi_config_static'] = function(block, generator) {
  const localIpStr = block.getFieldValue('LOCAL_IP') || '192.168.1.100';
  const dnsStr = block.getFieldValue('DNS') || '192.168.1.1';
  const gatewayStr = block.getFieldValue('GATEWAY') || '192.168.1.1';
  const subnetStr = block.getFieldValue('SUBNET') || '255.255.255.0';
  
  const localIp = ipStringToIPAddress(localIpStr);
  const dns = ipStringToIPAddress(dnsStr);
  const gateway = ipStringToIPAddress(gatewayStr);
  const subnet = ipStringToIPAddress(subnetStr);
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.config(' + localIp + ', ' + dns + ', ' + gateway + ', ' + subnet + ');\n';
};

// 设置DNS服务器块
Arduino.forBlock['rp_wifi_set_dns'] = function(block, generator) {
  const dns1Str = block.getFieldValue('DNS1') || '8.8.8.8';
  const dns1 = ipStringToIPAddress(dns1Str);
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.setDNS(' + dns1 + ');\n';
};

// 设置WiFi模式块
Arduino.forBlock['rp_wifi_set_mode'] = function(block, generator) {
  const mode = block.getFieldValue('MODE');
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.mode(' + mode + ');\n';
};

// 获取WiFi模式块
Arduino.forBlock['rp_wifi_get_mode'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.getMode()', generator.ORDER_FUNCTION_CALL];
};

// 扫描WiFi网络块
Arduino.forBlock['rp_wifi_scan_networks'] = function(block, generator) {
  const async = block.getFieldValue('ASYNC') === 'TRUE';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.scanNetworks(' + (async ? 'true' : 'false') + ')', generator.ORDER_FUNCTION_CALL];
};

// 扫描完成状态块
Arduino.forBlock['rp_wifi_scan_complete'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.scanComplete()', generator.ORDER_FUNCTION_CALL];
};

// 删除扫描结果块
Arduino.forBlock['rp_wifi_scan_delete'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return 'WiFi.scanDelete();\n';
};

// 获取网络SSID块
Arduino.forBlock['rp_wifi_get_ssid'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.SSID(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取网络信号强度块
Arduino.forBlock['rp_wifi_get_rssi'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.RSSI(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取网络加密类型块
Arduino.forBlock['rp_wifi_get_encryption'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.encryptionType(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取网络通道块
Arduino.forBlock['rp_wifi_get_channel'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.channel(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

// 加密类型常量块
Arduino.forBlock['rp_wifi_encryption_constant'] = function(block, generator) {
  const type = block.getFieldValue('TYPE');
  
  return [type, generator.ORDER_ATOMIC];
};

// 创建WiFi热点块（带密码）
Arduino.forBlock['rp_wifi_begin_ap'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"PicoW_AP"';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.beginAP(' + ssid + ', ' + password + ', ' + channel + ');\n';
};

// 创建开放WiFi热点块
Arduino.forBlock['rp_wifi_begin_ap_open'] = function(block, generator) {
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '"PicoW_AP"';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.beginAP(' + ssid + ', ' + channel + ');\n';
};

// 配置热点IP块
Arduino.forBlock['rp_wifi_softap_config'] = function(block, generator) {
  const ipStr = block.getFieldValue('IP') || '192.168.4.1';
  const gatewayStr = block.getFieldValue('GATEWAY') || '192.168.4.1';
  const subnetStr = block.getFieldValue('SUBNET') || '255.255.255.0';
  
  const ip = ipStringToIPAddress(ipStr);
  const gateway = ipStringToIPAddress(gatewayStr);
  const subnet = ipStringToIPAddress(subnetStr);
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.softAPConfig(' + ip + ', ' + gateway + ', ' + subnet + ');\n';
};

// 关闭WiFi热点块
Arduino.forBlock['rp_wifi_softap_disconnect'] = function(block, generator) {
  const wifiOff = block.getFieldValue('WIFI_OFF') === 'TRUE';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.softAPdisconnect(' + (wifiOff ? 'true' : 'false') + ');\n';
};

// 热点IP地址块
Arduino.forBlock['rp_wifi_softap_ip'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.softAPIP().toString()', generator.ORDER_FUNCTION_CALL];
};

// 热点MAC地址块
Arduino.forBlock['rp_wifi_softap_mac'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.softAPmacAddress()', generator.ORDER_FUNCTION_CALL];
};

// 热点SSID块
Arduino.forBlock['rp_wifi_softap_ssid'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.softAPSSID()', generator.ORDER_FUNCTION_CALL];
};

// 热点连接设备数块
Arduino.forBlock['rp_wifi_softap_station_count'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.softAPgetStationNum()', generator.ORDER_FUNCTION_CALL];
};

// 解析域名块
Arduino.forBlock['rp_wifi_host_by_name'] = function(block, generator) {
  const hostname = generator.valueToCode(block, 'HOSTNAME', generator.ORDER_ATOMIC) || '""';
  
  ensureRPWiFiLib(generator);
  
  // 使用辅助函数来解析域名
  const funcDef = `String resolveHostname(const char* hostname) {
  IPAddress ip;
  if (WiFi.hostByName(hostname, ip)) {
    return ip.toString();
  }
  return "";
}`;
  
  generator.addFunction('resolveHostname', funcDef);
  
  return ['resolveHostname(' + hostname + ')', generator.ORDER_FUNCTION_CALL];
};

// Ping块
Arduino.forBlock['rp_wifi_ping'] = function(block, generator) {
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const ttl = generator.valueToCode(block, 'TTL', generator.ORDER_ATOMIC) || '128';
  
  ensureRPWiFiLib(generator);
  
  return ['WiFi.ping(' + host + ', ' + ttl + ')', generator.ORDER_FUNCTION_CALL];
};

// 获取网络时间块
Arduino.forBlock['rp_wifi_get_time'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.getTime()', generator.ORDER_FUNCTION_CALL];
};

// 设置超时时间块
Arduino.forBlock['rp_wifi_set_timeout'] = function(block, generator) {
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '15000';
  
  ensureRPWiFiLib(generator);
  
  return 'WiFi.setTimeout(' + timeout + ');\n';
};

// 禁用低功耗模式块
Arduino.forBlock['rp_wifi_no_low_power'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return 'WiFi.noLowPowerMode();\n';
};

// 固件版本块
Arduino.forBlock['rp_wifi_firmware_version'] = function(block, generator) {
  ensureRPWiFiLib(generator);
  
  return ['WiFi.firmwareVersion()', generator.ORDER_FUNCTION_CALL];
};

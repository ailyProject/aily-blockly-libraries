// generator.js
'use strict';

// ----------- 工具函数，只添加一次库 -----------
function ensureWiFiLibrary(generator) {
  generator.addLibrary('WiFi', '#include <WiFiS3.h>');
}
function ensureRTCLibrary(generator) {
  generator.addLibrary('RTC', '#include <RTC.h>');
}

// 工具函数：将变量注册到 Blockly 变量系统中
function registerVariableToBlockly(varName, workspace) {
  try {
    if (!workspace) {
      workspace = Blockly.getMainWorkspace();
    }
    
    if (workspace && workspace.createVariable) {
      // 检查变量是否已存在
      const existingVar = workspace.getVariable(varName);
      if (!existingVar) {
        // 创建新变量
        workspace.createVariable(varName);
        console.log('Variable registered to Blockly:', varName);
      }
    }
  } catch (e) {
    console.log('Failed to register variable to Blockly:', varName, e.message);
  }
}

// 增强的 addVariable 函数，同时注册到 Blockly 变量系统
function addVariableAndRegister(generator, varKey, varDeclaration, varName, workspace) {
  // 添加到代码生成器
  generator.addVariable(varKey, varDeclaration);
  
  // 注册到 Blockly 变量系统
  if (varName) {
    registerVariableToBlockly(varName, workspace);
  }
}

// ----------- WiFiS3 基本功能 -----------
Arduino.forBlock['wifi_begin'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var ssid = block.getFieldValue('SSID') || 'your_ssid';
  var password = block.getFieldValue('PASSWORD') || 'your_password';

  // 添加全局变量声明并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'char ssid[]', 'char ssid[] = "' + ssid + '";', 'ssid');
  addVariableAndRegister(generator, 'char pswd[]', 'char pswd[] = "' + password + '";', 'pswd');

  return ['WiFi.begin(ssid, pswd)', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_begin_ap'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var ssid = block.getFieldValue('SSID') || 'your_ap_ssid';
  var password = block.getFieldValue('PASSWORD') || '';
  var channel = block.getFieldValue('CHANNEL') || '';

  // 添加 SSID 全局变量声明并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'char ap_ssid[]', 'char ap_ssid[] = "' + ssid + '";', 'ap_ssid');

  let code;
  
  // 检测参数并生成相应的调用
  if (password && channel) {
    // WiFi.beginAP(ssid, password, channel)
    addVariableAndRegister(generator, 'char ap_pswd[]', 'char ap_pswd[] = "' + password + '";', 'ap_pswd');
    addVariableAndRegister(generator, 'int ap_channel', 'int ap_channel = ' + channel + ';', 'ap_channel');
    code = 'WiFi.beginAP(ap_ssid, ap_pswd, ap_channel)';
  } else if (password) {
    // WiFi.beginAP(ssid, password)
    addVariableAndRegister(generator, 'char ap_pswd[]', 'char ap_pswd[] = "' + password + '";', 'ap_pswd');
    code = 'WiFi.beginAP(ap_ssid, ap_pswd)';
  } else if (channel) {
    // WiFi.beginAP(ssid, channel) - 注意：Arduino WiFi库通常不支持这种形式
    // 如果需要只设置channel而不设置password，通常需要空密码
    addVariableAndRegister(generator, 'int ap_channel', 'int ap_channel = ' + channel + ';', 'ap_channel');
    code = 'WiFi.beginAP(ap_ssid, "", ap_channel)';
  } else {
    // WiFi.beginAP(ssid)
    code = 'WiFi.beginAP(ap_ssid)';
  }
  
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_disconnect'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  return 'WiFi.disconnect();\n';
};

Arduino.forBlock['wifi_status'] = Arduino.forBlock['wifi_firmware_version'] =
  Arduino.forBlock['wifi_local_ip'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var caller = {
    'wifi_status': 'WiFi.status()',
    'wifi_firmware_version': 'WiFi.firmwareVersion()',
    'wifi_local_ip': 'WiFi.localIP()'
  }[block.type];
  return [caller, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_status_t'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var status = block.getFieldValue('STATUS');
  return [status, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['wifi_ssid'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  return ['WiFi.SSID()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_bssid'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('MAC');
  const mac = varField ? varField.getText() : 'bssid_array';
  
  // 将数组声明添加到全局变量部分并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'byte ' + mac + '[]', 'byte ' + mac + '[6];', mac);
  
  // 生成获取BSSID的代码 - 作为语句返回
  return 'WiFi.BSSID(' + mac + ');\n';
};

Arduino.forBlock['wifi_rssi'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  // var index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC);
  return ['WiFi.RSSI()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_channel'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';
  return ['WiFi.channel(' + index + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_encryption_type'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  // var index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC);
  return ['WiFi.encryptionType()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_config'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  // var ip = block.getFieldValue('IP') || '192.168.1.1';
  const ip = Arduino.valueToCode(block, 'IP', Arduino.ORDER_ATOMIC);

  // console.log('Setting WiFi IP:', ip);
  
  // 验证IP地址格式（IPv4）
  // function isValidIP(ip) {
  //   if (typeof ip !== 'string') return false;
    
  //   var parts = ip.split('.');
  //   if (parts.length !== 4) return false;
    
  //   for (var i = 0; i < parts.length; i++) {
  //     var part = parseInt(parts[i]);
  //     if (isNaN(part) || part < 0 || part > 255) {
  //       return false;
  //     }
  //     // 检查是否有前导零（除了单个0）
  //     if (parts[i] !== part.toString()) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }
  
  // // 如果IP格式无效，使用默认IP
  // if (!isValidIP(ip)) {
  //   ip = 'IPAddress(192.168.1.100)';
  // }
  
  // 将IP地址格式转换为Arduino的IPAddress格式
  // ip = 'IPAddress(' + ip.replace(/\./g, ',') + ')';
  let code = 'WiFi.config(' + ip + ');\n';
  return code;
};

Arduino.forBlock['wifi_mac_address'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('MAC');
  const mac = varField ? varField.getText() : 'mac_array';
  
  // 将数组声明添加到全局变量部分并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'byte ' + mac + '[]', 'byte ' + mac + '[6];', mac);
  
  // 生成获取MAC地址的代码 - 作为语句返回
  return 'WiFi.macAddress(' + mac + ');\n';
};

Arduino.forBlock['wifi_scan_networks'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  return ['WiFi.scanNetworks()', Arduino.ORDER_FUNCTION_CALL];
};

// ----------- WiFi Ping（合并智能路由） -----------
Arduino.forBlock['wifi_ping_new'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC);
  var ttl = generator.valueToCode(block, 'TTL', Arduino.ORDER_ATOMIC);
  var timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC);
  
  // 验证TTL和TIMEOUT必须是uint8_t类型（0-255）
  if (ttl && ttl !== '""' && ttl !== "''") {
    var ttlNum = parseInt(ttl.replace(/['"]/g, ''));
    if (isNaN(ttlNum) || ttlNum < 0 || ttlNum > 255) {
      ttl = null; // 如果不是有效的uint8_t范围，则忽略
    } else {
      ttl = Math.floor(ttlNum).toString(); // 确保是整数
    }
  }
  
  if (timeout && timeout !== '""' && timeout !== "''") {
    var timeoutNum = parseInt(timeout.replace(/['"]/g, ''));
    if (isNaN(timeoutNum) || timeoutNum < 0 || timeoutNum > 255) {
      timeout = null; // 如果不是有效的uint8_t范围，则忽略
    } else {
      timeout = Math.floor(timeoutNum).toString(); // 确保是整数
    }
  }
  
  // 构建参数列表，按顺序添加非空参数
  var params = [host];
  if (ttl) {
    params.push(ttl);
    if (timeout) {
      params.push(timeout);
    }
  }
  // 如果有TIMEOUT但没有TTL，则不保留TIMEOUT（按要求）
  
  return ['WiFi.ping(' + params.join(', ') + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_ping'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var mode = block.getFieldValue && block.getFieldValue('MODE');
  var ip = generator.valueToCode && generator.valueToCode(block, 'IP', Arduino.ORDER_ATOMIC);
  var host = generator.valueToCode && generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC);
  var ttl = generator.valueToCode && generator.valueToCode(block, 'TTL', Arduino.ORDER_ATOMIC);
  var timeout = generator.valueToCode && generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC);
  if (mode === 'IP') {
    return ['WiFi.ping(' + ip + ')', Arduino.ORDER_FUNCTION_CALL];
  } else if (mode === 'HOST') {
    return ['WiFi.ping(' + host + ', ' + ttl + ', ' + timeout + ')', Arduino.ORDER_FUNCTION_CALL];
  } else if (ip) {
    return ['WiFi.ping(' + ip + ')', Arduino.ORDER_FUNCTION_CALL];
  } else {
    return ['WiFi.ping()', Arduino.ORDER_FUNCTION_CALL];
  }
};

Arduino.forBlock['wifi_ping_host'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  var host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC);
  var ttl = generator.valueToCode(block, 'TTL', Arduino.ORDER_ATOMIC);
  var timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC);
  
  // 验证TTL和TIMEOUT必须是uint8_t类型（0-255）
  if (ttl && ttl !== '""' && ttl !== "''") {
    var ttlNum = parseInt(ttl.replace(/['"]/g, ''));
    if (isNaN(ttlNum) || ttlNum < 0 || ttlNum > 255) {
      ttl = '64'; // 默认TTL为64（uint8_t范围内）
    } else {
      ttl = Math.floor(ttlNum).toString(); // 确保是整数
    }
  } else {
    ttl = '64';
  }
  
  if (timeout && timeout !== '""' && timeout !== "''") {
    var timeoutNum = parseInt(timeout.replace(/['"]/g, ''));
    if (isNaN(timeoutNum) || timeoutNum < 0 || timeoutNum > 255) {
      timeout = '100'; // 默认超时100（uint8_t范围内，单位可能是100ms）
    } else {
      timeout = Math.floor(timeoutNum).toString(); // 确保是整数
    }
  } else {
    timeout = '100';
  }
  
  return ['WiFi.ping(' + host + ', ' + ttl + ', ' + timeout + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_get_time'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  return ['WiFi.getTime()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_ip_set'] = function(block, generator) {
  var ip = block.getFieldValue('IP') || '192.168.1.100';
  
  // 验证IP地址格式（IPv4）
  function isValidIP(ip) {
    if (typeof ip !== 'string') return false;
    
    var parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    for (var i = 0; i < parts.length; i++) {
      var part = parseInt(parts[i]);
      if (isNaN(part) || part < 0 || part > 255) {
        return false;
      }
      // 检查是否有前导零（除了单个0）
      if (parts[i] !== part.toString()) {
        return false;
      }
    }
    return true;
  }
  
  // 如果IP格式无效，使用默认IP
  if (!isValidIP(ip)) {
    ip = '192.168.1.100';
  }
  
  // 将IP地址格式转换为Arduino的IPAddress格式
  return ['IPAddress(' + ip.replace(/\./g, ',') + ')', Arduino.ORDER_FUNCTION_CALL];
};
// ----------- WiFiServer -----------
// Arduino.forBlock['wifi_server_create'] = function(block, generator) {
//   ensureWiFiLibrary(generator);
//   var port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
//   var serverName = block.getFieldValue('SERVER_NAME') || 'server';
//   generator.addVariable('WiFiServer ' + serverName, 'WiFiServer ' + serverName + '(' + port + ');');
//   return '';
// };

Arduino.forBlock['wifi_server_begin'] = function(block, generator) {
  // 监听SERVER输入值的变化，自动重命名Blockly变量
  if (!block._wifiServerVarMonitorAttached) {
    block._wifiServerVarMonitorAttached = true;
    block._wifiServerVarLastName = block.getFieldValue('SERVER') || 'server';
    const serverField = block.getField('SERVER');
    if (serverField && typeof serverField.setValidator === 'function') {
      serverField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wifiServerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WiFiServer');
          // const oldVar = workspace.getVariable(oldName, 'WiFiServer');
          // const existVar = workspace.getVariable(newName, 'WiFiServer');
          // if (oldVar && !existVar) {
          //   workspace.renameVariableById(oldVar.getId(), newName);
          //   if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          // }
          block._wifiServerVarLastName = newName;
        }
        return newName;
      });
    }
  }
  
  ensureWiFiLibrary(generator);
  var port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
  
  let serverName = block.getFieldValue('SERVER') || 'server';
  
  addVariableAndRegister(generator, 'WiFiServer ' + serverName, 'WiFiServer ' + serverName + '(' + port + ');', serverName);
  
  // 添加全局变量声明并注册到 Blockly 变量系统
  registerVariableToBlockly(serverName, 'WiFiServer');

  let code = serverName + '.begin();\n';
  return code;
};

Arduino.forBlock['wifi_server_available'] = function(block, generator) {
  // 监听CLIENT_NAME输入值的变化，自动重命名Blockly变量
  if (!block._wifiClientVarMonitorAttached) {
    block._wifiClientVarMonitorAttached = true;
    block._wifiClientVarLastName = block.getFieldValue('CLIENT_NAME') || 'client';
    const clientField = block.getField('CLIENT_NAME');
    if (clientField && typeof clientField.setValidator === 'function') {
      clientField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wifiClientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WiFiClient');
          // const oldVar = workspace.getVariable(oldName, 'WiFiClient');
          // const existVar = workspace.getVariable(newName, 'WiFiClient');
          // if (oldVar && !existVar) {
          //   workspace.renameVariableById(oldVar.getId(), newName);
          //   if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          // }
          block._wifiClientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 参考 BH1750 的变量获取方式
  const serverField = block.getField('SERVER_NAME');
  const serverName = serverField ? serverField.getText() : 'server';
  
  let clientName = block.getFieldValue('CLIENT_NAME') || 'client';

  registerVariableToBlockly(clientName, 'WiFiClient');
  
  let code = 'WiFiClient ' + clientName + ' = ' + serverName + '.available();\n';
  return code;
};

Arduino.forBlock['wifi_server_accept'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('SERVER_NAME');
  const serverName = varField ? varField.getText() : 'server';
  
  return [serverName + '.accept()', Arduino.ORDER_FUNCTION_CALL];
};

// ----------- WiFiClient -----------
// Arduino.forBlock['wifi_client_create'] = function(block, generator) {
//   ensureWiFiLibrary(generator);
//   var clientName = block.getFieldValue('CLIENT_NAME') || 'client';
//   var isSSL = block.getFieldValue && block.getFieldValue('SSL') === 'TRUE';
//   var clientType = isSSL ? 'WiFiSSLClient' : 'WiFiClient';
//   generator.addVariable(clientName, clientType + ' ' + clientName + ';');
//   return '';
// };

Arduino.forBlock['wifi_client_connect'] = function(block, generator) {
  // 监听CLIENT_NAME输入值的变化，自动重命名Blockly变量
  if (!block._wifiClientVarMonitorAttached) {
    block._wifiClientVarMonitorAttached = true;
    block._wifiClientVarLastName = block.getFieldValue('CLIENT_NAME') || 'client';
    const clientField = block.getField('CLIENT_NAME');
    if (clientField && typeof clientField.setValidator === 'function') {
      clientField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wifiClientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WiFiClient');
          block._wifiClientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureWiFiLibrary(generator);
  
  let clientName = block.getFieldValue('CLIENT_NAME') || 'client';
  
  var isSSL = block.getFieldValue && block.getFieldValue('SSL') === 'TRUE';
  var clientType = isSSL ? 'WiFiSSLClient' : 'WiFiClient';
  addVariableAndRegister(generator, clientName, clientType + ' ' + clientName + ';', clientName);

  registerVariableToBlockly(clientName, 'WiFiClient');

  var server = generator.valueToCode(block, 'SERVER', Arduino.ORDER_ATOMIC);
  var port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC);
  return [clientName + '.connect(' + server + ', ' + port + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_client_stop'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  let code = clientName + '.stop();\n';
  return code;
};

Arduino.forBlock['wifi_client_connected'] = Arduino.forBlock['wifi_client_available'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  var fn = block.type === 'wifi_client_connected' ? 'connected' : 'available';
  return [clientName + '.' + fn + '()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_client_read'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  return [clientName + '.read()', Arduino.ORDER_FUNCTION_CALL];
};


Arduino.forBlock['wifi_client_read_buffer'] = function(block, generator) {
  // 监听BUFFER输入值的变化，自动重命名Blockly变量
  if (!block._wifiBufferVarMonitorAttached) {
    block._wifiBufferVarMonitorAttached = true;
    block._wifiBufferVarLastName = block.getFieldValue('BUFFER') || 'buffer';
    const bufferField = block.getField('BUFFER');
    if (bufferField && typeof bufferField.setValidator === 'function') {
      bufferField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wifiBufferVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BUFFER');
          block._wifiBufferVarLastName = newName;
        }
        return newName;
      });
    }
  }
  // 参考 BH1750 的变量获取方式
  const clientField = block.getField('CLIENT_NAME');
  const clientName = clientField ? clientField.getText() : 'client';
  
  // const bufferField = block.getField('BUFFER');
  // const buffer = bufferField ? bufferField.getText() : 'buffer';
  let buffer = block.getFieldValue('BUFFER') || 'buffer';

  registerVariableToBlockly(buffer, 'BUFFER');
  
  var length = generator.valueToCode(block, 'LENGTH', Arduino.ORDER_ATOMIC);
  return [buffer && length ? clientName + '.read(' + buffer + ', ' + length + ')' : clientName + '.read()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_client_flush'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  let code = clientName + '.flush();\n';
  return code;
};

Arduino.forBlock['wifi_client_write'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  var data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  var length = generator.valueToCode(block, 'LENGTH', Arduino.ORDER_ATOMIC);
  return [length ? clientName + '.write(' + data + ', ' + length + ')' : clientName + '.write(' + data + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_client_print'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  var data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  let code = clientName + '.print(' + data + ');\n';
  return code;
};

Arduino.forBlock['wifi_client_println'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  var data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  let code = clientName + '.println(' + data + ');\n';
  return code;
};

Arduino.forBlock['wifi_client_read_string_until'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('CLIENT_NAME');
  const clientName = varField ? varField.getText() : 'client';
  
  var terminator = generator.valueToCode(block, 'TERMINATOR', Arduino.ORDER_ATOMIC);
  return [clientName + '.readStringUntil(' + terminator + ')', Arduino.ORDER_FUNCTION_CALL];
};

// ----------- WiFiUDP -----------
Arduino.forBlock['wifi_udp_create'] = function(block, generator) {
  ensureWiFiLibrary(generator);
  
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  addVariableAndRegister(generator, 'WiFiUDP ' + udpName, 'WiFiUDP ' + udpName + ';', udpName);
  return '';
};

Arduino.forBlock['wifi_udp_begin'] = function(block, generator) {
  // 监听UDP_NAME输入值的变化，自动重命名Blockly变量
  if (!block._wifiUdpVarMonitorAttached) {
    block._wifiUdpVarMonitorAttached = true;
    block._wifiUdpVarLastName = block.getFieldValue('UDP_NAME') || 'Udp';
    const udpField = block.getField('UDP_NAME');
    if (udpField && typeof udpField.setValidator === 'function') {
      udpField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wifiUdpVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WiFiUDP');
          // const oldVar = workspace.getVariable(oldName, 'WiFiUDP');
          // const existVar = workspace.getVariable(newName, 'WiFiUDP');
          // if (oldVar && !existVar) {
          //   workspace.renameVariableById(oldVar.getId(), newName);
          //   if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          // }
          block._wifiUdpVarLastName = newName;
        }
        return newName;
      });
    }
  }
  
  ensureWiFiLibrary(generator);
  
  // 参考 BH1750 的变量获取方式
  let udpName = block.getFieldValue('UDP_NAME') || 'Udp';

  registerVariableToBlockly(udpName, 'WiFiUDP');
  
  var port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC);
  
  addVariableAndRegister(generator, 'WiFiUDP ' + udpName, 'WiFiUDP ' + udpName + ';', udpName);
  
  let code = udpName + '.begin(' + port + ');\n';
  return code;
};

Arduino.forBlock['wifi_udp_begin_packet'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  var address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC);
  var port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC);
  let code = udpName + '.beginPacket(' + address + ', ' + port + ');\n';
  return code;
};

Arduino.forBlock['wifi_udp_write'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  var buffer = generator.valueToCode(block, 'BUFFER', Arduino.ORDER_ATOMIC);
  var size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC);
  let code = size ? udpName + '.write(' + buffer + ', ' + size + ');\n' : udpName + '.write(' + buffer + ');\n';
  return code;
};

Arduino.forBlock['wifi_udp_end_packet'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  let code = udpName + '.endPacket();\n';
  return code;
};

Arduino.forBlock['wifi_udp_parse_packet'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  return [udpName + '.parsePacket()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_udp_read'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const udpField = block.getField('UDP_NAME');
  const udpName = udpField ? udpField.getText() : 'Udp';
  
  const bufferField = block.getField('BUFFER');
  const buffer = bufferField ? bufferField.getText() : 'buffer';
  
  var size = generator.valueToCode(block, 'SIZE', Arduino.ORDER_ATOMIC) || '255';
  
  // 计算缓冲区大小 (size + 1)
  var bufferSize = parseInt(size.replace(/['"]/g, '')) || 255;
  var actualBufferSize = bufferSize + 1;
  
  // 创建全局缓冲区变量并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'char ' + buffer + '[]', 'char ' + buffer + '[' + actualBufferSize + '];', buffer);
  
  return [udpName + '.read(' + buffer + ', ' + size + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_udp_remote_ip'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  return [udpName + '.remoteIP()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifi_udp_remote_port'] = function(block, generator) {
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('UDP_NAME');
  const udpName = varField ? varField.getText() : 'Udp';
  
  return [udpName + '.remotePort()', Arduino.ORDER_FUNCTION_CALL];
};

// ----------- RTC -----------
Arduino.forBlock['rtc_begin'] = function(block, generator) {
  ensureRTCLibrary(generator);
  return 'RTC.begin();\n';
};

Arduino.forBlock['rtc_set_time'] = function(block, generator) {
  ensureRTCLibrary(generator);
  var time = generator.valueToCode(block, 'TIME', Arduino.ORDER_ATOMIC);
  
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('NAME');
  const name = varField ? varField.getText() : 'timeToSet';
  
  // 添加RTCTime变量声明并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'RTCTime ' + name, 'RTCTime ' + name + ';', name);
  
  let code = 'RTCTime ' +  name + ' = RTCTime(' + time + ');\nRTC.setTime(' + name + ');\n';
  return code;
};

Arduino.forBlock['rtc_get_time'] = function(block, generator) {
  ensureRTCLibrary(generator);
  
  // 参考 BH1750 的变量获取方式
  const varField = block.getField('NAME');
  const name = varField ? varField.getText() : 'currentTime';
  
  // 添加RTCTime变量声明并注册到 Blockly 变量系统
  addVariableAndRegister(generator, 'RTCTime ' + name, 'RTCTime ' + name + ';', name);
  
  let code = 'RTCTime ' + name + ';\nRTC.getTime(' + name + ');\n';
  return code;
};

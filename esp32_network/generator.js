// Network库代码生成器

// 确保NetworkClientSecure库被包含
function ensureNetworkClientSecureLib(generator) {
  generator.addLibrary('NetworkClientSecure', '#include <NetworkClientSecure.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// NetworkClient相关块
Arduino.forBlock['esp32_network_client_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._networkClientVarMonitorAttached) {
    block._networkClientVarMonitorAttached = true;
    block._networkClientVarLastName = block.getFieldValue('VAR') || 'client';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._networkClientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NetworkClient');
          block._networkClientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'client';
  
  // 添加库和变量
  generator.addLibrary('Network', '#include <Network.h>');
  registerVariableToBlockly(varName, 'NetworkClient');
  if (isBlockConnected(block)) {
    return 'NetworkClient ' + varName + ';';
  } else {
    generator.addObject(varName, 'NetworkClient ' + varName + ';');
  }
  
  return '';
};

// 创建NetworkClientSecure对象
Arduino.forBlock['esp32_networkclientsecure_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._networkclientsecureVarMonitorAttached) {
    block._networkclientsecureVarMonitorAttached = true;
    block._networkclientsecureVarLastName = block.getFieldValue('VAR') || 'client';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._networkclientsecureVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NetworkClientSecure');
          block._networkclientsecureVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'client';
  
  // 添加库和变量声明
  ensureNetworkClientSecureLib(generator);
  registerVariableToBlockly(varName, 'NetworkClientSecure');
  if (isBlockConnected(block)) {
    return 'NetworkClientSecure ' + varName + ';';
  } else {
    generator.addObject(varName, 'NetworkClientSecure ' + varName + ';');
  }
  
  return '';
};

// 设置不安全模式
Arduino.forBlock['esp32_networkclientsecure_set_insecure'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setInsecure();\n';
};

// 设置CA证书
Arduino.forBlock['esp32_networkclientsecure_set_ca_cert'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const caCert = generator.valueToCode(block, 'CA_CERT', generator.ORDER_ATOMIC) || '""';
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setCACert(' + caCert + '.c_str());\n';
};

// 设置客户端证书
Arduino.forBlock['esp32_networkclientsecure_set_certificate'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const cert = generator.valueToCode(block, 'CERT', generator.ORDER_ATOMIC) || '""';
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setCertificate(' + cert + '.c_str());\n';
};

// 设置私钥
Arduino.forBlock['esp32_networkclientsecure_set_private_key'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const privateKey = generator.valueToCode(block, 'PRIVATE_KEY', generator.ORDER_ATOMIC) || '""';
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setPrivateKey(' + privateKey + '.c_str());\n';
};

// 设置PSK认证
Arduino.forBlock['esp32_networkclientsecure_set_psk'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const pskIdent = generator.valueToCode(block, 'PSK_IDENT', generator.ORDER_ATOMIC) || '""';
  const pskKey = generator.valueToCode(block, 'PSK_KEY', generator.ORDER_ATOMIC) || '""';
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setPreSharedKey(' + pskIdent + '.c_str(), ' + pskKey + '.c_str());\n';
};

// 设置明文启动模式
Arduino.forBlock['esp32_networkclientsecure_set_plain_start'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setPlainStart();\n';
};

// 启动TLS升级
Arduino.forBlock['esp32_networkclientsecure_start_tls'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  
  ensureNetworkClientSecureLib(generator);
  
  const code = varName + '.startTLS()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 设置握手超时
Arduino.forBlock['esp32_networkclientsecure_set_handshake_timeout'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '120';
  
  ensureNetworkClientSecureLib(generator);
  
  return varName + '.setHandshakeTimeout(' + timeout + ');\n';
};

// 验证指纹
Arduino.forBlock['esp32_networkclientsecure_verify_fingerprint'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  const fingerprint = generator.valueToCode(block, 'FINGERPRINT', generator.ORDER_ATOMIC) || '""';
  const domain = generator.valueToCode(block, 'DOMAIN', generator.ORDER_ATOMIC) || '""';
  
  ensureNetworkClientSecureLib(generator);
  
  const code = varName + '.verify(' + fingerprint + '.c_str(), ' + domain + '.c_str())';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取对端证书指纹
Arduino.forBlock['esp32_networkclientsecure_get_peer_fingerprint'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  
  ensureNetworkClientSecureLib(generator);
  
  // 创建一个函数来获取指纹并转换为十六进制字符串
  const functionName = 'getPeerFingerprint_' + varName;
  const functionCode = `String ${functionName}() {
  uint8_t fingerprint[32];
  if (!${varName}.getFingerprintSHA256(fingerprint)) {
    return "";
  }
  String result = "";
  for (int i = 0; i < 32; i++) {
    if (fingerprint[i] < 16) result += "0";
    result += String(fingerprint[i], HEX);
    if (i < 31) result += " ";
  }
  return result;
}`;
  
  generator.addFunction(functionName, functionCode);
  
  const code = functionName + '()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 获取最后错误
Arduino.forBlock['esp32_networkclientsecure_last_error'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'client');
  
  ensureNetworkClientSecureLib(generator);
  
  // 创建一个函数来获取错误信息
  const functionName = 'getLastError_' + varName;
  const functionCode = `String ${functionName}() {
  char buf[256];
  int error = ${varName}.lastError(buf, sizeof(buf));
  if (error == 0) {
    return "No error";
  }
  return String(buf);
}`;
  
  generator.addFunction(functionName, functionCode);
  
  const code = functionName + '()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_client_connect_host'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '"example.com"';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.connect(' + host + ', ' + port + ');\n';
};

Arduino.forBlock['esp32_network_client_print'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '"Hello"';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.print(' + data + ');\n';
};

Arduino.forBlock['esp32_network_client_println'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '"Hello"';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.println(' + data + ');\n';
};

Arduino.forBlock['esp32_network_client_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_client_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';

  const type = block.getFieldValue('TYPE') || 'BYTE';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  let code = '';

  if (type === 'BYTE') {
    code = '(char)' + varName + '.read()';
  } else if (type === 'STRING') {
    code = varName + '.readString()';
  } else if (type === 'LINE') {
    code = varName + '.readStringUntil(\'\\n\')';
  } else {
    code = varName + '.read()';
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_client_connected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_client_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'client';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.stop();\n';
};

// NetworkServer相关块
Arduino.forBlock['esp32_network_server_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._networkServerVarMonitorAttached) {
    block._networkServerVarMonitorAttached = true;
    block._networkServerVarLastName = block.getFieldValue('VAR') || 'server';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._networkServerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NetworkServer');
          block._networkServerVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'server';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  const maxClients = generator.valueToCode(block, 'MAX_CLIENTS', generator.ORDER_ATOMIC) || '4';
  
  // 添加库和变量
  generator.addLibrary('Network', '#include <Network.h>');
  registerVariableToBlockly(varName, 'NetworkServer');
  generator.addObject(varName, 'NetworkServer ' + varName + '(' + port + ', ' + maxClients + ');');
  
  return '';
};

Arduino.forBlock['esp32_network_server_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'server';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.begin();\n';
};

Arduino.forBlock['esp32_network_server_accept'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._networkClientAcceptVarMonitorAttached) {
    block._networkClientAcceptVarMonitorAttached = true;
    block._networkClientAcceptVarLastName = block.getFieldValue('CLIENT_VAR') || 'client';
    const varField = block.getField('CLIENT_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._networkClientAcceptVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NetworkClient');
          block._networkClientAcceptVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'server';

  const clientVarName = block.getFieldValue('CLIENT_VAR') || 'client';
  
  // 注册客户端变量
  registerVariableToBlockly(clientVarName, 'NetworkClient');
  // generator.addObject(clientVarName, 'NetworkClient ' + clientVarName + ';');
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  let code = 'NetworkClient ' + clientVarName + ' = ' + varName + '.accept();\n';
  return code;
};

Arduino.forBlock['esp32_network_server_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'server';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.stop();\n';
};

// NetworkUDP相关块
Arduino.forBlock['esp32_network_udp_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._networkUdpVarMonitorAttached) {
    block._networkUdpVarMonitorAttached = true;
    block._networkUdpVarLastName = block.getFieldValue('VAR') || 'udp';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._networkUdpVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'NetworkUDP');
          block._networkUdpVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'udp';
  
  // 添加库和变量
  generator.addLibrary('Network', '#include <Network.h>');
  registerVariableToBlockly(varName, 'NetworkUDP');

  if (isBlockConnected(block)) {
    return 'NetworkUDP ' + varName + ';';
  } else {
    generator.addObject(varName, 'NetworkUDP ' + varName + ';');
  }

  return '';
};

Arduino.forBlock['esp32_network_udp_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '8888';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.begin(' + port + ');\n';
};

Arduino.forBlock['esp32_network_udp_begin_packet'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '"192.168.1.1"';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '8888';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.beginPacket(' + ip + ', ' + port + ');\n';
};

Arduino.forBlock['esp32_network_udp_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '"Hello"';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.print(' + data + ');\n';
};

Arduino.forBlock['esp32_network_udp_end_packet'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.endPacket();\n';
};

Arduino.forBlock['esp32_network_udp_parse_packet'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.parsePacket()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_udp_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_udp_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.readString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_udp_remote_ip'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.remoteIP().toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_udp_remote_port'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return [varName + '.remotePort()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_network_udp_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'udp';
  
  generator.addLibrary('Network', '#include <Network.h>');
  
  return varName + '.stop();\n';
};
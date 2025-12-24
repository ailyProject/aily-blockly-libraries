// ============================================
// eModbus Blockly Library - Code Generator
// ============================================

// 辅助函数：确保eModbus库引入
function ensureEmodbusLib(generator) {
  generator.addLibrary('eModbus_RTUutils', '#include "RTUutils.h"');
}

// 辅助函数：确保WiFi库引入
function ensureWiFiLib(generator) {
  generator.addLibrary('WiFi', '#include <WiFi.h>');
}

// ============================================
// RTU 客户端
// ============================================

// 创建Modbus RTU客户端
Arduino.forBlock['emodbus_rtu_client_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'mbClient';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (newName !== block._varLastName) {
          renameVariableInBlockly(block, block._varLastName, newName, 'ModbusClientRTU');
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'mbClient';
  const rtsPin = block.getFieldValue('RTS_PIN') || '-1';

  generator.addLibrary('eModbus_ClientRTU', '#include "ModbusClientRTU.h"');
  ensureEmodbusLib(generator);

  registerVariableToBlockly(varName, 'ModbusClientRTU');
  generator.addVariable(varName, 'ModbusClientRTU ' + varName + '(' + rtsPin + ');');

  return '';
};

// 启动RTU客户端
Arduino.forBlock['emodbus_rtu_client_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serial = block.getFieldValue('SERIAL') || 'Serial2';
  const baudrate = block.getFieldValue('BAUDRATE') || '9600';
  const rxPin = block.getFieldValue('RX_PIN') || '16';
  const txPin = block.getFieldValue('TX_PIN') || '17';

  generator.addLibrary('eModbus_ClientRTU', '#include "ModbusClientRTU.h"');
  ensureEmodbusLib(generator);

  let code = '';
  code += 'RTUutils::prepareHardwareSerial(' + serial + ');\n';
  code += serial + '.begin(' + baudrate + ', SERIAL_8N1, ' + rxPin + ', ' + txPin + ');\n';
  code += varName + '.begin(' + serial + ');\n';

  return code;
};

// ============================================
// TCP 客户端
// ============================================

// 创建Modbus TCP客户端
Arduino.forBlock['emodbus_tcp_client_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'mbTcpClient';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (newName !== block._varLastName) {
          renameVariableInBlockly(block, block._varLastName, newName, 'ModbusClientTCP');
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'mbTcpClient';

  generator.addLibrary('eModbus_ClientTCP', '#include "ModbusClientTCP.h"');
  ensureWiFiLib(generator);

  registerVariableToBlockly(varName, 'ModbusClientTCP');
  generator.addVariable('_wifiClient_' + varName, 'WiFiClient _wifiClient_' + varName + ';');
  generator.addVariable(varName, 'ModbusClientTCP ' + varName + '(_wifiClient_' + varName + ');');

  return '';
};

// 启动TCP客户端
Arduino.forBlock['emodbus_tcp_client_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbTcpClient';

  generator.addLibrary('eModbus_ClientTCP', '#include "ModbusClientTCP.h"');

  return varName + '.begin();\n';
};

// 设置TCP客户端目标
Arduino.forBlock['emodbus_tcp_client_set_target'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbTcpClient';
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC) || '"192.168.1.1"';
  const port = block.getFieldValue('PORT') || '502';

  generator.addLibrary('eModbus_ClientTCP', '#include "ModbusClientTCP.h"');

  // 添加IP解析辅助函数
  let parseIPFunc = '';
  parseIPFunc += 'IPAddress _parseIP(const char* ipStr) {\n';
  parseIPFunc += '  IPAddress ip;\n';
  parseIPFunc += '  ip.fromString(ipStr);\n';
  parseIPFunc += '  return ip;\n';
  parseIPFunc += '}\n';
  generator.addFunction('_parseIP', parseIPFunc);

  return varName + '.setTarget(_parseIP(' + ip + '), ' + port + ');\n';
};

// ============================================
// 通用客户端设置
// ============================================

// 设置超时时间
Arduino.forBlock['emodbus_client_set_timeout'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const timeout = block.getFieldValue('TIMEOUT') || '2000';

  return varName + '.setTimeout(' + timeout + ');\n';
};

// 数据回调
Arduino.forBlock['emodbus_client_on_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_emodbus_onData_' + varName;

  // 添加响应消息全局变量
  generator.addVariable('_emodbus_response_' + varName, 'ModbusMessage _emodbus_response_' + varName + ';');
  generator.addVariable('_emodbus_token_' + varName, 'uint32_t _emodbus_token_' + varName + ' = 0;');

  let functionDef = '';
  functionDef += 'void ' + callbackName + '(ModbusMessage response, uint32_t token) {\n';
  functionDef += '  _emodbus_response_' + varName + ' = response;\n';
  functionDef += '  _emodbus_token_' + varName + ' = token;\n';
  functionDef += handlerCode;
  functionDef += '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(callbackName + '_setup', varName + '.onDataHandler(&' + callbackName + ');');

  return '';
};

// 错误回调
Arduino.forBlock['emodbus_client_on_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = '_emodbus_onError_' + varName;

  // 添加错误信息全局变量
  generator.addVariable('_emodbus_error_' + varName, 'Modbus::Error _emodbus_error_' + varName + ' = Modbus::SUCCESS;');

  let functionDef = '';
  functionDef += 'void ' + callbackName + '(Modbus::Error error, uint32_t token) {\n';
  functionDef += '  _emodbus_error_' + varName + ' = error;\n';
  functionDef += '  ModbusError me(error);\n';
  functionDef += handlerCode;
  functionDef += '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(callbackName + '_setup', varName + '.onErrorHandler(&' + callbackName + ');');

  return '';
};

// ============================================
// 异步读取操作
// ============================================

// 读取保持寄存器
Arduino.forBlock['emodbus_read_holding_registers'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';

  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', READ_HOLD_REGISTER, ' + address + ', ' + count + ');\n';
};

// 读取输入寄存器
Arduino.forBlock['emodbus_read_input_registers'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';

  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', READ_INPUT_REGISTER, ' + address + ', ' + count + ');\n';
};

// 读取线圈
Arduino.forBlock['emodbus_read_coils'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';

  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', READ_COIL, ' + address + ', ' + count + ');\n';
};

// 读取离散输入
Arduino.forBlock['emodbus_read_discrete_inputs'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';

  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', READ_DISCR_INPUT, ' + address + ', ' + count + ');\n';
};

// ============================================
// 写入操作
// ============================================

// 写入单个寄存器
Arduino.forBlock['emodbus_write_single_register'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', WRITE_HOLD_REGISTER, ' + address + ', (uint16_t)' + value + ');\n';
};

// 写入单个线圈
Arduino.forBlock['emodbus_write_single_coil'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  // 线圈值需要转换为0x0000或0xFF00
  return varName + '.addRequest((uint32_t)millis(), ' + serverId + ', WRITE_COIL, ' + address + ', (uint16_t)((' + value + ') ? 0xFF00 : 0x0000));\n';
};

// 写入多个寄存器
Arduino.forBlock['emodbus_write_multiple_registers'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const values = generator.valueToCode(block, 'VALUES', generator.ORDER_ATOMIC) || '{}';

  // 添加写入多寄存器的辅助函数
  let writeMultiFunc = '';
  writeMultiFunc += 'void _emodbus_writeMultiRegs(ModbusClient& client, uint8_t serverId, uint16_t addr, std::vector<int>& vals) {\n';
  writeMultiFunc += '  ModbusMessage msg;\n';
  writeMultiFunc += '  msg.add(serverId, WRITE_MULT_REGISTERS, addr, (uint16_t)vals.size(), (uint8_t)(vals.size() * 2));\n';
  writeMultiFunc += '  for (auto v : vals) {\n';
  writeMultiFunc += '    msg.add((uint16_t)v);\n';
  writeMultiFunc += '  }\n';
  writeMultiFunc += '  client.addRequest(msg, (uint32_t)millis());\n';
  writeMultiFunc += '}\n';
  generator.addFunction('_emodbus_writeMultiRegs', writeMultiFunc);

  return '_emodbus_writeMultiRegs(' + varName + ', ' + serverId + ', ' + address + ', ' + values + ');\n';
};

// ============================================
// 同步读取操作
// ============================================

// 同步读取保持寄存器
Arduino.forBlock['emodbus_sync_read_holding_registers'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  // 添加同步读取辅助函数
  let syncReadFunc = '';
  syncReadFunc += 'int16_t _emodbus_syncReadHoldReg(ModbusClient& client, uint8_t serverId, uint16_t addr) {\n';
  syncReadFunc += '  ModbusMessage response = client.syncRequest((uint32_t)millis(), serverId, READ_HOLD_REGISTER, addr, (uint16_t)1);\n';
  syncReadFunc += '  if (response.getError() == Modbus::SUCCESS && response.size() >= 5) {\n';
  syncReadFunc += '    uint16_t value;\n';
  syncReadFunc += '    response.get(3, value);\n';
  syncReadFunc += '    return (int16_t)value;\n';
  syncReadFunc += '  }\n';
  syncReadFunc += '  return -1;\n';
  syncReadFunc += '}\n';
  generator.addFunction('_emodbus_syncReadHoldReg', syncReadFunc);

  const code = '_emodbus_syncReadHoldReg(' + varName + ', ' + serverId + ', ' + address + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 同步读取输入寄存器
Arduino.forBlock['emodbus_sync_read_input_register'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  // 添加同步读取辅助函数
  let syncReadFunc = '';
  syncReadFunc += 'int16_t _emodbus_syncReadInputReg(ModbusClient& client, uint8_t serverId, uint16_t addr) {\n';
  syncReadFunc += '  ModbusMessage response = client.syncRequest((uint32_t)millis(), serverId, READ_INPUT_REGISTER, addr, (uint16_t)1);\n';
  syncReadFunc += '  if (response.getError() == Modbus::SUCCESS && response.size() >= 5) {\n';
  syncReadFunc += '    uint16_t value;\n';
  syncReadFunc += '    response.get(3, value);\n';
  syncReadFunc += '    return (int16_t)value;\n';
  syncReadFunc += '  }\n';
  syncReadFunc += '  return -1;\n';
  syncReadFunc += '}\n';
  generator.addFunction('_emodbus_syncReadInputReg', syncReadFunc);

  const code = '_emodbus_syncReadInputReg(' + varName + ', ' + serverId + ', ' + address + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 同步读取线圈
Arduino.forBlock['emodbus_sync_read_coil'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  // 添加同步读取辅助函数
  let syncReadFunc = '';
  syncReadFunc += 'int8_t _emodbus_syncReadCoil(ModbusClient& client, uint8_t serverId, uint16_t addr) {\n';
  syncReadFunc += '  ModbusMessage response = client.syncRequest((uint32_t)millis(), serverId, READ_COIL, addr, (uint16_t)1);\n';
  syncReadFunc += '  if (response.getError() == Modbus::SUCCESS && response.size() >= 4) {\n';
  syncReadFunc += '    return (response[3] & 0x01);\n';
  syncReadFunc += '  }\n';
  syncReadFunc += '  return -1;\n';
  syncReadFunc += '}\n';
  generator.addFunction('_emodbus_syncReadCoil', syncReadFunc);

  const code = '_emodbus_syncReadCoil(' + varName + ', ' + serverId + ', ' + address + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// ============================================
// 响应数据处理
// ============================================

// 从响应获取16位值
Arduino.forBlock['emodbus_response_get_uint16'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

  // 添加获取响应值的辅助函数
  let getValueFunc = '';
  getValueFunc += 'uint16_t _emodbus_getResponseUint16(ModbusMessage& response, uint16_t index) {\n';
  getValueFunc += '  uint16_t value = 0;\n';
  getValueFunc += '  uint16_t offset = 3 + index * 2;\n';
  getValueFunc += '  if (offset + 1 < response.size()) {\n';
  getValueFunc += '    response.get(offset, value);\n';
  getValueFunc += '  }\n';
  getValueFunc += '  return value;\n';
  getValueFunc += '}\n';
  generator.addFunction('_emodbus_getResponseUint16', getValueFunc);

  // 需要知道使用哪个客户端的响应变量，这里使用一个通用变量
  const code = '_emodbus_getResponseUint16(_emodbus_response_mbClient, ' + index + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 从响应获取浮点值
Arduino.forBlock['emodbus_response_get_float'] = function(block, generator) {
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

  // 添加获取浮点值的辅助函数
  let getFloatFunc = '';
  getFloatFunc += 'float _emodbus_getResponseFloat(ModbusMessage& response, uint16_t index) {\n';
  getFloatFunc += '  float value = 0.0f;\n';
  getFloatFunc += '  uint16_t offset = 3 + index * 4;\n';
  getFloatFunc += '  if (offset + 3 < response.size()) {\n';
  getFloatFunc += '    response.get(offset, value);\n';
  getFloatFunc += '  }\n';
  getFloatFunc += '  return value;\n';
  getFloatFunc += '}\n';
  generator.addFunction('_emodbus_getResponseFloat', getFloatFunc);

  const code = '_emodbus_getResponseFloat(_emodbus_response_mbClient, ' + index + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 响应的从站ID
Arduino.forBlock['emodbus_response_server_id'] = function(block, generator) {
  const code = '_emodbus_response_mbClient.getServerID()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 响应的功能码
Arduino.forBlock['emodbus_response_function_code'] = function(block, generator) {
  const code = '_emodbus_response_mbClient.getFunctionCode()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 响应的数据长度
Arduino.forBlock['emodbus_response_length'] = function(block, generator) {
  const code = '_emodbus_response_mbClient.size()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 错误代码
Arduino.forBlock['emodbus_error_code'] = function(block, generator) {
  const code = '(int)_emodbus_error_mbClient';
  return [code, generator.ORDER_ATOMIC];
};

// 错误信息
Arduino.forBlock['emodbus_error_message'] = function(block, generator) {
  const code = '(const char *)ModbusError(_emodbus_error_mbClient)';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// ============================================
// RTU 服务器
// ============================================

// 创建RTU服务器
Arduino.forBlock['emodbus_rtu_server_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'mbServer';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (newName !== block._varLastName) {
          renameVariableInBlockly(block, block._varLastName, newName, 'ModbusServerRTU');
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'mbServer';
  const timeout = block.getFieldValue('TIMEOUT') || '2000';
  const rtsPin = block.getFieldValue('RTS_PIN') || '-1';

  generator.addLibrary('eModbus_ServerRTU', '#include "ModbusServerRTU.h"');
  ensureEmodbusLib(generator);

  registerVariableToBlockly(varName, 'ModbusServerRTU');
  generator.addVariable(varName, 'ModbusServerRTU ' + varName + '(' + timeout + ', ' + rtsPin + ');');

  return '';
};

// 启动RTU服务器
Arduino.forBlock['emodbus_rtu_server_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbServer';
  const serial = block.getFieldValue('SERIAL') || 'Serial2';
  const baudrate = block.getFieldValue('BAUDRATE') || '9600';
  const rxPin = block.getFieldValue('RX_PIN') || '16';
  const txPin = block.getFieldValue('TX_PIN') || '17';

  generator.addLibrary('eModbus_ServerRTU', '#include "ModbusServerRTU.h"');
  ensureEmodbusLib(generator);

  let code = '';
  code += 'RTUutils::prepareHardwareSerial(' + serial + ');\n';
  code += serial + '.begin(' + baudrate + ', SERIAL_8N1, ' + rxPin + ', ' + txPin + ');\n';
  code += varName + '.begin(' + serial + ');\n';

  return code;
};

// ============================================
// TCP 服务器
// ============================================

// 创建TCP服务器
Arduino.forBlock['emodbus_tcp_server_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'mbTcpServer';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (newName !== block._varLastName) {
          renameVariableInBlockly(block, block._varLastName, newName, 'ModbusServerWiFi');
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'mbTcpServer';
  const port = block.getFieldValue('PORT') || '502';
  const maxClients = block.getFieldValue('MAX_CLIENTS') || '4';

  generator.addLibrary('eModbus_ServerWiFi', '#include "ModbusServerWiFi.h"');
  ensureWiFiLib(generator);

  registerVariableToBlockly(varName, 'ModbusServerWiFi');
  generator.addVariable(varName, 'ModbusServerWiFi ' + varName + ';');

  return '';
};

// 启动TCP服务器
Arduino.forBlock['emodbus_tcp_server_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbTcpServer';

  generator.addLibrary('eModbus_ServerWiFi', '#include "ModbusServerWiFi.h"');

  return varName + '.start(502, 4, 20000);\n';
};

// ============================================
// 服务器功能码注册
// ============================================

// 注册FC03处理
Arduino.forBlock['emodbus_server_register_fc03'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbServer';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const addressVarField = block.getField('ADDRESS_VAR');
  const addressVar = addressVarField ? addressVarField.getText() : 'reqAddress';
  const countVarField = block.getField('COUNT_VAR');
  const countVar = countVarField ? countVarField.getText() : 'reqCount';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  const callbackName = '_emodbus_fc03_' + varName;

  // 添加响应构建变量
  generator.addVariable('_emodbus_server_response', 'ModbusMessage _emodbus_server_response;');

  let functionDef = '';
  functionDef += 'ModbusMessage ' + callbackName + '(ModbusMessage request) {\n';
  functionDef += '  uint16_t ' + addressVar + ' = 0;\n';
  functionDef += '  uint16_t ' + countVar + ' = 0;\n';
  functionDef += '  request.get(2, ' + addressVar + ');\n';
  functionDef += '  request.get(4, ' + countVar + ');\n';
  functionDef += '  _emodbus_server_response = ModbusMessage();\n';
  functionDef += '  _emodbus_server_response.add(request.getServerID(), request.getFunctionCode(), (uint8_t)(' + countVar + ' * 2));\n';
  functionDef += handlerCode;
  functionDef += '  return _emodbus_server_response;\n';
  functionDef += '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(callbackName + '_register', varName + '.registerWorker(' + serverId + ', READ_HOLD_REGISTER, &' + callbackName + ');');

  return '';
};

// 注册FC06处理
Arduino.forBlock['emodbus_server_register_fc06'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbServer';
  const serverId = block.getFieldValue('SERVER_ID') || '1';
  const addressVarField = block.getField('ADDRESS_VAR');
  const addressVar = addressVarField ? addressVarField.getText() : 'reqAddress';
  const valueVarField = block.getField('VALUE_VAR');
  const valueVar = valueVarField ? valueVarField.getText() : 'reqValue';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  const callbackName = '_emodbus_fc06_' + varName;

  let functionDef = '';
  functionDef += 'ModbusMessage ' + callbackName + '(ModbusMessage request) {\n';
  functionDef += '  uint16_t ' + addressVar + ' = 0;\n';
  functionDef += '  uint16_t ' + valueVar + ' = 0;\n';
  functionDef += '  request.get(2, ' + addressVar + ');\n';
  functionDef += '  request.get(4, ' + valueVar + ');\n';
  functionDef += handlerCode;
  functionDef += '  return ECHO_RESPONSE;\n';
  functionDef += '}\n';

  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(callbackName + '_register', varName + '.registerWorker(' + serverId + ', WRITE_HOLD_REGISTER, &' + callbackName + ');');

  return '';
};

// 添加响应数据
Arduino.forBlock['emodbus_server_add_response_data'] = function(block, generator) {
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  return '_emodbus_server_response.add((uint16_t)' + value + ');\n';
};

// 设置错误响应
Arduino.forBlock['emodbus_server_set_error'] = function(block, generator) {
  const errorCode = block.getFieldValue('ERROR_CODE') || 'ILLEGAL_DATA_ADDRESS';

  return '_emodbus_server_response.setError(request.getServerID(), request.getFunctionCode(), ' + errorCode + ');\n';
};

// ============================================
// 客户端状态
// ============================================

// 待处理请求数
Arduino.forBlock['emodbus_client_pending_requests'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';

  const code = varName + '.pendingRequests()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 清空请求队列
Arduino.forBlock['emodbus_client_clear_queue'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mbClient';

  return varName + '.clearQueue();\n';
};

// AsyncTCP Blockly库代码生成器
// ESP32异步TCP客户端和服务器

// ==================== 辅助函数 ====================

// 确保库引用
function ensureAsyncTCPLib(generator) {
  generator.addLibrary('AsyncTCP', '#include <AsyncTCP.h>');
}

// ==================== TCP客户端块 ====================

Arduino.forBlock['async_tcp_client_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._asyncTcpClientVarMonitorAttached) {
    block._asyncTcpClientVarMonitorAttached = true;
    block._asyncTcpClientVarLastName = block.getFieldValue('VAR') || 'tcpClient';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const oldName = block._asyncTcpClientVarLastName;
        if (oldName !== newName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'AsyncClient');
        }
        block._asyncTcpClientVarLastName = newName;
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'tcpClient';
  
  ensureAsyncTCPLib(generator);
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'AsyncClient');
  }
  
  generator.addVariable('AsyncClient_' + varName, 'AsyncClient ' + varName + ';');
  
  return '';
};

Arduino.forBlock['async_tcp_client_connect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC) || '"127.0.0.1"';
  const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
  
  ensureAsyncTCPLib(generator);
  
  return varName + '.connect(' + host + ', ' + port + ');\n';
};

Arduino.forBlock['async_tcp_client_close'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return varName + '.close();\n';
};

Arduino.forBlock['async_tcp_client_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
  
  return varName + '.write(' + data + ');\n';
};

Arduino.forBlock['async_tcp_client_connected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.connected()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_connecting'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.connecting()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_space'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.space()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_can_send'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.canSend()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_set_no_delay'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const noDelay = block.getFieldValue('NODELAY') === 'TRUE' ? 'true' : 'false';
  
  return varName + '.setNoDelay(' + noDelay + ');\n';
};

Arduino.forBlock['async_tcp_client_set_rx_timeout'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '5';
  
  return varName + '.setRxTimeout(' + timeout + ');\n';
};

Arduino.forBlock['async_tcp_client_remote_ip'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.remoteIP().toString()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_remote_port'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.remotePort()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['async_tcp_client_local_port'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  
  return [varName + '.localPort()', Arduino.ORDER_ATOMIC];
};

// ==================== TCP客户端事件回调块 ====================

Arduino.forBlock['async_tcp_client_on_connect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onConnect_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client) {\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onConnect(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_on_disconnect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onDisconnect_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client) {\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onDisconnect(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_on_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const dataVar = block.getFieldValue('DATA_VAR') || 'receivedData';
  const lenVar = block.getFieldValue('LEN_VAR') || 'dataLength';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onData_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  // 添加全局变量用于存储数据
  generator.addVariable('asyncTcp_data_' + varName, 'String ' + dataVar + ';');
  generator.addVariable('asyncTcp_len_' + varName, 'size_t ' + lenVar + ' = 0;');
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client, void *data, size_t len) {\n' +
    '  ' + dataVar + ' = String((char*)data).substring(0, len);\n' +
    '  ' + lenVar + ' = len;\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onData(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_on_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const errorVar = block.getFieldValue('ERROR_VAR') || 'errorCode';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onError_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  // 添加全局变量用于存储错误码
  generator.addVariable('asyncTcp_error_' + varName, 'int8_t ' + errorVar + ' = 0;');
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client, int8_t error) {\n' +
    '  ' + errorVar + ' = error;\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onError(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_on_ack'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const lenVar = block.getFieldValue('LEN_VAR') || 'ackLength';
  const timeVar = block.getFieldValue('TIME_VAR') || 'ackTime';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onAck_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  // 添加全局变量
  generator.addVariable('asyncTcp_ackLen_' + varName, 'size_t ' + lenVar + ' = 0;');
  generator.addVariable('asyncTcp_ackTime_' + varName, 'uint32_t ' + timeVar + ' = 0;');
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client, size_t len, uint32_t time) {\n' +
    '  ' + lenVar + ' = len;\n' +
    '  ' + timeVar + ' = time;\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onAck(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_on_timeout'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpClient';
  const timeVar = block.getFieldValue('TIME_VAR') || 'timeoutMs';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onTimeout_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  // 添加全局变量
  generator.addVariable('asyncTcp_timeout_' + varName, 'uint32_t ' + timeVar + ' = 0;');
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client, uint32_t time) {\n' +
    '  ' + timeVar + ' = time;\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onTimeout(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

Arduino.forBlock['async_tcp_client_error_to_string'] = function(block, generator) {
  const error = generator.valueToCode(block, 'ERROR', Arduino.ORDER_ATOMIC) || '0';
  
  ensureAsyncTCPLib(generator);
  
  return ['AsyncClient::errorToString(' + error + ')', Arduino.ORDER_ATOMIC];
};

// ==================== TCP服务器块 ====================

Arduino.forBlock['async_tcp_server_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._asyncTcpServerVarMonitorAttached) {
    block._asyncTcpServerVarMonitorAttached = true;
    block._asyncTcpServerVarLastName = block.getFieldValue('VAR') || 'tcpServer';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const oldName = block._asyncTcpServerVarLastName;
        if (oldName !== newName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'AsyncServer');
        }
        block._asyncTcpServerVarLastName = newName;
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'tcpServer';
  const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
  
  ensureAsyncTCPLib(generator);
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'AsyncServer');
  }
  
  generator.addVariable('AsyncServer_' + varName, 'AsyncServer ' + varName + '(' + port + ');');
  
  return '';
};

Arduino.forBlock['async_tcp_server_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpServer';
  
  return varName + '.begin();\n';
};

Arduino.forBlock['async_tcp_server_end'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpServer';
  
  return varName + '.end();\n';
};

Arduino.forBlock['async_tcp_server_set_no_delay'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpServer';
  const noDelay = block.getFieldValue('NODELAY') === 'TRUE' ? 'true' : 'false';
  
  return varName + '.setNoDelay(' + noDelay + ');\n';
};

Arduino.forBlock['async_tcp_server_on_client'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tcpServer';
  const clientVar = block.getFieldValue('CLIENT_VAR') || 'newClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'asyncTcp_onClient_' + varName;
  
  ensureAsyncTCPLib(generator);
  
  // 添加全局变量用于存储客户端指针
  generator.addVariable('asyncTcp_client_' + varName, 'AsyncClient* ' + clientVar + ' = nullptr;');
  
  const functionDef = 
    'void ' + callbackName + '(void *arg, AsyncClient *client) {\n' +
    '  ' + clientVar + ' = client;\n' +
    handlerCode +
    '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  const setupCode = varName + '.onClient(' + callbackName + ', NULL);\n';
  generator.addSetupEnd(callbackName, setupCode);
  
  return '';
};

'use strict';

// 确保WiFi库引用
function ensureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];
  
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp8266') > -1) {
    generator.addLibrary('WiFi', '#include <ESP8266WiFi.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// WebSocket客户端创建
Arduino.forBlock['websocket_client_create'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'wsClient';
  
  // 设置变量重命名监听
  if (!block._wsClientVarMonitorAttached) {
    block._wsClientVarMonitorAttached = true;
    block._wsClientVarLastName = varName;
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wsClientVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WebSocketsClient');
          block._wsClientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 添加库和变量声明
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  registerVariableToBlockly(varName, 'WebSocketsClient');
  generator.addVariable(varName, 'WebSocketsClient ' + varName + ';');
  
  return '';
};

// WebSocket客户端连接
Arduino.forBlock['websocket_client_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"/"';
  
  // 确保WiFi库引用
  ensureWiFiLib(generator);
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  // 自动添加loop调用
  generator.addLoopBegin(varName + '.loop();', varName + '.loop();');
  
  return varName + '.begin(' + host + ', ' + port + ', ' + url + ');\n';
};

// WebSocket客户端SSL连接
Arduino.forBlock['websocket_client_begin_ssl'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '443';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '"/"';
  
  // 确保WiFi库引用
  ensureWiFiLib(generator);
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  // 自动添加loop调用
  generator.addLoopBegin(varName + '.loop();', varName + '.loop();');
  
  return varName + '.beginSSL(' + host + ', ' + port + ', ' + url + ');\n';
};

// WebSocket客户端事件处理
Arduino.forBlock['websocket_client_on_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'websocket_client_event_' + varName;
  
  const functionDef = 'void ' + callbackName + '(WStype_t type, uint8_t * payload, size_t length) {\n' +
    handlerCode +
    '}\n';

  let code = varName + '.onEvent(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  
  return ''; // hat模式块返回空字符串
};

// WebSocket客户端发送文本
Arduino.forBlock['websocket_client_send_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return varName + '.sendTXT(' + text + ');\n';
};

// WebSocket客户端发送二进制数据
Arduino.forBlock['websocket_client_send_binary'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return varName + '.sendBIN((uint8_t*)' + data + '.c_str(), ' + data + '.length());\n';
};

// WebSocket客户端断开连接
Arduino.forBlock['websocket_client_disconnect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return varName + '.disconnect();\n';
};

// WebSocket客户端连接状态
Arduino.forBlock['websocket_client_is_connected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return [varName + '.isConnected()', generator.ORDER_ATOMIC];
};

// WebSocket客户端设置重连间隔
Arduino.forBlock['websocket_client_set_reconnect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '5000';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return varName + '.setReconnectInterval(' + interval + ');\n';
};

// WebSocket客户端启用心跳
Arduino.forBlock['websocket_client_enable_heartbeat'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsClient';
  const pingInterval = generator.valueToCode(block, 'PING_INTERVAL', generator.ORDER_ATOMIC) || '15000';
  const pongTimeout = generator.valueToCode(block, 'PONG_TIMEOUT', generator.ORDER_ATOMIC) || '3000';
  const disconnectCount = generator.valueToCode(block, 'DISCONNECT_COUNT', generator.ORDER_ATOMIC) || '2';
  
  generator.addLibrary('WebSockets', '#include <WebSocketsClient.h>');
  
  return varName + '.enableHeartbeat(' + pingInterval + ', ' + pongTimeout + ', ' + disconnectCount + ');\n';
};

// WebSocket服务器创建
Arduino.forBlock['websocket_server_create'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'wsServer';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '81';
  
  // 设置变量重命名监听
  if (!block._wsServerVarMonitorAttached) {
    block._wsServerVarMonitorAttached = true;
    block._wsServerVarLastName = varName;
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._wsServerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'WebSocketsServer');
          block._wsServerVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 添加库和变量声明
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  registerVariableToBlockly(varName, 'WebSocketsServer');
  generator.addVariable(varName, 'WebSocketsServer ' + varName + '(' + port + ');');
  
  return '';
};

// WebSocket服务器启动
Arduino.forBlock['websocket_server_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  
  // 确保WiFi库引用
  ensureWiFiLib(generator);
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  // 自动添加loop调用
  generator.addLoopBegin(varName + '.loop();', varName + '.loop();');
  
  return varName + '.begin();\n';
};

// WebSocket服务器事件处理
Arduino.forBlock['websocket_server_on_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  // const clientNum = generator.valueToCode(block, 'CLIENT_NUM', generator.ORDER_ATOMIC) || '0';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'websocket_server_event_' + varName;
  
  const functionDef = 'void ' + callbackName + '(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {\n' +
    handlerCode +
    '}\n';

  let code = varName + '.onEvent(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  
  return ''; // hat模式块返回空字符串
};

// WebSocket服务器发送文本
Arduino.forBlock['websocket_server_send_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const clientNum = generator.valueToCode(block, 'CLIENT_NUM', generator.ORDER_ATOMIC) || '0';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.sendTXT(' + clientNum + ', ' + text + ');\n';
};

// WebSocket服务器广播文本
Arduino.forBlock['websocket_server_broadcast_text'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.broadcastTXT(' + text + ');\n';
};

// WebSocket服务器发送二进制数据
Arduino.forBlock['websocket_server_send_binary'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const clientNum = generator.valueToCode(block, 'CLIENT_NUM', generator.ORDER_ATOMIC) || '0';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.sendBIN(' + clientNum + ', (uint8_t*)' + data + '.c_str(), ' + data + '.length());\n';
};

// WebSocket服务器广播二进制数据
Arduino.forBlock['websocket_server_broadcast_binary'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.broadcastBIN((uint8_t*)' + data + '.c_str(), ' + data + '.length());\n';
};

// WebSocket服务器断开客户端
Arduino.forBlock['websocket_server_disconnect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const clientNum = generator.valueToCode(block, 'CLIENT_NUM', generator.ORDER_ATOMIC) || '0';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.disconnect(' + clientNum + ');\n';
};

// WebSocket服务器断开所有客户端
Arduino.forBlock['websocket_server_disconnect_all'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return varName + '.disconnect();\n';
};

// WebSocket服务器连接的客户端数量
Arduino.forBlock['websocket_server_connected_clients'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return [varName + '.connectedClients()', generator.ORDER_ATOMIC];
};

// WebSocket服务器客户端连接状态
Arduino.forBlock['websocket_server_client_connected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wsServer';
  const clientNum = generator.valueToCode(block, 'CLIENT_NUM', generator.ORDER_ATOMIC) || '0';
  
  generator.addLibrary('WebSocketsServer', '#include <WebSocketsServer.h>');
  
  return [varName + '.clientIsConnected(' + clientNum + ')', generator.ORDER_ATOMIC];
};

// WebSocket事件类型
Arduino.forBlock['websocket_event_type'] = function(block, generator) {
  const eventType = block.getFieldValue('TYPE');
  
  switch(eventType) {
    case 'WStype_DISCONNECTED':
      return ['WStype_DISCONNECTED', generator.ORDER_ATOMIC];
    case 'WStype_CONNECTED':
      return ['WStype_CONNECTED', generator.ORDER_ATOMIC];
    case 'WStype_TEXT':
      return ['WStype_TEXT', generator.ORDER_ATOMIC];
    case 'WStype_BIN':
      return ['WStype_BIN', generator.ORDER_ATOMIC];
    case 'WStype_PING':
      return ['WStype_PING', generator.ORDER_ATOMIC];
    case 'WStype_PONG':
      return ['WStype_PONG', generator.ORDER_ATOMIC];
    case 'WStype_ERROR':
      return ['WStype_ERROR', generator.ORDER_ATOMIC];
    default:
      return ['WStype_DISCONNECTED', generator.ORDER_ATOMIC];
  }
};

// WebSocket事件数据
Arduino.forBlock['websocket_event_payload'] = function(block, generator) {
  const payloadType = block.getFieldValue('PAYLOAD');
  
  switch(payloadType) {
    case 'TYPE':
      return ['type', generator.ORDER_ATOMIC];
    case 'PAYLOAD':
      return ['payload', generator.ORDER_ATOMIC];
    case 'PAYLOAD_CHAR':
      return ['(char*)payload', generator.ORDER_ATOMIC];
    default:
      return ['type', generator.ORDER_ATOMIC];
  }
};

Arduino.forBlock['websocket_event_payload_length'] = function(block, generator) {
  return ['length', generator.ORDER_ATOMIC];
};

Arduino.forBlock['websocket_event_client_num'] = function(block, generator) {
  return ['num', generator.ORDER_ATOMIC];
};
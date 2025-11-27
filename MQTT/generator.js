// 确保库引用
function ensurePubSubLib(generator) {
  generator.addLibrary('PubSubClient', '#include <PubSubClient.h>');
}

// 确保WiFi库引用（根据板卡类型）
function ensureWiFiLib(generator) {
  const boardConfig = window['boardConfig'];
  
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
    generator.addLibrary('WiFi', '#include <WiFiS3.h>');
  } else {
    generator.addLibrary('WiFi', '#include <WiFi.h>');
  }
}

// 确保Ethernet库引用
function ensureEthernetLib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Ethernet', '#include <Ethernet.h>');
}

// 获取变量名的工具函数
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// 创建MQTT客户端
Arduino.forBlock['pubsub_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._pubsubVarMonitorAttached) {
    block._pubsubVarMonitorAttached = true;
    block._pubsubVarLastName = block.getFieldValue('VAR') || 'mqttClient';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._pubsubVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'PubSubClient');
          block._pubsubVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // if (!block._clientVarMonitorAttached) {
  //   block._clientVarMonitorAttached = true;
  //   block._clientVarLastName = block.getFieldValue('CLIENT') || 'client';
  //   const varField = block.getField('CLIENT');
  //   if (varField && typeof varField.setValidator === 'function') {
  //     varField.setValidator(function(newName) {
  //       const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  //       const oldName = block._clientVarLastName;
  //       if (workspace && newName && newName !== oldName) {
  //         renameVariableInBlockly(block, oldName, newName, 'WiFiClient');
  //         block._clientVarLastName = newName;
  //       }
  //       return newName;
  //     });
  //   }
  // }

  const varName = block.getFieldValue('VAR') || 'mqttClient';
  const clientVarName = block.getFieldValue('CLIENT') || 'client';
  const ssl = block.getFieldValue('SSL') === 'TRUE';
  const server = generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) || '"mqtt.example.com"';
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || (ssl ? '8883' : '1883');
  
  // 添加库和变量声明
  ensurePubSubLib(generator);
  ensureWiFiLib(generator);
  registerVariableToBlockly(varName, 'PubSubClient');
  // generator.addVariable(varName, 'PubSubClient ' + varName + '(wifiClient);');
  
  const boardConfig = window['boardConfig'];
  // 添加WiFi客户端声明
  if (ssl) {
    if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
      // ESP32系列开发板
      generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
      generator.addVariable(clientVarName, 'WiFiClientSecure ' + clientVarName + ';');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
      // Arduino UNO R4 WiFi
      generator.addLibrary('WiFiSSLClient', '#include <WiFiSSLClient.h>');
      generator.addVariable(clientVarName, 'WiFiSSLClient ' + clientVarName + ';');
    } else {
      // 其他开发板默认使用WiFiClientSecure
      generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
      generator.addVariable(clientVarName, 'WiFiClientSecure ' + clientVarName + ';');
    }
  } else {
    generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
    generator.addVariable(clientVarName, 'WiFiClient ' + clientVarName + ';');
  }
  generator.addVariable(varName, 'PubSubClient ' + varName + '(' + clientVarName + ');');

  let code = ''
  code += varName + '.setServer(' + server + ', ' + port + ');\n';

  generator.addLoopEnd(varName + '.loop()', varName + '.loop();');
  
  return code;
};

// // 设置MQTT服务器
// Arduino.forBlock['pubsub_set_server'] = function(block, generator) {
//   const server = generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) || '"mqtt.example.com"';
//   const port = block.getFieldValue('PORT') || '1883';
  
//   ensurePubSubLib(generator);
  
//   // 查找已创建的MQTT客户端变量
//   const workspace = block.workspace;
//   let mqttClientVar = 'mqttClient';
//   if (workspace) {
//     const variables = workspace.getVariablesOfType('PubSubClient');
//     if (variables && variables.length > 0) {
//       mqttClientVar = variables[0].name;
//     }
//   }
  
//   return mqttClientVar + '.setServer(' + server + ', ' + port + ');\n';
// };

// 设置MQTT回调
Arduino.forBlock['pubsub_set_callback'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'mqtt_callback_' + varName;

  // 添加byte数组转char数组的代码
  let payloadConversion = 
    '  char* payload_str = (char*)malloc(length + 1);\n' +
    '  memcpy(payload_str, payload, length);\n' +
    '  payload_str[length] = \'\\0\';\n' +
    '\n';
  
  // 在回调函数体结束前释放内存
  let memoryCleanup = 
    '\n' +
    '  free(payload_str);\n';
  
  // 生成回调函数
  let functionDef = 'void ' + callbackName + '(char* topic, byte* payload, unsigned int length) {\n';
  functionDef += payloadConversion;
  functionDef += handlerCode;
  functionDef += memoryCleanup;
  functionDef += '}\n';
  
  generator.addFunction(callbackName, functionDef);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = 'mqttClient';
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  let code = mqttClientVar + '.setCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['pubsub_set_callback_with_topic'] = function(block, generator) {
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '"topic"';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'mqtt_sub_' + topic.replace(/[^a-zA-Z0-9_]/g, '_') + '_callback';

  // 生成回调函数
  let functionDef = 'void ' + callbackName + '(const char* payload) {\n';
  functionDef += handlerCode;
  functionDef += '}\n';

  generator.addFunction(callbackName, functionDef);

  // 在订阅时使用该回调函数
  let code = '';
  code += 'if (strcmp(topic, ' + topic + ') == 0)  {\n';
  code += '  ' + callbackName + '(payload_str);\n';
  code += '}\n';

  return code;
};

// 连接MQTT服务器
Arduino.forBlock['pubsub_connect'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const clientId = generator.valueToCode(block, 'CLIENT_ID', generator.ORDER_ATOMIC) || '"arduinoClient"';
  
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return [mqttClientVar + '.connect(' + clientId + ')', generator.ORDER_FUNCTION_CALL];
};

// 带认证连接MQTT服务器
Arduino.forBlock['pubsub_connect_auth'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const clientId = generator.valueToCode(block, 'CLIENT_ID', generator.ORDER_ATOMIC) || '"arduinoClient"';
  const username = generator.valueToCode(block, 'USERNAME', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return [mqttClientVar + '.connect(' + clientId + ', ' + username + ', ' + password + ')', generator.ORDER_FUNCTION_CALL];
};

// 发布MQTT消息
Arduino.forBlock['pubsub_publish'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '"topic"';
  const payload = generator.valueToCode(block, 'PAYLOAD', generator.ORDER_ATOMIC) || '"message"';
  
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return mqttClientVar + '.publish(' + topic + ', ' + payload + ');\n';
};

// 订阅MQTT主题
Arduino.forBlock['pubsub_subscribe'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '"topic"';
  
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return mqttClientVar + '.subscribe(' + topic + ');\n';
};

// 取消订阅MQTT主题
Arduino.forBlock['pubsub_unsubscribe'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '"topic"';
  
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return mqttClientVar + '.unsubscribe(' + topic + ');\n';
};

// 处理MQTT通信
Arduino.forBlock['pubsub_loop'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return mqttClientVar + '.loop();\n';
};

// 检查MQTT连接状态
Arduino.forBlock['pubsub_connected'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return [mqttClientVar + '.connected()', generator.ORDER_FUNCTION_CALL];
};

// 获取MQTT连接状态码
Arduino.forBlock['pubsub_state'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return [mqttClientVar + '.state()', generator.ORDER_FUNCTION_CALL];
};

// 断开MQTT连接
Arduino.forBlock['pubsub_disconnect'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'mqttClient');
  ensurePubSubLib(generator);
  
  // 查找已创建的MQTT客户端变量
  const workspace = block.workspace;
  let mqttClientVar = varName;
  if (workspace) {
    const variables = workspace.getVariablesOfType('PubSubClient');
    if (variables && variables.length > 0) {
      mqttClientVar = variables[0].name;
    }
  }
  
  return mqttClientVar + '.disconnect();\n';
};
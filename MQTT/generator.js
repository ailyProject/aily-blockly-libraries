// generator.js
// 合并后的 Generator blocks for Ethernet, WiFi, PubSubClient, and SRAM

// Ethernet.h
Arduino.forBlock['ethernet_begin'] = function(block, generator) {
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC);
  const ip = generator.valueToCode(block, 'IP', generator.ORDER_ATOMIC);
  generator.addLibrary('Ethernet', '#include <Ethernet.h>');
  return 'Ethernet.begin(' + mac + ', ' + ip + ');\n';
};

// WiFi，根据板卡类型统一处理WiFi相关的addLibrary
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
Arduino.forBlock['wifi_mode'] = function(block, generator) {
  ensureWiFiLib(generator);
  return 'WiFi.mode(' + generator.valueToCode(block, 'MODE', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['wifi_begin'] = function(block, generator) {
  ensureWiFiLib(generator);
  return 'WiFi.begin(' + generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['wifi_status'] = function(block, generator) {
  ensureWiFiLib(generator);
  return ['WiFi.status()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['wifi_local_ip'] = function(block, generator) {
  ensureWiFiLib(generator);
  return ['WiFi.localIP()', generator.ORDER_FUNCTION_CALL];
};

// PubSubClient，统一获取clientName简化冗余
function getClientName(block, def) {
  return block.getFieldValue('NAME') || def;
}
function ensurePubSubLib(generator) {
  generator.addLibrary('PubSubClient', '#include <PubSubClient.h>');
}
Arduino.forBlock['pubsub_create'] = function(block, generator) {
  ensurePubSubLib(generator);
  const client = block.getFieldValue('CLIENT') || 'client';
  const name = block.getFieldValue('NAME') || 'mqttClient';
  const ssl = block.getFieldValue('SSL') === 'TRUE';
  const server = block.getFieldValue('SERVER') || 'broker.diandeng.tech';
  const port = block.getFieldValue('PORT') || '1883';
  
  // 检查是否有提供客户端名称
  const hasClientName = client && client.trim() !== '';
  
  // 根据板卡类型选择合适的WiFi客户端库
  const boardConfig = window['boardConfig'];
  
  if (ssl) {
    // SSL模式 - 添加安全客户端库
    if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
      // ESP32系列开发板
      generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
      generator.addVariable('WiFiClientSecure ' + client, 'WiFiClientSecure ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
      // Arduino UNO R4 WiFi
      generator.addLibrary('WiFiSSLClient', '#include <WiFiSSLClient.h>');
      generator.addVariable('WiFiSSLClient ' + client, 'WiFiSSLClient ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    } else {
      // 默认ESP32处理
      generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
      generator.addVariable('WiFiClientSecure ' + client, 'WiFiClientSecure ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    }
  } else {
    // 非SSL模式 - 使用普通WiFi客户端
    ensureWiFiLib(generator);
    if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
      // ESP32系列开发板
      generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
      generator.addVariable('WiFiClient ' + client, 'WiFiClient ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    } else if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') > -1) {
      // Arduino UNO R4 WiFi
      generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
      generator.addVariable('WiFiClient ' + client, 'WiFiClient ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    } else {
      // 默认ESP32处理
      generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
      generator.addVariable('WiFiClient ' + client, 'WiFiClient ' + client + ';');
      generator.addVariable('PubSubClient ' + name, 'PubSubClient ' + name + '(' + client + ');');
    }
  }

  let code = name + '.setServer("' + server + '", ' + port + ');\n';

  generator.addLoopEnd(name + '.loop()', name + '.loop();\n');

  return code;
};
Arduino.forBlock['pubsub_create_with_server'] = function(block, generator) {
  ensurePubSubLib(generator);
  const name = getClientName(block, 'mqttClient');
  generator.addVariable(
    'PubSubClient ' + name,
    'PubSubClient ' + name + '(' + generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'CALLBACK', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'CLIENT', generator.ORDER_ATOMIC) + ')'
  );
  return '';
};
Arduino.forBlock['pubsub_set_server_ip'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return clientName + '.setServer(' + generator.valueToCode(block, 'SERVER', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_set_server_domain'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return clientName + '.setServer(' + generator.valueToCode(block, 'DOMAIN', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_set_callback'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  
  let callbackName = clientName + '_callback';

  // 获取回调函数体内容
  const callbackBody = generator.statementToCode(block, 'NAME') || '';

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
  
  // 生成回调函数定义
  const functionDef = 'void ' + callbackName + '(char* topic, byte* payload, unsigned int length) {\n' + 
    payloadConversion + 
    callbackBody + 
    memoryCleanup + 
    '}';

  // registerVariableToBlockly('topic', callbackName);
  // registerVariableToBlockly('payload', callbackName);
  // registerVariableToBlockly('payload_str', callbackName);
  // registerVariableToBlockly('length', callbackName);
  addVariableToToolbox('topic', 'topic');
  addVariableToToolbox('payload', 'payload');
  addVariableToToolbox('payload_str', 'payload_str');
  addVariableToToolbox('length', 'length');

  generator.addFunction(callbackName, functionDef);
  
  // 使用字符串拼接构建setCallback代码
  let code = clientName + '.setCallback(' + callbackName + ');\n';
  
  // 添加到setup函数末尾
  generator.addSetupEnd('pubsub_callback_' + clientName, code);
  
  return '';
};

Arduino.forBlock['pubsub_set_callback_with_topic'] = function(block, generator) {
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '""';

  const callbackName = 'mqtt' + topic.replace(/[^a-zA-Z0-9]/g, '_') + '_sub_callback';
  const callbackBody = generator.statementToCode(block, 'NAME') || '';

  const functionDef = 'void ' + callbackName + '(const char* payload) {\n' + callbackBody + '}\n';
  generator.addFunction(callbackName, functionDef);
  
  // let code = callbackName + '(payload, length);\n';
  let code = 'if (strcmp(topic, ' + topic + ') == 0) {\n' +
    '  ' + callbackName + '(payload_str);\n' +
    '}\n';
  // generator.addSetupEnd('pubsub_callback_' + callbackName, code);
  
  return code;
};

Arduino.forBlock['pubsub_connect'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return clientName + '.connect(' + generator.valueToCode(block, 'CLIENT_ID', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_connect_with_credentials'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  const clientId = block.getFieldValue('CLIENT_ID') || '';
  const username = block.getFieldValue('USERNAME') || '';
  const password = block.getFieldValue('PASSWORD') || '';
  
  // 确保 clientId 不为空
  const finalClientId = clientId.trim() === '' ? 'defaultClient' : clientId;
  
  // 生成连接代码作为表达式
  let code;
  if (username.trim() === '' && password.trim() === '') {
    code = clientName + '.connect("' + finalClientId + '")';
  } else {
    code = clientName + '.connect("' + finalClientId + '", "' + username + '", "' + password + '")';
  }
  
  // 返回表达式格式：[代码, 优先级]
  return [code, generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['pubsub_connected'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return [clientName + '.connected()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['pubsub_loop'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return clientName + '.loop();\n';
};
Arduino.forBlock['pubsub_state'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return [clientName + '.state()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['pubsub_publish'] = function(block, generator) {
  // 确保已包含PubSubClient库
  ensurePubSubLib(generator);
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  
  // 获取主题和负载参数，提供默认值
  const topic = generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) || '""';
  const payload = generator.valueToCode(block, 'PAYLOAD', generator.ORDER_ATOMIC) || '""';
    
  let code = '';
  code += clientName + '.publish(' + topic + ', ' + payload + ');\n';

  return code;
};
Arduino.forBlock['pubsub_publish_with_length'] = function(block, generator) {
  const clientName = block.getField('NAME').getVariable().getName() || 'mqttClient';
  return clientName + '.publish(' + generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'PAYLOAD', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_subscribe'] = function(block, generator) {
  const clientName = block.getFieldValue('NAME') || 'mqttClient';
  return clientName + '.subscribe(' + generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_begin_publish'] = function(block, generator) {
  const clientName = block.getField('NAME').getVariable().getName() || 'mqttClient';
  return clientName + '.beginPublish(' + generator.valueToCode(block, 'TOPIC', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'RETAINED', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_print'] = function(block, generator) {
  const clientName = block.getField('NAME').getVariable().getName() || 'mqttClient';
  return clientName + '.print(' + generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['pubsub_end_publish'] = function(block, generator) {
  const clientName = block.getField('NAME').getVariable().getName() || 'mqttClient';
  return clientName + '.endPublish();\n';
};

// SRAM.h，统一SRAM名字
function getSramName(block) {
  return block.getFieldValue('NAME') || 'sram';
}
function ensureSramLib(generator) {
  generator.addLibrary('SRAM', '#include <SRAM.h>');
}
Arduino.forBlock['sram_create'] = function(block, generator) {
  ensureSramLib(generator);
  generator.addVariable('SRAM ' + getSramName(block), 'SRAM ' + getSramName(block) + '(' + generator.valueToCode(block, 'CS_PIN', generator.ORDER_ATOMIC) + ', ' + generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) + ')');
  return '';
};
Arduino.forBlock['sram_begin'] = function(block, generator) {
  return getSramName(block) + '.begin();\n';
};
Arduino.forBlock['sram_seek'] = function(block, generator) {
  return getSramName(block) + '.seek(' + generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) + ');\n';
};
Arduino.forBlock['sram_read'] = function(block, generator) {
  return [getSramName(block) + '.read()', generator.ORDER_FUNCTION_CALL];
};

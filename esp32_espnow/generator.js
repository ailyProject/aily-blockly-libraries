// ESP-NOW Blockly库代码生成器

// ============================================
// 辅助函数
// ============================================

// 确保WiFi库被引用并初始化
function ensureWiFiLib(generator) {
  generator.addLibrary('WiFi', '#include <WiFi.h>');
}

// 确保ESP-NOW库被引用
function ensureEspNowLib(generator) {
  generator.addLibrary('ESP32_NOW', '#include <ESP32_NOW.h>');
}

// 确保ESP-NOW Serial库被引用
function ensureEspNowSerialLib(generator) {
  generator.addLibrary('ESP32_NOW_Serial', '#include <ESP32_NOW_Serial.h>');
  generator.addLibrary('MacAddress', '#include <MacAddress.h>');
}

// 确保esp_mac库（用于MAC2STR宏）
function ensureEspMacLib(generator) {
  generator.addLibrary('esp_mac', '#include <esp_mac.h>');
}

// 确保vector库
function ensureVectorLib(generator) {
  generator.addLibrary('vector', '#include <vector>');
}

// 确保WiFi初始化
function ensureWiFiInit(generator, mode, channel) {
  ensureWiFiLib(generator);
  
  const wifiMode = mode || 'WIFI_STA';
  const setupKey = 'wifi_init_' + wifiMode;
  
  let wifiSetup = 'WiFi.mode(' + wifiMode + ');\n';
  if (channel) {
    wifiSetup += 'WiFi.setChannel(' + channel + ', WIFI_SECOND_CHAN_NONE);\n';
  }
  
  if (wifiMode === 'WIFI_STA' || wifiMode === 'WIFI_AP_STA') {
    wifiSetup += 'while (!WiFi.STA.started()) {\n';
    wifiSetup += '  delay(100);\n';
    wifiSetup += '}\n';
  } else if (wifiMode === 'WIFI_AP') {
    wifiSetup += 'while (!WiFi.AP.started()) {\n';
    wifiSetup += '  delay(100);\n';
    wifiSetup += '}\n';
  }
  
  generator.addSetup(setupKey, wifiSetup);
}

// 确保ESP-NOW初始化
function ensureEspNowInit(generator) {
  ensureEspNowLib(generator);
  ensureSerialBegin('Serial', generator);
  
  const initCode = 'if (!ESP_NOW.begin()) {\n' +
    '  Serial.println("Failed to initialize ESP-NOW");\n' +
    '  ESP.restart();\n' +
    '}\n';
  
  generator.addSetup('esp_now_init', initCode);
}

// 生成MAC地址解析辅助函数
function ensureMacParseFunction(generator) {
  ensureSerialBegin('Serial', generator);

  const funcDef = 
'bool parseMacAddress(const String& macStr, uint8_t* mac) {\n' +
'  if (sscanf(macStr.c_str(), "%hhx:%hhx:%hhx:%hhx:%hhx:%hhx",\n' +
'             &mac[0], &mac[1], &mac[2], &mac[3], &mac[4], &mac[5]) != 6) {\n' +
'    Serial.println("Invalid MAC address format");\n' +
'    return false;\n' +
'  }\n' +
'  return true;\n' +
'}\n';
  
  generator.addFunction('parseMacAddress', funcDef);
}

// 生成MAC地址转字符串辅助函数
function ensureMacToStringFunction(generator) {
  const funcDef = 
'String macToString(const uint8_t* mac) {\n' +
'  char macStr[18];\n' +
'  snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X",\n' +
'           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);\n' +
'  return String(macStr);\n' +
'}\n';
  
  generator.addFunction('macToString', funcDef);
}

// 设置变量重命名监听
function setupVarMonitor(block, fieldName, varType) {
  const monitorKey = '_espNow_' + fieldName + '_MonitorAttached';
  const lastNameKey = '_espNow_' + fieldName + '_LastName';
  
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block[lastNameKey] = block.getFieldValue(fieldName) || 'peer1';
    const varField = block.getField(fieldName);
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block[lastNameKey];
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, varType);
          }
          block[lastNameKey] = newName;
        }
        return newName;
      });
    }
  }
}

// 生成统一的广播Peer类（简化版，不需要每个peer生成子类）
function ensureSimpleBroadcastPeerClass(generator) {
  ensureSerialBegin('Serial', generator);

  const classDef = 
'// 简化版广播Peer类\n' +
'class ESP_NOW_Broadcast_Peer : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ESP_NOW_Broadcast_Peer(uint8_t channel = 0, wifi_interface_t iface = WIFI_IF_STA, const uint8_t *lmk = nullptr)\n' +
'    : ESP_NOW_Peer(ESP_NOW.BROADCAST_ADDR, channel, iface, lmk) {}\n' +
'  \n' +
'  ~ESP_NOW_Broadcast_Peer() { remove(); }\n' +
'  \n' +
'  bool begin() {\n' +
'    if (!ESP_NOW.begin() || !add()) {\n' +
'      Serial.println("Failed to initialize broadcast peer");\n' +
'      return false;\n' +
'    }\n' +
'    return true;\n' +
'  }\n' +
'  \n' +
'  bool sendMessage(const String& msg) {\n' +
'    return send((const uint8_t *)msg.c_str(), msg.length());\n' +
'  }\n' +
'};\n';
  
  generator.addObject('ESP_NOW_Broadcast_Peer_class', classDef);
}

// 生成统一的接收Peer类（用于从机自动注册新设备）
function ensureSimpleReceiverPeerClass(generator) {
  const classDef = 
'// 简化版接收Peer类\n' +
'class ESP_NOW_Receiver_Peer : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ESP_NOW_Receiver_Peer(const uint8_t *mac_addr, uint8_t channel = 0, wifi_interface_t iface = WIFI_IF_STA, const uint8_t *lmk = nullptr)\n' +
'    : ESP_NOW_Peer(mac_addr, channel, iface, lmk) {}\n' +
'  \n' +
'  ~ESP_NOW_Receiver_Peer() {}\n' +
'  \n' +
'  bool addPeer() { return add(); }\n' +
'  \n' +
'  bool sendMessage(const String& msg) {\n' +
'    return send((const uint8_t *)msg.c_str(), msg.length());\n' +
'  }\n' +
'  \n' +
'  void onReceive(const uint8_t *data, size_t len, bool broadcast) {\n' +
'    // 已注册设备的消息在此处理，转发到全局回调\n' +
'    esp_now_rx_sender_mac = macToString(addr());\n' +
'    esp_now_rx_message = String((char *)data, len);\n' +
'    esp_now_rx_len = len;\n' +
'    esp_now_rx_broadcast = broadcast;\n' +
'    esp_now_on_message_handler();\n' +
'  }\n' +
'};\n';
  
  generator.addObject('ESP_NOW_Receiver_Peer_class', classDef);
}

// ============================================
// 极简模式块
// ============================================

// 初始化为主机（广播发送方）
Arduino.forBlock['esp_now_master_init'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureEspNowLib(generator);
  ensureWiFiLib(generator);
  ensureSimpleBroadcastPeerClass(generator);
  ensureSerialBegin('Serial', generator);
  
  // 全局广播对象
  generator.addObject('esp_now_broadcast', 'ESP_NOW_Broadcast_Peer* esp_now_broadcast = nullptr;');
  
  // WiFi初始化
  let setupCode = '// ESP-NOW 主机模式初始化\n';
  setupCode += 'WiFi.mode(WIFI_STA);\n';
  setupCode += 'WiFi.setChannel(' + channel + ', WIFI_SECOND_CHAN_NONE);\n';
  setupCode += 'while (!WiFi.STA.started()) {\n';
  setupCode += '  delay(100);\n';
  setupCode += '}\n';
  setupCode += 'Serial.println("ESP-NOW Master Mode");\n';
  setupCode += 'Serial.println("MAC: " + WiFi.macAddress());\n';
  setupCode += 'Serial.printf("Channel: %d\\n", ' + channel + ');\n';
  setupCode += '\n';
  setupCode += 'esp_now_broadcast = new ESP_NOW_Broadcast_Peer(' + channel + ');\n';
  setupCode += 'if (!esp_now_broadcast->begin()) {\n';
  setupCode += '  Serial.println("Failed to init ESP-NOW master");\n';
  setupCode += '  delay(5000);\n';
  setupCode += '  ESP.restart();\n';
  setupCode += '}\n';
  
  if (!isConnected) {
    return '';
  }

  generator.addSetup('esp_now_master_init', setupCode);
  
  return '';
};

// 初始化为从机（接收方）
Arduino.forBlock['esp_now_slave_init'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureEspNowLib(generator);
  ensureWiFiLib(generator);
  ensureEspMacLib(generator);
  ensureVectorLib(generator);
  ensureMacToStringFunction(generator);  // 先添加辅助函数
  ensureSerialBegin('Serial', generator);
  
  // 全局变量：存储接收到的消息信息（在类定义之前）
  generator.addVariable('esp_now_rx_message', 'String esp_now_rx_message;');
  generator.addVariable('esp_now_rx_len', 'size_t esp_now_rx_len = 0;');
  generator.addVariable('esp_now_rx_broadcast', 'bool esp_now_rx_broadcast = false;');
  generator.addVariable('esp_now_rx_sender_mac', 'String esp_now_rx_sender_mac;');
  generator.addVariable('esp_now_slave_channel', 'uint8_t esp_now_slave_channel = ' + channel + ';');
  
  // 用户消息回调占位（默认为空，需要在类之前声明）
  generator.addFunction('esp_now_on_message_handler', 'void esp_now_on_message_handler() {\n  // 用户回调将覆盖此函数\n}\n');
  
  // 现在添加类定义（类中会调用上面的函数和变量）
  ensureSimpleReceiverPeerClass(generator);
  
  // vector在类之后
  generator.addObject('esp_now_masters', 'std::vector<ESP_NOW_Receiver_Peer*> esp_now_masters;');
  
  // 新设备注册回调函数
  const callbackDef = 
'void esp_now_register_new_master(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg) {\n' +
'  // 保存消息数据供用户回调使用\n' +
'  esp_now_rx_sender_mac = macToString(info->src_addr);\n' +
'  esp_now_rx_message = String((char *)data, len);\n' +
'  esp_now_rx_len = len;\n' +
'  esp_now_rx_broadcast = (memcmp(info->des_addr, ESP_NOW.BROADCAST_ADDR, 6) == 0);\n' +
'  \n' +
'  // 检查是否为广播消息并注册新设备\n' +
'  if (esp_now_rx_broadcast) {\n' +
'    // 检查是否已注册\n' +
'    for (auto& m : esp_now_masters) {\n' +
'      if (memcmp(m->addr(), info->src_addr, 6) == 0) {\n' +
'        esp_now_on_message_handler(); // 触发用户回调\n' +
'        return;\n' +
'      }\n' +
'    }\n' +
'    // 注册新设备\n' +
'    Serial.printf("New master: " MACSTR "\\n", MAC2STR(info->src_addr));\n' +
'    ESP_NOW_Receiver_Peer* new_master = new ESP_NOW_Receiver_Peer(info->src_addr, esp_now_slave_channel, WIFI_IF_STA, nullptr);\n' +
'    if (new_master->addPeer()) {\n' +
'      esp_now_masters.push_back(new_master);\n' +
'      Serial.printf("Registered (total: %zu)\\n", esp_now_masters.size());\n' +
'    } else {\n' +
'      delete new_master;\n' +
'    }\n' +
'  }\n' +
'  esp_now_on_message_handler(); // 触发用户回调\n' +
'}\n';
  
  generator.addFunction('esp_now_register_new_master', callbackDef);
  
  // WiFi和ESP-NOW初始化
  let setupCode = '// ESP-NOW 从机模式初始化\n';
  setupCode += 'WiFi.mode(WIFI_STA);\n';
  setupCode += 'WiFi.setChannel(' + channel + ', WIFI_SECOND_CHAN_NONE);\n';
  setupCode += 'while (!WiFi.STA.started()) {\n';
  setupCode += '  delay(100);\n';
  setupCode += '}\n';
  setupCode += 'Serial.println("ESP-NOW Slave Mode");\n';
  setupCode += 'Serial.println("MAC: " + WiFi.macAddress());\n';
  setupCode += 'Serial.printf("Channel: %d\\n", ' + channel + ');\n';
  setupCode += '\n';
  setupCode += 'if (!ESP_NOW.begin()) {\n';
  setupCode += '  Serial.println("Failed to init ESP-NOW");\n';
  setupCode += '  delay(5000);\n';
  setupCode += '  ESP.restart();\n';
  setupCode += '}\n';
  setupCode += 'ESP_NOW.onNewPeer(esp_now_register_new_master, nullptr);\n';
  setupCode += 'Serial.println("Waiting for master...");\n';
  
  if (!isConnected) {
    return '';
  }
  
  generator.addSetup('esp_now_slave_init', setupCode);
  
  return '';
};

// 广播消息（极简模式）
Arduino.forBlock['esp_now_broadcast_message'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  
  ensureEspNowLib(generator);
  
  let code = 'if (esp_now_broadcast != nullptr) {\n';
  code += '  esp_now_broadcast->sendMessage(' + message + ');\n';
  code += '}\n';
  
  return code;
};

// 当收到消息时（极简模式全局回调）
Arduino.forBlock['esp_now_on_message_received'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureEspNowLib(generator);
  
  // 覆盖用户回调函数
  const callbackDef = 
'void esp_now_on_message_handler() {\n' +
handlerCode +
'}\n';
  
  generator.addFunction('esp_now_on_message_handler', callbackDef);
  
  return '';
};

// 极简模式回调变量：收到的消息
Arduino.forBlock['esp_now_received_message'] = function(block, generator) {
  return ['esp_now_rx_message', generator.ORDER_ATOMIC];
};

// 极简模式回调变量：消息长度
Arduino.forBlock['esp_now_received_message_len'] = function(block, generator) {
  return ['esp_now_rx_len', generator.ORDER_ATOMIC];
};

// 极简模式回调变量：是否广播
Arduino.forBlock['esp_now_received_is_broadcast'] = function(block, generator) {
  return ['esp_now_rx_broadcast', generator.ORDER_ATOMIC];
};

// 极简模式回调变量：发送方MAC
Arduino.forBlock['esp_now_received_sender_mac'] = function(block, generator) {
  return ['esp_now_rx_sender_mac', generator.ORDER_ATOMIC];
};

// 回复消息（向最后一个发送消息的设备回复）
Arduino.forBlock['esp_now_reply_message'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  
  ensureEspNowLib(generator);
  ensureMacParseFunction(generator);
  
  // 添加回复辅助函数
  const funcDef = 
'// 简化版回复Peer类\n' +
'class ESP_NOW_Reply_Peer : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ESP_NOW_Reply_Peer(const uint8_t *mac_addr, uint8_t channel, wifi_interface_t iface)\n' +
'    : ESP_NOW_Peer(mac_addr, channel, iface, nullptr) {}\n' +
'  ~ESP_NOW_Reply_Peer() { remove(); }\n' +
'  \n' +
'  bool addPeer() { return add(); }\n' +
'  \n' +
'  bool sendMessage(const String& msg) {\n' +
'    return send((const uint8_t *)msg.c_str(), msg.length());\n' +
'  }\n' +
'};\n' +
'\n' +
'void espNowReplyMessage(const String& msg) {\n' +
'  if (esp_now_rx_sender_mac.length() == 0) return;\n' +
'  \n' +
'  uint8_t mac[6];\n' +
'  if (!parseMacAddress(esp_now_rx_sender_mac, mac)) return;\n' +
'  \n' +
'  // 检查是否已在masters列表中\n' +
'  for (auto& m : esp_now_masters) {\n' +
'    if (memcmp(m->addr(), mac, 6) == 0) {\n' +
'      m->sendMessage(msg);\n' +
'      return;\n' +
'    }\n' +
'  }\n' +
'  \n' +
'  // 临时创建peer发送\n' +
'  ESP_NOW_Reply_Peer* reply_peer = new ESP_NOW_Reply_Peer(mac, esp_now_slave_channel, WIFI_IF_STA);\n' +
'  if (reply_peer->addPeer()) {\n' +
'    reply_peer->sendMessage(msg);\n' +
'  }\n' +
'  delete reply_peer;\n' +
'}\n';
  
  generator.addFunction('espNowReplyMessage', funcDef);
  
  return 'espNowReplyMessage(' + message + ');\n';
};

// 初始化为双向节点（既能广播发送也能接收）
Arduino.forBlock['esp_now_node_init'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureEspNowLib(generator);
  ensureWiFiLib(generator);
  ensureEspMacLib(generator);
  ensureVectorLib(generator);
  ensureMacToStringFunction(generator);
  ensureMacParseFunction(generator);
  ensureSimpleBroadcastPeerClass(generator);
  ensureSerialBegin('Serial', generator);
  
  // 全局变量
  generator.addVariable('esp_now_rx_message', 'String esp_now_rx_message;');
  generator.addVariable('esp_now_rx_len', 'size_t esp_now_rx_len = 0;');
  generator.addVariable('esp_now_rx_broadcast', 'bool esp_now_rx_broadcast = false;');
  generator.addVariable('esp_now_rx_sender_mac', 'String esp_now_rx_sender_mac;');
  generator.addVariable('esp_now_slave_channel', 'uint8_t esp_now_slave_channel = ' + channel + ';');
  generator.addObject('esp_now_broadcast', 'ESP_NOW_Broadcast_Peer* esp_now_broadcast = nullptr;');
  
  // 用户消息回调占位
  generator.addFunction('esp_now_on_message_handler', 'void esp_now_on_message_handler() {\n  // 用户回调将覆盖此函数\n}\n');
  
  // 接收Peer类
  ensureSimpleReceiverPeerClass(generator);
  
  generator.addObject('esp_now_masters', 'std::vector<ESP_NOW_Receiver_Peer*> esp_now_masters;');
  
  // 新设备注册回调函数
  const callbackDef = 
'void esp_now_register_new_master(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg) {\n' +
'  esp_now_rx_sender_mac = macToString(info->src_addr);\n' +
'  esp_now_rx_message = String((char *)data, len);\n' +
'  esp_now_rx_len = len;\n' +
'  esp_now_rx_broadcast = (memcmp(info->des_addr, ESP_NOW.BROADCAST_ADDR, 6) == 0);\n' +
'  \n' +
'  if (esp_now_rx_broadcast) {\n' +
'    for (auto& m : esp_now_masters) {\n' +
'      if (memcmp(m->addr(), info->src_addr, 6) == 0) {\n' +
'        esp_now_on_message_handler();\n' +
'        return;\n' +
'      }\n' +
'    }\n' +
'    Serial.printf("New peer: " MACSTR "\\n", MAC2STR(info->src_addr));\n' +
'    ESP_NOW_Receiver_Peer* new_peer = new ESP_NOW_Receiver_Peer(info->src_addr, esp_now_slave_channel, WIFI_IF_STA, nullptr);\n' +
'    if (new_peer->addPeer()) {\n' +
'      esp_now_masters.push_back(new_peer);\n' +
'      Serial.printf("Registered (total: %zu)\\n", esp_now_masters.size());\n' +
'    } else {\n' +
'      delete new_peer;\n' +
'    }\n' +
'  }\n' +
'  esp_now_on_message_handler();\n' +
'}\n';
  
  generator.addFunction('esp_now_register_new_master', callbackDef);
  
  // 初始化代码
  let setupCode = '// ESP-NOW 双向节点模式初始化\n';
  setupCode += 'WiFi.mode(WIFI_STA);\n';
  setupCode += 'WiFi.setChannel(' + channel + ', WIFI_SECOND_CHAN_NONE);\n';
  setupCode += 'while (!WiFi.STA.started()) {\n';
  setupCode += '  delay(100);\n';
  setupCode += '}\n';
  setupCode += 'Serial.println("ESP-NOW Node Mode");\n';
  setupCode += 'Serial.println("MAC: " + WiFi.macAddress());\n';
  setupCode += 'Serial.printf("Channel: %d\\n", ' + channel + ');\n';
  setupCode += '\n';
  setupCode += '// 初始化广播peer\n';
  setupCode += 'esp_now_broadcast = new ESP_NOW_Broadcast_Peer(' + channel + ');\n';
  setupCode += 'if (!esp_now_broadcast->begin()) {\n';
  setupCode += '  Serial.println("Failed to init ESP-NOW");\n';
  setupCode += '  delay(5000);\n';
  setupCode += '  ESP.restart();\n';
  setupCode += '}\n';
  setupCode += '// 注册新设备回调\n';
  setupCode += 'ESP_NOW.onNewPeer(esp_now_register_new_master, nullptr);\n';
  setupCode += 'Serial.println("Ready for communication...");\n';
  
  if (!isConnected) {
    return '';
  }
  
  generator.addSetup('esp_now_node_init', setupCode);
  
  return '';
};

// ============================================
// 标准模式：初始化相关块
// ============================================

// 初始化ESP-NOW
Arduino.forBlock['esp_now_begin'] = function(block, generator) {
  ensureEspNowLib(generator);
  ensureWiFiInit(generator, 'WIFI_STA', null);
  ensureEspNowInit(generator);
  return '';
};

// 初始化ESP-NOW（带主密钥）
Arduino.forBlock['esp_now_begin_with_pmk'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const pmk = generator.valueToCode(block, 'PMK', generator.ORDER_ATOMIC) || '"pmk1234567890123"';
  
  ensureEspNowLib(generator);
  ensureWiFiInit(generator, 'WIFI_STA', null);
  ensureSerialBegin('Serial', generator);
  
  const initCode = 'if (!ESP_NOW.begin((const uint8_t *)' + pmk + '.c_str())) {\n' +
    '  Serial.println("Failed to initialize ESP-NOW");\n' +
    '  ESP.restart();\n' +
    '}\n';
  
  if (!isConnected) {
    return '';
  }
  
  generator.addSetup('esp_now_init', initCode);
  return '';
};

// 停止ESP-NOW
Arduino.forBlock['esp_now_end'] = function(block, generator) {
  ensureEspNowLib(generator);
  return 'ESP_NOW.end();\n';
};

// 设置WiFi模式和通道
Arduino.forBlock['esp_now_wifi_init'] = function(block, generator) {
  const mode = block.getFieldValue('MODE') || 'WIFI_STA';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureWiFiInit(generator, mode, channel);
  return '';
};

// ============================================
// 对等设备管理块
// ============================================

// 创建对等设备
Arduino.forBlock['esp_now_create_peer'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const varName = block.getFieldValue('VAR') || 'peer1';
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"AA:BB:CC:DD:EE:FF"';
  
  // 设置变量重命名监听
  setupVarMonitor(block, 'VAR', 'ESP_NOW_Peer');
  
  ensureEspNowLib(generator);
  ensureWiFiInit(generator, 'WIFI_STA', null);
  ensureEspNowInit(generator);
  ensureMacParseFunction(generator);
  ensureSerialBegin('Serial', generator);
  
  // 生成自定义类（包含回调占位符）
  const className = 'ESP_NOW_Peer_' + varName;
  
  let classDef = 
'class ' + className + ' : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ' + className + '(const uint8_t *mac_addr, uint8_t channel = 0, wifi_interface_t iface = WIFI_IF_STA, const uint8_t *lmk = nullptr)\n' +
'    : ESP_NOW_Peer(mac_addr, channel, iface, lmk) {}\n' +
'  \n' +
'  String esp_now_data;\n' +
'  size_t esp_now_len;\n' +
'  bool esp_now_broadcast;\n' +
'  bool esp_now_success;\n' +
'  \n' +
'  void onReceive(const uint8_t *data, size_t len, bool broadcast) {\n' +
'    esp_now_data = String((char *)data, len);\n' +
'    esp_now_len = len;\n' +
'    esp_now_broadcast = broadcast;\n' +
'    _onReceiveCallback();\n' +
'  }\n' +
'  \n' +
'  void onSent(bool success) {\n' +
'    esp_now_success = success;\n' +
'    _onSentCallback();\n' +
'  }\n' +
'  \n' +
'  virtual void _onReceiveCallback() {}\n' +
'  virtual void _onSentCallback() {}\n' +
'};\n';
  
  generator.addObject(className + '_class', classDef);
  
  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ESP_NOW_Peer');
  }

  if (!isConnected) {
    return '';
  }
  
  // 生成MAC解析和对象创建代码
  generator.addVariable(varName + '_mac', 'uint8_t ' + varName + '_mac[6];');
  
  let setupCode = 'parseMacAddress(' + mac + ', ' + varName + '_mac);\n';
  generator.addSetup('esp_now_peer_mac_' + varName, setupCode);
  
  // 声明对象指针
  generator.addVariable(varName, className + '* ' + varName + ' = nullptr;');
  
  let createCode = varName + ' = new ' + className + '(' + varName + '_mac);\n';
  createCode += 'if (!' + varName + '->add()) {\n';
  createCode += '  Serial.println("Failed to register peer: ' + varName + '");\n';
  createCode += '}\n';
  
  generator.addSetup('esp_now_peer_create_' + varName, createCode);
  
  return '';
};

// 创建高级对等设备（带通道和加密）
Arduino.forBlock['esp_now_create_peer_advanced'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const varName = block.getFieldValue('VAR') || 'peer1';
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"AA:BB:CC:DD:EE:FF"';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '0';
  const lmk = generator.valueToCode(block, 'LMK', generator.ORDER_ATOMIC) || '""';
  
  // 设置变量重命名监听
  setupVarMonitor(block, 'VAR', 'ESP_NOW_Peer');
  
  ensureEspNowLib(generator);
  ensureWiFiInit(generator, 'WIFI_STA', channel);
  ensureEspNowInit(generator);
  ensureMacParseFunction(generator);
  ensureSerialBegin('Serial', generator);
  
  // 生成自定义类
  const className = 'ESP_NOW_Peer_' + varName;
  
  let classDef = 
'class ' + className + ' : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ' + className + '(const uint8_t *mac_addr, uint8_t channel, wifi_interface_t iface, const uint8_t *lmk)\n' +
'    : ESP_NOW_Peer(mac_addr, channel, iface, lmk) {}\n' +
'  \n' +
'  String esp_now_data;\n' +
'  size_t esp_now_len;\n' +
'  bool esp_now_broadcast;\n' +
'  bool esp_now_success;\n' +
'  \n' +
'  void onReceive(const uint8_t *data, size_t len, bool broadcast) {\n' +
'    esp_now_data = String((char *)data, len);\n' +
'    esp_now_len = len;\n' +
'    esp_now_broadcast = broadcast;\n' +
'    _onReceiveCallback();\n' +
'  }\n' +
'  \n' +
'  void onSent(bool success) {\n' +
'    esp_now_success = success;\n' +
'    _onSentCallback();\n' +
'  }\n' +
'  \n' +
'  virtual void _onReceiveCallback() {}\n' +
'  virtual void _onSentCallback() {}\n' +
'};\n';
  
  generator.addObject(className + '_class', classDef);
  
  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ESP_NOW_Peer');
  }

  if (!isConnected) {
    return '';
  }
  
  // 生成MAC解析和对象创建代码
  generator.addVariable(varName + '_mac', 'uint8_t ' + varName + '_mac[6];');
  
  let setupCode = 'parseMacAddress(' + mac + ', ' + varName + '_mac);\n';
  generator.addSetup('esp_now_peer_mac_' + varName, setupCode);
  
  // 声明对象指针
  const lmkCode = lmk === '""' ? 'nullptr' : '(const uint8_t *)' + lmk + '.c_str()';
  generator.addVariable(varName, className + '* ' + varName + ' = nullptr;');
  
  let createCode = varName + ' = new ' + className + '(' + varName + '_mac, ' + channel + ', WIFI_IF_STA, ' + lmkCode + ');\n';
  createCode += 'if (!' + varName + '->add()) {\n';
  createCode += '  Serial.println("Failed to register peer: ' + varName + '");\n';
  createCode += '}\n';
  
  generator.addSetup('esp_now_peer_create_' + varName, createCode);
  
  return '';
};

// 创建广播对等设备（简化版）
Arduino.forBlock['esp_now_create_broadcast_peer'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const varName = block.getFieldValue('VAR') || 'broadcastPeer';
  
  // 设置变量重命名监听
  setupVarMonitor(block, 'VAR', 'ESP_NOW_Peer');
  
  ensureEspNowLib(generator);
  ensureWiFiInit(generator, 'WIFI_STA', null);
  ensureEspNowInit(generator);
  ensureSerialBegin('Serial', generator);
  
  // 使用统一的简化广播类
  ensureSimpleBroadcastPeerClass(generator);
  
  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ESP_NOW_Peer');
  }
  
  // 声明对象指针
  generator.addVariable(varName, 'ESP_NOW_Broadcast_Peer* ' + varName + ' = nullptr;');
  
  let createCode = varName + ' = new ESP_NOW_Broadcast_Peer();\n';
  createCode += 'if (!' + varName + '->add()) {\n';
  createCode += '  Serial.println("Failed to register broadcast peer: ' + varName + '");\n';
  createCode += '}\n';

  if (!isConnected) {
    return '';
  }
  
  generator.addSetup('esp_now_broadcast_create_' + varName, createCode);
  
  return '';
};

// 移除对等设备
Arduino.forBlock['esp_now_remove_peer'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'peer1';
  
  ensureEspNowLib(generator);
  
  let code = 'if (' + varName + ' != nullptr) {\n';
  code += '  ESP_NOW.removePeer(*' + varName + ');\n';
  code += '  delete ' + varName + ';\n';
  code += '  ' + varName + ' = nullptr;\n';
  code += '}\n';
  
  return code;
};

// ============================================
// 发送消息块
// ============================================

// 发送消息到对等设备
Arduino.forBlock['esp_now_send'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'peer1';
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  
  ensureEspNowLib(generator);
  
  let code = 'if (' + varName + ' != nullptr) {\n';
  code += '  ' + varName + '->send((const uint8_t *)' + message + '.c_str(), ' + message + '.length());\n';
  code += '}\n';
  
  return code;
};

// 发送原始数据到对等设备
Arduino.forBlock['esp_now_send_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'peer1';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';
  const len = generator.valueToCode(block, 'LEN', generator.ORDER_ATOMIC) || '0';
  
  ensureEspNowLib(generator);
  
  let code = 'if (' + varName + ' != nullptr) {\n';
  code += '  ' + varName + '->send((const uint8_t *)&(' + data + '), ' + len + ');\n';
  code += '}\n';
  
  return code;
};

// ============================================
// 回调事件块
// ============================================

// 当对等设备收到消息时（Hat模式）
Arduino.forBlock['esp_now_on_receive'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'peer1';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureEspNowLib(generator);
  
  const className = 'ESP_NOW_Peer_' + varName;
  const callbackClassName = className + '_WithCallback';
  
  // 生成带回调的派生类
  let classDef = 
'class ' + callbackClassName + ' : public ' + className + ' {\n' +
'public:\n' +
'  using ' + className + '::' + className + ';\n' +
'  \n' +
'  void _onReceiveCallback() override {\n' +
handlerCode +
'  }\n' +
'};\n';
  
  generator.addObject(callbackClassName + '_class', classDef);
  
  return '';
};

// 当消息发送完成时（Hat模式）
Arduino.forBlock['esp_now_on_sent'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'peer1';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureEspNowLib(generator);
  
  const className = 'ESP_NOW_Peer_' + varName;
  const callbackClassName = className + '_WithSentCallback';
  
  // 生成带回调的派生类
  let classDef = 
'class ' + callbackClassName + ' : public ' + className + ' {\n' +
'public:\n' +
'  using ' + className + '::' + className + ';\n' +
'  \n' +
'  void _onSentCallback() override {\n' +
handlerCode +
'  }\n' +
'};\n';
  
  generator.addObject(callbackClassName + '_class', classDef);
  
  return '';
};

// 当收到新对等设备消息时
Arduino.forBlock['esp_now_on_new_peer'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureEspNowLib(generator);
  ensureMacToStringFunction(generator);
  
  // 全局变量用于存储新对等设备信息
  generator.addVariable('esp_now_src_mac_global', 'String esp_now_src_mac_global;');
  generator.addVariable('esp_now_data_global', 'String esp_now_data_global;');
  generator.addVariable('esp_now_len_global', 'size_t esp_now_len_global;');
  
  // 生成回调函数
  const callbackName = 'esp_now_new_peer_callback';
  
  let funcDef = 
'void ' + callbackName + '(const esp_now_recv_info_t *info, const uint8_t *data, int len, void *arg) {\n' +
'  esp_now_src_mac_global = macToString(info->src_addr);\n' +
'  esp_now_data_global = String((char *)data, len);\n' +
'  esp_now_len_global = len;\n' +
handlerCode +
'}\n';
  
  generator.addFunction(callbackName, funcDef);

  if (!isConnected) {
    return '';
  }
  
  // 注册回调
  generator.addSetup('esp_now_new_peer_callback', 'ESP_NOW.onNewPeer(' + callbackName + ', nullptr);\n');
  
  return '';
};

// ============================================
// 回调中使用的值块
// ============================================

// 收到的消息内容
Arduino.forBlock['esp_now_received_data'] = function(block, generator) {
  return ['esp_now_data', generator.ORDER_ATOMIC];
};

// 收到的消息长度
Arduino.forBlock['esp_now_received_len'] = function(block, generator) {
  return ['esp_now_len', generator.ORDER_ATOMIC];
};

// 是否为广播消息
Arduino.forBlock['esp_now_is_broadcast'] = function(block, generator) {
  return ['esp_now_broadcast', generator.ORDER_ATOMIC];
};

// 发送是否成功
Arduino.forBlock['esp_now_send_success'] = function(block, generator) {
  return ['esp_now_success', generator.ORDER_ATOMIC];
};

// 发送方MAC地址（在新对等设备回调中使用）
Arduino.forBlock['esp_now_src_mac'] = function(block, generator) {
  return ['esp_now_src_mac_global', generator.ORDER_ATOMIC];
};

// ============================================
// ESP-NOW Serial 模式块
// ============================================

// 创建ESP-NOW串口
Arduino.forBlock['esp_now_serial_create'] = function(block, generator) {
  // 检查块是否连接到代码流程中（有父块或前置连接）
  // 如果是独立块则不生成代码
  const isConnected = isBlockConnected(block, 'arduino_setup');

  const varName = block.getFieldValue('VAR') || 'nowSerial';
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"AA:BB:CC:DD:EE:FF"';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  const mode = block.getFieldValue('MODE') || 'WIFI_STA';
  const interface = (mode === 'WIFI_STA') ? 'WIFI_IF_STA' : 'WIFI_IF_AP';
  
  // 设置变量重命名监听
  setupVarMonitor(block, 'VAR', 'ESP_NOW_Serial');
  
  ensureEspNowSerialLib(generator);
  ensureWiFiLib(generator);
  
  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'ESP_NOW_Serial');
  }
  
  // 声明对象（使用MacAddress类）
  // generator.addVariable(varName + '_mac', 'MacAddress ' + varName + '_mac;');
  // generator.addVariable(varName, 'ESP_NOW_Serial_Class* ' + varName + ' = nullptr;');
  
  // 创建对象
  // 解析MAC地址并创建ESP-NOW串口对象
  // MAC AA:BB:CC:DD:EE:FF 格式
  // 提取为 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF 格式
  let mac_addr = mac.replace(/"/g, '').split(':').map(part => '0x' + part).join(', ');
  generator.addVariable('peer_mac', 'const MacAddress peer_mac({' + mac_addr + '});');
  generator.addObject(varName, 'ESP_NOW_Serial_Class ' + varName + '(peer_mac, ' + channel + ', ' + interface + ');');

  // WiFi初始化
  let wifiSetup = 'WiFi.mode(' + mode + ');\n';
  wifiSetup += 'WiFi.setChannel(' + channel + ', WIFI_SECOND_CHAN_NONE);\n';
  wifiSetup += 'while (!(WiFi.STA.started() || WiFi.AP.started())) {\n';
  wifiSetup += '  delay(100);\n';
  wifiSetup += '}\n';
  wifiSetup += '\n';
  wifiSetup += '// ESP-NOW初始化\n';
  wifiSetup += varName + '.begin(115200);\n';

  if (!isConnected) {
    return '';
  }
  
  generator.addSetup('wifi_init_serial_' + varName, wifiSetup);

  // let createCode = varName + '_mac.fromString(' + mac + ');\n';
  // createCode += varName + ' = new ESP_NOW_Serial_Class(' + varName + '_mac, ' + channel + ', WIFI_IF_STA);\n';
  
  // generator.addSetup('esp_now_serial_create_' + varName, createCode);
  
  // return wifiSetup;
  return '';
};

// // ESP-NOW串口开始通信
// Arduino.forBlock['esp_now_serial_begin'] = function(block, generator) {
//   const varField = block.getField('VAR');
//   const varName = varField ? varField.getText() : 'nowSerial';
  
//   ensureEspNowSerialLib(generator);
  
//   let code = 'if (' + varName + ' != nullptr) {\n';
//   code += '  ' + varName + '->begin(115200);\n';
//   code += '}\n';
  
//   generator.addSetup('esp_now_serial_begin_' + varName, code);
  
//   return '';
// };

// // ESP-NOW串口停止通信
// Arduino.forBlock['esp_now_serial_end'] = function(block, generator) {
//   const varField = block.getField('VAR');
//   const varName = varField ? varField.getText() : 'nowSerial';
  
//   return varName + '->end();\n';
// };

// ESP-NOW串口可读字节数
Arduino.forBlock['esp_now_serial_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  
  return [varName + '.available()', generator.ORDER_ATOMIC];
};

// ESP-NOW串口可写字节数
Arduino.forBlock['esp_now_serial_available_for_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  
  return [varName + '.availableForWrite()', generator.ORDER_ATOMIC];
};

// ESP-NOW串口读取一个字节
Arduino.forBlock['esp_now_serial_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  
  return [varName + '.read()', generator.ORDER_ATOMIC];
};

// ESP-NOW串口读取字符串
Arduino.forBlock['esp_now_serial_read_string'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  
  // Stream类已提供readString()方法，直接使用
  return [varName + '.readString()', generator.ORDER_FUNCTION_CALL];
};

// ESP-NOW串口发送数据
Arduino.forBlock['esp_now_serial_print'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  return varName + '.print(' + data + ');\n';
};

// ESP-NOW串口发送数据并换行
Arduino.forBlock['esp_now_serial_println'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  return varName + '.println(' + data + ');\n';
};

Arduino.forBlock['esp_now_serial_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nowSerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  return [varName + '.write(' + data + ')', generator.ORDER_FUNCTION_CALL];
};

// ============================================
// 快速操作模式块
// ============================================

// 快速广播消息
Arduino.forBlock['esp_now_quick_broadcast'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureEspNowLib(generator);
  ensureWiFiLib(generator);
  ensureSerialBegin('Serial', generator);
  
  // 添加快速广播辅助函数
  const funcDef = 
'class ESP_NOW_Quick_Broadcast : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ESP_NOW_Quick_Broadcast() : ESP_NOW_Peer(ESP_NOW.BROADCAST_ADDR, 0, WIFI_IF_STA, nullptr) {}\n' +
'};\n' +
'\n' +
'bool esp_now_quick_broadcast_init = false;\n' +
'ESP_NOW_Quick_Broadcast* esp_now_quick_broadcast_peer = nullptr;\n' +
'\n' +
'void espNowQuickBroadcast(const String& msg, uint8_t channel) {\n' +
'  if (!esp_now_quick_broadcast_init) {\n' +
'    WiFi.mode(WIFI_STA);\n' +
'    WiFi.setChannel(channel, WIFI_SECOND_CHAN_NONE);\n' +
'    while (!WiFi.STA.started()) {\n' +
'      delay(100);\n' +
'    }\n' +
'    if (!ESP_NOW.begin()) {\n' +
'      Serial.println("Failed to initialize ESP-NOW");\n' +
'      return;\n' +
'    }\n' +
'    esp_now_quick_broadcast_peer = new ESP_NOW_Quick_Broadcast();\n' +
'    if (!esp_now_quick_broadcast_peer->add()) {\n' +
'      Serial.println("Failed to add broadcast peer");\n' +
'      return;\n' +
'    }\n' +
'    esp_now_quick_broadcast_init = true;\n' +
'  }\n' +
'  esp_now_quick_broadcast_peer->send((const uint8_t *)msg.c_str(), msg.length());\n' +
'}\n';
  
  generator.addFunction('espNowQuickBroadcast', funcDef);
  
  return 'espNowQuickBroadcast(' + message + ', ' + channel + ');\n';
};

// 快速发送消息给指定MAC
Arduino.forBlock['esp_now_quick_send'] = function(block, generator) {
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"AA:BB:CC:DD:EE:FF"';
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  
  ensureEspNowLib(generator);
  ensureWiFiLib(generator);
  ensureMacParseFunction(generator);
  ensureSerialBegin('Serial', generator);
  
  // 添加快速发送辅助函数
  const funcDef = 
'class ESP_NOW_Quick_Peer : public ESP_NOW_Peer {\n' +
'public:\n' +
'  ESP_NOW_Quick_Peer(const uint8_t *mac_addr) : ESP_NOW_Peer(mac_addr, 0, WIFI_IF_STA, nullptr) {}\n' +
'};\n' +
'\n' +
'bool esp_now_quick_send_init = false;\n' +
'\n' +
'void espNowQuickSend(const String& macStr, const String& msg, uint8_t channel) {\n' +
'  if (!esp_now_quick_send_init) {\n' +
'    WiFi.mode(WIFI_STA);\n' +
'    WiFi.setChannel(channel, WIFI_SECOND_CHAN_NONE);\n' +
'    while (!WiFi.STA.started()) {\n' +
'      delay(100);\n' +
'    }\n' +
'    if (!ESP_NOW.begin()) {\n' +
'      Serial.println("Failed to initialize ESP-NOW");\n' +
'      return;\n' +
'    }\n' +
'    esp_now_quick_send_init = true;\n' +
'  }\n' +
'  \n' +
'  uint8_t mac[6];\n' +
'  if (!parseMacAddress(macStr, mac)) {\n' +
'    return;\n' +
'  }\n' +
'  \n' +
'  ESP_NOW_Quick_Peer* peer = new ESP_NOW_Quick_Peer(mac);\n' +
'  if (peer->add()) {\n' +
'    peer->send((const uint8_t *)msg.c_str(), msg.length());\n' +
'  }\n' +
'  delete peer;\n' +
'}\n';
  
  generator.addFunction('espNowQuickSend', funcDef);
  
  return 'espNowQuickSend(' + mac + ', ' + message + ', ' + channel + ');\n';
};

// ============================================
// 状态查询块
// ============================================

// 获取本机MAC地址（根据WiFi模式自动选择）
Arduino.forBlock['esp_now_get_mac'] = function(block, generator) {
  ensureWiFiLib(generator);
  // 根据WiFi模式返回对应的MAC地址
  return ['(WiFi.getMode() == WIFI_AP ? WiFi.softAPmacAddress() : WiFi.macAddress())', generator.ORDER_CONDITIONAL];
};

// 获取最大数据长度
Arduino.forBlock['esp_now_get_max_data_len'] = function(block, generator) {
  ensureEspNowLib(generator);
  return ['ESP_NOW.getMaxDataLen()', generator.ORDER_FUNCTION_CALL];
};

// 获取对等设备数量
Arduino.forBlock['esp_now_get_peer_count'] = function(block, generator) {
  ensureEspNowLib(generator);
  return ['ESP_NOW.getTotalPeerCount()', generator.ORDER_FUNCTION_CALL];
};

// 获取版本号
Arduino.forBlock['esp_now_get_version'] = function(block, generator) {
  ensureEspNowLib(generator);
  return ['ESP_NOW.getVersion()', generator.ORDER_FUNCTION_CALL];
};

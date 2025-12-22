/**
 * NimBLE-Arduino Blockly Generator
 * 为NimBLE蓝牙库生成Arduino代码
 */

// 辅助函数：确保NimBLE库已添加
function ensureNimBLELib(generator) {
  generator.addLibrary('NimBLEDevice', '#include <NimBLEDevice.h>');
}

// ========================
// 设备初始化块
// ========================

Arduino.forBlock['nimble_init'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const deviceName = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"NimBLE"';
  
  return 'NimBLEDevice::init(' + deviceName + ');\n';
};

Arduino.forBlock['nimble_deinit'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const clearAll = block.getFieldValue('CLEAR_ALL') === 'TRUE' ? 'true' : 'false';
  
  return 'NimBLEDevice::deinit(' + clearAll + ');\n';
};

Arduino.forBlock['nimble_get_address'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['String(NimBLEDevice::getAddress().toString().c_str())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_set_mtu'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const mtu = generator.valueToCode(block, 'MTU', generator.ORDER_ATOMIC) || '512';
  
  return 'NimBLEDevice::setMTU(' + mtu + ');\n';
};

Arduino.forBlock['nimble_set_power'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const power = block.getFieldValue('POWER') || '0';
  
  return 'NimBLEDevice::setPower(' + power + ');\n';
};

// ========================
// 服务端块
// ========================

Arduino.forBlock['nimble_create_server'] = function(block, generator) {
  // 变量重命名监听
  if (!block._nimbleServerVarMonitorAttached) {
    block._nimbleServerVarMonitorAttached = true;
    block._nimbleServerVarLastName = block.getFieldValue('VAR') || 'pServer';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleServerVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLEServer');
          }
          block._nimbleServerVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const varName = block.getFieldValue('VAR') || 'pServer';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'NimBLEServer');
  }
  generator.addVariable(varName, 'NimBLEServer* ' + varName + ' = nullptr;');
  
  return varName + ' = NimBLEDevice::createServer();\n';
};

Arduino.forBlock['nimble_server_create_service'] = function(block, generator) {
  // 服务变量重命名监听
  if (!block._nimbleServiceVarMonitorAttached) {
    block._nimbleServiceVarMonitorAttached = true;
    block._nimbleServiceVarLastName = block.getFieldValue('SERVICE_VAR') || 'pService';
    const varField = block.getField('SERVICE_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleServiceVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLEService');
          }
          block._nimbleServiceVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const serverField = block.getField('SERVER');
  const serverVar = serverField ? serverField.getText() : 'pServer';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"ABCD"';
  const serviceVar = block.getFieldValue('SERVICE_VAR') || 'pService';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(serviceVar, 'NimBLEService');
  }
  generator.addVariable(serviceVar, 'NimBLEService* ' + serviceVar + ' = nullptr;');
  
  return serviceVar + ' = ' + serverVar + '->createService(' + uuid + ');\n';
};

Arduino.forBlock['nimble_service_create_characteristic'] = function(block, generator) {
  // 特征变量重命名监听
  if (!block._nimbleCharVarMonitorAttached) {
    block._nimbleCharVarMonitorAttached = true;
    block._nimbleCharVarLastName = block.getFieldValue('CHAR_VAR') || 'pCharacteristic';
    const varField = block.getField('CHAR_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleCharVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLECharacteristic');
          }
          block._nimbleCharVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const serviceField = block.getField('SERVICE');
  const serviceVar = serviceField ? serviceField.getText() : 'pService';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"1234"';
  const charVar = block.getFieldValue('CHAR_VAR') || 'pCharacteristic';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(charVar, 'NimBLECharacteristic');
  }
  generator.addVariable(charVar, 'NimBLECharacteristic* ' + charVar + ' = nullptr;');
  
  return charVar + ' = ' + serviceVar + '->createCharacteristic(' + uuid + ');\n';
};

Arduino.forBlock['nimble_service_create_characteristic_props'] = function(block, generator) {
  // 特征变量重命名监听
  if (!block._nimbleCharVarMonitorAttached) {
    block._nimbleCharVarMonitorAttached = true;
    block._nimbleCharVarLastName = block.getFieldValue('CHAR_VAR') || 'pCharacteristic';
    const varField = block.getField('CHAR_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleCharVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLECharacteristic');
          }
          block._nimbleCharVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const serviceField = block.getField('SERVICE');
  const serviceVar = serviceField ? serviceField.getText() : 'pService';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"1234"';
  const charVar = block.getFieldValue('CHAR_VAR') || 'pCharacteristic';
  const props = block.getFieldValue('PROPERTIES') || 'READ_WRITE';
  
  // 属性映射
  const propsMap = {
    'READ': 'NIMBLE_PROPERTY::READ',
    'WRITE': 'NIMBLE_PROPERTY::WRITE',
    'READ_WRITE': 'NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE',
    'READ_NOTIFY': 'NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY',
    'READ_WRITE_NOTIFY': 'NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY',
    'READ_WRITE_INDICATE': 'NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::INDICATE'
  };
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(charVar, 'NimBLECharacteristic');
  }
  generator.addVariable(charVar, 'NimBLECharacteristic* ' + charVar + ' = nullptr;');
  
  return charVar + ' = ' + serviceVar + '->createCharacteristic(' + uuid + ', ' + propsMap[props] + ');\n';
};

Arduino.forBlock['nimble_characteristic_set_value'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pCharacteristic';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  return charVar + '->setValue(' + value + ');\n';
};

Arduino.forBlock['nimble_characteristic_get_value'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pCharacteristic';
  
  return ['String(' + charVar + '->getValue().c_str())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_characteristic_notify'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pCharacteristic';
  
  return charVar + '->notify();\n';
};

Arduino.forBlock['nimble_service_start'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const serviceField = block.getField('SERVICE');
  const serviceVar = serviceField ? serviceField.getText() : 'pService';
  
  return serviceVar + '->start();\n';
};

Arduino.forBlock['nimble_server_connected_count'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const serverField = block.getField('SERVER');
  const serverVar = serverField ? serverField.getText() : 'pServer';
  
  return [serverVar + '->getConnectedCount()', generator.ORDER_ATOMIC];
};

// ========================
// 广播块
// ========================

Arduino.forBlock['nimble_start_advertising'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return 'NimBLEDevice::startAdvertising();\n';
};

Arduino.forBlock['nimble_stop_advertising'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return 'NimBLEDevice::getAdvertising()->stop();\n';
};

Arduino.forBlock['nimble_advertising_add_service'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"ABCD"';
  
  return 'NimBLEDevice::getAdvertising()->addServiceUUID(' + uuid + ');\n';
};

Arduino.forBlock['nimble_advertising_set_name'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"NimBLE"';
  
  return 'NimBLEDevice::getAdvertising()->setName(' + name + ');\n';
};

// ========================
// 服务端回调块
// ========================

Arduino.forBlock['nimble_on_connect'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const serverField = block.getField('SERVER');
  const serverVar = serverField ? serverField.getText() : 'pServer';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackClassName = 'NimBLEServerCallbacks_' + serverVar;
  
  const callbackDef = `class ${callbackClassName} : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo) override {
${handlerCode}  }
};`;

  generator.addObject(callbackClassName + '_instance', callbackClassName + ' ' + serverVar + '_callbacks;');
  generator.addFunction(callbackClassName, callbackDef);
  generator.addSetupEnd(serverVar + '_setCallbacks', serverVar + '->setCallbacks(&' + serverVar + '_callbacks);');
  
  return '';
};

Arduino.forBlock['nimble_on_disconnect'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const serverField = block.getField('SERVER');
  const serverVar = serverField ? serverField.getText() : 'pServer';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackClassName = 'NimBLEServerDisconnectCallbacks_' + serverVar;
  
  const callbackDef = `class ${callbackClassName} : public NimBLEServerCallbacks {
  void onDisconnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo, int reason) override {
${handlerCode}  }
};`;

  generator.addObject(callbackClassName + '_instance', callbackClassName + ' ' + serverVar + '_disconnect_callbacks;');
  generator.addFunction(callbackClassName, callbackDef);
  generator.addSetupEnd(serverVar + '_setDisconnectCallbacks', serverVar + '->setCallbacks(&' + serverVar + '_disconnect_callbacks);');
  
  return '';
};

Arduino.forBlock['nimble_on_characteristic_write'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pCharacteristic';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackClassName = 'NimBLECharWriteCallbacks_' + charVar;
  
  const callbackDef = `class ${callbackClassName} : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic, NimBLEConnInfo& connInfo) override {
${handlerCode}  }
};`;

  generator.addObject(callbackClassName + '_instance', callbackClassName + ' ' + charVar + '_callbacks;');
  generator.addFunction(callbackClassName, callbackDef);
  generator.addSetupEnd(charVar + '_setCallbacks', charVar + '->setCallbacks(&' + charVar + '_callbacks);');
  
  return '';
};

// ========================
// 扫描块
// ========================

Arduino.forBlock['nimble_start_scan'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5';
  
  return 'NimBLEDevice::getScan()->start(' + duration + ' * 1000);\n';
};

Arduino.forBlock['nimble_stop_scan'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return 'NimBLEDevice::getScan()->stop();\n';
};

Arduino.forBlock['nimble_is_scanning'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['NimBLEDevice::getScan()->isScanning()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_on_scan_result'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackClassName = 'NimBLEScanCallbacks_custom';
  
  const callbackDef = `class ${callbackClassName} : public NimBLEScanCallbacks {
  void onResult(const NimBLEAdvertisedDevice* advertisedDevice) override {
    const NimBLEAdvertisedDevice* scanDevice = advertisedDevice;
${handlerCode}  }
};`;

  generator.addObject(callbackClassName + '_instance', callbackClassName + ' nimbleScanCallbacks;');
  generator.addFunction(callbackClassName, callbackDef);
  generator.addSetupEnd('setScanCallbacks', 'NimBLEDevice::getScan()->setScanCallbacks(&nimbleScanCallbacks);');
  
  return '';
};

Arduino.forBlock['nimble_scan_device_name'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['String(scanDevice->getName().c_str())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_scan_device_address'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['String(scanDevice->getAddress().toString().c_str())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_scan_device_rssi'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['scanDevice->getRSSI()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_scan_device_has_service'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"ABCD"';
  
  return ['scanDevice->isAdvertisingService(NimBLEUUID(' + uuid + '))', generator.ORDER_ATOMIC];
};

// ========================
// 客户端块
// ========================

Arduino.forBlock['nimble_create_client'] = function(block, generator) {
  // 变量重命名监听
  if (!block._nimbleClientVarMonitorAttached) {
    block._nimbleClientVarMonitorAttached = true;
    block._nimbleClientVarLastName = block.getFieldValue('VAR') || 'pClient';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleClientVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLEClient');
          }
          block._nimbleClientVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const varName = block.getFieldValue('VAR') || 'pClient';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'NimBLEClient');
  }
  generator.addVariable(varName, 'NimBLEClient* ' + varName + ' = nullptr;');
  
  return varName + ' = NimBLEDevice::createClient();\n';
};

Arduino.forBlock['nimble_client_connect_address'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const clientField = block.getField('CLIENT');
  const clientVar = clientField ? clientField.getText() : 'pClient';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '""';
  
  return [clientVar + '->connect(NimBLEAddress(' + address + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_client_connect_device'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const clientField = block.getField('CLIENT');
  const clientVar = clientField ? clientField.getText() : 'pClient';
  
  return [clientVar + '->connect(scanDevice)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_client_disconnect'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const clientField = block.getField('CLIENT');
  const clientVar = clientField ? clientField.getText() : 'pClient';
  
  return clientVar + '->disconnect();\n';
};

Arduino.forBlock['nimble_client_is_connected'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const clientField = block.getField('CLIENT');
  const clientVar = clientField ? clientField.getText() : 'pClient';
  
  return [clientVar + '->isConnected()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_client_get_service'] = function(block, generator) {
  // 远程服务变量重命名监听
  if (!block._nimbleRemoteServiceVarMonitorAttached) {
    block._nimbleRemoteServiceVarMonitorAttached = true;
    block._nimbleRemoteServiceVarLastName = block.getFieldValue('SERVICE_VAR') || 'pRemoteService';
    const varField = block.getField('SERVICE_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleRemoteServiceVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLERemoteService');
          }
          block._nimbleRemoteServiceVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const clientField = block.getField('CLIENT');
  const clientVar = clientField ? clientField.getText() : 'pClient';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"ABCD"';
  const serviceVar = block.getFieldValue('SERVICE_VAR') || 'pRemoteService';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(serviceVar, 'NimBLERemoteService');
  }
  generator.addVariable(serviceVar, 'NimBLERemoteService* ' + serviceVar + ' = nullptr;');
  
  return serviceVar + ' = ' + clientVar + '->getService(' + uuid + ');\n';
};

Arduino.forBlock['nimble_remote_service_get_characteristic'] = function(block, generator) {
  // 远程特征变量重命名监听
  if (!block._nimbleRemoteCharVarMonitorAttached) {
    block._nimbleRemoteCharVarMonitorAttached = true;
    block._nimbleRemoteCharVarLastName = block.getFieldValue('CHAR_VAR') || 'pRemoteChar';
    const varField = block.getField('CHAR_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._nimbleRemoteCharVarLastName;
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, 'NimBLERemoteCharacteristic');
          }
          block._nimbleRemoteCharVarLastName = newName;
        }
        return newName;
      });
    }
  }

  ensureNimBLELib(generator);
  
  const serviceField = block.getField('SERVICE');
  const serviceVar = serviceField ? serviceField.getText() : 'pRemoteService';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"1234"';
  const charVar = block.getFieldValue('CHAR_VAR') || 'pRemoteChar';
  
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(charVar, 'NimBLERemoteCharacteristic');
  }
  generator.addVariable(charVar, 'NimBLERemoteCharacteristic* ' + charVar + ' = nullptr;');
  
  return charVar + ' = ' + serviceVar + '->getCharacteristic(' + uuid + ');\n';
};

Arduino.forBlock['nimble_remote_char_read'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pRemoteChar';
  
  return ['String(' + charVar + '->readValue().c_str())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['nimble_remote_char_write'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pRemoteChar';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  return charVar + '->writeValue(' + value + ');\n';
};

Arduino.forBlock['nimble_remote_char_subscribe'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  const charField = block.getField('CHAR');
  const charVar = charField ? charField.getText() : 'pRemoteChar';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  const callbackName = 'nimble_notify_' + charVar + '_callback';
  
  const callbackDef = `void ${callbackName}(NimBLERemoteCharacteristic* pRemoteCharacteristic, uint8_t* pData, size_t length, bool isNotify) {
  String notifyData = String((char*)pData, length);
${handlerCode}}`;

  generator.addFunction(callbackName, callbackDef);
  
  return charVar + '->subscribe(true, ' + callbackName + ');\n';
};

Arduino.forBlock['nimble_notify_data'] = function(block, generator) {
  ensureNimBLELib(generator);
  
  return ['notifyData', generator.ORDER_ATOMIC];
};

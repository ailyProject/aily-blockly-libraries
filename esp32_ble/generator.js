'use strict';

// 确保添加BLE库
function ensureBLELib(generator) {
  generator.addLibrary('BLEDevice', '#include <BLEDevice.h>');
  generator.addLibrary('BLEServer', '#include <BLEServer.h>');
  generator.addLibrary('BLEUtils', '#include <BLEUtils.h>');
}

// BLE UART相关的全局变量名
const BLE_UART_SERVICE_UUID = '"6E400001-B5A3-F393-E0A9-E50E24DCCA9E"';
const BLE_UART_RX_UUID = '"6E400002-B5A3-F393-E0A9-E50E24DCCA9E"';
const BLE_UART_TX_UUID = '"6E400003-B5A3-F393-E0A9-E50E24DCCA9E"';

// ==================== 设备初始化 ====================

Arduino.forBlock['esp32_ble_init'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"ESP32-BLE"';
  
  ensureBLELib(generator);
  
  return 'BLEDevice::init(' + name + ');\n';
};

Arduino.forBlock['esp32_ble_deinit'] = function(block, generator) {
  const releaseMemory = block.getFieldValue('RELEASE_MEMORY');
  
  ensureBLELib(generator);
  
  return 'BLEDevice::deinit(' + releaseMemory + ');\n';
};

Arduino.forBlock['esp32_ble_get_address'] = function(block, generator) {
  ensureBLELib(generator);
  
  return ['BLEDevice::getAddress().toString().c_str()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_set_mtu'] = function(block, generator) {
  const mtu = generator.valueToCode(block, 'MTU', generator.ORDER_ATOMIC) || '512';
  
  ensureBLELib(generator);
  
  return 'BLEDevice::setMTU(' + mtu + ');\n';
};

Arduino.forBlock['esp32_ble_get_mtu'] = function(block, generator) {
  ensureBLELib(generator);
  
  return ['BLEDevice::getMTU()', generator.ORDER_FUNCTION_CALL];
};

// ==================== 服务端 ====================

Arduino.forBlock['esp32_ble_create_server'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'pServer';
  
  ensureBLELib(generator);
  registerVariableToBlockly(varName, 'BLEServer');
  generator.addVariable('BLEServer* ' + varName, 'BLEServer* ' + varName + ' = NULL;');
  
  return varName + ' = BLEDevice::createServer();\n';
};

Arduino.forBlock['esp32_ble_server_create_service'] = function(block, generator) {
  const serverField = block.getField('SERVER');
  const serverName = serverField ? serverField.getText() : 'pServer';
  const serviceVar = block.getFieldValue('SERVICE_VAR') || 'pService';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"4fafc201-1fb5-459e-8fcc-c5c9c331914b"';
  
  ensureBLELib(generator);
  registerVariableToBlockly(serviceVar, 'BLEService');
  generator.addVariable('BLEService* ' + serviceVar, 'BLEService* ' + serviceVar + ' = NULL;');
  
  return serviceVar + ' = ' + serverName + '->createService(' + uuid + ');\n';
};

Arduino.forBlock['esp32_ble_service_start'] = function(block, generator) {
  const serviceField = block.getField('SERVICE');
  const serviceName = serviceField ? serviceField.getText() : 'pService';
  
  return serviceName + '->start();\n';
};

Arduino.forBlock['esp32_ble_service_stop'] = function(block, generator) {
  const serviceField = block.getField('SERVICE');
  const serviceName = serviceField ? serviceField.getText() : 'pService';
  
  return serviceName + '->stop();\n';
};

// ==================== 特征值 ====================

Arduino.forBlock['esp32_ble_create_characteristic'] = function(block, generator) {
  const serviceField = block.getField('SERVICE');
  const serviceName = serviceField ? serviceField.getText() : 'pService';
  const charVar = block.getFieldValue('CHAR_VAR') || 'pCharacteristic';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"beb5483e-36e1-4688-b7f5-ea07361b26a8"';
  const properties = block.getFieldValue('PROPERTIES');
  
  ensureBLELib(generator);
  registerVariableToBlockly(charVar, 'BLECharacteristic');
  generator.addVariable('BLECharacteristic* ' + charVar, 'BLECharacteristic* ' + charVar + ' = NULL;');
  
  return charVar + ' = ' + serviceName + '->createCharacteristic(' + uuid + ', ' + properties + ');\n';
};

Arduino.forBlock['esp32_ble_characteristic_set_value'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  return charName + '->setValue(' + value + ');\n';
};

Arduino.forBlock['esp32_ble_characteristic_get_value'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  
  return [charName + '->getValue()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_characteristic_notify'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  
  return charName + '->notify();\n';
};

Arduino.forBlock['esp32_ble_characteristic_indicate'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  
  return charName + '->indicate();\n';
};

Arduino.forBlock['esp32_ble_add_descriptor'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  
  generator.addLibrary('BLE2902', '#include <BLE2902.h>');
  
  return charName + '->addDescriptor(new BLE2902());\n';
};

// ==================== 广播 ====================

Arduino.forBlock['esp32_ble_start_advertising'] = function(block, generator) {
  ensureBLELib(generator);
  
  return 'BLEDevice::startAdvertising();\n';
};

Arduino.forBlock['esp32_ble_stop_advertising'] = function(block, generator) {
  ensureBLELib(generator);
  
  return 'BLEDevice::stopAdvertising();\n';
};

Arduino.forBlock['esp32_ble_advertising_add_service_uuid'] = function(block, generator) {
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"4fafc201-1fb5-459e-8fcc-c5c9c331914b"';
  
  generator.addLibrary('BLEAdvertising', '#include <BLEAdvertising.h>');
  
  return 'BLEDevice::getAdvertising()->addServiceUUID(' + uuid + ');\n';
};

Arduino.forBlock['esp32_ble_advertising_set_scan_response'] = function(block, generator) {
  const enabled = block.getFieldValue('ENABLED');
  
  generator.addLibrary('BLEAdvertising', '#include <BLEAdvertising.h>');
  
  return 'BLEDevice::getAdvertising()->setScanResponse(' + enabled + ');\n';
};

// ==================== 事件回调 ====================

Arduino.forBlock['esp32_ble_on_connect'] = function(block, generator) {
  const serverField = block.getField('SERVER');
  const serverName = serverField ? serverField.getText() : 'pServer';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackClassName = 'BLEServerCallbacksOnConnect_' + serverName;
  
  ensureBLELib(generator);
  
  const classDef = 
`class ${callbackClassName} : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
${handlerCode}  }
  void onDisconnect(BLEServer* pServer) {}
};`;
  
  generator.addFunction(callbackClassName, classDef);
  
  const setupCode = serverName + '->setCallbacks(new ' + callbackClassName + '());';
  generator.addSetupEnd(callbackClassName + '_setup', setupCode);
  
  return '';
};

Arduino.forBlock['esp32_ble_on_disconnect'] = function(block, generator) {
  const serverField = block.getField('SERVER');
  const serverName = serverField ? serverField.getText() : 'pServer';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackClassName = 'BLEServerCallbacksOnDisconnect_' + serverName;
  
  ensureBLELib(generator);
  
  const classDef = 
`class ${callbackClassName} : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {}
  void onDisconnect(BLEServer* pServer) {
${handlerCode}  }
};`;
  
  generator.addFunction(callbackClassName, classDef);
  
  const setupCode = serverName + '->setCallbacks(new ' + callbackClassName + '());';
  generator.addSetupEnd(callbackClassName + '_setup', setupCode);
  
  return '';
};

Arduino.forBlock['esp32_ble_on_write'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pCharacteristic';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackClassName = 'BLECharacteristicCallbacksOnWrite_' + charName;
  
  ensureBLELib(generator);
  
  // 添加全局变量存储接收的数据
  generator.addVariable('ble_received_value_' + charName, 'String ble_received_value_' + charName + ' = "";');
  
  const classDef = 
`class ${callbackClassName} : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    ble_received_value_${charName} = pCharacteristic->getValue();
${handlerCode}  }
};`;
  
  generator.addFunction(callbackClassName, classDef);
  
  const setupCode = charName + '->setCallbacks(new ' + callbackClassName + '());';
  generator.addSetupEnd(callbackClassName + '_setup', setupCode);
  
  return '';
};

Arduino.forBlock['esp32_ble_server_connected_count'] = function(block, generator) {
  const serverField = block.getField('SERVER');
  const serverName = serverField ? serverField.getText() : 'pServer';
  
  return [serverName + '->getConnectedCount()', generator.ORDER_FUNCTION_CALL];
};

// ==================== 客户端 ====================

Arduino.forBlock['esp32_ble_create_client'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'pClient';
  
  ensureBLELib(generator);
  generator.addLibrary('BLEClient', '#include <BLEClient.h>');
  registerVariableToBlockly(varName, 'BLEClient');
  generator.addVariable('BLEClient* ' + varName, 'BLEClient* ' + varName + ' = NULL;');
  
  return varName + ' = BLEDevice::createClient();\n';
};

Arduino.forBlock['esp32_ble_client_connect'] = function(block, generator) {
  const clientField = block.getField('CLIENT');
  const clientName = clientField ? clientField.getText() : 'pClient';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '"00:00:00:00:00:00"';
  
  generator.addLibrary('BLEAddress', '#include <BLEAddress.h>');
  
  return clientName + '->connect(BLEAddress(' + address + '));\n';
};

Arduino.forBlock['esp32_ble_client_disconnect'] = function(block, generator) {
  const clientField = block.getField('CLIENT');
  const clientName = clientField ? clientField.getText() : 'pClient';
  
  return clientName + '->disconnect();\n';
};

Arduino.forBlock['esp32_ble_client_is_connected'] = function(block, generator) {
  const clientField = block.getField('CLIENT');
  const clientName = clientField ? clientField.getText() : 'pClient';
  
  return [clientName + '->isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_client_get_service'] = function(block, generator) {
  const clientField = block.getField('CLIENT');
  const clientName = clientField ? clientField.getText() : 'pClient';
  const serviceVar = block.getFieldValue('SERVICE_VAR') || 'pRemoteService';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"4fafc201-1fb5-459e-8fcc-c5c9c331914b"';
  
  generator.addLibrary('BLERemoteService', '#include <BLERemoteService.h>');
  registerVariableToBlockly(serviceVar, 'BLERemoteService');
  generator.addVariable('BLERemoteService* ' + serviceVar, 'BLERemoteService* ' + serviceVar + ' = NULL;');
  
  return serviceVar + ' = ' + clientName + '->getService(' + uuid + ');\n';
};

Arduino.forBlock['esp32_ble_remote_service_get_characteristic'] = function(block, generator) {
  const serviceField = block.getField('SERVICE');
  const serviceName = serviceField ? serviceField.getText() : 'pRemoteService';
  const charVar = block.getFieldValue('CHAR_VAR') || 'pRemoteCharacteristic';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"beb5483e-36e1-4688-b7f5-ea07361b26a8"';
  
  generator.addLibrary('BLERemoteCharacteristic', '#include <BLERemoteCharacteristic.h>');
  registerVariableToBlockly(charVar, 'BLERemoteCharacteristic');
  generator.addVariable('BLERemoteCharacteristic* ' + charVar, 'BLERemoteCharacteristic* ' + charVar + ' = NULL;');
  
  return charVar + ' = ' + serviceName + '->getCharacteristic(' + uuid + ');\n';
};

Arduino.forBlock['esp32_ble_remote_characteristic_read'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pRemoteCharacteristic';
  
  return [charName + '->readValue()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_remote_characteristic_write'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pRemoteCharacteristic';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  
  return charName + '->writeValue(' + value + ');\n';
};

Arduino.forBlock['esp32_ble_remote_characteristic_can_read'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pRemoteCharacteristic';
  
  return [charName + '->canRead()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_remote_characteristic_can_notify'] = function(block, generator) {
  const charField = block.getField('CHAR');
  const charName = charField ? charField.getText() : 'pRemoteCharacteristic';
  
  return [charName + '->canNotify()', generator.ORDER_FUNCTION_CALL];
};

// ==================== 扫描 ====================

Arduino.forBlock['esp32_ble_get_scan'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'pBLEScan';
  
  ensureBLELib(generator);
  generator.addLibrary('BLEScan', '#include <BLEScan.h>');
  registerVariableToBlockly(varName, 'BLEScan');
  generator.addVariable('BLEScan* ' + varName, 'BLEScan* ' + varName + ' = NULL;');
  
  return varName + ' = BLEDevice::getScan();\n';
};

Arduino.forBlock['esp32_ble_scan_set_active'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  const active = block.getFieldValue('ACTIVE');
  
  return scanName + '->setActiveScan(' + active + ');\n';
};

Arduino.forBlock['esp32_ble_scan_set_interval'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1349';
  
  return scanName + '->setInterval(' + interval + ');\n';
};

Arduino.forBlock['esp32_ble_scan_set_window'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  const window = generator.valueToCode(block, 'WINDOW', generator.ORDER_ATOMIC) || '449';
  
  return scanName + '->setWindow(' + window + ');\n';
};

Arduino.forBlock['esp32_ble_scan_start'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5';
  
  generator.addVariable('BLEScanResults* bleScanResults', 'BLEScanResults* bleScanResults = NULL;');
  
  return 'bleScanResults = ' + scanName + '->start(' + duration + ', false);\n';
};

Arduino.forBlock['esp32_ble_scan_stop'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  
  return scanName + '->stop();\n';
};

Arduino.forBlock['esp32_ble_scan_get_results'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  
  return [scanName + '->getResults()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_scan_results_count'] = function(block, generator) {
  const results = generator.valueToCode(block, 'RESULTS', generator.ORDER_ATOMIC) || 'bleScanResults';
  
  return [results + '->getCount()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_scan_results_get_device'] = function(block, generator) {
  const results = generator.valueToCode(block, 'RESULTS', generator.ORDER_ATOMIC) || 'bleScanResults';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  generator.addLibrary('BLEAdvertisedDevice', '#include <BLEAdvertisedDevice.h>');
  
  return [results + '->getDevice(' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_advertised_device_name'] = function(block, generator) {
  const device = generator.valueToCode(block, 'DEVICE', generator.ORDER_ATOMIC) || 'device';
  
  return [device + '.getName().c_str()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_advertised_device_address'] = function(block, generator) {
  const device = generator.valueToCode(block, 'DEVICE', generator.ORDER_ATOMIC) || 'device';
  
  return [device + '.getAddress().toString().c_str()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_advertised_device_rssi'] = function(block, generator) {
  const device = generator.valueToCode(block, 'DEVICE', generator.ORDER_ATOMIC) || 'device';
  
  return [device + '.getRSSI()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_ble_scan_clear_results'] = function(block, generator) {
  const scanField = block.getField('SCAN');
  const scanName = scanField ? scanField.getText() : 'pBLEScan';
  
  return scanName + '->clearResults();\n';
};

// ==================== 快速操作 - BLE UART ====================

Arduino.forBlock['esp32_ble_uart_server_quick'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"ESP32-UART"';
  
  ensureBLELib(generator);
  generator.addLibrary('BLE2902', '#include <BLE2902.h>');
  
  // 添加全局变量
  generator.addVariable('ble_uart_server', 'BLEServer* ble_uart_server = NULL;');
  generator.addVariable('ble_uart_tx_char', 'BLECharacteristic* ble_uart_tx_char = NULL;');
  generator.addVariable('ble_uart_rx_char', 'BLECharacteristic* ble_uart_rx_char = NULL;');
  generator.addVariable('ble_uart_connected', 'bool ble_uart_connected = false;');
  generator.addVariable('ble_uart_received_data', 'String ble_uart_received_data = "";');
  
  // 添加回调类
  const serverCallbackClass = 
`class BLEUartServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    ble_uart_connected = true;
  }
  void onDisconnect(BLEServer* pServer) {
    ble_uart_connected = false;
    delay(500);
    pServer->getAdvertising()->start();
  }
};`;
  generator.addFunction('BLEUartServerCallbacks', serverCallbackClass);
  
  const rxCallbackClass = 
`class BLEUartRxCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    ble_uart_received_data = pCharacteristic->getValue();
  }
};`;
  generator.addFunction('BLEUartRxCallbacks', rxCallbackClass);
  
  // 生成初始化代码
  let code = '';
  code += 'BLEDevice::init(' + name + ');\n';
  code += 'ble_uart_server = BLEDevice::createServer();\n';
  code += 'ble_uart_server->setCallbacks(new BLEUartServerCallbacks());\n';
  code += 'BLEService* ble_uart_service = ble_uart_server->createService(' + BLE_UART_SERVICE_UUID + ');\n';
  code += 'ble_uart_tx_char = ble_uart_service->createCharacteristic(' + BLE_UART_TX_UUID + ', BLECharacteristic::PROPERTY_NOTIFY);\n';
  code += 'ble_uart_tx_char->addDescriptor(new BLE2902());\n';
  code += 'ble_uart_rx_char = ble_uart_service->createCharacteristic(' + BLE_UART_RX_UUID + ', BLECharacteristic::PROPERTY_WRITE);\n';
  code += 'ble_uart_rx_char->setCallbacks(new BLEUartRxCallbacks());\n';
  code += 'ble_uart_service->start();\n';
  code += 'ble_uart_server->getAdvertising()->addServiceUUID(' + BLE_UART_SERVICE_UUID + ');\n';
  code += 'ble_uart_server->getAdvertising()->setScanResponse(true);\n';
  code += 'ble_uart_server->getAdvertising()->start();\n';
  
  return code;
};

Arduino.forBlock['esp32_ble_uart_send'] = function(block, generator) {
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  
  let code = '';
  code += 'if (ble_uart_connected) {\n';
  code += '  ble_uart_tx_char->setValue(String(' + data + ').c_str());\n';
  code += '  ble_uart_tx_char->notify();\n';
  code += '}\n';
  
  return code;
};

Arduino.forBlock['esp32_ble_uart_on_receive'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  ensureBLELib(generator);
  generator.addLibrary('BLE2902', '#include <BLE2902.h>');
  
  generator.addVariable('ble_uart_received_data', 'String ble_uart_received_data = "";');
  
  const rxCallbackClass = 
`class BLEUartRxCallbacksWithHandler : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    ble_uart_received_data = pCharacteristic->getValue();
${handlerCode}  }
};`;
  generator.addFunction('BLEUartRxCallbacksWithHandler', rxCallbackClass);
  
  const setupCode = 'ble_uart_rx_char->setCallbacks(new BLEUartRxCallbacksWithHandler());';
  generator.addSetupEnd('ble_uart_rx_callback_setup', setupCode);
  
  return '';
};

Arduino.forBlock['esp32_ble_uart_received_data'] = function(block, generator) {
  return ['ble_uart_received_data', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_ble_uart_is_connected'] = function(block, generator) {
  return ['ble_uart_connected', generator.ORDER_ATOMIC];
};

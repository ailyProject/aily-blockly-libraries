'use strict';

function seeedRpcBleEnsureBase(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core) {
    generator.addLibrary('Seeed_rpcBLEDevice', '#include <rpcBLEDevice.h>');
  } else {
    generator.addLibrary('Seeed_rpcBLEDevice', '#include <rpcBLEDevice.h>');
  }
}

function seeedRpcBleEnsureServer(generator) {
  seeedRpcBleEnsureBase(generator);
  generator.addLibrary('Seeed_BLEServer', '#include <BLEServer.h>');
}

function seeedRpcBleEnsureCharacteristic(generator) {
  seeedRpcBleEnsureServer(generator);
  generator.addLibrary('Seeed_BLECharacteristic', '#include <BLECharacteristic.h>');
}

function seeedRpcBleEnsureAdvertising(generator) {
  seeedRpcBleEnsureBase(generator);
  generator.addLibrary('Seeed_BLEAdvertising', '#include <BLEAdvertising.h>');
}

function seeedRpcBleEnsureScan(generator) {
  seeedRpcBleEnsureBase(generator);
  generator.addLibrary('Seeed_BLEScan', '#include <BLEScan.h>');
  generator.addLibrary('Seeed_BLEAdvertisedDevice', '#include <BLEAdvertisedDevice.h>');
}

function seeedRpcBleEnsureClient(generator) {
  seeedRpcBleEnsureBase(generator);
  generator.addLibrary('Seeed_BLEClient', '#include <BLEClient.h>');
  generator.addLibrary('Seeed_BLEAddress', '#include <BLEAddress.h>');
}

function seeedRpcBleEnsureRemote(generator) {
  seeedRpcBleEnsureClient(generator);
  generator.addLibrary('Seeed_BLERemoteService', '#include <BLERemoteService.h>');
  generator.addLibrary('Seeed_BLERemoteCharacteristic', '#include <BLERemoteCharacteristic.h>');
}

function seeedRpcBleEnsure2902(generator) {
  seeedRpcBleEnsureCharacteristic(generator);
  generator.addLibrary('Seeed_BLE2902', '#include <BLE2902.h>');
}

function seeedRpcBleEnsureBeacon(generator) {
  seeedRpcBleEnsureAdvertising(generator);
  generator.addLibrary('Seeed_BLEBeacon', '#include <BLEBeacon.h>');
}

function seeedRpcBleEnsureSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator);
  }
}

function seeedRpcBleBool(block, fieldName) {
  return block.getFieldValue(fieldName) === 'TRUE' ? 'true' : 'false';
}

function seeedRpcBleAttachInputVarMonitor(block, fieldName, varType, defaultName, flagName) {
  const varName = block.getFieldValue(fieldName) || defaultName;
  registerVariableToBlockly(varName, varType);

  const monitorFlag = flagName || ('_varMonitorAttached_' + fieldName);
  if (block[monitorFlag]) {
    return varName;
  }

  block[monitorFlag] = true;
  block[monitorFlag + 'LastName'] = varName;
  const varField = block.getField(fieldName);
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const oldName = block[monitorFlag + 'LastName'];
      const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      if (workspace && newName && newName !== oldName) {
        renameVariableInBlockly(block, oldName, newName, varType);
        block[monitorFlag + 'LastName'] = newName;
      }
    };
  }

  return varName;
}

function seeedRpcBleGetVar(block, defaultName) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : defaultName;
}

function seeedRpcBleGetFieldVar(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

function seeedRpcBleSafeName(value, fallback) {
  const cleaned = String(value || '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  if (!cleaned || /^[0-9]/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
}

function seeedRpcBleStringExpr(valueCode) {
  return 'std::string(String(' + valueCode + ').c_str())';
}

function seeedRpcBleReceivedVar(prefix, name) {
  return prefix + '_' + seeedRpcBleSafeName(name, 'value');
}

function seeedRpcBleAddScanHelpers(generator) {
  seeedRpcBleEnsureScan(generator);
  generator.addFunction('seeedRpcBleScanResultName',
    'String seeedRpcBleScanResultName(BLEScanResults& results, int index) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  return String(device.getName().c_str());\n' +
    '}\n'
  );
  generator.addFunction('seeedRpcBleScanResultAddress',
    'String seeedRpcBleScanResultAddress(BLEScanResults& results, int index) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  return String(device.getAddress().toString().c_str());\n' +
    '}\n'
  );
  generator.addFunction('seeedRpcBleScanResultRssi',
    'int seeedRpcBleScanResultRssi(BLEScanResults& results, int index) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return 0;\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  return device.getRSSI();\n' +
    '}\n'
  );
  generator.addFunction('seeedRpcBleScanResultServiceUUID',
    'String seeedRpcBleScanResultServiceUUID(BLEScanResults& results, int index) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  if (!device.haveServiceUUID()) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  return String(device.getServiceUUID().toString().c_str());\n' +
    '}\n'
  );
  generator.addFunction('seeedRpcBleScanResultInfo',
    'String seeedRpcBleScanResultInfo(BLEScanResults& results, int index) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  return String(device.toString().c_str());\n' +
    '}\n'
  );
  generator.addFunction('seeedRpcBleScanResultHasService',
    'bool seeedRpcBleScanResultHasService(BLEScanResults& results, int index, String uuid) {\n' +
    '  if (index < 0 || index >= results.getCount()) {\n' +
    '    return false;\n' +
    '  }\n' +
    '  BLEAdvertisedDevice device = results.getDevice((uint32_t)index);\n' +
    '  return device.isAdvertisingService(BLEUUID(uuid.c_str()));\n' +
    '}\n'
  );
}

function seeedRpcBleUartEnsureGlobals(generator) {
  seeedRpcBleEnsure2902(generator);
  generator.addVariable('seeed_rpcble_uart_server', 'BLEServer* seeed_rpcble_uart_server = NULL;');
  generator.addVariable('seeed_rpcble_uart_tx', 'BLECharacteristic* seeed_rpcble_uart_tx = NULL;');
  generator.addVariable('seeed_rpcble_uart_rx', 'BLECharacteristic* seeed_rpcble_uart_rx = NULL;');
  generator.addVariable('seeed_rpcble_uart_connected', 'bool seeed_rpcble_uart_connected = false;');
  generator.addVariable('seeed_rpcble_uart_received', 'String seeed_rpcble_uart_received = "";');
}

function seeedRpcBleBatteryEnsureGlobals(generator) {
  seeedRpcBleEnsure2902(generator);
  generator.addVariable('seeed_rpcble_battery_server', 'BLEServer* seeed_rpcble_battery_server = NULL;');
  generator.addVariable('seeed_rpcble_battery_char', 'BLECharacteristic* seeed_rpcble_battery_char = NULL;');
  generator.addVariable('seeed_rpcble_battery_connected', 'bool seeed_rpcble_battery_connected = false;');
  generator.addVariable('seeed_rpcble_battery_level', 'uint8_t seeed_rpcble_battery_level = 0;');
}

Arduino.forBlock['seeed_rpcble_init'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Wio BLE"';
  seeedRpcBleEnsureBase(generator);
  return 'BLEDevice::init(String(' + name + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcble_deinit'] = function(block, generator) {
  seeedRpcBleEnsureBase(generator);
  return 'BLEDevice::deinit();\n';
};

Arduino.forBlock['seeed_rpcble_is_initialized'] = function(block, generator) {
  seeedRpcBleEnsureBase(generator);
  return ['BLEDevice::getInitialized()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_get_address'] = function(block, generator) {
  seeedRpcBleEnsureBase(generator);
  return ['String(BLEDevice::getAddress().toString().c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_set_mtu'] = function(block, generator) {
  const mtu = generator.valueToCode(block, 'MTU', generator.ORDER_ATOMIC) || '23';
  seeedRpcBleEnsureBase(generator);
  return 'BLEDevice::setMTU(' + mtu + ');\n';
};

Arduino.forBlock['seeed_rpcble_get_mtu'] = function(block, generator) {
  seeedRpcBleEnsureBase(generator);
  return ['BLEDevice::getMTU()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_create_server'] = function(block, generator) {
  const varName = seeedRpcBleAttachInputVarMonitor(block, 'VAR', 'BLEServer', 'pServer', '_seeedRpcBleServer_varMonitorAttached');
  seeedRpcBleEnsureServer(generator);
  generator.addVariable('BLEServer* ' + varName, 'BLEServer* ' + varName + ' = NULL;');
  return varName + ' = BLEDevice::createServer();\n';
};

Arduino.forBlock['seeed_rpcble_server_create_service'] = function(block, generator) {
  const serverName = seeedRpcBleGetFieldVar(block, 'SERVER', 'pServer');
  const serviceVar = seeedRpcBleAttachInputVarMonitor(block, 'SERVICE_VAR', 'BLEService', 'pService', '_seeedRpcBleService_varMonitorAttached');
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"180f"';
  seeedRpcBleEnsureServer(generator);
  generator.addVariable('BLEService* ' + serviceVar, 'BLEService* ' + serviceVar + ' = NULL;');
  return serviceVar + ' = ' + serverName + '->createService(String(' + uuid + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcble_service_start'] = function(block, generator) {
  const serviceName = seeedRpcBleGetVar(block, 'pService');
  return serviceName + '->start();\n';
};

Arduino.forBlock['seeed_rpcble_service_stop'] = function(block, generator) {
  const serviceName = seeedRpcBleGetVar(block, 'pService');
  return serviceName + '->stop();\n';
};

Arduino.forBlock['seeed_rpcble_server_connected_count'] = function(block, generator) {
  const serverName = seeedRpcBleGetVar(block, 'pServer');
  return [serverName + '->getConnectedCount()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_server_set_callbacks'] = function(block, generator) {
  const serverName = seeedRpcBleGetVar(block, 'pServer');
  const connectCode = generator.statementToCode(block, 'ON_CONNECT') || '';
  const disconnectCode = generator.statementToCode(block, 'ON_DISCONNECT') || '';
  const safeName = seeedRpcBleSafeName(serverName, 'server');
  const className = 'SeeedRpcBleServerCallbacks_' + safeName;
  seeedRpcBleEnsureServer(generator);
  generator.addFunction(className,
    'class ' + className + ' : public BLEServerCallbacks {\n' +
    '  void onConnect(BLEServer* pServer) {\n' +
    connectCode +
    '  }\n' +
    '  void onDisconnect(BLEServer* pServer) {\n' +
    disconnectCode +
    '  }\n' +
    '};\n'
  );
  return serverName + '->setCallbacks(new ' + className + '());\n';
};

Arduino.forBlock['seeed_rpcble_create_characteristic'] = function(block, generator) {
  const serviceName = seeedRpcBleGetFieldVar(block, 'SERVICE', 'pService');
  const charVar = seeedRpcBleAttachInputVarMonitor(block, 'CHAR_VAR', 'BLECharacteristic', 'pCharacteristic', '_seeedRpcBleCharacteristic_varMonitorAttached');
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"2a19"';
  const properties = block.getFieldValue('PROPERTIES') || 'BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE';
  seeedRpcBleEnsureCharacteristic(generator);
  generator.addVariable('BLECharacteristic* ' + charVar, 'BLECharacteristic* ' + charVar + ' = NULL;');
  return charVar + ' = ' + serviceName + '->createCharacteristic(String(' + uuid + ').c_str(), ' + properties + ');\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_set_permissions'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const permissions = block.getFieldValue('PERMISSIONS') || 'GATT_PERM_READ | GATT_PERM_WRITE';
  return charName + '->setAccessPermissions(' + permissions + ');\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_add_notify_descriptor'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  seeedRpcBleEnsure2902(generator);
  return charName + '->addDescriptor(new BLE2902());\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_add_descriptor'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"4545"';
  const flags = block.getFieldValue('FLAGS') || 'ATTRIB_FLAG_VOID | ATTRIB_FLAG_ASCII_Z';
  const permissions = block.getFieldValue('PERMISSIONS') || 'GATT_PERM_READ | GATT_PERM_WRITE';
  const maxLen = generator.valueToCode(block, 'MAX_LEN', generator.ORDER_ATOMIC) || '2';
  seeedRpcBleEnsureCharacteristic(generator);
  return charName + '->createDescriptor(String(' + uuid + ').c_str(), ' + flags + ', ' + permissions + ', ' + maxLen + ');\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_set_value'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  return charName + '->setValue(' + seeedRpcBleStringExpr(value) + ');\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_set_byte'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return '{\n  uint8_t seeedRpcBleByteValue = (uint8_t)(' + value + ');\n  ' + charName + '->setValue(&seeedRpcBleByteValue, 1);\n}\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_get_value'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  return ['String(' + charName + '->getValue().c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_characteristic_notify'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  return charName + '->notify();\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_indicate'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  return charName + '->indicate();\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_set_callbacks'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const safeName = seeedRpcBleSafeName(charName, 'characteristic');
  const receivedVar = seeedRpcBleReceivedVar('seeed_rpcble_received', safeName);
  const className = 'SeeedRpcBleCharacteristicCallbacks_' + safeName;
  seeedRpcBleEnsureCharacteristic(generator);
  generator.addVariable(receivedVar, 'String ' + receivedVar + ' = "";');
  generator.addFunction(className,
    'class ' + className + ' : public BLECharacteristicCallbacks {\n' +
    '  void onWrite(BLECharacteristic* pCharacteristic) {\n' +
    '    ' + receivedVar + ' = String(pCharacteristic->getValue().c_str());\n' +
    handlerCode +
    '  }\n' +
    '};\n'
  );
  return charName + '->setCallbacks(new ' + className + '());\n';
};

Arduino.forBlock['seeed_rpcble_characteristic_received_value'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pCharacteristic');
  const safeName = seeedRpcBleSafeName(charName, 'characteristic');
  const receivedVar = seeedRpcBleReceivedVar('seeed_rpcble_received', safeName);
  generator.addVariable(receivedVar, 'String ' + receivedVar + ' = "";');
  return [receivedVar, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_advertising_add_service_uuid'] = function(block, generator) {
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"180f"';
  seeedRpcBleEnsureAdvertising(generator);
  return 'BLEDevice::getAdvertising()->addServiceUUID(String(' + uuid + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcble_advertising_set_scan_response'] = function(block, generator) {
  const enable = seeedRpcBleBool(block, 'ENABLE');
  seeedRpcBleEnsureAdvertising(generator);
  return 'BLEDevice::getAdvertising()->setScanResponse(' + enable + ');\n';
};

Arduino.forBlock['seeed_rpcble_advertising_set_preferred'] = function(block, generator) {
  const minValue = generator.valueToCode(block, 'MIN', generator.ORDER_ATOMIC) || '0x06';
  const maxValue = generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '0x12';
  seeedRpcBleEnsureAdvertising(generator);
  return 'BLEDevice::getAdvertising()->setMinPreferred(' + minValue + ');\n' +
    'BLEDevice::getAdvertising()->setMaxPreferred(' + maxValue + ');\n';
};

Arduino.forBlock['seeed_rpcble_start_advertising'] = function(block, generator) {
  seeedRpcBleEnsureAdvertising(generator);
  return 'BLEDevice::startAdvertising();\n';
};

Arduino.forBlock['seeed_rpcble_stop_advertising'] = function(block, generator) {
  seeedRpcBleEnsureAdvertising(generator);
  return 'BLEDevice::stopAdvertising();\n';
};

Arduino.forBlock['seeed_rpcble_scan_create'] = function(block, generator) {
  const varName = seeedRpcBleAttachInputVarMonitor(block, 'VAR', 'BLEScan', 'pBLEScan', '_seeedRpcBleScan_varMonitorAttached');
  seeedRpcBleEnsureScan(generator);
  generator.addVariable('BLEScan* ' + varName, 'BLEScan* ' + varName + ' = NULL;');
  return varName + ' = BLEDevice::getScan();\n';
};

Arduino.forBlock['seeed_rpcble_scan_set_active'] = function(block, generator) {
  const scanName = seeedRpcBleGetVar(block, 'pBLEScan');
  const active = seeedRpcBleBool(block, 'ACTIVE');
  return scanName + '->setActiveScan(' + active + ');\n';
};

Arduino.forBlock['seeed_rpcble_scan_set_interval'] = function(block, generator) {
  const scanName = seeedRpcBleGetVar(block, 'pBLEScan');
  const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '100';
  return scanName + '->setInterval(' + interval + ');\n';
};

Arduino.forBlock['seeed_rpcble_scan_set_window'] = function(block, generator) {
  const scanName = seeedRpcBleGetVar(block, 'pBLEScan');
  const windowValue = generator.valueToCode(block, 'WINDOW', generator.ORDER_ATOMIC) || '99';
  return scanName + '->setWindow(' + windowValue + ');\n';
};

Arduino.forBlock['seeed_rpcble_scan_start'] = function(block, generator) {
  const scanName = seeedRpcBleGetFieldVar(block, 'SCAN', 'pBLEScan');
  const resultVar = seeedRpcBleAttachInputVarMonitor(block, 'RESULT_VAR', 'BLEScanResults', 'foundDevices', '_seeedRpcBleScanResults_varMonitorAttached');
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5';
  const isContinue = seeedRpcBleBool(block, 'CONTINUE');
  seeedRpcBleEnsureScan(generator);
  generator.addVariable('BLEScanResults ' + resultVar, 'BLEScanResults ' + resultVar + ';');
  return resultVar + ' = ' + scanName + '->start(' + duration + ', ' + isContinue + ');\n';
};

Arduino.forBlock['seeed_rpcble_scan_stop'] = function(block, generator) {
  const scanName = seeedRpcBleGetVar(block, 'pBLEScan');
  return scanName + '->stop();\n';
};

Arduino.forBlock['seeed_rpcble_scan_clear_results'] = function(block, generator) {
  const scanName = seeedRpcBleGetVar(block, 'pBLEScan');
  return scanName + '->clearResults();\n';
};

Arduino.forBlock['seeed_rpcble_scan_results_count'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  return [resultsName + '.getCount()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_name'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultName(' + resultsName + ', ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_address'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultAddress(' + resultsName + ', ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_rssi'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultRssi(' + resultsName + ', ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_service_uuid'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultServiceUUID(' + resultsName + ', ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_info'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultInfo(' + resultsName + ', ' + index + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_scan_result_has_service'] = function(block, generator) {
  const resultsName = seeedRpcBleGetVar(block, 'foundDevices');
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"180f"';
  seeedRpcBleAddScanHelpers(generator);
  return ['seeedRpcBleScanResultHasService(' + resultsName + ', ' + index + ', String(' + uuid + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_create_client'] = function(block, generator) {
  const varName = seeedRpcBleAttachInputVarMonitor(block, 'VAR', 'BLEClient', 'pClient', '_seeedRpcBleClient_varMonitorAttached');
  seeedRpcBleEnsureClient(generator);
  generator.addVariable('BLEClient* ' + varName, 'BLEClient* ' + varName + ' = NULL;');
  return varName + ' = BLEDevice::createClient();\n';
};

Arduino.forBlock['seeed_rpcble_client_connect'] = function(block, generator) {
  const clientName = seeedRpcBleGetVar(block, 'pClient');
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '"00:00:00:00:00:00"';
  const addressType = block.getFieldValue('ADDRESS_TYPE') || 'GAP_REMOTE_ADDR_LE_PUBLIC';
  seeedRpcBleEnsureClient(generator);
  return clientName + '->connect(BLEAddress(String(' + address + ').c_str()), ' + addressType + ');\n';
};

Arduino.forBlock['seeed_rpcble_client_disconnect'] = function(block, generator) {
  const clientName = seeedRpcBleGetVar(block, 'pClient');
  return clientName + '->disconnect();\n';
};

Arduino.forBlock['seeed_rpcble_client_is_connected'] = function(block, generator) {
  const clientName = seeedRpcBleGetVar(block, 'pClient');
  return [clientName + '->isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_client_rssi'] = function(block, generator) {
  const clientName = seeedRpcBleGetVar(block, 'pClient');
  return [clientName + '->getRssi()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_client_get_service'] = function(block, generator) {
  const clientName = seeedRpcBleGetFieldVar(block, 'CLIENT', 'pClient');
  const serviceVar = seeedRpcBleAttachInputVarMonitor(block, 'SERVICE_VAR', 'BLERemoteService', 'pRemoteService', '_seeedRpcBleRemoteService_varMonitorAttached');
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"180f"';
  seeedRpcBleEnsureRemote(generator);
  generator.addVariable('BLERemoteService* ' + serviceVar, 'BLERemoteService* ' + serviceVar + ' = NULL;');
  return serviceVar + ' = ' + clientName + '->getService(String(' + uuid + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcble_remote_service_get_characteristic'] = function(block, generator) {
  const serviceName = seeedRpcBleGetFieldVar(block, 'SERVICE', 'pRemoteService');
  const charVar = seeedRpcBleAttachInputVarMonitor(block, 'CHAR_VAR', 'BLERemoteCharacteristic', 'pRemoteCharacteristic', '_seeedRpcBleRemoteCharacteristic_varMonitorAttached');
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"2a19"';
  seeedRpcBleEnsureRemote(generator);
  generator.addVariable('BLERemoteCharacteristic* ' + charVar, 'BLERemoteCharacteristic* ' + charVar + ' = NULL;');
  return charVar + ' = ' + serviceName + '->getCharacteristic(String(' + uuid + ').c_str());\n';
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_read'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  return ['String(' + charName + '->readValue().c_str())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_write'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  const response = seeedRpcBleBool(block, 'RESPONSE');
  return charName + '->writeValue(' + seeedRpcBleStringExpr(value) + ', ' + response + ');\n';
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_can_read'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  return [charName + '->canRead()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_can_write'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  return [charName + '->canWrite()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_can_notify'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  return [charName + '->canNotify()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_rpcble_remote_characteristic_register_notify'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  const notify = seeedRpcBleBool(block, 'NOTIFY');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const safeName = seeedRpcBleSafeName(charName, 'remoteCharacteristic');
  const notifyVar = seeedRpcBleReceivedVar('seeed_rpcble_notify', safeName);
  const functionName = 'seeedRpcBleNotify_' + safeName;
  seeedRpcBleEnsureRemote(generator);
  generator.addVariable(notifyVar, 'String ' + notifyVar + ' = "";');
  generator.addFunction(functionName,
    'void ' + functionName + '(BLERemoteCharacteristic* pBLERemoteCharacteristic, uint8_t* pData, size_t length, bool isNotify) {\n' +
    '  ' + notifyVar + ' = "";\n' +
    '  for (size_t i = 0; i < length; i++) {\n' +
    '    ' + notifyVar + ' += (char)pData[i];\n' +
    '  }\n' +
    handlerCode +
    '}\n'
  );
  return charName + '->registerForNotify(' + functionName + ', ' + notify + ');\n';
};

Arduino.forBlock['seeed_rpcble_remote_notify_value'] = function(block, generator) {
  const charName = seeedRpcBleGetVar(block, 'pRemoteCharacteristic');
  const safeName = seeedRpcBleSafeName(charName, 'remoteCharacteristic');
  const notifyVar = seeedRpcBleReceivedVar('seeed_rpcble_notify', safeName);
  generator.addVariable(notifyVar, 'String ' + notifyVar + ' = "";');
  return [notifyVar, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_uart_begin'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Wio UART"';
  seeedRpcBleUartEnsureGlobals(generator);
  generator.addFunction('SeeedRpcBleUartServerCallbacks',
    'class SeeedRpcBleUartServerCallbacks : public BLEServerCallbacks {\n' +
    '  void onConnect(BLEServer* pServer) {\n' +
    '    seeed_rpcble_uart_connected = true;\n' +
    '  }\n' +
    '  void onDisconnect(BLEServer* pServer) {\n' +
    '    seeed_rpcble_uart_connected = false;\n' +
    '    pServer->getAdvertising()->start();\n' +
    '  }\n' +
    '};\n'
  );
  generator.addFunction('SeeedRpcBleUartRxCallbacks',
    'class SeeedRpcBleUartRxCallbacks : public BLECharacteristicCallbacks {\n' +
    '  void onWrite(BLECharacteristic* pCharacteristic) {\n' +
    '    seeed_rpcble_uart_received = String(pCharacteristic->getValue().c_str());\n' +
    '  }\n' +
    '};\n'
  );
  generator.addFunction('seeedRpcBleUartSend',
    'void seeedRpcBleUartSend(String data) {\n' +
    '  if (seeed_rpcble_uart_connected && seeed_rpcble_uart_tx != NULL) {\n' +
    '    seeed_rpcble_uart_tx->setValue(std::string(data.c_str()));\n' +
    '    seeed_rpcble_uart_tx->notify();\n' +
    '    delay(10);\n' +
    '  }\n' +
    '}\n'
  );
  let code = '';
  code += 'BLEDevice::init(String(' + name + ').c_str());\n';
  code += 'seeed_rpcble_uart_server = BLEDevice::createServer();\n';
  code += 'seeed_rpcble_uart_server->setCallbacks(new SeeedRpcBleUartServerCallbacks());\n';
  code += 'BLEService* seeed_rpcble_uart_service = seeed_rpcble_uart_server->createService("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");\n';
  code += 'seeed_rpcble_uart_tx = seeed_rpcble_uart_service->createCharacteristic("6E400003-B5A3-F393-E0A9-E50E24DCCA9E", BLECharacteristic::PROPERTY_NOTIFY | BLECharacteristic::PROPERTY_READ);\n';
  code += 'seeed_rpcble_uart_tx->setAccessPermissions(GATT_PERM_READ);\n';
  code += 'seeed_rpcble_uart_tx->addDescriptor(new BLE2902());\n';
  code += 'seeed_rpcble_uart_rx = seeed_rpcble_uart_service->createCharacteristic("6E400002-B5A3-F393-E0A9-E50E24DCCA9E", BLECharacteristic::PROPERTY_WRITE);\n';
  code += 'seeed_rpcble_uart_rx->setAccessPermissions(GATT_PERM_READ | GATT_PERM_WRITE);\n';
  code += 'seeed_rpcble_uart_rx->setCallbacks(new SeeedRpcBleUartRxCallbacks());\n';
  code += 'seeed_rpcble_uart_service->start();\n';
  code += 'seeed_rpcble_uart_server->getAdvertising()->addServiceUUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");\n';
  code += 'seeed_rpcble_uart_server->getAdvertising()->setScanResponse(true);\n';
  code += 'seeed_rpcble_uart_server->getAdvertising()->start();\n';
  return code;
};

Arduino.forBlock['seeed_rpcble_uart_send'] = function(block, generator) {
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  seeedRpcBleUartEnsureGlobals(generator);
  generator.addFunction('seeedRpcBleUartSend',
    'void seeedRpcBleUartSend(String data) {\n' +
    '  if (seeed_rpcble_uart_connected && seeed_rpcble_uart_tx != NULL) {\n' +
    '    seeed_rpcble_uart_tx->setValue(std::string(data.c_str()));\n' +
    '    seeed_rpcble_uart_tx->notify();\n' +
    '    delay(10);\n' +
    '  }\n' +
    '}\n'
  );
  return 'seeedRpcBleUartSend(String(' + data + '));\n';
};

Arduino.forBlock['seeed_rpcble_uart_connected'] = function(block, generator) {
  seeedRpcBleUartEnsureGlobals(generator);
  return ['seeed_rpcble_uart_connected', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_uart_received'] = function(block, generator) {
  seeedRpcBleUartEnsureGlobals(generator);
  return ['seeed_rpcble_uart_received', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_uart_on_receive'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  seeedRpcBleUartEnsureGlobals(generator);
  generator.addFunction('SeeedRpcBleUartRxCallbacksWithHandler',
    'class SeeedRpcBleUartRxCallbacksWithHandler : public BLECharacteristicCallbacks {\n' +
    '  void onWrite(BLECharacteristic* pCharacteristic) {\n' +
    '    seeed_rpcble_uart_received = String(pCharacteristic->getValue().c_str());\n' +
    handlerCode +
    '  }\n' +
    '};\n'
  );
  return 'seeed_rpcble_uart_rx->setCallbacks(new SeeedRpcBleUartRxCallbacksWithHandler());\n';
};

Arduino.forBlock['seeed_rpcble_web_battery_begin'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"BLE Battery"';
  const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_ATOMIC) || '10';
  seeedRpcBleBatteryEnsureGlobals(generator);
  generator.addFunction('SeeedRpcBleBatteryServerCallbacks',
    'class SeeedRpcBleBatteryServerCallbacks : public BLEServerCallbacks {\n' +
    '  void onConnect(BLEServer* pServer) {\n' +
    '    seeed_rpcble_battery_connected = true;\n' +
    '  }\n' +
    '  void onDisconnect(BLEServer* pServer) {\n' +
    '    seeed_rpcble_battery_connected = false;\n' +
    '    pServer->getAdvertising()->start();\n' +
    '  }\n' +
    '};\n'
  );
  generator.addFunction('seeedRpcBleBatterySetLevel',
    'void seeedRpcBleBatterySetLevel(uint8_t level, bool sendNotify) {\n' +
    '  seeed_rpcble_battery_level = level;\n' +
    '  if (seeed_rpcble_battery_char != NULL) {\n' +
    '    seeed_rpcble_battery_char->setValue(&seeed_rpcble_battery_level, 1);\n' +
    '    if (sendNotify && seeed_rpcble_battery_connected) {\n' +
    '      seeed_rpcble_battery_char->notify();\n' +
    '    }\n' +
    '  }\n' +
    '}\n'
  );
  let code = '';
  code += 'BLEDevice::init(String(' + name + ').c_str());\n';
  code += 'seeed_rpcble_battery_server = BLEDevice::createServer();\n';
  code += 'seeed_rpcble_battery_server->setCallbacks(new SeeedRpcBleBatteryServerCallbacks());\n';
  code += 'BLEService* seeed_rpcble_battery_service = seeed_rpcble_battery_server->createService(BLEUUID((uint16_t)0x180F));\n';
  code += 'seeed_rpcble_battery_char = seeed_rpcble_battery_service->createCharacteristic(BLEUUID((uint16_t)0x2A19), BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);\n';
  code += 'seeed_rpcble_battery_char->setAccessPermissions(GATT_PERM_READ | GATT_PERM_WRITE);\n';
  code += 'seeed_rpcble_battery_char->addDescriptor(new BLE2902());\n';
  code += 'seeed_rpcble_battery_service->start();\n';
  code += 'seeed_rpcble_battery_server->getAdvertising()->addServiceUUID(BLEUUID((uint16_t)0x180F));\n';
  code += 'seeed_rpcble_battery_server->getAdvertising()->start();\n';
  code += 'seeedRpcBleBatterySetLevel((uint8_t)(' + level + '), false);\n';
  return code;
};

Arduino.forBlock['seeed_rpcble_web_battery_set_level'] = function(block, generator) {
  const level = generator.valueToCode(block, 'LEVEL', generator.ORDER_ATOMIC) || '0';
  const notify = seeedRpcBleBool(block, 'NOTIFY');
  seeedRpcBleBatteryEnsureGlobals(generator);
  generator.addFunction('seeedRpcBleBatterySetLevel',
    'void seeedRpcBleBatterySetLevel(uint8_t level, bool sendNotify) {\n' +
    '  seeed_rpcble_battery_level = level;\n' +
    '  if (seeed_rpcble_battery_char != NULL) {\n' +
    '    seeed_rpcble_battery_char->setValue(&seeed_rpcble_battery_level, 1);\n' +
    '    if (sendNotify && seeed_rpcble_battery_connected) {\n' +
    '      seeed_rpcble_battery_char->notify();\n' +
    '    }\n' +
    '  }\n' +
    '}\n'
  );
  return 'seeedRpcBleBatterySetLevel((uint8_t)(' + level + '), ' + notify + ');\n';
};

Arduino.forBlock['seeed_rpcble_web_battery_level'] = function(block, generator) {
  seeedRpcBleBatteryEnsureGlobals(generator);
  return ['seeed_rpcble_battery_level', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_web_battery_connected'] = function(block, generator) {
  seeedRpcBleBatteryEnsureGlobals(generator);
  return ['seeed_rpcble_battery_connected', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_rpcble_ibeacon_begin'] = function(block, generator) {
  const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"wio"';
  const uuid = generator.valueToCode(block, 'UUID', generator.ORDER_ATOMIC) || '"8ec76ea3-6668-48da-9866-75be8bc86f4d"';
  const major = generator.valueToCode(block, 'MAJOR', generator.ORDER_ATOMIC) || '0x007B';
  const minor = generator.valueToCode(block, 'MINOR', generator.ORDER_ATOMIC) || '0x01C8';
  const manufacturer = generator.valueToCode(block, 'MANUFACTURER', generator.ORDER_ATOMIC) || '0x4C00';
  const power = generator.valueToCode(block, 'POWER', generator.ORDER_ATOMIC) || '-59';
  const info = generator.valueToCode(block, 'INFO', generator.ORDER_ATOMIC) || '""';
  const scannable = block.getFieldValue('ADV_TYPE') === 'SCAN_IND' ? 'true' : 'false';
  seeedRpcBleEnsureBeacon(generator);
  generator.addVariable('seeed_rpcble_beacon_advertising', 'BLEAdvertising* seeed_rpcble_beacon_advertising = NULL;');
  generator.addFunction('seeedRpcBleStartIBeacon',
    'void seeedRpcBleStartIBeacon(String uuid, uint16_t major, uint16_t minor, uint16_t manufacturerId, int8_t signalPower, String name, String info, bool scannable) {\n' +
    '  BLEBeacon beacon = BLEBeacon();\n' +
    '  beacon.setManufacturerId(manufacturerId);\n' +
    '  beacon.setProximityUUID(BLEUUID(uuid.c_str()));\n' +
    '  beacon.setMajor(major);\n' +
    '  beacon.setMinor(minor);\n' +
    '  beacon.setSignalPower(signalPower);\n' +
    '  BLEAdvertisementData advertisementData = BLEAdvertisementData();\n' +
    '  BLEAdvertisementData scanResponseData = BLEAdvertisementData();\n' +
    '  advertisementData.setFlags(0x04);\n' +
    '  std::string serviceData = "";\n' +
    '  serviceData += (char)26;\n' +
    '  serviceData += (char)0xFF;\n' +
    '  serviceData += beacon.getData();\n' +
    '  advertisementData.addData(serviceData);\n' +
    '  if (name.length() > 0) {\n' +
    '    scanResponseData.setName(std::string(name.c_str()));\n' +
    '  }\n' +
    '  if (info.length() > 0) {\n' +
    '    scanResponseData.setManufacturerData(std::string(info.c_str()));\n' +
    '  }\n' +
    '  seeed_rpcble_beacon_advertising->setAdvertisementData(advertisementData);\n' +
    '  seeed_rpcble_beacon_advertising->setScanResponseData(scanResponseData);\n' +
    '  seeed_rpcble_beacon_advertising->setAdvertisementType(scannable ? GAP_ADTYPE_ADV_SCAN_IND : GAP_ADTYPE_ADV_NONCONN_IND);\n' +
    '  seeed_rpcble_beacon_advertising->start();\n' +
    '}\n'
  );
  let code = '';
  code += 'BLEDevice::init(String(' + name + ').c_str());\n';
  code += 'seeed_rpcble_beacon_advertising = BLEDevice::getAdvertising();\n';
  code += 'seeedRpcBleStartIBeacon(String(' + uuid + '), (uint16_t)(' + major + '), (uint16_t)(' + minor + '), (uint16_t)(' + manufacturer + '), (int8_t)(' + power + '), String(' + name + '), String(' + info + '), ' + scannable + ');\n';
  return code;
};

Arduino.forBlock['seeed_rpcble_ibeacon_stop'] = function(block, generator) {
  seeedRpcBleEnsureBeacon(generator);
  generator.addVariable('seeed_rpcble_beacon_advertising', 'BLEAdvertising* seeed_rpcble_beacon_advertising = NULL;');
  return 'if (seeed_rpcble_beacon_advertising != NULL) {\n  seeed_rpcble_beacon_advertising->stop();\n}\n';
};
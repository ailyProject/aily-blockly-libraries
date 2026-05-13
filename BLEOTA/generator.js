'use strict';

function bleotaGetBoardConfig() {
  return (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
}

function bleotaGetBoardCore() {
  const boardConfig = bleotaGetBoardConfig();
  return boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
}

function bleotaSafeIdentifier(value, fallback) {
  let identifier = String(value || fallback || 'value').replace(/[^A-Za-z0-9_]/g, '_');
  if (!identifier) identifier = fallback || 'value';
  if (/^[0-9]/.test(identifier)) identifier = '_' + identifier;
  return identifier;
}

function bleotaValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function bleotaRegisterVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function bleotaAttachInputVarMonitor(block, fieldName, varType, defaultName, marker) {
  const attachedKey = '_bleota' + marker + '_varMonitorAttached';
  const lastKey = '_bleota' + marker + '_varLastName';
  if (!block[attachedKey]) {
    block[attachedKey] = true;
    block[lastKey] = block.getFieldValue(fieldName) || defaultName;
    bleotaRegisterVariable(block[lastKey], varType);
    const varField = block.getField(fieldName);
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block[lastKey];
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, varType);
          }
          block[lastKey] = newName;
        }
      };
    }
  }
}

function bleotaGetVariableName(block, fieldName, fallback) {
  const varField = block.getField(fieldName);
  return bleotaSafeIdentifier(varField ? varField.getText() : fallback, fallback);
}

function bleotaEnsureLibrary(generator) {
  bleotaGetBoardCore();
  generator.addLibrary('BLEOTA', '#include <BLEOTA.h>');
}

function bleotaEnsureSerial(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator, '115200');
  } else {
    generator.addSetupBegin('bleota_serial_begin', 'Serial.begin(115200);');
  }
}

function bleotaEnsureObjects(generator, otaName, serverName) {
  generator.addObject('bleota_object_' + otaName, 'BLEOTAClass ' + otaName + ';');
  generator.addObject('bleota_server_' + serverName, 'BLEServer* ' + serverName + ' = NULL;');
}

function bleotaEnsureServerCallbacks(generator, serverName) {
  const id = bleotaSafeIdentifier(serverName, 'pServer');
  const connectedVar = 'bleota_device_connected_' + id;
  const oldConnectedVar = 'bleota_old_device_connected_' + id;
  const callbackClass = 'BLEOTAServerCallbacks_' + id;

  generator.addObject('bleota_connection_state_' + id, 'bool ' + connectedVar + ' = false;\nbool ' + oldConnectedVar + ' = false;');

  const classDef = 'class ' + callbackClass + ' : public BLEServerCallbacks {\n' +
    'public:\n' +
    '  void onConnect(BLEServer* pServer) {\n' +
    '    ' + connectedVar + ' = true;\n' +
    '  }\n' +
    '#if defined(CONFIG_BLUEDROID_ENABLED)\n' +
    '  void onConnect(BLEServer* pServer, esp_ble_gatts_cb_param_t* param) {\n' +
    '    ' + connectedVar + ' = true;\n' +
    '    pServer->updateConnParams(param->connect.remote_bda, 0x06, 0x12, 0, 2000);\n' +
    '  }\n' +
    '#endif\n' +
    '  void onDisconnect(BLEServer* pServer) {\n' +
    '    ' + connectedVar + ' = false;\n' +
    '  }\n' +
    '};\n';
  generator.addFunction(callbackClass, classDef);

  return {
    connectedVar: connectedVar,
    oldConnectedVar: oldConnectedVar,
    callbackClass: callbackClass
  };
}

function bleotaEnsureLoopHelper(generator) {
  const functionDef = 'void bleota_loop_service(BLEOTABase& ota, BLEServer* server, bool& deviceConnected, bool& oldDeviceConnected, bool resetAfterUpdate) {\n' +
    '  if (!deviceConnected && oldDeviceConnected) {\n' +
    '    delay(500);\n' +
    '    if (server != NULL) {\n' +
    '      server->startAdvertising();\n' +
    '    }\n' +
    '    oldDeviceConnected = deviceConnected;\n' +
    '  }\n' +
    '  if (deviceConnected && !oldDeviceConnected) {\n' +
    '    oldDeviceConnected = deviceConnected;\n' +
    '  }\n' +
    '  ota.process(resetAfterUpdate);\n' +
    '}\n';
  generator.addFunction('bleota_loop_service', functionDef);
}

function bleotaEnsurePublicKeyHelper(generator) {
  generator.addLibrary('BLEOTA_string', '#include <string.h>');
  const functionDef = 'bool bleota_set_public_key(BLEOTABase& ota, const char* key) {\n' +
    '  if (key == NULL) {\n' +
    '    return true;\n' +
    '  }\n' +
    '  return ota.setKey(key, strlen(key));\n' +
    '}\n\n' +
    'bool bleota_set_public_key(BLEOTABase& ota, const String& key) {\n' +
    '  return ota.setKey(key.c_str(), key.length());\n' +
    '}\n';
  generator.addFunction('bleota_set_public_key', functionDef);
}

function bleotaAdvertisingCode(otaName, scanResponse) {
  return 'BLEDevice::getAdvertising()->addServiceUUID(' + otaName + '.getBLEOTAuuid());\n' +
    'BLEDevice::getAdvertising()->setScanResponse(' + scanResponse + ');\n' +
    'BLEDevice::getAdvertising()->setMinPreferred(0x0);\n' +
    'BLEDevice::startAdvertising();\n';
}

Arduino.forBlock['bleota_begin_auto'] = function(block, generator) {
  const deviceName = bleotaValueToCode(block, generator, 'DEVICE_NAME', '"ESP32-BLE-OTA"');
  const otaName = 'BLEOTA';
  const serverName = 'pServer';

  bleotaEnsureLibrary(generator);
  bleotaEnsureSerial(generator);
  bleotaRegisterVariable(otaName, 'BLEOTAClass');
  bleotaRegisterVariable(serverName, 'BLEServer');
  generator.addObject('bleota_object_' + otaName, 'BLEOTAClass ' + otaName + ';');
  generator.addObject('bleota_server_' + serverName, 'BLEServer* ' + serverName + ' = NULL;');
  const callbackInfo = bleotaEnsureServerCallbacks(generator, serverName);
  bleotaEnsureLoopHelper(generator);
  generator.addLoopBegin('bleota_loop_' + serverName, 'bleota_loop_service(' + otaName + ', ' + serverName + ', ' + callbackInfo.connectedVar + ', ' + callbackInfo.oldConnectedVar + ', true);');

  return 'BLEDevice::init(' + deviceName + ');\n' +
    serverName + ' = BLEDevice::createServer();\n' +
    serverName + '->setCallbacks(new ' + callbackInfo.callbackClass + '());\n' +
    otaName + '.begin(' + serverName + ', false);\n' +
    otaName + '.init();\n' +
    bleotaAdvertisingCode(otaName, 'false') +
    'Serial.println("BLE OTA ready");\n';
};

Arduino.forBlock['bleota_setup'] = function(block, generator) {
  bleotaAttachInputVarMonitor(block, 'VAR', 'BLEOTAClass', 'BLEOTA', 'Ota');
  bleotaAttachInputVarMonitor(block, 'SERVER_VAR', 'BLEServer', 'pServer', 'Server');

  const otaName = bleotaSafeIdentifier(block.getFieldValue('VAR') || 'BLEOTA', 'BLEOTA');
  const serverName = bleotaSafeIdentifier(block.getFieldValue('SERVER_VAR') || 'pServer', 'pServer');
  const deviceName = bleotaValueToCode(block, generator, 'DEVICE_NAME', '"ESP32-BLE-OTA"');
  const secure = block.getFieldValue('SECURE') || 'false';

  bleotaEnsureLibrary(generator);
  bleotaRegisterVariable(otaName, 'BLEOTAClass');
  bleotaRegisterVariable(serverName, 'BLEServer');
  bleotaEnsureObjects(generator, otaName, serverName);
  const callbackInfo = bleotaEnsureServerCallbacks(generator, serverName);

  return 'BLEDevice::init(' + deviceName + ');\n' +
    serverName + ' = BLEDevice::createServer();\n' +
    serverName + '->setCallbacks(new ' + callbackInfo.callbackClass + '());\n' +
    otaName + '.begin(' + serverName + ', ' + secure + ');\n';
};

Arduino.forBlock['bleota_set_public_key'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  const key = bleotaValueToCode(block, generator, 'KEY', '""');

  bleotaEnsureLibrary(generator);
  bleotaEnsurePublicKeyHelper(generator);
  return 'bleota_set_public_key(' + otaName + ', ' + key + ');\n';
};

Arduino.forBlock['bleota_set_device_info'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  const info = block.getFieldValue('INFO') || 'MODEL';
  const value = bleotaValueToCode(block, generator, 'VALUE', '""');
  const setters = {
    MODEL: 'setModel',
    SERIAL_NUMBER: 'setSerialNumber',
    FW_VERSION: 'setFWVersion',
    HW_VERSION: 'setHWVersion',
    MANUFACTURER: 'setManufactuer'
  };

  bleotaEnsureLibrary(generator);
  return otaName + '.' + (setters[info] || 'setModel') + '(' + value + ');\n';
};

Arduino.forBlock['bleota_start_service'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  const serverName = bleotaGetVariableName(block, 'SERVER', 'pServer');
  const scanResponse = block.getFieldValue('SCAN_RESPONSE') || 'false';
  const autoReset = block.getFieldValue('AUTO_RESET') || 'true';

  bleotaEnsureLibrary(generator);
  const callbackInfo = bleotaEnsureServerCallbacks(generator, serverName);
  bleotaEnsureLoopHelper(generator);
  generator.addLoopBegin('bleota_loop_' + serverName, 'bleota_loop_service(' + otaName + ', ' + serverName + ', ' + callbackInfo.connectedVar + ', ' + callbackInfo.oldConnectedVar + ', ' + autoReset + ');');

  return otaName + '.init();\n' + bleotaAdvertisingCode(otaName, scanResponse);
};

Arduino.forBlock['bleota_process'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  const reset = block.getFieldValue('RESET') || 'true';
  bleotaEnsureLibrary(generator);
  return otaName + '.process(' + reset + ');\n';
};

Arduino.forBlock['bleota_abort'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  bleotaEnsureLibrary(generator);
  return otaName + '.abort();\n';
};

Arduino.forBlock['bleota_is_running'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  bleotaEnsureLibrary(generator);
  return [otaName + '.isRunning()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bleota_progress'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  bleotaEnsureLibrary(generator);
  return [otaName + '.progress()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bleota_uuid'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  bleotaEnsureLibrary(generator);
  return [otaName + '.getBLEOTAuuid()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bleota_on_events'] = function(block, generator) {
  const otaName = bleotaGetVariableName(block, 'VAR', 'BLEOTA');
  const id = bleotaSafeIdentifier(otaName, 'BLEOTA');
  const callbackClass = 'BLEOTAEventCallbacks_' + id;
  const beforeOta = generator.statementToCode(block, 'BEFORE_OTA') || '';
  const beforeSpiffs = generator.statementToCode(block, 'BEFORE_SPIFFS') || '';
  const afterStop = generator.statementToCode(block, 'AFTER_STOP') || '';
  const afterAbort = generator.statementToCode(block, 'AFTER_ABORT') || '';

  bleotaEnsureLibrary(generator);
  const classDef = 'class ' + callbackClass + ' : public BLEOTACallbacks {\n' +
    'public:\n' +
    '  void beforeStartOTA() {\n' + beforeOta + '  }\n' +
    '  void beforeStartSPIFFS() {\n' + beforeSpiffs + '  }\n' +
    '  void afterStop() {\n' + afterStop + '  }\n' +
    '  void afterAbort() {\n' + afterAbort + '  }\n' +
    '};\n';
  generator.addFunction(callbackClass, classDef);
  generator.addSetupEnd('bleota_callbacks_' + id, otaName + '.setCallbacks(new ' + callbackClass + '());');
  return '';
};

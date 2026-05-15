'use strict';

function ensureBluefruit52Lib(generator) {
  const boardConfig = (typeof window !== 'undefined') ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('nrf54l15clean') === -1) {
    // Bluefruit52Lib is intended for the nRF54 clean core; the include is still
    // added so generated sketches remain explicit about their dependency.
  }
  generator.addLibrary('Bluefruit52Lib', '#include <bluefruit.h>');
}

function bluefruit52GetVar(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function bluefruit52SafeName(name) {
  const cleaned = String(name || 'var').replace(/[^a-zA-Z0-9_]/g, '_');
  return /^[a-zA-Z_]/.test(cleaned) ? cleaned : '_' + cleaned;
}

function bluefruit52Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function bluefruit52AttachVarMonitor(block, varType, fallback) {
  if (!block._bluefruit52_varMonitorAttached) {
    block._bluefruit52_varMonitorAttached = true;
    block._bluefruit52_varLastName = block.getFieldValue('VAR') || fallback;
    registerVariableToBlockly(block._bluefruit52_varLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._bluefruit52_varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._bluefruit52_varLastName = newName;
        }
      };
    }
  }
}

function ensureBluefruit52CallbackGlobals(generator) {
  ensureBluefruit52Lib(generator);
  generator.addVariable('_bluefruit52_callback_conn_handle', 'static uint16_t _bluefruit52_callback_conn_handle = BLE_CONN_HANDLE_INVALID;');
  generator.addVariable('_bluefruit52_callback_disconnect_reason', 'static uint8_t _bluefruit52_callback_disconnect_reason = 0;');
  generator.addVariable('_bluefruit52_callback_data', 'static String _bluefruit52_callback_data = "";');
}

function ensureBluefruit52StreamHelpers(generator) {
  ensureBluefruit52Lib(generator);
  generator.addFunction('_bluefruit52_read_all',
    'String _bluefruit52_read_all(Stream& stream) {\n' +
    '  String data = "";\n' +
    '  while (stream.available() > 0) {\n' +
    '    int ch = stream.read();\n' +
    '    if (ch < 0) break;\n' +
    '    data += (char)ch;\n' +
    '  }\n' +
    '  return data;\n' +
    '}\n');
}

function ensureBluefruit52CharacteristicHelpers(generator) {
  ensureBluefruit52Lib(generator);
  generator.addFunction('_bluefruit52_characteristic_read_string',
    'String _bluefruit52_characteristic_read_string(BLECharacteristic& chr) {\n' +
    '  char buffer[BLUEFRUIT_GATT_VALUE_MAX_LEN + 1] = {0};\n' +
    '  uint16_t len = chr.read(buffer, BLUEFRUIT_GATT_VALUE_MAX_LEN);\n' +
    '  if (len > BLUEFRUIT_GATT_VALUE_MAX_LEN) len = BLUEFRUIT_GATT_VALUE_MAX_LEN;\n' +
    '  buffer[len] = 0;\n' +
    '  return String(buffer);\n' +
    '}\n');
  generator.addFunction('_bluefruit52_characteristic_write_string',
    'bool _bluefruit52_characteristic_write_string(BLECharacteristic& chr, const String& value) {\n' +
    '  return chr.write(value.c_str()) > 0;\n' +
    '}\n');
  generator.addFunction('_bluefruit52_characteristic_notify_string',
    'bool _bluefruit52_characteristic_notify_string(BLECharacteristic& chr, const String& value) {\n' +
    '  return chr.notify(value.c_str());\n' +
    '}\n');
  generator.addFunction('_bluefruit52_characteristic_indicate_string',
    'bool _bluefruit52_characteristic_indicate_string(BLECharacteristic& chr, const String& value) {\n' +
    '  return chr.indicate(value.c_str());\n' +
    '}\n');
}

function ensureBluefruit52Uuid128Helper(generator) {
  ensureBluefruit52Lib(generator);
  generator.addFunction('_bluefruit52_hex_value',
    'int _bluefruit52_hex_value(char c) {\n' +
    '  if (c >= \'0\' && c <= \'9\') return c - \'0\';\n' +
    '  if (c >= \'a\' && c <= \'f\') return c - \'a\' + 10;\n' +
    '  if (c >= \'A\' && c <= \'F\') return c - \'A\' + 10;\n' +
    '  return -1;\n' +
    '}\n');
  generator.addFunction('_bluefruit52_parse_uuid128',
    'bool _bluefruit52_parse_uuid128(const char* str, uint8_t out[16]) {\n' +
    '  if (str == NULL || out == NULL) return false;\n' +
    '  char hex[32];\n' +
    '  uint8_t used = 0;\n' +
    '  for (uint8_t i = 0; str[i] != 0 && used < sizeof(hex); ++i) {\n' +
    '    if (str[i] == \'-\') continue;\n' +
    '    if (_bluefruit52_hex_value(str[i]) < 0) return false;\n' +
    '    hex[used++] = str[i];\n' +
    '  }\n' +
    '  if (used != 32) return false;\n' +
    '  for (uint8_t i = 0; i < 16; ++i) {\n' +
    '    int hi = _bluefruit52_hex_value(hex[i * 2]);\n' +
    '    int lo = _bluefruit52_hex_value(hex[i * 2 + 1]);\n' +
    '    if (hi < 0 || lo < 0) return false;\n' +
    '    out[i] = (uint8_t)((hi << 4) | lo);\n' +
    '  }\n' +
    '  return true;\n' +
    '}\n');
}

function ensureBluefruit52ScanHelpers(generator) {
  ensureBluefruit52Lib(generator);
  generator.addVariable('_bluefruit52_scan_report', 'static ble_gap_evt_adv_report_t* _bluefruit52_scan_report = NULL;');
  generator.addFunction('_bluefruit52_addr_to_string',
    'String _bluefruit52_addr_to_string(const ble_gap_addr_t& addr) {\n' +
    '  char buffer[18] = {0};\n' +
    '  snprintf(buffer, sizeof(buffer), "%02X:%02X:%02X:%02X:%02X:%02X",\n' +
    '           addr.addr[5], addr.addr[4], addr.addr[3], addr.addr[2], addr.addr[1], addr.addr[0]);\n' +
    '  return String(buffer);\n' +
    '}\n');
  generator.addFunction('_bluefruit52_scan_report_address',
    'String _bluefruit52_scan_report_address() {\n' +
    '  if (_bluefruit52_scan_report == NULL) return String("");\n' +
    '  return _bluefruit52_addr_to_string(_bluefruit52_scan_report->peer_addr);\n' +
    '}\n');
}

function ensureBluefruit52QuickUartGlobals(generator) {
  ensureBluefruit52Lib(generator);
  ensureBluefruit52StreamHelpers(generator);
  generator.addObject('_bluefruit52_quick_dis', 'BLEDis _bluefruit52_quick_dis;');
  generator.addObject('_bluefruit52_quick_uart', 'BLEUart _bluefruit52_quick_uart;');
  generator.addFunction('_bluefruit52_quick_uart_start_adv',
    'void _bluefruit52_quick_uart_start_adv() {\n' +
    '  Bluefruit.Advertising.clearData();\n' +
    '  Bluefruit.ScanResponse.clearData();\n' +
    '  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);\n' +
    '  Bluefruit.Advertising.addTxPower();\n' +
    '  Bluefruit.Advertising.addService(_bluefruit52_quick_uart);\n' +
    '  Bluefruit.Advertising.addName();\n' +
    '  Bluefruit.ScanResponse.addName();\n' +
    '  Bluefruit.Advertising.restartOnDisconnect(true);\n' +
    '  Bluefruit.Advertising.setInterval(32, 244);\n' +
    '  Bluefruit.Advertising.setFastTimeout(30);\n' +
    '  Bluefruit.Advertising.start(0);\n' +
    '}\n');
}

// ==================== 初始化与状态 ====================

Arduino.forBlock['bluefruit52_init'] = function(block, generator) {
  const prphCount = block.getFieldValue('PRPH_COUNT') || '1';
  const centralCount = block.getFieldValue('CENTRAL_COUNT') || '0';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.begin(' + prphCount + ', ' + centralCount + ');\n';
};

Arduino.forBlock['bluefruit52_set_name'] = function(block, generator) {
  const name = bluefruit52Value(block, generator, 'NAME', '"Bluefruit52"');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.setName(String(' + name + ').c_str());\n';
};

Arduino.forBlock['bluefruit52_set_tx_power'] = function(block, generator) {
  const txPower = block.getFieldValue('TX_POWER') || '0';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.setTxPower(' + txPower + ');\n';
};

Arduino.forBlock['bluefruit52_auto_conn_led'] = function(block, generator) {
  const enabled = block.getFieldValue('ENABLED') || 'true';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.autoConnLed(' + enabled + ');\n';
};

Arduino.forBlock['bluefruit52_config_bandwidth'] = function(block, generator) {
  const role = block.getFieldValue('ROLE') || 'Prph';
  const bandwidth = block.getFieldValue('BANDWIDTH') || 'BANDWIDTH_NORMAL';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.config' + role + 'Bandwidth(' + bandwidth + ');\n';
};

Arduino.forBlock['bluefruit52_connected'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return ['Bluefruit.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_disconnect'] = function(block, generator) {
  const handle = bluefruit52Value(block, generator, 'HANDLE', 'Bluefruit.connHandle()');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.disconnect(' + handle + ');\n';
};

Arduino.forBlock['bluefruit52_callback_conn_handle'] = function(block, generator) {
  ensureBluefruit52CallbackGlobals(generator);
  return ['_bluefruit52_callback_conn_handle', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bluefruit52_callback_disconnect_reason'] = function(block, generator) {
  ensureBluefruit52CallbackGlobals(generator);
  return ['_bluefruit52_callback_disconnect_reason', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bluefruit52_callback_data'] = function(block, generator) {
  ensureBluefruit52CallbackGlobals(generator);
  return ['_bluefruit52_callback_data', generator.ORDER_ATOMIC];
};

// ==================== 回调 ====================

Arduino.forBlock['bluefruit52_on_periph_connect'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  generator.addFunction('_bluefruit52_periph_connect_callback',
    'void _bluefruit52_periph_connect_callback(uint16_t conn_handle) {\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    handlerCode +
    '}\n');
  generator.addSetupBegin('_bluefruit52_periph_connect_setup', 'Bluefruit.Periph.setConnectCallback(_bluefruit52_periph_connect_callback);');
  return '';
};

Arduino.forBlock['bluefruit52_on_periph_disconnect'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  generator.addFunction('_bluefruit52_periph_disconnect_callback',
    'void _bluefruit52_periph_disconnect_callback(uint16_t conn_handle, uint8_t reason) {\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    '  _bluefruit52_callback_disconnect_reason = reason;\n' +
    handlerCode +
    '}\n');
  generator.addSetupBegin('_bluefruit52_periph_disconnect_setup', 'Bluefruit.Periph.setDisconnectCallback(_bluefruit52_periph_disconnect_callback);');
  return '';
};

Arduino.forBlock['bluefruit52_on_central_connect'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  generator.addFunction('_bluefruit52_central_connect_callback',
    'void _bluefruit52_central_connect_callback(uint16_t conn_handle) {\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    handlerCode +
    '}\n');
  generator.addSetupBegin('_bluefruit52_central_connect_setup', 'Bluefruit.Central.setConnectCallback(_bluefruit52_central_connect_callback);');
  return '';
};

Arduino.forBlock['bluefruit52_on_central_disconnect'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  generator.addFunction('_bluefruit52_central_disconnect_callback',
    'void _bluefruit52_central_disconnect_callback(uint16_t conn_handle, uint8_t reason) {\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    '  _bluefruit52_callback_disconnect_reason = reason;\n' +
    handlerCode +
    '}\n');
  generator.addSetupBegin('_bluefruit52_central_disconnect_setup', 'Bluefruit.Central.setDisconnectCallback(_bluefruit52_central_disconnect_callback);');
  return '';
};

// ==================== 广播 ====================

Arduino.forBlock['bluefruit52_adv_clear'] = function(block, generator) {
  const target = block.getFieldValue('TARGET') || 'Advertising';
  ensureBluefruit52Lib(generator);
  if (target === 'Both') {
    return 'Bluefruit.Advertising.clearData();\nBluefruit.ScanResponse.clearData();\n';
  }
  return 'Bluefruit.' + target + '.clearData();\n';
};

Arduino.forBlock['bluefruit52_adv_add_flags'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);\n';
};

Arduino.forBlock['bluefruit52_adv_add_tx_power'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.addTxPower();\n';
};

Arduino.forBlock['bluefruit52_adv_add_name'] = function(block, generator) {
  const target = block.getFieldValue('TARGET') || 'Advertising';
  ensureBluefruit52Lib(generator);
  if (target === 'Both') {
    return 'Bluefruit.Advertising.addName();\nBluefruit.ScanResponse.addName();\n';
  }
  return 'Bluefruit.' + target + '.addName();\n';
};

Arduino.forBlock['bluefruit52_adv_add_service'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.addService(' + varName + ');\n';
};

Arduino.forBlock['bluefruit52_adv_add_uuid'] = function(block, generator) {
  const uuid = bluefruit52Value(block, generator, 'UUID', '"BEE0"');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.addService(BLEUuid(' + uuid + '));\n';
};

Arduino.forBlock['bluefruit52_adv_add_appearance'] = function(block, generator) {
  const appearance = block.getFieldValue('APPEARANCE') || 'BLE_APPEARANCE_GENERIC_CLOCK';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.addAppearance(' + appearance + ');\n';
};

Arduino.forBlock['bluefruit52_adv_restart_on_disconnect'] = function(block, generator) {
  const enabled = block.getFieldValue('ENABLED') || 'true';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.restartOnDisconnect(' + enabled + ');\n';
};

Arduino.forBlock['bluefruit52_adv_set_interval'] = function(block, generator) {
  const fast = bluefruit52Value(block, generator, 'FAST', '32');
  const slow = bluefruit52Value(block, generator, 'SLOW', '244');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.setInterval(' + fast + ', ' + slow + ');\n';
};

Arduino.forBlock['bluefruit52_adv_set_initial_timeout'] = function(block, generator) {
  const seconds = bluefruit52Value(block, generator, 'SECONDS', '30');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.setFastTimeout(' + seconds + ');\n';
};

Arduino.forBlock['bluefruit52_adv_start'] = function(block, generator) {
  const timeout = bluefruit52Value(block, generator, 'TIMEOUT', '0');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.start(' + timeout + ');\n';
};

Arduino.forBlock['bluefruit52_adv_stop'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.stop();\n';
};

Arduino.forBlock['bluefruit52_adv_is_running'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return ['Bluefruit.Advertising.isRunning()', generator.ORDER_FUNCTION_CALL];
};

// ==================== BLE UART 外设 ====================

Arduino.forBlock['bluefruit52_bleuart_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEUart', 'bleuart');
  const varName = block.getFieldValue('VAR') || 'bleuart';
  const fifo = bluefruit52Value(block, generator, 'FIFO', '256');
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEUart');
  generator.addObject('BLEUart ' + varName, 'BLEUart ' + varName + '(' + fifo + ');');
  return '';
};

Arduino.forBlock['bluefruit52_bleuart_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_bleuart_write'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  const data = bluefruit52Value(block, generator, 'DATA', '"Hello BLE"');
  ensureBluefruit52Lib(generator);
  return varName + '.print(String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_bleuart_available'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52Lib(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_bleuart_read'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52Lib(generator);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_bleuart_read_string'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52StreamHelpers(generator);
  return ['_bluefruit52_read_all(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_bleuart_notify_enabled'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  ensureBluefruit52Lib(generator);
  return [varName + '.notifyEnabled()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_bleuart_on_receive'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bleuart');
  const safe = bluefruit52SafeName(varName);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  ensureBluefruit52StreamHelpers(generator);
  const callbackName = '_bluefruit52_' + safe + '_rx_callback';
  generator.addFunction(callbackName,
    'void ' + callbackName + '(uint16_t conn_handle) {\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    '  _bluefruit52_callback_data = _bluefruit52_read_all(' + varName + ');\n' +
    handlerCode +
    '}\n');
  return varName + '.setRxCallback(' + callbackName + ');\n';
};

Arduino.forBlock['bluefruit52_bleuart_peripheral_quick'] = function(block, generator) {
  const name = bluefruit52Value(block, generator, 'NAME', '"Bluefruit52-UART"');
  ensureBluefruit52QuickUartGlobals(generator);
  var code = '';
  code += 'Bluefruit.begin(1, 0);\n';
  code += 'Bluefruit.setName(String(' + name + ').c_str());\n';
  code += 'Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);\n';
  code += '_bluefruit52_quick_dis.setManufacturer("SeeedStudio");\n';
  code += '_bluefruit52_quick_dis.setModel("XIAO nRF54L15");\n';
  code += '_bluefruit52_quick_dis.begin();\n';
  code += '_bluefruit52_quick_uart.begin();\n';
  code += '_bluefruit52_quick_uart_start_adv();\n';
  return code;
};

Arduino.forBlock['bluefruit52_bleuart_quick_send'] = function(block, generator) {
  const data = bluefruit52Value(block, generator, 'DATA', '"Hello BLE"');
  ensureBluefruit52QuickUartGlobals(generator);
  return '_bluefruit52_quick_uart.print(String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_bleuart_quick_received_data'] = function(block, generator) {
  ensureBluefruit52QuickUartGlobals(generator);
  return ['_bluefruit52_read_all(_bluefruit52_quick_uart)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_bleuart_quick_connected'] = function(block, generator) {
  ensureBluefruit52QuickUartGlobals(generator);
  return ['Bluefruit.connected()', generator.ORDER_FUNCTION_CALL];
};

// ==================== GATT 服务和特征 ====================

Arduino.forBlock['bluefruit52_service_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEService', 'customService');
  const varName = block.getFieldValue('VAR') || 'customService';
  const uuid = bluefruit52Value(block, generator, 'UUID', '"BEE0"');
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEService');
  generator.addObject('BLEService ' + varName, 'BLEService ' + varName + ';');
  return varName + '.setUuid(BLEUuid(' + uuid + '));\n';
};

Arduino.forBlock['bluefruit52_service_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customService');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_characteristic_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLECharacteristic', 'customChar');
  const varName = block.getFieldValue('VAR') || 'customChar';
  const uuid = bluefruit52Value(block, generator, 'UUID', '"BEE1"');
  const properties = block.getFieldValue('PROPERTIES') || 'CHR_PROPS_READ | CHR_PROPS_NOTIFY';
  const maxLen = bluefruit52Value(block, generator, 'MAX_LEN', '20');
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLECharacteristic');
  generator.addObject('BLECharacteristic ' + varName, 'BLECharacteristic ' + varName + ';');
  return varName + '.setUuid(BLEUuid(' + uuid + '));\n' +
         varName + '.setProperties(' + properties + ');\n' +
         varName + '.setMaxLen(' + maxLen + ');\n';
};

Arduino.forBlock['bluefruit52_characteristic_set_permission'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  const readPerm = block.getFieldValue('READ_PERM') || 'SECMODE_OPEN';
  const writePerm = block.getFieldValue('WRITE_PERM') || 'SECMODE_OPEN';
  ensureBluefruit52Lib(generator);
  return varName + '.setPermission(' + readPerm + ', ' + writePerm + ');\n';
};

Arduino.forBlock['bluefruit52_characteristic_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_characteristic_write_text'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  const data = bluefruit52Value(block, generator, 'DATA', '"value"');
  ensureBluefruit52CharacteristicHelpers(generator);
  return '_bluefruit52_characteristic_write_string(' + varName + ', String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_characteristic_notify_text'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  const data = bluefruit52Value(block, generator, 'DATA', '"notify"');
  ensureBluefruit52CharacteristicHelpers(generator);
  return '_bluefruit52_characteristic_notify_string(' + varName + ', String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_characteristic_indicate_text'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  const data = bluefruit52Value(block, generator, 'DATA', '"indicate"');
  ensureBluefruit52CharacteristicHelpers(generator);
  return '_bluefruit52_characteristic_indicate_string(' + varName + ', String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_characteristic_read_string'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  ensureBluefruit52CharacteristicHelpers(generator);
  return ['_bluefruit52_characteristic_read_string(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_characteristic_notify_enabled'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  ensureBluefruit52Lib(generator);
  return [varName + '.notifyEnabled()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_characteristic_on_write'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'customChar');
  const safe = bluefruit52SafeName(varName);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  const callbackName = '_bluefruit52_' + safe + '_write_callback';
  generator.addFunction(callbackName,
    'void ' + callbackName + '(uint16_t conn_handle, BLECharacteristic* chr, uint8_t* data, uint16_t len) {\n' +
    '  (void)chr;\n' +
    '  _bluefruit52_callback_conn_handle = conn_handle;\n' +
    '  _bluefruit52_callback_data = "";\n' +
    '  for (uint16_t i = 0; i < len; ++i) _bluefruit52_callback_data += (char)data[i];\n' +
    handlerCode +
    '}\n');
  return varName + '.setWriteCallback(' + callbackName + ');\n';
};

// ==================== 标准服务 ====================

Arduino.forBlock['bluefruit52_dis_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEDis', 'bledis');
  const varName = block.getFieldValue('VAR') || 'bledis';
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEDis');
  generator.addObject('BLEDis ' + varName, 'BLEDis ' + varName + ';');
  return '';
};

Arduino.forBlock['bluefruit52_dis_set'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bledis');
  const field = block.getFieldValue('FIELD') || 'setManufacturer';
  const value = bluefruit52Value(block, generator, 'VALUE', '"SeeedStudio"');
  const safe = bluefruit52SafeName(varName + '_' + field);
  ensureBluefruit52Lib(generator);
  generator.addVariable('_bluefruit52_dis_' + safe, 'static char _bluefruit52_dis_' + safe + '[64] = {0};');
  return '{\n' +
         '  String _bluefruit52_text = String(' + value + ');\n' +
         '  _bluefruit52_text.toCharArray(_bluefruit52_dis_' + safe + ', sizeof(_bluefruit52_dis_' + safe + '));\n' +
         '  ' + varName + '.' + field + '(_bluefruit52_dis_' + safe + ');\n' +
         '}\n';
};

Arduino.forBlock['bluefruit52_dis_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'bledis');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_bas_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEBas', 'blebas');
  const varName = block.getFieldValue('VAR') || 'blebas';
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEBas');
  generator.addObject('BLEBas ' + varName, 'BLEBas ' + varName + ';');
  return '';
};

Arduino.forBlock['bluefruit52_bas_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blebas');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_bas_write'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blebas');
  const level = bluefruit52Value(block, generator, 'LEVEL', '100');
  ensureBluefruit52Lib(generator);
  return varName + '.write((uint8_t)(' + level + '));\n';
};

Arduino.forBlock['bluefruit52_bas_notify'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blebas');
  const level = bluefruit52Value(block, generator, 'LEVEL', '100');
  ensureBluefruit52Lib(generator);
  return varName + '.notify((uint8_t)(' + level + '));\n';
};

// ==================== 扫描与中心端 ====================

Arduino.forBlock['bluefruit52_scanner_config'] = function(block, generator) {
  const interval = bluefruit52Value(block, generator, 'INTERVAL', '160');
  const windowValue = bluefruit52Value(block, generator, 'WINDOW', '80');
  const active = block.getFieldValue('ACTIVE') || 'false';
  const restart = block.getFieldValue('RESTART') || 'true';
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Scanner.setInterval(' + interval + ', ' + windowValue + ');\n' +
         'Bluefruit.Scanner.useActiveScan(' + active + ');\n' +
         'Bluefruit.Scanner.restartOnDisconnect(' + restart + ');\n';
};

Arduino.forBlock['bluefruit52_scanner_start'] = function(block, generator) {
  const timeout = bluefruit52Value(block, generator, 'TIMEOUT', '0');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Scanner.start(' + timeout + ');\n';
};

Arduino.forBlock['bluefruit52_scanner_stop'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Scanner.stop();\n';
};

Arduino.forBlock['bluefruit52_scanner_resume'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Scanner.resume();\n';
};

Arduino.forBlock['bluefruit52_scanner_filter_uuid'] = function(block, generator) {
  const uuid = bluefruit52Value(block, generator, 'UUID', '"6E400001-B5A3-F393-E0A9-E50E24DCCA9E"');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Scanner.filterUuid(BLEUuid(' + uuid + '));\n';
};

Arduino.forBlock['bluefruit52_on_scan_report'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52ScanHelpers(generator);
  generator.addFunction('_bluefruit52_scan_callback',
    'void _bluefruit52_scan_callback(ble_gap_evt_adv_report_t* report) {\n' +
    '  _bluefruit52_scan_report = report;\n' +
    handlerCode +
    '}\n');
  generator.addSetupBegin('_bluefruit52_scan_callback_setup', 'Bluefruit.Scanner.setRxCallback(_bluefruit52_scan_callback);');
  return '';
};

Arduino.forBlock['bluefruit52_scan_report_rssi'] = function(block, generator) {
  ensureBluefruit52ScanHelpers(generator);
  return ['(_bluefruit52_scan_report ? _bluefruit52_scan_report->rssi : 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bluefruit52_scan_report_address'] = function(block, generator) {
  ensureBluefruit52ScanHelpers(generator);
  return ['_bluefruit52_scan_report_address()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_scan_report_has_uuid'] = function(block, generator) {
  const uuid = bluefruit52Value(block, generator, 'UUID', '"6E400001-B5A3-F393-E0A9-E50E24DCCA9E"');
  ensureBluefruit52ScanHelpers(generator);
  return ['(_bluefruit52_scan_report && Bluefruit.Scanner.checkReportForUuid(_bluefruit52_scan_report, BLEUuid(' + uuid + ')))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bluefruit52_central_connect_report'] = function(block, generator) {
  ensureBluefruit52ScanHelpers(generator);
  return 'if (_bluefruit52_scan_report != NULL) {\n  Bluefruit.Central.connect(_bluefruit52_scan_report);\n}\n';
};

Arduino.forBlock['bluefruit52_central_connected'] = function(block, generator) {
  ensureBluefruit52Lib(generator);
  return ['Bluefruit.Central.connected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_client_uart_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEClientUart', 'clientUart');
  const varName = block.getFieldValue('VAR') || 'clientUart';
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEClientUart');
  generator.addObject('BLEClientUart ' + varName, 'BLEClientUart ' + varName + ';');
  return '';
};

Arduino.forBlock['bluefruit52_client_uart_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_client_uart_discover'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  const handle = bluefruit52Value(block, generator, 'HANDLE', '_bluefruit52_callback_conn_handle');
  ensureBluefruit52Lib(generator);
  return varName + '.discover(' + handle + ');\n';
};

Arduino.forBlock['bluefruit52_client_uart_enable_txd'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  ensureBluefruit52Lib(generator);
  return varName + '.enableTXD();\n';
};

Arduino.forBlock['bluefruit52_client_uart_write'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  const data = bluefruit52Value(block, generator, 'DATA', '"Hello"');
  ensureBluefruit52Lib(generator);
  return varName + '.print(String(' + data + '));\n';
};

Arduino.forBlock['bluefruit52_client_uart_read_string'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  ensureBluefruit52StreamHelpers(generator);
  return ['_bluefruit52_read_all(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bluefruit52_client_uart_on_receive'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'clientUart');
  const safe = bluefruit52SafeName(varName);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  ensureBluefruit52CallbackGlobals(generator);
  ensureBluefruit52StreamHelpers(generator);
  const callbackName = '_bluefruit52_' + safe + '_client_uart_rx_callback';
  generator.addFunction(callbackName,
    'void ' + callbackName + '(BLEClientUart& uart_svc) {\n' +
    '  _bluefruit52_callback_conn_handle = uart_svc.connHandle();\n' +
    '  _bluefruit52_callback_data = _bluefruit52_read_all(uart_svc);\n' +
    handlerCode +
    '}\n');
  return varName + '.setRxCallback(' + callbackName + ');\n';
};

// ==================== HID ====================

Arduino.forBlock['bluefruit52_hid_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEHidAdafruit', 'blehid');
  const varName = block.getFieldValue('VAR') || 'blehid';
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'BLEHidAdafruit');
  generator.addObject('BLEHidAdafruit ' + varName, 'BLEHidAdafruit ' + varName + ';');
  return '';
};

Arduino.forBlock['bluefruit52_hid_begin'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  ensureBluefruit52Lib(generator);
  return varName + '.begin();\n';
};

Arduino.forBlock['bluefruit52_hid_key_press'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  const charValue = bluefruit52Value(block, generator, 'CHAR', '"A"');
  ensureBluefruit52Lib(generator);
  return '{\n' +
         '  String _bluefruit52_key = String(' + charValue + ');\n' +
         '  if (_bluefruit52_key.length() > 0) ' + varName + '.keyPress(_bluefruit52_key.charAt(0));\n' +
         '}\n';
};

Arduino.forBlock['bluefruit52_hid_key_release'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  ensureBluefruit52Lib(generator);
  return varName + '.keyRelease();\n';
};

Arduino.forBlock['bluefruit52_hid_key_sequence'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  const text = bluefruit52Value(block, generator, 'TEXT', '"Hello"');
  const interval = bluefruit52Value(block, generator, 'INTERVAL', '5');
  ensureBluefruit52Lib(generator);
  return varName + '.keySequence(String(' + text + ').c_str(), ' + interval + ');\n';
};

Arduino.forBlock['bluefruit52_hid_mouse_move'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  const x = bluefruit52Value(block, generator, 'X', '0');
  const y = bluefruit52Value(block, generator, 'Y', '0');
  ensureBluefruit52Lib(generator);
  return varName + '.mouseMove((int8_t)(' + x + '), (int8_t)(' + y + '));\n';
};

Arduino.forBlock['bluefruit52_hid_mouse_press'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  const button = block.getFieldValue('BUTTON') || 'MOUSE_BUTTON_LEFT';
  ensureBluefruit52Lib(generator);
  return varName + '.mouseButtonPress(' + button + ');\n';
};

Arduino.forBlock['bluefruit52_hid_mouse_release'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  ensureBluefruit52Lib(generator);
  return varName + '.mouseButtonRelease();\n';
};

Arduino.forBlock['bluefruit52_hid_mouse_scroll'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'blehid');
  const amount = bluefruit52Value(block, generator, 'AMOUNT', '1');
  ensureBluefruit52Lib(generator);
  return varName + '.mouseScroll((int8_t)(' + amount + '));\n';
};

// ==================== Beacon ====================

Arduino.forBlock['bluefruit52_beacon_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'BLEBeacon', 'beacon');
  const varName = block.getFieldValue('VAR') || 'beacon';
  const uuid = bluefruit52Value(block, generator, 'UUID', '"01122334-4556-6778-899A-ABBCCDDEEFF0"');
  const major = bluefruit52Value(block, generator, 'MAJOR', '1');
  const minor = bluefruit52Value(block, generator, 'MINOR', '1');
  const rssi = bluefruit52Value(block, generator, 'RSSI', '-54');
  const safe = bluefruit52SafeName(varName);
  ensureBluefruit52Uuid128Helper(generator);
  registerVariableToBlockly(varName, 'BLEBeacon');
  generator.addObject('BLEBeacon ' + varName, 'BLEBeacon ' + varName + ';');
  generator.addVariable('_bluefruit52_uuid_' + safe, 'static uint8_t _bluefruit52_uuid_' + safe + '[16] = {0};');
  return '_bluefruit52_parse_uuid128(String(' + uuid + ').c_str(), _bluefruit52_uuid_' + safe + ');\n' +
         varName + '.setUuid(_bluefruit52_uuid_' + safe + ');\n' +
         varName + '.setMajorMinor((uint16_t)(' + major + '), (uint16_t)(' + minor + '));\n' +
         varName + '.setRssiAt1m((int8_t)(' + rssi + '));\n';
};

Arduino.forBlock['bluefruit52_beacon_set_manufacturer'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'beacon');
  const companyId = bluefruit52Value(block, generator, 'COMPANY_ID', '0x0059');
  ensureBluefruit52Lib(generator);
  return varName + '.setManufacturer((uint16_t)(' + companyId + '));\n';
};

Arduino.forBlock['bluefruit52_eddystone_create'] = function(block, generator) {
  bluefruit52AttachVarMonitor(block, 'EddyStoneUrl', 'eddyUrl');
  const varName = block.getFieldValue('VAR') || 'eddyUrl';
  const url = bluefruit52Value(block, generator, 'URL', '"https://www.adafruit.com"');
  const rssi = bluefruit52Value(block, generator, 'RSSI', '-40');
  const safe = bluefruit52SafeName(varName);
  ensureBluefruit52Lib(generator);
  registerVariableToBlockly(varName, 'EddyStoneUrl');
  generator.addObject('EddyStoneUrl ' + varName, 'EddyStoneUrl ' + varName + ';');
  generator.addVariable('_bluefruit52_eddy_url_' + safe, 'static char _bluefruit52_eddy_url_' + safe + '[96] = {0};');
  return '{\n' +
         '  String _bluefruit52_url = String(' + url + ');\n' +
         '  _bluefruit52_url.toCharArray(_bluefruit52_eddy_url_' + safe + ', sizeof(_bluefruit52_eddy_url_' + safe + '));\n' +
         '  ' + varName + '.setUrl(_bluefruit52_eddy_url_' + safe + ');\n' +
         '  ' + varName + '.setRssi((int8_t)(' + rssi + '));\n' +
         '}\n';
};

Arduino.forBlock['bluefruit52_adv_set_beacon'] = function(block, generator) {
  const varName = bluefruit52GetVar(block, 'beacon');
  ensureBluefruit52Lib(generator);
  return 'Bluefruit.Advertising.setBeacon(' + varName + ');\n';
};
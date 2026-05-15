'use strict';

function ensureQuickEspNowLibrary(generator) {
  generator.addLibrary('QuickEspNow', '#include <QuickEspNow.h>');
}

function registerQuickEspNowGlobalAlias() {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly('quickEspNow', 'QuickEspNowGlobal');
  }
}

function attachQuickEspNowMonitor(block) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = 'quickEspNow';
    registerQuickEspNowGlobalAlias();

    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace =
          block.workspace ||
          (typeof Blockly !== 'undefined' &&
            Blockly.getMainWorkspace &&
            Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (
          workspace &&
          newName &&
          newName !== oldName &&
          typeof renameVariableInBlockly === 'function'
        ) {
          renameVariableInBlockly(block, oldName, newName, 'QuickEspNowGlobal');
          block._varLastName = newName;
        }
      };
    }
  }
}

function getQuickEspNowBoardConfig() {
  const boardConfig =
    typeof window !== 'undefined' ? window['boardConfig'] : undefined;
  return boardConfig;
}

function ensureQuickEspNowGlobals(generator) {
  ensureQuickEspNowLibrary(generator);

  generator.addVariable('_quickespnow_rx_message', 'String _quickespnow_rx_message = "";');
  generator.addVariable('_quickespnow_rx_length', 'int _quickespnow_rx_length = 0;');
  generator.addVariable('_quickespnow_rx_rssi', 'int _quickespnow_rx_rssi = 0;');
  generator.addVariable('_quickespnow_rx_is_broadcast', 'bool _quickespnow_rx_is_broadcast = false;');
  generator.addVariable('_quickespnow_rx_sender_mac', 'String _quickespnow_rx_sender_mac = "";');
  generator.addVariable('_quickespnow_tx_target_mac', 'String _quickespnow_tx_target_mac = "";');
  generator.addVariable('_quickespnow_tx_status', 'int _quickespnow_tx_status = -1;');
  generator.addVariable('_quickespnow_last_send_result', 'int _quickespnow_last_send_result = 0;');

  generator.addFunction(
    '_quickespnow_parse_mac',
    'bool _quickespnow_parse_mac(const String& macText, uint8_t* address) {\n' +
    '  unsigned int values[6] = {0};\n' +
    '  if (sscanf(macText.c_str(), "%x:%x:%x:%x:%x:%x", &values[0], &values[1], &values[2], &values[3], &values[4], &values[5]) != 6) {\n' +
    '    return false;\n' +
    '  }\n' +
    '  for (int i = 0; i < 6; ++i) {\n' +
    '    address[i] = static_cast<uint8_t>(values[i]);\n' +
    '  }\n' +
    '  return true;\n' +
    '}\n'
  );

  generator.addFunction(
    '_quickespnow_mac_to_string',
    'String _quickespnow_mac_to_string(const uint8_t* address) {\n' +
    '  if (address == nullptr) {\n' +
    '    return String("");\n' +
    '  }\n' +
    '  char buffer[18] = {0};\n' +
    '  snprintf(buffer, sizeof(buffer), "%02X:%02X:%02X:%02X:%02X:%02X",\n' +
    '           address[0], address[1], address[2], address[3], address[4], address[5]);\n' +
    '  return String(buffer);\n' +
    '}\n'
  );

  generator.addFunction(
    '_quickespnow_buffer_to_string',
    'String _quickespnow_buffer_to_string(const uint8_t* data, size_t len) {\n' +
    '  String value = "";\n' +
    '  for (size_t i = 0; i < len; ++i) {\n' +
    '    value += static_cast<char>(data[i]);\n' +
    '  }\n' +
    '  return value;\n' +
    '}\n'
  );

  generator.addFunction(
    '_quickespnow_send_text_to_mac',
    'int _quickespnow_send_text_to_mac(const String& macText, const String& message) {\n' +
    '  uint8_t address[6] = {0};\n' +
    '  if (!_quickespnow_parse_mac(macText, address)) {\n' +
    '    return COMMS_SEND_PARAM_ERROR;\n' +
    '  }\n' +
    '  return quickEspNow.send(address, reinterpret_cast<const uint8_t*>(message.c_str()), message.length());\n' +
    '}\n'
  );

  generator.addFunction(
    '_quickespnow_send_broadcast_text',
    'int _quickespnow_send_broadcast_text(const String& message) {\n' +
    '  return quickEspNow.sendBcast(reinterpret_cast<const uint8_t*>(message.c_str()), message.length());\n' +
    '}\n'
  );
}

Arduino.forBlock['quickespnow_init_current'] = function(block, generator) {
  const iface = block.getFieldValue('INTERFACE') || '0';
  const sendMode = block.getFieldValue('SEND_MODE') || 'true';
  const boardConfig = getQuickEspNowBoardConfig();

  attachQuickEspNowMonitor(block);
  ensureQuickEspNowLibrary(generator);

  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    registerQuickEspNowGlobalAlias();
  }

  return 'quickEspNow.begin(CURRENT_WIFI_CHANNEL, ' + iface + ', ' + sendMode + ');\n';
};

Arduino.forBlock['quickespnow_init_channel'] = function(block, generator) {
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';
  const iface = block.getFieldValue('INTERFACE') || '0';
  const sendMode = block.getFieldValue('SEND_MODE') || 'true';
  const boardConfig = getQuickEspNowBoardConfig();

  attachQuickEspNowMonitor(block);
  ensureQuickEspNowLibrary(generator);

  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    registerQuickEspNowGlobalAlias();
  }

  return 'quickEspNow.begin(' + channel + ', ' + iface + ', ' + sendMode + ');\n';
};

Arduino.forBlock['quickespnow_begin_current'] = Arduino.forBlock['quickespnow_init_current'];
Arduino.forBlock['quickespnow_begin_channel'] = Arduino.forBlock['quickespnow_init_channel'];

Arduino.forBlock['quickespnow_stop'] = function(block, generator) {
  ensureQuickEspNowLibrary(generator);

  return 'quickEspNow.stop();\n';
};

Arduino.forBlock['quickespnow_set_channel'] = function(block, generator) {
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '1';

  ensureQuickEspNowLibrary(generator);

  return 'quickEspNow.setChannel(' + channel + ');\n';
};

Arduino.forBlock['quickespnow_enable_transmit'] = function(block, generator) {
  const enable = generator.valueToCode(block, 'ENABLE', generator.ORDER_ATOMIC) || 'true';

  ensureQuickEspNowLibrary(generator);

  return 'quickEspNow.enableTransmit(' + enable + ');\n';
};

Arduino.forBlock['quickespnow_send_text'] = function(block, generator) {
  const mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"FF:FF:FF:FF:FF:FF"';
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';

  ensureQuickEspNowGlobals(generator);

  return '_quickespnow_last_send_result = _quickespnow_send_text_to_mac(String(' + mac + '), String(' + message + '));\n';
};

Arduino.forBlock['quickespnow_send_broadcast_text'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';

  ensureQuickEspNowGlobals(generator);

  return '_quickespnow_last_send_result = _quickespnow_send_broadcast_text(String(' + message + '));\n';
};

Arduino.forBlock['quickespnow_on_received'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureQuickEspNowGlobals(generator);

  const functionDef =
    'void _quickespnow_on_received_handler(uint8_t* address, uint8_t* data, uint8_t len, signed int rssi, bool broadcast) {\n' +
    '  _quickespnow_rx_sender_mac = _quickespnow_mac_to_string(address);\n' +
    '  _quickespnow_rx_message = _quickespnow_buffer_to_string(data, len);\n' +
    '  _quickespnow_rx_length = len;\n' +
    '  _quickespnow_rx_rssi = rssi;\n' +
    '  _quickespnow_rx_is_broadcast = broadcast;\n' +
         handlerCode +
    '}\n';

  generator.addFunction('_quickespnow_on_received_handler', functionDef);
  generator.addSetupEnd('quickespnow_on_received_setup', 'quickEspNow.onDataRcvd(_quickespnow_on_received_handler);');

  return '';
};

Arduino.forBlock['quickespnow_on_sent'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureQuickEspNowGlobals(generator);

  const functionDef =
    'void _quickespnow_on_sent_handler(uint8_t* address, uint8_t status) {\n' +
    '  _quickespnow_tx_target_mac = _quickespnow_mac_to_string(address);\n' +
    '  _quickespnow_tx_status = status;\n' +
         handlerCode +
    '}\n';

  generator.addFunction('_quickespnow_on_sent_handler', functionDef);
  generator.addSetupEnd('quickespnow_on_sent_setup', 'quickEspNow.onDataSent(_quickespnow_on_sent_handler);');

  return '';
};

Arduino.forBlock['quickespnow_ready_to_send'] = function(block, generator) {
  ensureQuickEspNowLibrary(generator);

  return ['quickEspNow.readyToSendData()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['quickespnow_last_send_result'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_last_send_result', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_get_max_message_length'] = function(block, generator) {
  ensureQuickEspNowLibrary(generator);

  return ['quickEspNow.getMaxMessageLength()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['quickespnow_get_address_length'] = function(block, generator) {
  ensureQuickEspNowLibrary(generator);

  return ['quickEspNow.getAddressLength()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['quickespnow_received_message'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_rx_message', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_received_length'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_rx_length', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_received_rssi'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_rx_rssi', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_received_is_broadcast'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_rx_is_broadcast', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_received_sender_mac'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_rx_sender_mac', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_sent_target_mac'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_tx_target_mac', generator.ORDER_ATOMIC];
};

Arduino.forBlock['quickespnow_sent_status'] = function(block, generator) {
  ensureQuickEspNowGlobals(generator);

  return ['_quickespnow_tx_status', generator.ORDER_ATOMIC];
};
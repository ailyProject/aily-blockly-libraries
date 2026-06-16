'use strict';

function ailyUsbSafeName(name, fallback) {
  const raw = String(name || fallback || 'value').trim();
  const safe = raw.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]+/, '');
  return safe || fallback || 'value';
}

function ailyUsbOrder(generator) {
  return generator.ORDER_ATOMIC || (typeof Arduino !== 'undefined' ? Arduino.ORDER_ATOMIC : 0) || 0;
}

function ailyUsbValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, ailyUsbOrder(generator)) || fallback;
}

function ailyUsbRegisterVariable(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function ensureUsbSoftHost(generator) {
  generator.addLibrary('ESP32_USB_Soft_Host_FORCE_TEMPLATED_NOPS', '#define FORCE_TEMPLATED_NOPS');
  generator.addLibrary('ESP32_USB_Soft_Host', '#include <ESP32-USB-Soft-Host.h>');
  generator.addLibrary('ESP32_USB_Soft_Host_stdio', '#include <stdio.h>');
}

function ensureUsbSoftHostState(generator) {
  ensureUsbSoftHost(generator);
  generator.addVariable('aily_usb_soft_host_last_port', 'uint8_t ailyUsbSoftHostLastPort = 0;');
  generator.addVariable('aily_usb_soft_host_last_length', 'uint8_t ailyUsbSoftHostLastLength = 0;');
  generator.addVariable('aily_usb_soft_host_last_data', 'uint8_t ailyUsbSoftHostLastData[8] = {0};');
  generator.addVariable('aily_usb_soft_host_last_data_hex', 'String ailyUsbSoftHostLastDataHex = "";');
  generator.addVariable('aily_usb_soft_host_last_vendor', 'uint16_t ailyUsbSoftHostLastVendor = 0;');
  generator.addVariable('aily_usb_soft_host_last_product', 'uint16_t ailyUsbSoftHostLastProduct = 0;');
  generator.addVariable('aily_usb_soft_host_last_class', 'uint8_t ailyUsbSoftHostLastClass = 0;');
  generator.addFunction('aily_usb_soft_host_update_hex',
    'void ailyUsbSoftHostUpdateHex() {\n' +
    '  ailyUsbSoftHostLastDataHex = "";\n' +
    '  char byteText[4];\n' +
    '  for (uint8_t i = 0; i < ailyUsbSoftHostLastLength; i++) {\n' +
    '    if (i > 0) ailyUsbSoftHostLastDataHex += " ";\n' +
    '    snprintf(byteText, sizeof(byteText), "%02X", ailyUsbSoftHostLastData[i]);\n' +
    '    ailyUsbSoftHostLastDataHex += byteText;\n' +
    '  }\n' +
    '}\n'
  );
  generator.addFunction('aily_usb_soft_host_data_byte',
    'uint8_t ailyUsbSoftHostDataByte(int index) {\n' +
    '  if (index < 0 || index >= ailyUsbSoftHostLastLength) return 0;\n' +
    '  return ailyUsbSoftHostLastData[index];\n' +
    '}\n'
  );
}

function addUsbUserNumber(generator, name, ctype) {
  const safe = ailyUsbSafeName(name, 'usbValue');
  generator.addVariable('aily_usb_soft_host_user_' + safe, (ctype || 'uint32_t') + ' ' + safe + ' = 0;');
  ailyUsbRegisterVariable(safe, 'Number');
  return safe;
}

function addUsbUserString(generator, name) {
  const safe = ailyUsbSafeName(name, 'usbText');
  generator.addVariable('aily_usb_soft_host_user_' + safe, 'String ' + safe + ' = "";');
  ailyUsbRegisterVariable(safe, 'String');
  return safe;
}

Arduino.forBlock['esp32_usb_soft_host_begin'] = function(block, generator) {
  ensureUsbSoftHost(generator);
  const pins = ['DP0', 'DM0', 'DP1', 'DM1', 'DP2', 'DM2', 'DP3', 'DM3']
    .map((name, index) => ailyUsbValue(block, generator, name, index < 2 ? String(16 + index) : '-1'));
  return 'usb_pins_config_t ailyUsbSoftHostPins = {' + pins.join(', ') + '};\n' +
    'USH.init(ailyUsbSoftHostPins);\n';
};

Arduino.forBlock['esp32_usb_soft_host_task_options'] = function(block, generator) {
  ensureUsbSoftHost(generator);
  const priority = ailyUsbValue(block, generator, 'PRIORITY', '5');
  const blinkPin = ailyUsbValue(block, generator, 'BLINK_PIN', '22');
  const core = block.getFieldValue('CORE') || '1';
  const isrFlag = block.getFieldValue('ISR_FLAG') || 'ESP_INTR_FLAG_IRAM';
  return 'USH.setTaskCore(' + core + ');\n' +
    'USH.setTaskPriority(' + priority + ');\n' +
    'USH.setBlinkPin((gpio_num_t)' + blinkPin + ');\n' +
    'USH.setISRAllocFlag(' + isrFlag + ');\n';
};

Arduino.forBlock['esp32_usb_soft_host_descriptor_log'] = function(block, generator) {
  ensureUsbSoftHost(generator);
  return 'USH.setOnConfigDescCB(Default_USB_ConfigDescCB);\n' +
    'USH.setOnIfaceDescCb(Default_USB_IfaceDescCb);\n' +
    'USH.setOnHIDDevDescCb(Default_USB_HIDDevDescCb);\n' +
    'USH.setOnEPDescCb(Default_USB_EPDescCb);\n';
};

Arduino.forBlock['esp32_usb_soft_host_on_detect'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  const portVar = addUsbUserNumber(generator, block.getFieldValue('PORT_VAR'), 'uint8_t');
  const vendorVar = addUsbUserNumber(generator, block.getFieldValue('VENDOR_VAR'), 'uint16_t');
  const productVar = addUsbUserNumber(generator, block.getFieldValue('PRODUCT_VAR'), 'uint16_t');
  const classVar = addUsbUserNumber(generator, block.getFieldValue('CLASS_VAR'), 'uint8_t');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction('aily_usb_soft_host_on_detect',
    'void ailyUsbSoftHostOnDetect(uint8_t usbNum, void *dev) {\n' +
    '  sDevDesc *device = (sDevDesc*)dev;\n' +
    '  ailyUsbSoftHostLastPort = usbNum;\n' +
    '  ailyUsbSoftHostLastVendor = device ? device->idVendor : 0;\n' +
    '  ailyUsbSoftHostLastProduct = device ? device->idProduct : 0;\n' +
    '  ailyUsbSoftHostLastClass = device ? device->bDeviceClass : 0;\n' +
    '  ' + portVar + ' = ailyUsbSoftHostLastPort;\n' +
    '  ' + vendorVar + ' = ailyUsbSoftHostLastVendor;\n' +
    '  ' + productVar + ' = ailyUsbSoftHostLastProduct;\n' +
    '  ' + classVar + ' = ailyUsbSoftHostLastClass;\n' +
    handlerCode +
    '}\n'
  );
  return 'USH.setOndetectCb(ailyUsbSoftHostOnDetect);\n';
};

Arduino.forBlock['esp32_usb_soft_host_on_disconnect'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  const portVar = addUsbUserNumber(generator, block.getFieldValue('PORT_VAR'), 'uint8_t');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction('aily_usb_soft_host_on_disconnect',
    'void ailyUsbSoftHostOnDisconnect(uint8_t usbNum) {\n' +
    '  ailyUsbSoftHostLastPort = usbNum;\n' +
    '  ' + portVar + ' = ailyUsbSoftHostLastPort;\n' +
    handlerCode +
    '}\n'
  );
  return 'USH.setOndisconnectCb(ailyUsbSoftHostOnDisconnect);\n';
};

Arduino.forBlock['esp32_usb_soft_host_on_data'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  const portVar = addUsbUserNumber(generator, block.getFieldValue('PORT_VAR'), 'uint8_t');
  const lenVar = addUsbUserNumber(generator, block.getFieldValue('LEN_VAR'), 'uint8_t');
  const hexVar = addUsbUserString(generator, block.getFieldValue('HEX_VAR'));
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction('aily_usb_soft_host_on_data',
    'void ailyUsbSoftHostOnData(uint8_t usbNum, uint8_t byteDepth, uint8_t *data, uint8_t dataLen) {\n' +
    '  (void)byteDepth;\n' +
    '  ailyUsbSoftHostLastPort = usbNum;\n' +
    '  ailyUsbSoftHostLastLength = dataLen > 8 ? 8 : dataLen;\n' +
    '  for (uint8_t i = 0; i < 8; i++) {\n' +
    '    ailyUsbSoftHostLastData[i] = (data && i < ailyUsbSoftHostLastLength) ? data[i] : 0;\n' +
    '  }\n' +
    '  ailyUsbSoftHostUpdateHex();\n' +
    '  ' + portVar + ' = ailyUsbSoftHostLastPort;\n' +
    '  ' + lenVar + ' = ailyUsbSoftHostLastLength;\n' +
    '  ' + hexVar + ' = ailyUsbSoftHostLastDataHex;\n' +
    handlerCode +
    '}\n'
  );
  return 'USH.setPrintCb(ailyUsbSoftHostOnData);\n';
};

Arduino.forBlock['esp32_usb_soft_host_on_tick'] = function(block, generator) {
  ensureUsbSoftHost(generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  generator.addFunction('aily_usb_soft_host_on_tick',
    'void ailyUsbSoftHostOnTick() {\n' +
    handlerCode +
    '}\n'
  );
  return 'USH.setTaskTicker(ailyUsbSoftHostOnTick);\n';
};

Arduino.forBlock['esp32_usb_soft_host_timer'] = function(block, generator) {
  ensureUsbSoftHost(generator);
  return block.getFieldValue('ACTION') === 'RESUME' ? 'USH.TimerResume();\n' : 'USH.TimerPause();\n';
};

Arduino.forBlock['esp32_usb_soft_host_last_value'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  const map = {
    PORT: 'ailyUsbSoftHostLastPort',
    LENGTH: 'ailyUsbSoftHostLastLength',
    VENDOR: 'ailyUsbSoftHostLastVendor',
    PRODUCT: 'ailyUsbSoftHostLastProduct',
    CLASS: 'ailyUsbSoftHostLastClass'
  };
  return [map[block.getFieldValue('VALUE')] || map.PORT, ailyUsbOrder(generator)];
};

Arduino.forBlock['esp32_usb_soft_host_last_data_hex'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  return ['ailyUsbSoftHostLastDataHex', ailyUsbOrder(generator)];
};

Arduino.forBlock['esp32_usb_soft_host_data_byte'] = function(block, generator) {
  ensureUsbSoftHostState(generator);
  const index = ailyUsbValue(block, generator, 'INDEX', '0');
  return ['ailyUsbSoftHostDataByte(' + index + ')', ailyUsbOrder(generator)];
};

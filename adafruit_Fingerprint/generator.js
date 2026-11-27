Arduino.forBlock['fingerprint_begin'] = function (block, generator) {
  var baud = block.getFieldValue('BAUDRATE');
  generator.addLibrary('#include <Adafruit_Fingerprint.h>', '#include <Adafruit_Fingerprint.h>');
  generator.addVariable('adafruit_fingerprint_sensor', 'Adafruit_Fingerprint finger(&Serial, 0x0);');
  generator.addSetupBegin('finger_begin', 'finger.begin(' + baud + ');', true);
  return '';
};

// The Stream constructor leaves baud and pin selection to the selected UART.
Arduino.forBlock['fingerprint_begin_uart'] = function (block, generator) {
  var index = block.getFieldValue('UART') === '2' ? '2' : '1';
  var baud = Number(block.getFieldValue('BAUDRATE')) || 57600;
  var rx = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC) || '2';
  var tx = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC) || '3';
  generator.addLibrary('#include <Adafruit_Fingerprint.h>', '#include <Adafruit_Fingerprint.h>');
  var declaration = [
    '#if defined(ARDUINO_ARCH_STM32) && !defined(HAVE_HWSERIAL' + index + ') && defined(USART' + index + ')',
    '#if STM32_CORE_VERSION_MAJOR >= 3',
    'Uart fingerprintPort(USART' + index + ');',
    '#else',
    'HardwareSerial fingerprintPort(USART' + index + ');',
    '#endif',
    '#else',
    'auto &fingerprintPort = Serial' + index + ';',
    '#endif',
    'Adafruit_Fingerprint finger(static_cast<Stream *>(&fingerprintPort));'
  ].join('\n');
  generator.addVariable('adafruit_fingerprint_sensor', declaration, true);
  var begin = [
    '#if defined(ARDUINO_ARCH_ESP32)',
    'fingerprintPort.begin(' + baud + ', SERIAL_8N1, ' + rx + ', ' + tx + ');',
    '#else',
    '#if defined(ARDUINO_ARCH_STM32)',
    'fingerprintPort.setRx(' + rx + ');',
    'fingerprintPort.setTx(' + tx + ');',
    '#endif',
    'fingerprintPort.begin(' + baud + ');',
    '#endif',
    'finger.begin(' + baud + ');'
  ].join('\n') + '\n';
  var parent = block;
  while (parent && parent.type !== 'arduino_setup') {
    parent = typeof parent.getSurroundParent === 'function' ? parent.getSurroundParent() : null;
  }
  // Keep the user's UART initialization order inside setup, even if a loop
  // expression previously requested the default automatic initialization.
  generator.addSetupBegin('finger_begin', parent ? '' : begin, true);
  return parent ? begin : '';
};

Arduino.forBlock['fingerprint_verify'] = function (block, generator) {
  return ['finger.verifyPassword()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fingerprint_get_image'] = function (block, generator) {
  return ['finger.getImage()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fingerprint_image2Tz'] = function (block, generator) {
  var slot = Number(block.getFieldValue('SLOT')) === 2 ? 2 : 1;
  generator.addLibrary('#include <Adafruit_Fingerprint.h>', '#include <Adafruit_Fingerprint.h>');
  generator.addVariable('adafruit_fingerprint_sensor', 'Adafruit_Fingerprint finger(&Serial, 0x0);');
  generator.addSetupBegin('finger_begin', 'finger.begin(57600);');
  return ['finger.image2Tz(' + slot + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fingerprint_create_model'] = function (block, generator) {
  return ['finger.createModel()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fingerprint_store_model'] = function (block, generator) {
  var id = block.getFieldValue('ID');
  return 'finger.storeModel(' + id + ');\n';
};

Arduino.forBlock['fingerprint_delete_model'] = function (block, generator) {
  var id = block.getFieldValue('ID');
  return 'finger.deleteModel(' + id + ');\n';
};

Arduino.forBlock['fingerprint_finger_fast_search'] = function (block, generator) {
  return ['finger.fingerFastSearch()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['fingerprint_LEDcontrol'] = function (block, generator) {
  var state = block.getFieldValue('STATE');
  var on = (state === 'ON') ? 'true' : 'false';
  return 'finger.LEDcontrol(' + on + ');\n';
};

Arduino.forBlock['fingerprint_get_template_count'] = function (block, generator) {
  return ['finger.getTemplateCount()', Arduino.ORDER_ATOMIC];
};
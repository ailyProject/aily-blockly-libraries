'use strict';

function ensureM5Dial(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
    return;
  }
  generator.addLibrary('m5stack_dial', '#include <M5Dial.h>');
  generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5Dial.begin(ailyM5Config, true, true);');
  generator.addLoopBegin('m5stack_device_update', 'M5Dial.update();');
}

Arduino.forBlock['m5dial_peripheral_init'] = function(block, generator) {
  ensureM5Dial(generator);
  return '';
};

Arduino.forBlock['m5dial_encoder_position'] = function(block, generator) {
  ensureM5Dial(generator);
  return ['M5Dial.Encoder.read()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5dial_encoder_delta'] = function(block, generator) {
  ensureM5Dial(generator);
  return ['M5Dial.Encoder.readAndReset()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5dial_encoder_write'] = function(block, generator) {
  ensureM5Dial(generator);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || '0';
  return 'M5Dial.Encoder.write(' + value + ');\n';
};

Arduino.forBlock['m5dial_rfid_uid'] = function(block, generator) {
  ensureM5Dial(generator);
  generator.addFunction('aily_m5dial_rfid_uid',
    'String ailyM5DialRfidUid() {\n' +
    '  if (!M5Dial.Rfid.PICC_IsNewCardPresent() || !M5Dial.Rfid.PICC_ReadCardSerial()) return String();\n' +
    '  String uid;\n' +
    '  for (byte i = 0; i < M5Dial.Rfid.uid.size; ++i) {\n' +
    '    if (M5Dial.Rfid.uid.uidByte[i] < 0x10) uid += "0";\n' +
    '    uid += String(M5Dial.Rfid.uid.uidByte[i], HEX);\n' +
    '  }\n' +
    '  uid.toUpperCase();\n' +
    '  M5Dial.Rfid.PICC_HaltA();\n' +
    '  return uid;\n' +
    '}\n');
  return ['ailyM5DialRfidUid()', generator.ORDER_ATOMIC];
};

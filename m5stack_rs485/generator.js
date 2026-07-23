'use strict';

function m5stackRS485BoardName() {
  const config = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : {};
  return String(config.name || config.board || '').toLowerCase();
}

function m5stackRS485Config() {
  const name = m5stackRS485BoardName();
  if (name.indexOf('tab5') >= 0) return { serial: 'Serial2', rx: 21, tx: 20, dir: 34 };
  if (name.indexOf('tough') >= 0) return { serial: 'Serial2', rx: 27, tx: 19, dir: -1 };
  return { serial: 'Serial', rx: 3, tx: 1, dir: 2 };
}

function m5stackRS485Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
}

function ensureM5StackRS485(generator, baud) {
  const config = m5stackRS485Config();
  generator.addLibrary('m5stack_rs485_arduino', '#include <Arduino.h>');
  generator.addVariable('aily_m5_rs485_serial', 'HardwareSerial& ailyM5RS485 = ' + config.serial + ';');
  let setup = 'ailyM5RS485.begin(' + baud + ', SERIAL_8N1, ' + config.rx + ', ' + config.tx + ');\nailyM5RS485.setTimeout(20);';
  if (config.dir >= 0) setup = 'pinMode(' + config.dir + ', OUTPUT);\ndigitalWrite(' + config.dir + ', LOW);\n' + setup;
  generator.addSetupBegin('m5stack_rs485_begin', setup);
  generator.addVariable('aily_m5_rs485_dir', 'const int8_t ailyM5RS485Dir = ' + config.dir + ';');
  generator.addFunction('aily_m5_rs485_direction',
    'void ailyM5RS485Direction(bool sending) {\n' +
    '  if (ailyM5RS485Dir >= 0) { digitalWrite(ailyM5RS485Dir, sending ? HIGH : LOW); delayMicroseconds(100); }\n' +
    '}\n');
}

function ensureM5StackRS485Default(generator) {
  ensureM5StackRS485(generator, '115200');
}

Arduino.forBlock['m5stack_rs485_init'] = function(block, generator) {
  ensureM5StackRS485(generator, m5stackRS485Value(block, generator, 'BAUD', '115200'));
  return '';
};

Arduino.forBlock['m5stack_rs485_available'] = function(block, generator) {
  ensureM5StackRS485Default(generator);
  return ['ailyM5RS485.available()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rs485_read_byte'] = function(block, generator) {
  ensureM5StackRS485Default(generator);
  return ['ailyM5RS485.read()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rs485_read_line'] = function(block, generator) {
  ensureM5StackRS485Default(generator);
  generator.addFunction('aily_m5_rs485_read_line',
    'String ailyM5RS485ReadLine() {\n' +
    '  String value = ailyM5RS485.readStringUntil(\'\\n\'); value.trim(); return value;\n' +
    '}\n');
  return ['ailyM5RS485ReadLine()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rs485_write_text'] = function(block, generator) {
  ensureM5StackRS485Default(generator);
  generator.addFunction('aily_m5_rs485_write_text',
    'bool ailyM5RS485WriteText(const String& value, bool newline) {\n' +
    '  ailyM5RS485Direction(true); size_t written = newline ? ailyM5RS485.println(value) : ailyM5RS485.print(value);\n' +
    '  ailyM5RS485.flush(); ailyM5RS485Direction(false);\n' +
    '  return written == value.length() + (newline ? 2 : 0);\n' +
    '}\n');
  const value = m5stackRS485Value(block, generator, 'TEXT', '""');
  const newline = block.getFieldValue('NEWLINE') === 'FALSE' ? 'false' : 'true';
  return ['ailyM5RS485WriteText(String(' + value + '), ' + newline + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_rs485_write_byte'] = function(block, generator) {
  ensureM5StackRS485Default(generator);
  generator.addFunction('aily_m5_rs485_write_byte',
    'bool ailyM5RS485WriteByte(uint8_t value) {\n' +
    '  ailyM5RS485Direction(true); size_t written = ailyM5RS485.write(value);\n' +
    '  ailyM5RS485.flush(); ailyM5RS485Direction(false); return written == 1;\n' +
    '}\n');
  return ['ailyM5RS485WriteByte((uint8_t)(' + m5stackRS485Value(block, generator, 'VALUE', '0') + '))', generator.ORDER_ATOMIC];
};

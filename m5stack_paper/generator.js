'use strict';

function ensureM5Paper(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
  } else {
    generator.addLibrary('m5stack_unified', '#include <M5Unified.h>');
    generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5.begin(ailyM5Config);');
    generator.addLoopBegin('m5stack_device_update', 'M5.update();');
  }
  generator.addLibrary('m5paper_sht3x', '#include <SHT3X.h>\n#include <Wire.h>');
  generator.addVariable('aily_m5paper_sht30', 'SHT3X ailyM5PaperSHT30;\nbool ailyM5PaperSHTReady = false;');
  generator.addSetupBegin('m5paper_i2c_begin', 'ailyM5PaperSHTReady = ailyM5PaperSHT30.begin(&Wire, 0x44, 21, 22, 400000U);');
}

function m5paperValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
}

function ensureM5PaperFRAM(generator) {
  generator.addFunction('aily_m5paper_fram_write_byte',
    'bool ailyM5PaperFRAMWriteByte(uint8_t address, uint8_t value) {\n' +
    '  Wire.beginTransmission(0x50); Wire.write(address); Wire.write(value); return Wire.endTransmission() == 0;\n' +
    '}\n');
  generator.addFunction('aily_m5paper_fram_read_byte',
    'int ailyM5PaperFRAMReadByte(uint8_t address) {\n' +
    '  Wire.beginTransmission(0x50); Wire.write(address); if (Wire.endTransmission(false) != 0) return -1;\n' +
    '  if (Wire.requestFrom((uint8_t)0x50, (uint8_t)1) != 1) return -1; return Wire.read();\n' +
    '}\n');
}

Arduino.forBlock['m5paper_init'] = function(block, generator) {
  ensureM5Paper(generator);
  return '';
};

Arduino.forBlock['m5paper_sht_available'] = function(block, generator) {
  ensureM5Paper(generator);
  return ['ailyM5PaperSHTReady', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5paper_sht_value'] = function(block, generator) {
  ensureM5Paper(generator);
  generator.addFunction('aily_m5paper_sht_value',
    'float ailyM5PaperSHTValue(bool humidity) {\n' +
    '  static uint32_t lastRead = 0; static bool valid = false; uint32_t now = millis();\n' +
    '  if (!ailyM5PaperSHTReady) return NAN;\n' +
    '  if (!valid || now - lastRead >= 500) { valid = ailyM5PaperSHT30.update(); lastRead = now; }\n' +
    '  if (!valid) return NAN; return humidity ? ailyM5PaperSHT30.humidity : ailyM5PaperSHT30.cTemp;\n' +
    '}\n');
  const humidity = block.getFieldValue('VALUE') === 'HUMIDITY' ? 'true' : 'false';
  return ['ailyM5PaperSHTValue(' + humidity + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5paper_fram_write_byte'] = function(block, generator) {
  ensureM5Paper(generator); ensureM5PaperFRAM(generator);
  const address = m5paperValue(block, generator, 'ADDRESS', '0');
  const value = m5paperValue(block, generator, 'VALUE', '0');
  return ['ailyM5PaperFRAMWriteByte((uint8_t)constrain(' + address + ', 0, 255), (uint8_t)(' + value + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5paper_fram_read_byte'] = function(block, generator) {
  ensureM5Paper(generator); ensureM5PaperFRAM(generator);
  const address = m5paperValue(block, generator, 'ADDRESS', '0');
  return ['ailyM5PaperFRAMReadByte((uint8_t)constrain(' + address + ', 0, 255))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5paper_fram_write_text'] = function(block, generator) {
  ensureM5Paper(generator); ensureM5PaperFRAM(generator);
  generator.addFunction('aily_m5paper_fram_write_text',
    'bool ailyM5PaperFRAMWriteText(uint8_t address, const String& value) {\n' +
    '  size_t room = 255 - address; size_t length = min(value.length(), room);\n' +
    '  for (size_t i = 0; i < length; ++i) if (!ailyM5PaperFRAMWriteByte(address + i, value[i])) return false;\n' +
    '  return ailyM5PaperFRAMWriteByte(address + length, 0);\n' +
    '}\n');
  const address = m5paperValue(block, generator, 'ADDRESS', '0');
  const value = m5paperValue(block, generator, 'TEXT', '""');
  return ['ailyM5PaperFRAMWriteText((uint8_t)constrain(' + address + ', 0, 255), String(' + value + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5paper_fram_read_text'] = function(block, generator) {
  ensureM5Paper(generator); ensureM5PaperFRAM(generator);
  generator.addFunction('aily_m5paper_fram_read_text',
    'String ailyM5PaperFRAMReadText(uint8_t address, uint16_t maxLength) {\n' +
    '  String result; maxLength = min((uint16_t)(256 - address), maxLength);\n' +
    '  for (uint16_t i = 0; i < maxLength; ++i) { int value = ailyM5PaperFRAMReadByte(address + i); if (value <= 0) break; result += (char)value; }\n' +
    '  return result;\n' +
    '}\n');
  const address = m5paperValue(block, generator, 'ADDRESS', '0');
  const length = m5paperValue(block, generator, 'LENGTH', '32');
  return ['ailyM5PaperFRAMReadText((uint8_t)constrain(' + address + ', 0, 255), (uint16_t)constrain(' + length + ', 0, 256))', generator.ORDER_ATOMIC];
};

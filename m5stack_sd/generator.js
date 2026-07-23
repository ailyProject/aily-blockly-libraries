'use strict';

function ensureM5StackSD(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
  } else {
    generator.addLibrary('m5stack_unified', '#include <M5Unified.h>');
    generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5.begin(ailyM5Config);');
    generator.addLoopBegin('m5stack_device_update', 'M5.update();');
  }
  generator.addLibrary('m5stack_sd_fs', '#include <FS.h>\n#include <SD.h>\n#include <SD_MMC.h>\n#include <SPI.h>');
  generator.addVariable('aily_m5_sd_fs', 'fs::FS* ailyM5SD = nullptr;');
  generator.addFunction('aily_m5_sd_path',
    'String ailyM5SDPath(const String& value) {\n' +
    '  if (!value.length() || value[0] == \'/\') return value;\n' +
    '  return String("/") + value;\n' +
    '}\n');
  generator.addFunction('aily_m5_sd_present',
    'bool ailyM5SDPresent() {\n' +
    '  if (ailyM5SD == &SD_MMC) return SD_MMC.cardType() != CARD_NONE;\n' +
    '  if (ailyM5SD == &SD) return SD.cardType() != CARD_NONE;\n' +
    '  return false;\n' +
    '}\n');
  generator.addFunction('aily_m5_sd_mount',
    'bool ailyM5SDMount() {\n' +
    '  if (ailyM5SD && ailyM5SDPresent()) return true;\n' +
    '  if (ailyM5SD == &SD_MMC) SD_MMC.end();\n' +
    '  else if (ailyM5SD == &SD) SD.end();\n' +
    '  ailyM5SD = nullptr;\n' +
    '  if (M5.getBoard() == m5::board_t::board_M5Tough) {\n' +
    '    SPI.begin(18, 38, 23, 4);\n' +
    '    if (SD.begin(4, SPI, 25000000) && SD.cardType() != CARD_NONE) { ailyM5SD = &SD; return true; }\n' +
    '    SD.end(); return false;\n' +
    '  }\n' +
    '  if (!M5.hasSD()) return false;\n' +
    '  if (M5.hasSDMMC()) {\n' +
    '    SD_MMC.setPins(M5.getPin(m5::pin_name_t::sd_mmc_clk), M5.getPin(m5::pin_name_t::sd_mmc_cmd), M5.getPin(m5::pin_name_t::sd_mmc_d0), M5.getPin(m5::pin_name_t::sd_mmc_d1), M5.getPin(m5::pin_name_t::sd_mmc_d2), M5.getPin(m5::pin_name_t::sd_mmc_d3));\n' +
    '    if (SD_MMC.begin("/sdcard", false) && SD_MMC.cardType() != CARD_NONE) { ailyM5SD = &SD_MMC; return true; }\n' +
    '    SD_MMC.end();\n' +
    '  } else {\n' +
    '    int clk = M5.getPin(m5::pin_name_t::sd_spi_sclk);\n' +
    '    int miso = M5.getPin(m5::pin_name_t::sd_spi_miso);\n' +
    '    int mosi = M5.getPin(m5::pin_name_t::sd_spi_mosi);\n' +
    '    int cs = M5.getPin(m5::pin_name_t::sd_spi_cs);\n' +
    '    if (clk < 0 || miso < 0 || mosi < 0 || cs < 0) return false;\n' +
    '    SPI.begin(clk, miso, mosi, cs);\n' +
    '    if (SD.begin(cs, SPI, 25000000) && SD.cardType() != CARD_NONE) { ailyM5SD = &SD; return true; }\n' +
    '    SD.end();\n' +
    '  }\n' +
    '  return false;\n' +
    '}\n');
}

function m5stackSDValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
}

function ensureM5StackSDWrite(generator) {
  generator.addFunction('aily_m5_sd_write_text',
    'bool ailyM5SDWriteText(const String& rawPath, const String& text, bool append) {\n' +
    '  if (!ailyM5SDMount()) return false;\n' +
    '  File file = ailyM5SD->open(ailyM5SDPath(rawPath), append ? FILE_APPEND : FILE_WRITE);\n' +
    '  if (!file || file.isDirectory()) { if (file) file.close(); return false; }\n' +
    '  size_t written = file.print(text); file.close(); return written == text.length();\n' +
    '}\n');
}

function ensureM5StackSDRemove(generator) {
  generator.addFunction('aily_m5_sd_remove',
    'bool ailyM5SDRemove(const String& rawPath) {\n' +
    '  return ailyM5SDMount() && ailyM5SD->remove(ailyM5SDPath(rawPath));\n' +
    '}\n');
}

Arduino.forBlock['m5stack_sd_init'] = function(block, generator) {
  ensureM5StackSD(generator);
  generator.addSetupEnd('m5stack_sd_begin', 'ailyM5SDMount();');
  return '';
};

Arduino.forBlock['m5stack_sd_available'] = function(block, generator) {
  ensureM5StackSD(generator);
  return ['ailyM5SDMount()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_exists'] = function(block, generator) {
  ensureM5StackSD(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['(ailyM5SDMount() && ailyM5SD->exists(ailyM5SDPath(String(' + path + '))))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_read_text'] = function(block, generator) {
  ensureM5StackSD(generator);
  generator.addFunction('aily_m5_sd_read_text',
    'String ailyM5SDReadText(const String& rawPath) {\n' +
    '  if (!ailyM5SDMount()) return String();\n' +
    '  File file = ailyM5SD->open(ailyM5SDPath(rawPath), FILE_READ);\n' +
    '  if (!file || file.isDirectory()) { if (file) file.close(); return String(); }\n' +
    '  String content; while (file.available()) content += (char)file.read();\n' +
    '  file.close(); return content;\n' +
    '}\n');
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['ailyM5SDReadText(String(' + path + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_write_text'] = function(block, generator) {
  ensureM5StackSD(generator);
  ensureM5StackSDWrite(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  const content = m5stackSDValue(block, generator, 'TEXT', '""');
  const append = block.getFieldValue('MODE') === 'APPEND' ? 'true' : 'false';
  return 'ailyM5SDWriteText(String(' + path + '), String(' + content + '), ' + append + ');\n';
};

Arduino.forBlock['m5stack_sd_write_ok'] = function(block, generator) {
  ensureM5StackSD(generator);
  ensureM5StackSDWrite(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  const content = m5stackSDValue(block, generator, 'TEXT', '""');
  const append = block.getFieldValue('MODE') === 'APPEND' ? 'true' : 'false';
  return ['ailyM5SDWriteText(String(' + path + '), String(' + content + '), ' + append + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_remove'] = function(block, generator) {
  ensureM5StackSD(generator);
  ensureM5StackSDRemove(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return 'ailyM5SDRemove(String(' + path + '));\n';
};

Arduino.forBlock['m5stack_sd_remove_ok'] = function(block, generator) {
  ensureM5StackSD(generator);
  ensureM5StackSDRemove(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['ailyM5SDRemove(String(' + path + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_file_size'] = function(block, generator) {
  ensureM5StackSD(generator);
  generator.addFunction('aily_m5_sd_file_size',
    'size_t ailyM5SDFileSize(const String& rawPath) {\n' +
    '  if (!ailyM5SDMount()) return 0; File file = ailyM5SD->open(ailyM5SDPath(rawPath), FILE_READ);\n' +
    '  if (!file || file.isDirectory()) { if (file) file.close(); return 0; }\n' +
    '  size_t result = file.size(); file.close(); return result;\n' +
    '}\n');
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['ailyM5SDFileSize(String(' + path + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_mkdir'] = function(block, generator) {
  ensureM5StackSD(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['(ailyM5SDMount() && ailyM5SD->mkdir(ailyM5SDPath(String(' + path + '))))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_rmdir'] = function(block, generator) {
  ensureM5StackSD(generator);
  const path = m5stackSDValue(block, generator, 'PATH', '""');
  return ['(ailyM5SDMount() && ailyM5SD->rmdir(ailyM5SDPath(String(' + path + '))))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_rename'] = function(block, generator) {
  ensureM5StackSD(generator);
  const from = m5stackSDValue(block, generator, 'FROM', '""');
  const to = m5stackSDValue(block, generator, 'TO', '""');
  return ['(ailyM5SDMount() && ailyM5SD->rename(ailyM5SDPath(String(' + from + ')), ailyM5SDPath(String(' + to + '))))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_list'] = function(block, generator) {
  ensureM5StackSD(generator);
  generator.addFunction('aily_m5_sd_list',
    'String ailyM5SDList(const String& rawPath) {\n' +
    '  if (!ailyM5SDMount()) return String();\n' +
    '  File dir = ailyM5SD->open(ailyM5SDPath(rawPath), FILE_READ);\n' +
    '  if (!dir || !dir.isDirectory()) { if (dir) dir.close(); return String(); }\n' +
    '  String result; File entry = dir.openNextFile();\n' +
    '  while (entry) {\n' +
    '    if (result.length()) result += "\\n";\n' +
    '    result += entry.name(); if (entry.isDirectory()) result += "/";\n' +
    '    entry.close(); entry = dir.openNextFile();\n' +
    '  }\n' +
    '  dir.close(); return result;\n' +
    '}\n');
  const path = m5stackSDValue(block, generator, 'PATH', '"/"');
  return ['ailyM5SDList(String(' + path + '))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5stack_sd_space'] = function(block, generator) {
  ensureM5StackSD(generator);
  generator.addFunction('aily_m5_sd_space',
    'uint64_t ailyM5SDSpace(uint8_t kind) {\n' +
    '  if (!ailyM5SDMount()) return 0;\n' +
    '  if (ailyM5SD == &SD_MMC) return kind == 0 ? SD_MMC.cardSize() : (kind == 1 ? SD_MMC.totalBytes() : SD_MMC.usedBytes());\n' +
    '  return kind == 0 ? SD.cardSize() : (kind == 1 ? SD.totalBytes() : SD.usedBytes());\n' +
    '}\n');
  const kinds = { CAPACITY: '0', TOTAL: '1', USED: '2' };
  return ['ailyM5SDSpace(' + (kinds[block.getFieldValue('KIND')] || '0') + ')', generator.ORDER_ATOMIC];
};

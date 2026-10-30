// IBoxS31_SDCard：microSD（1 线 SDMMC D0=IO20 CLK=IO24 CMD=IO25，电源 IO39 低电平开）

// 引脚和 I2C 地址按智盒板 IBox S31 写死，换成别的板时在代码里留个提醒
Arduino.iboxs31BoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && !/ibox\s*s31/i.test(name)) {
      return '// 注意：当前开发板是 ' + name + '，本库按智盒板 IBox S31 的引脚和 I2C 地址编写\n';
    }
  } catch (e) {}
  return '';
};

Arduino.iboxs31SdcardEnsure = function (generator) {
  generator.addLibrary('IBoxS31_SDCard', '#include <FS.h>\n#include <SD_MMC.h>\n#include <IBoxS31_SDCard.h>');
  generator.addVariable('iboxs31_sdcard', 'IBoxS31_SDCard iboxs31_sdcard;');
  // 路径没写开头的 / 时补上
  generator.addFunction('iboxs31_sdcard_path', [
    'String iboxs31_sdcard_path(const String &path) {',
    '  return path.startsWith("/") ? path : "/" + path;',
    '}',
  ].join('\n'));
};

Arduino.iboxs31SdcardText = function (block, name, generator) {
  return 'String(' + (generator.valueToCode(block, name, generator.ORDER_ATOMIC) || '""') + ')';
};

Arduino.forBlock['iboxs31_sdcard_init'] = function (block, generator) {
  const test = block.getFieldValue('TEST') === 'false' ? 'false' : 'true';
  Arduino.iboxs31SdcardEnsure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_sdcard.begin(' + test + ');\n';
};

Arduino.forBlock['iboxs31_sdcard_state'] = function (block, generator) {
  const call = block.getFieldValue('WHAT') === 'RW_OK' ? 'iboxs31_sdcard.rwOk()' : 'iboxs31_sdcard.mounted()';
  Arduino.iboxs31SdcardEnsure(generator);
  return [call, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_sdcard_size'] = function (block, generator) {
  Arduino.iboxs31SdcardEnsure(generator);
  return ['iboxs31_sdcard.sizeGB()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_sdcard_status'] = function (block, generator) {
  Arduino.iboxs31SdcardEnsure(generator);
  return ['String(IBoxS31_SDCard::statusName(iboxs31_sdcard.status()))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_sdcard_write'] = function (block, generator) {
  const append = block.getFieldValue('MODE') === 'APPEND' ? 'true' : 'false';
  const path = Arduino.iboxs31SdcardText(block, 'PATH', generator);
  const text = Arduino.iboxs31SdcardText(block, 'TEXT', generator);
  Arduino.iboxs31SdcardEnsure(generator);
  generator.addFunction('iboxs31_sdcard_write', [
    'bool iboxs31_sdcard_write(const String &path, const String &text, bool append) {',
    '  if (!iboxs31_sdcard.mounted()) return false;',
    '  File f = SD_MMC.open(iboxs31_sdcard_path(path), append ? FILE_APPEND : FILE_WRITE);',
    '  if (!f) return false;',
    '  const size_t written = f.print(text);',
    '  f.close();',
    '  return written == text.length();',
    '}',
  ].join('\n'));
  return 'iboxs31_sdcard_write(' + path + ', ' + text + ', ' + append + ');\n';
};

Arduino.forBlock['iboxs31_sdcard_read'] = function (block, generator) {
  const path = Arduino.iboxs31SdcardText(block, 'PATH', generator);
  Arduino.iboxs31SdcardEnsure(generator);
  generator.addFunction('iboxs31_sdcard_read', [
    'String iboxs31_sdcard_read(const String &path) {',
    '  if (!iboxs31_sdcard.mounted()) return String();',
    '  File f = SD_MMC.open(iboxs31_sdcard_path(path), FILE_READ);',
    '  if (!f || f.isDirectory()) return String();',
    '  String text = f.readString();',
    '  f.close();',
    '  return text;',
    '}',
  ].join('\n'));
  return ['iboxs31_sdcard_read(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_sdcard_exists'] = function (block, generator) {
  const path = Arduino.iboxs31SdcardText(block, 'PATH', generator);
  Arduino.iboxs31SdcardEnsure(generator);
  return ['(iboxs31_sdcard.mounted() && SD_MMC.exists(iboxs31_sdcard_path(' + path + ')))', generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_sdcard_remove'] = function (block, generator) {
  const path = Arduino.iboxs31SdcardText(block, 'PATH', generator);
  Arduino.iboxs31SdcardEnsure(generator);
  return 'if (iboxs31_sdcard.mounted()) SD_MMC.remove(iboxs31_sdcard_path(' + path + '));\n';
};

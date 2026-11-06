'use strict';

function ensureSDMMCLib(generator) {
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD_MMC', '#include <SD_MMC.h>');
}

// 挂载失败时 IDF 6 不会完全释放 SDMMC 主机，不手动释放的话之后再也挂不上；释放后再试一次
function ensureSDMMCMount(generator) {
  ensureSDMMCLib(generator);
  generator.addLibrary('sdmmc_host', [
    '#if defined __has_include',
    '#if __has_include("driver/sdmmc_host.h")',
    '#include "driver/sdmmc_host.h"',
    '#define SDMMC_HAS_HOST_DEINIT 1',
    '#endif',
    '#endif',
  ].join('\n'));
  generator.addFunction('sdmmc_mount', [
    'bool sdmmc_mount(bool mode1bit) {',
    '  for (int attempt = 0; attempt < 2; attempt++) {',
    '    if (SD_MMC.begin("/sdcard", mode1bit)) return true;',
    '    SD_MMC.end();',
    '#ifdef SDMMC_HAS_HOST_DEINIT',
    '    sdmmc_host_deinit();',
    '#endif',
    '    delay(100);',
    '  }',
    '  return false;',
    '}',
  ].join('\n'));
}

// 板卡 board.json 的 sdCardPins（clk/cmd/d0，4 位模式再加 d1~d3）：工作区里没有"设置引脚"积木时，初始化前自动设置
function sdmmcBoardPins(block, mode1bit) {
  try {
    const ws = block.workspace;
    const manual = ws && ws.getAllBlocks
      ? ws.getAllBlocks(false).some(b => b.type === 'esp32_sd_mmc_set_pins' && (!b.isEnabled || b.isEnabled()))
      : false;
    const pins = window['boardConfig'] && window['boardConfig'].sdCardPins;
    if (manual || !pins || pins.clk == null || pins.cmd == null || pins.d0 == null) return '';
    const list = [pins.clk, pins.cmd, pins.d0];
    if (mode1bit === 'false' && pins.d1 != null && pins.d2 != null && pins.d3 != null) list.push(pins.d1, pins.d2, pins.d3);
    return 'SD_MMC.setPins(' + list.join(', ') + ');\n';
  } catch (e) {
    return '';
  }
}

Arduino.forBlock['esp32_sd_mmc_begin'] = function(block, generator) {
  const mode1bit = block.getFieldValue('MODE') || 'false';
  ensureSDMMCMount(generator);
  ensureSerialBegin("Serial", generator);
  let code = sdmmcBoardPins(block, mode1bit);
  code += 'if (!sdmmc_mount(' + mode1bit + ')) {\n';
  code += '  Serial.println("SD_MMC Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp32_sd_mmc_set_pins'] = function(block, generator) {
  const clk = generator.valueToCode(block, 'CLK', generator.ORDER_ATOMIC) || '14';
  const cmd = generator.valueToCode(block, 'CMD', generator.ORDER_ATOMIC) || '15';
  const d0 = generator.valueToCode(block, 'D0', generator.ORDER_ATOMIC) || '2';
  ensureSDMMCLib(generator);
  return 'SD_MMC.setPins(' + clk + ', ' + cmd + ', ' + d0 + ');\n';
};

Arduino.forBlock['esp32_sd_mmc_end'] = function(block, generator) {
  ensureSDMMCLib(generator);
  return 'SD_MMC.end();\n';
};

Arduino.forBlock['esp32_sd_mmc_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'cardType';
  ensureSDMMCLib(generator);
  let code = '';
  switch (info) {
    case 'cardType': code = 'SD_MMC.cardType()'; break;
    case 'cardSize': code = '(SD_MMC.cardSize() / (1024 * 1024))'; break;
    case 'totalBytes': code = '(SD_MMC.totalBytes() / (1024 * 1024))'; break;
    case 'usedBytes': code = '(SD_MMC.usedBytes() / (1024 * 1024))'; break;
    default: code = '0';
  }
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_mmc_write_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/test.txt"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  ensureSDMMCLib(generator);
  ensureSerialBegin("Serial", generator);

  let funcDef = 'void sdmmc_writeFile(const char * path, const char * message) {\n';
  funcDef += '  File file = SD_MMC.open(path, FILE_WRITE);\n';
  funcDef += '  if (!file) {\n';
  funcDef += '    Serial.println("Failed to open file for writing");\n';
  funcDef += '    return;\n';
  funcDef += '  }\n';
  funcDef += '  file.print(message);\n';
  funcDef += '  file.close();\n';
  funcDef += '}\n';
  generator.addFunction('sdmmc_writeFile', funcDef);
  return 'sdmmc_writeFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['esp32_sd_mmc_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/test.txt"';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  ensureSDMMCLib(generator);
  ensureSerialBegin("Serial", generator);

  let funcDef = 'void sdmmc_appendFile(const char * path, const char * message) {\n';
  funcDef += '  File file = SD_MMC.open(path, FILE_APPEND);\n';
  funcDef += '  if (!file) {\n';
  funcDef += '    Serial.println("Failed to open file for appending");\n';
  funcDef += '    return;\n';
  funcDef += '  }\n';
  funcDef += '  file.print(message);\n';
  funcDef += '  file.close();\n';
  funcDef += '}\n';
  generator.addFunction('sdmmc_appendFile', funcDef);
  return 'sdmmc_appendFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['esp32_sd_mmc_read_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/test.txt"';
  ensureSDMMCLib(generator);
  ensureSerialBegin("Serial", generator);

  let funcDef = 'String sdmmc_readFile(const char * path) {\n';
  funcDef += '  File file = SD_MMC.open(path);\n';
  funcDef += '  if (!file || file.isDirectory()) {\n';
  funcDef += '    Serial.println("Failed to open file for reading");\n';
  funcDef += '    return String();\n';
  funcDef += '  }\n';
  funcDef += '  String content;\n';
  funcDef += '  while (file.available()) {\n';
  funcDef += '    content += (char)file.read();\n';
  funcDef += '  }\n';
  funcDef += '  file.close();\n';
  funcDef += '  return content;\n';
  funcDef += '}\n';
  generator.addFunction('sdmmc_readFile', funcDef);
  return ['sdmmc_readFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_mmc_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/test.txt"';
  ensureSDMMCLib(generator);
  return 'SD_MMC.remove(' + path + ');\n';
};

Arduino.forBlock['esp32_sd_mmc_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/test.txt"';
  ensureSDMMCLib(generator);
  return ['SD_MMC.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_mmc_mkdir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/mydir"';
  ensureSDMMCLib(generator);
  return 'SD_MMC.mkdir(' + path + ');\n';
};

Arduino.forBlock['esp32_sd_mmc_rmdir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/mydir"';
  ensureSDMMCLib(generator);
  return 'SD_MMC.rmdir(' + path + ');\n';
};

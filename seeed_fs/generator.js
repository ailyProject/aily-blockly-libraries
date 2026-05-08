'use strict';

// Helper: add Seeed_Arduino_FS library include
function ensureSeeedFS(generator) {
  generator.addLibrary('Seeed_Arduino_FS', '#include <Seeed_Arduino_FS.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

Arduino.forBlock['seeed_fs_sd_begin'] = function(block, generator) {
  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 4000000UL)) {\n';
  code += '  Serial.println("Card Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';
  code += 'Serial.println("SD card initialized.");\n';

  return code;
};

Arduino.forBlock['seeed_fs_sd_begin_spi'] = function(block, generator) {
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '1';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '4000000';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.begin(' + ss + ', SPI, ' + frequency + ')) {\n';
  code += '  Serial.println("Card Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';
  code += 'Serial.println("SD card initialized.");\n';

  return code;
};

Arduino.forBlock['seeed_fs_sd_card_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'cardType';

  ensureSeeedFS(generator);

  let code = '';
  switch (info) {
    case 'cardType':
      code = 'SD.cardType()';
      break;
    case 'cardSize':
      code = '((unsigned long)(SD.cardSize() / (1024 * 1024)))';
      break;
    case 'totalBytes':
      code = '((unsigned long)(SD.totalBytes() / (1024 * 1024)))';
      break;
    case 'usedBytes':
      code = '((unsigned long)(SD.usedBytes() / (1024 * 1024)))';
      break;
    default:
      code = '0';
  }

  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_file_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);

  let code = 'SD.exists(' + path + ')';

  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_open_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';

  ensureSeeedFS(generator);

  registerVariableToBlockly(varName, 'File');
  generator.addObject(varName, 'fs::File ' + varName + ';');

  let code = varName + ' = SD.open(' + path + ', ' + mode + ')';

  return [code, generator.ORDER_ASSIGNMENT];
};

Arduino.forBlock['seeed_fs_close_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  ensureSeeedFS(generator);

  return varName + '.close();\n';
};

Arduino.forBlock['seeed_fs_write_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);

  return varName + '.print(String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_fs_read_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  ensureSeeedFS(generator);

  const functionDef =
    'String seeedReadFileContent(fs::File &f) {\n' +
    '  String result = "";\n' +
    '  while (f.available()) {\n' +
    '    result += (char)f.read();\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n';

  generator.addObject('seeedReadFileContent_function', functionDef, true);

  return ['seeedReadFileContent(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_file_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  ensureSeeedFS(generator);

  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_file_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  ensureSeeedFS(generator);

  return [varName + '.size()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_write_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void seeedWriteFile(const char *path, const char *message) {\n' +
    '  fs::File f = SD.open(path, FILE_WRITE);\n' +
    '  if (!f) {\n' +
    '    Serial.println("Failed to open file for writing");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (f.print(message)) {\n' +
    '    Serial.println("File written");\n' +
    '  } else {\n' +
    '    Serial.println("Write failed");\n' +
    '  }\n' +
    '  f.close();\n' +
    '}\n';

  generator.addObject('seeedWriteFile_function', functionDef, true);

  return 'seeedWriteFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_fs_read_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String seeedReadFile(const char *path) {\n' +
    '  String result = "";\n' +
    '  fs::File f = SD.open(path);\n' +
    '  if (!f) {\n' +
    '    Serial.println("Failed to open file for reading");\n' +
    '    return result;\n' +
    '  }\n' +
    '  while (f.available()) {\n' +
    '    result += (char)f.read();\n' +
    '  }\n' +
    '  f.close();\n' +
    '  return result;\n' +
    '}\n';

  generator.addObject('seeedReadFile_function', functionDef, true);

  return ['seeedReadFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_fs_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void seeedAppendFile(const char *path, const char *message) {\n' +
    '  fs::File f = SD.open(path, FILE_APPEND);\n' +
    '  if (!f) {\n' +
    '    Serial.println("Failed to open file for appending");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (f.print(message)) {\n' +
    '    Serial.println("Message appended");\n' +
    '  } else {\n' +
    '    Serial.println("Append failed");\n' +
    '  }\n' +
    '  f.close();\n' +
    '}\n';

  generator.addObject('seeedAppendFile_function', functionDef, true);

  return 'seeedAppendFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_fs_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SD.remove(' + path + ')) {\n';
  code += '  Serial.println("File deleted");\n';
  code += '} else {\n';
  code += '  Serial.println("Delete failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_fs_rename_file'] = function(block, generator) {
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("File renamed");\n';
  code += '} else {\n';
  code += '  Serial.println("Rename failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_fs_create_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("Dir created");\n';
  code += '} else {\n';
  code += '  Serial.println("mkdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_fs_remove_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("Dir removed");\n';
  code += '} else {\n';
  code += '  Serial.println("rmdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_fs_list_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const levels = generator.valueToCode(block, 'LEVELS', generator.ORDER_ATOMIC) || '0';

  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);

  generator.addObject('seeedListDir_function',
`void seeedListDir(fs::FS &fs, const char *dirname, uint8_t levels) {
  Serial.print("Listing directory: ");
  Serial.println(dirname);
  fs::File root = fs.open(dirname);
  if (!root) {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return;
  }
  fs::File entry = root.openNextFile();
  while (entry) {
    if (entry.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(entry.name());
      if (levels) {
        seeedListDir(fs, entry.name(), levels - 1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(entry.name());
      Serial.print("  SIZE: ");
      Serial.println(entry.size());
    }
    entry = root.openNextFile();
  }
}`, true);

  return 'seeedListDir(SD, ' + path + ', ' + levels + ');\n';
};

// ─── SFUD 闪存文件系统 (FS层) ─────────────────────────────────────────────────

function ensureSeeedSFUD(generator) {
  generator.addLibrary('Seeed_Arduino_FS', '#include <Seeed_Arduino_FS.h>');
  generator.addLibrary('Seeed_SFUD', '#include <Seeed_SFUD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

Arduino.forBlock['seeed_sfud_fs_begin_qspi'] = function(block, generator) {
  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'while (!SFUD.begin(104000000UL)) {\n';
  code += '  Serial.println("Flash Mount Failed");\n';
  code += '  delay(500);\n';
  code += '}\n';
  code += 'Serial.println("Flash initialized.");\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_begin_spi'] = function(block, generator) {
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '4';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '4000000';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'while (!SFUD.begin(' + ss + ', SPI, ' + frequency + ')) {\n';
  code += '  Serial.println("Flash Mount Failed");\n';
  code += '  delay(500);\n';
  code += '}\n';
  code += 'Serial.println("Flash initialized.");\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_flash_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'flashSize';

  ensureSeeedSFUD(generator);

  let code = '';
  switch (info) {
    case 'flashSize':
      code = '((unsigned long)(SFUD.flashSize()))';
      break;
    case 'totalBytes':
      code = '((unsigned long)(SFUD.totalBytes() / (1024 * 1024)))';
      break;
    case 'usedBytes':
      code = '((unsigned long)(SFUD.usedBytes() / (1024 * 1024)))';
      break;
    default:
      code = '0';
  }

  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_sfud_fs_file_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);

  return ['SFUD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_sfud_fs_open_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'flashFile';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';

  ensureSeeedSFUD(generator);

  registerVariableToBlockly(varName, 'File');
  generator.addObject(varName, 'fs::File ' + varName + ';');

  return [varName + ' = SFUD.open(' + path + ', ' + mode + ')', generator.ORDER_ASSIGNMENT];
};

Arduino.forBlock['seeed_sfud_fs_write_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void sfudWriteFile(const char *path, const char *message) {\n' +
    '  fs::File f = SFUD.open(path, FILE_WRITE);\n' +
    '  if (!f) {\n' +
    '    Serial.println("[SFUD] Failed to open file for writing");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (f.print(message)) {\n' +
    '    Serial.println("[SFUD] File written");\n' +
    '  } else {\n' +
    '    Serial.println("[SFUD] Write failed");\n' +
    '  }\n' +
    '  f.close();\n' +
    '}\n';

  generator.addObject('sfudWriteFile_function', functionDef, true);

  return 'sfudWriteFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_sfud_fs_read_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String sfudReadFile(const char *path) {\n' +
    '  String result = "";\n' +
    '  fs::File f = SFUD.open(path);\n' +
    '  if (!f) {\n' +
    '    Serial.println("[SFUD] Failed to open file for reading");\n' +
    '    return result;\n' +
    '  }\n' +
    '  while (f.available()) {\n' +
    '    result += (char)f.read();\n' +
    '  }\n' +
    '  f.close();\n' +
    '  return result;\n' +
    '}\n';

  generator.addObject('sfudReadFile_function', functionDef, true);

  return ['sfudReadFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_sfud_fs_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void sfudAppendFile(const char *path, const char *message) {\n' +
    '  fs::File f = SFUD.open(path, FILE_APPEND);\n' +
    '  if (!f) {\n' +
    '    Serial.println("[SFUD] Failed to open file for appending");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (f.print(message)) {\n' +
    '    Serial.println("[SFUD] Message appended");\n' +
    '  } else {\n' +
    '    Serial.println("[SFUD] Append failed");\n' +
    '  }\n' +
    '  f.close();\n' +
    '}\n';

  generator.addObject('sfudAppendFile_function', functionDef, true);

  return 'sfudAppendFile(' + path + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_sfud_fs_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SFUD.remove(' + path + ')) {\n';
  code += '  Serial.println("[SFUD] File deleted");\n';
  code += '} else {\n';
  code += '  Serial.println("[SFUD] Delete failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_rename_file'] = function(block, generator) {
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SFUD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("[SFUD] File renamed");\n';
  code += '} else {\n';
  code += '  Serial.println("[SFUD] Rename failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_create_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SFUD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("[SFUD] Dir created");\n';
  code += '} else {\n';
  code += '  Serial.println("[SFUD] mkdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_remove_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (SFUD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("[SFUD] Dir removed");\n';
  code += '} else {\n';
  code += '  Serial.println("[SFUD] rmdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_sfud_fs_list_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const levels = generator.valueToCode(block, 'LEVELS', generator.ORDER_ATOMIC) || '0';

  ensureSeeedSFUD(generator);
  ensureSerialBegin('Serial', generator);

  // reuse the same helper function as SD list dir (works with any fs::FS reference)
  generator.addObject('seeedListDir_function',
`void seeedListDir(fs::FS &fs, const char *dirname, uint8_t levels) {
  Serial.print("Listing directory: ");
  Serial.println(dirname);
  fs::File root = fs.open(dirname);
  if (!root) {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return;
  }
  fs::File entry = root.openNextFile();
  while (entry) {
    if (entry.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(entry.name());
      if (levels) {
        seeedListDir(fs, entry.name(), levels - 1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(entry.name());
      Serial.print("  SIZE: ");
      Serial.println(entry.size());
    }
    entry = root.openNextFile();
  }
}`, true);

  return 'seeedListDir(SFUD, ' + path + ', ' + levels + ');\n';
};

// ─── SFUD 原始闪存操作 (低层直接访问) ──────────────────────────────────────────

function ensureRawSFUD(generator) {
  generator.addLibrary('sfud', '#include <sfud.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

Arduino.forBlock['seeed_sfud_init'] = function(block, generator) {
  ensureRawSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'while (sfud_init() != SFUD_SUCCESS) {\n';
  code += '  Serial.println("SFUD init failed, retrying...");\n';
  code += '  delay(500);\n';
  code += '}\n';
  code += '#ifdef SFUD_USING_QSPI\n';
  code += 'sfud_qspi_fast_read_enable(sfud_get_device(SFUD_W25Q32_DEVICE_INDEX), 2);\n';
  code += '#endif\n';
  code += 'Serial.println("SFUD raw flash initialized.");\n';

  return code;
};

Arduino.forBlock['seeed_sfud_erase'] = function(block, generator) {
  const addr = generator.valueToCode(block, 'ADDR', generator.ORDER_ATOMIC) || '0';
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '4096';

  ensureRawSFUD(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += '{\n';
  code += '  const sfud_flash *_sfud_flash = sfud_get_device_table() + 0;\n';
  code += '  sfud_err _sfud_result = sfud_erase(_sfud_flash, ' + addr + ', ' + size + ');\n';
  code += '  if (_sfud_result == SFUD_SUCCESS) {\n';
  code += '    Serial.println("SFUD: Erase done");\n';
  code += '  } else {\n';
  code += '    Serial.println("SFUD: Erase failed");\n';
  code += '  }\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['seeed_sfud_write_str'] = function(block, generator) {
  const addr = generator.valueToCode(block, 'ADDR', generator.ORDER_ATOMIC) || '0';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  ensureRawSFUD(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void sfudWriteStr(uint32_t addr, const char *str) {\n' +
    '  const sfud_flash *flash = sfud_get_device_table() + 0;\n' +
    '  size_t len = strlen(str) + 1;\n' +
    '  sfud_err result = sfud_erase_write(flash, addr, len, (const uint8_t *)str);\n' +
    '  if (result == SFUD_SUCCESS) {\n' +
    '    Serial.println("SFUD: Write done");\n' +
    '  } else {\n' +
    '    Serial.println("SFUD: Write failed");\n' +
    '  }\n' +
    '}\n';

  generator.addObject('sfudWriteStr_function', functionDef, true);

  return 'sfudWriteStr(' + addr + ', String(' + content + ').c_str());\n';
};

Arduino.forBlock['seeed_sfud_read_str'] = function(block, generator) {
  const addr = generator.valueToCode(block, 'ADDR', generator.ORDER_ATOMIC) || '0';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '64';

  ensureRawSFUD(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String sfudReadStr(uint32_t addr, uint32_t maxLen) {\n' +
    '  const sfud_flash *flash = sfud_get_device_table() + 0;\n' +
    '  uint8_t *buf = new uint8_t[maxLen + 1];\n' +
    '  if (!buf) return String("");\n' +
    '  sfud_read(flash, addr, maxLen, buf);\n' +
    '  buf[maxLen] = \'\\0\';\n' +
    '  String result = String((char *)buf);\n' +
    '  delete[] buf;\n' +
    '  return result;\n' +
    '}\n';

  generator.addObject('sfudReadStr_function', functionDef, true);

  return ['sfudReadStr(' + addr + ', ' + length + ')', generator.ORDER_FUNCTION_CALL];
};

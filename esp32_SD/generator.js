'use strict';

function esp32SdEnsureLibrary(generator) {
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function esp32SdFileVariable(block, fallback) {
  const field = block.getField('VAR');
  return field ? field.getText() : fallback;
}

function esp32SdMonitorFileVariable(block) {
  if (block._esp32SdFileVarMonitorAttached) {
    return;
  }

  const field = block.getField('VAR');
  if (!field) {
    return;
  }

  block._esp32SdFileVarMonitorAttached = true;
  block._esp32SdFileLastName = field.getText() || 'file';
  registerVariableToBlockly(block._esp32SdFileLastName, 'File');

  const originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const oldName = block._esp32SdFileLastName;
    if (newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, 'File');
      block._esp32SdFileLastName = newName;
    }
  };
}

function esp32SdRegisterFileVariable(block, generator) {
  esp32SdMonitorFileVariable(block);
  const varName = esp32SdFileVariable(block, 'file');
  registerVariableToBlockly(varName, 'File');
  generator.addObject('esp32_sd_file_' + varName, 'File ' + varName + ';');
  return varName;
}

function esp32SdMountCode(beginExpression) {
  let code = '';
  code += 'if (!' + beginExpression + ') {\n';
  code += '  Serial.println("SD card mount failed");\n';
  code += '  return;\n';
  code += '}\n';
  code += 'if (SD.cardType() == CARD_NONE) {\n';
  code += '  Serial.println("No SD card attached");\n';
  code += '  SD.end();\n';
  code += '  return;\n';
  code += '}\n';
  return code;
}

function esp32SdFrequencyHz(block, generator) {
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '4';
  return '((uint32_t)((' + frequency + ') * 1000000.0))';
}

Arduino.forBlock['esp32_sd_begin'] = function(block, generator) {
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);
  return esp32SdMountCode('SD.begin()');
};

Arduino.forBlock['esp32_sd_begin_custom'] = function(block, generator) {
  const cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '5';
  const sck = generator.valueToCode(block, 'SCK', generator.ORDER_ATOMIC) || '18';
  const miso = generator.valueToCode(block, 'MISO', generator.ORDER_ATOMIC) || '19';
  const mosi = generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || '23';
  const frequencyHz = esp32SdFrequencyHz(block, generator);

  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'SPI.begin(' + sck + ', ' + miso + ', ' + mosi + ', ' + cs + ');\n';
  code += esp32SdMountCode('SD.begin(' + cs + ', SPI, ' + frequencyHz + ')');
  return code;
};

// Kept for compatibility with existing projects. This block installs its code in setup().
Arduino.forBlock['esp32_sd_init'] = function(block, generator) {
  const spi = block.getFieldValue('SPI') || 'SPI';
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '5';
  const frequencyHz = esp32SdFrequencyHz(block, generator);

  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  generator.addSetup('spi_' + spi + '_begin', spi + '.begin();');
  generator.addSetup('sd_' + spi + '_begin', esp32SdMountCode('SD.begin(' + ss + ', ' + spi + ', ' + frequencyHz + ')'));
  return '';
};

Arduino.forBlock['esp32_sd_begin_advanced'] = function(block, generator) {
  const spi = block.getFieldValue('SPI') || 'SPI';
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '5';
  const frequencyHz = esp32SdFrequencyHz(block, generator);
  const mountPoint = block.getFieldValue('MOUNT_POINT') || '/sd';
  const maxFiles = generator.valueToCode(block, 'MAX_FILES', generator.ORDER_ATOMIC) || '5';
  const formatIfEmpty = generator.valueToCode(block, 'FORMAT_IF_EMPTY', generator.ORDER_ATOMIC) || 'false';

  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  return esp32SdMountCode(
    'SD.begin(' + ss + ', ' + spi + ', ' + frequencyHz + ', ' + JSON.stringify(mountPoint) + ', ' + maxFiles + ', ' + formatIfEmpty + ')'
  );
};

Arduino.forBlock['esp32_sd_end'] = function(block, generator) {
  esp32SdEnsureLibrary(generator);
  return 'SD.end();\n';
};

Arduino.forBlock['esp32_sd_card_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'cardType';
  esp32SdEnsureLibrary(generator);

  let code = '0';
  switch (info) {
    case 'cardType':
      code = 'SD.cardType()';
      break;
    case 'cardSize':
      code = '(SD.cardSize() / (1024ULL * 1024ULL))';
      break;
    case 'totalBytes':
      code = '(SD.totalBytes() / (1024ULL * 1024ULL))';
      break;
    case 'usedBytes':
      code = '(SD.usedBytes() / (1024ULL * 1024ULL))';
      break;
    case 'numSectors':
      code = 'SD.numSectors()';
      break;
    case 'sectorSize':
      code = 'SD.sectorSize()';
      break;
  }
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_card_type_name'] = function(block, generator) {
  esp32SdEnsureLibrary(generator);

  const functionDef =
    'const char *esp32SdCardTypeName() {\n' +
    '  switch (SD.cardType()) {\n' +
    '    case CARD_MMC: return "MMC";\n' +
    '    case CARD_SD: return "SDSC";\n' +
    '    case CARD_SDHC: return "SDHC/SDXC";\n' +
    '    case CARD_NONE: return "NONE";\n' +
    '    default: return "UNKNOWN";\n' +
    '  }\n' +
    '}\n';
  generator.addObject('esp32_sd_card_type_name_function', functionDef, true);
  return ['String(esp32SdCardTypeName())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_mountpoint'] = function(block, generator) {
  esp32SdEnsureLibrary(generator);
  return ['String(SD.mountpoint() ? SD.mountpoint() : "")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  return ['SD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

// Legacy value block: retained so saved workspaces continue to generate code.
Arduino.forBlock['esp32_sd_open_file'] = function(block, generator) {
  const varName = esp32SdRegisterFileVariable(block, generator);
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';
  esp32SdEnsureLibrary(generator);
  return [varName + ' = SD.open(' + path + ', ' + mode + ')', generator.ORDER_ASSIGNMENT];
};

Arduino.forBlock['esp32_sd_open_file_to'] = function(block, generator) {
  const varName = esp32SdRegisterFileVariable(block, generator);
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';
  esp32SdEnsureLibrary(generator);
  return varName + ' = SD.open(' + path + ', ' + mode + ');\n';
};

Arduino.forBlock['esp32_sd_close_file'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return varName + '.close();\n';
};

Arduino.forBlock['esp32_sd_file_is_open'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return ['((bool)' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_sd_write_file'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  return varName + '.print(String(' + content + '));\n';
};

Arduino.forBlock['esp32_sd_read_file'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);

  const functionDef =
    'String esp32SdReadRemaining(File &file) {\n' +
    '  String result;\n' +
    '  const size_t remaining = file.available();\n' +
    '  if (remaining > 0) {\n' +
    '    result.reserve(remaining);\n' +
    '  }\n' +
    '  while (file.available()) {\n' +
    '    result += (char)file.read();\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n';
  generator.addObject('esp32_sd_read_remaining_function', functionDef, true);
  return ['esp32SdReadRemaining(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_read_file_bytes'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '64';
  esp32SdEnsureLibrary(generator);

  const functionDef =
    'String esp32SdReadBytes(File &file, size_t length) {\n' +
    '  String result;\n' +
    '  const size_t availableBytes = file.available();\n' +
    '  if (length > availableBytes) {\n' +
    '    length = availableBytes;\n' +
    '  }\n' +
    '  result.reserve(length);\n' +
    '  while (length > 0 && file.available()) {\n' +
    '    result += (char)file.read();\n' +
    '    length--;\n' +
    '  }\n' +
    '  return result;\n' +
    '}\n';
  generator.addObject('esp32_sd_read_bytes_function', functionDef, true);
  return ['esp32SdReadBytes(' + varName + ', ' + length + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_read_byte'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_peek_byte'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return [varName + '.peek()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_available'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return ['(' + varName + '.available() > 0)', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['esp32_sd_file_available_bytes'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_size'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return [varName + '.size()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_position'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return [varName + '.position()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_seek_file'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  const mode = block.getFieldValue('MODE') || 'SeekSet';
  esp32SdEnsureLibrary(generator);
  return [varName + '.seek(' + position + ', ' + mode + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_flush_file'] = function(block, generator) {
  const varName = esp32SdFileVariable(block, 'file');
  esp32SdEnsureLibrary(generator);
  return varName + '.flush();\n';
};

Arduino.forBlock['esp32_sd_write_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void esp32SdWriteFile(const char *path, const String &message) {\n' +
    '  File file = SD.open(path, FILE_WRITE);\n' +
    '  if (!file || file.isDirectory()) {\n' +
    '    Serial.println("Failed to open file for writing");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (!file.print(message)) {\n' +
    '    Serial.println("Write failed");\n' +
    '  }\n' +
    '  file.close();\n' +
    '}\n';
  generator.addObject('esp32_sd_write_file_function', functionDef, true);
  return 'esp32SdWriteFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['esp32_sd_read_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String esp32SdReadFile(const char *path) {\n' +
    '  String result;\n' +
    '  File file = SD.open(path, FILE_READ);\n' +
    '  if (!file || file.isDirectory()) {\n' +
    '    Serial.println("Failed to open file for reading");\n' +
    '    return result;\n' +
    '  }\n' +
    '  const size_t fileSize = file.size();\n' +
    '  if (fileSize > 0) {\n' +
    '    result.reserve(fileSize);\n' +
    '  }\n' +
    '  while (file.available()) {\n' +
    '    result += (char)file.read();\n' +
    '  }\n' +
    '  file.close();\n' +
    '  return result;\n' +
    '}\n';
  generator.addObject('esp32_sd_read_file_function', functionDef, true);
  return ['esp32SdReadFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void esp32SdAppendFile(const char *path, const String &message) {\n' +
    '  File file = SD.open(path, FILE_APPEND);\n' +
    '  if (!file || file.isDirectory()) {\n' +
    '    Serial.println("Failed to open file for appending");\n' +
    '    return;\n' +
    '  }\n' +
    '  if (!file.print(message)) {\n' +
    '    Serial.println("Append failed");\n' +
    '  }\n' +
    '  file.close();\n' +
    '}\n';
  generator.addObject('esp32_sd_append_file_function', functionDef, true);
  return 'esp32SdAppendFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['esp32_sd_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.remove(' + path + ')) {\n';
  code += '  Serial.println("Delete failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp32_sd_rename_file'] = function(block, generator) {
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("Rename failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp32_sd_create_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("mkdir failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp32_sd_remove_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("rmdir failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp32_sd_list_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const levels = generator.valueToCode(block, 'LEVELS', generator.ORDER_ATOMIC) || '0';
  esp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void esp32SdListDir(fs::FS &fs, const char *dirname, uint8_t levels) {\n' +
    '  File root = fs.open(dirname);\n' +
    '  if (!root || !root.isDirectory()) {\n' +
    '    Serial.println("Failed to open directory");\n' +
    '    return;\n' +
    '  }\n' +
    '  File file = root.openNextFile();\n' +
    '  while (file) {\n' +
    '    if (file.isDirectory()) {\n' +
    '      Serial.print("DIR : ");\n' +
    '      Serial.println(file.name());\n' +
    '      if (levels > 0) {\n' +
    '        esp32SdListDir(fs, file.path(), levels - 1);\n' +
    '      }\n' +
    '    } else {\n' +
    '      Serial.print("FILE: ");\n' +
    '      Serial.print(file.name());\n' +
    '      Serial.print(" SIZE: ");\n' +
    '      Serial.println(file.size());\n' +
    '    }\n' +
    '    file = root.openNextFile();\n' +
    '  }\n' +
    '}\n';
  generator.addObject('esp32_sd_list_dir_function', functionDef, true);
  return 'esp32SdListDir(SD, ' + path + ', ' + levels + ');\n';
};

'use strict';

// Two SPIClass wrappers must not manage the same HSPI peripheral: either
// wrapper can stop the bus. Inspect the whole workspace so block order does
// not affect whether SD reuses TFT_eSPI's wrapper or owns a standalone one.
function xueersiEsp32SdUsesTftEspi(block) {
  const workspace = block && block.workspace;
  if (!workspace || typeof workspace.getBlocksByType !== 'function') {
    return false;
  }

  return workspace.getBlocksByType('tftscr_init', false).some(tftBlock => {
    if (typeof tftBlock.getInheritedDisabled === 'function'
        && tftBlock.getInheritedDisabled()) {
      return false;
    }
    if (typeof tftBlock.isEnabled === 'function') {
      return tftBlock.isEnabled();
    }
    return !tftBlock.disabled;
  });
}

function xueersiEsp32SdEnsureLibrary(generator, useTftEspi = false) {
  if (useTftEspi) {
    generator.addMacro('USE_HSPI_PORT', '#define USE_HSPI_PORT');
    generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  }
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function xueersiEsp32SdFileVariable(block, fallback) {
  const field = block.getField('VAR');
  return field ? field.getText() : fallback;
}

function xueersiEsp32SdMonitorFileVariable(block) {
  if (block._xueersiEsp32SdFileVarMonitorAttached) {
    return;
  }

  const field = block.getField('VAR');
  if (!field) {
    return;
  }

  block._xueersiEsp32SdFileVarMonitorAttached = true;
  block._xueersiEsp32SdFileLastName = field.getText() || 'file';
  registerVariableToBlockly(block._xueersiEsp32SdFileLastName, 'File');

  const originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const oldName = block._xueersiEsp32SdFileLastName;
    if (newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, 'File');
      block._xueersiEsp32SdFileLastName = newName;
    }
  };
}

function xueersiEsp32SdRegisterFileVariable(block, generator) {
  xueersiEsp32SdMonitorFileVariable(block);
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  registerVariableToBlockly(varName, 'File');
  generator.addObject('xueersi_esp32_sd_file_' + varName, 'File ' + varName + ';');
  return varName;
}

Arduino.forBlock['xueersi_esp32_sd_init'] = function(block, generator) {
  const useTftEspi = xueersiEsp32SdUsesTftEspi(block);
  xueersiEsp32SdEnsureLibrary(generator, useTftEspi);
  ensureSerialBegin('Serial', generator);
  const spiInstance = useTftEspi
    ? '  SPIClass &sharedSpi = TFT_eSPI::getSPIinstance();'
    : '  static SPIClass standaloneSpi(HSPI);\n  SPIClass &sharedSpi = standaloneSpi;';
  generator.addFunction('xueersi_esp32_sd_shared_hspi_begin', `static uint32_t xueersiEsp32SdActiveFrequency = 0;

static bool xueersiEsp32SdProbeFilesystem(void) {
  File root = SD.open("/", FILE_READ);
  if (!root || !root.isDirectory()) {
    if (root) {
      root.close();
    }
    return false;
  }

  // Opening "/" can succeed without fetching every directory sector. Walk
  // real entries, reopen a regular file by path, then sample it from several
  // positions so an unstable clock is rejected before application code uses SD.
  bool readOk = true;
  bool fileProbed = false;
  uint8_t entriesChecked = 0;
  File entry = root.openNextFile();
  while (entry && entriesChecked < 32) {
    entriesChecked++;
    const bool entryIsDirectory = entry.isDirectory();
    const String entryPath = String(entry.path());
    const size_t entrySize = entry.size();
    Serial.printf("[Xueersi SD] %s %s (%lu bytes)\\n",
      entryIsDirectory ? "DIR " : "FILE",
      entryPath.c_str(),
      (unsigned long)entrySize);

    if (!entryIsDirectory && !fileProbed && entrySize > 0) {
      // Reopen by its real path instead of reading through the directory
      // iterator. This verifies the exact lookup operation used by playback,
      // including FAT long-file-name handling.
      entry.close();
      File probeFile = SD.open(entryPath.c_str(), FILE_READ);
      if (!probeFile || probeFile.isDirectory()) {
        if (probeFile) probeFile.close();
        readOk = false;
        break;
      }

      uint8_t probeBuffer[512];
      const size_t sampleSize = entrySize > 4096 ? 4096 : entrySize;
      const uint8_t sampleCount = entrySize > sampleSize ? 5 : 1;
      for (uint8_t sample = 0; sample < sampleCount && readOk; sample++) {
        const size_t maxOffset = entrySize - sampleSize;
        const size_t offset = sampleCount > 1
          ? (uint64_t)maxOffset * sample / (sampleCount - 1)
          : 0;
        if (!probeFile.seek(offset, SeekSet)) {
          readOk = false;
          break;
        }

        size_t remaining = sampleSize;
        while (remaining > 0) {
          const size_t wanted = remaining > sizeof(probeBuffer)
            ? sizeof(probeBuffer)
            : remaining;
          const size_t count = probeFile.read(probeBuffer, wanted);
          if (count != wanted) {
            readOk = false;
            break;
          }
          remaining -= count;
        }
      }
      probeFile.close();
      fileProbed = true;
    } else {
      entry.close();
    }

    if (!readOk) {
      break;
    }
    entry = root.openNextFile();
  }

  if (entry) {
    entry.close();
  }
  root.close();
  return readOk;
}

static bool xueersiEsp32SdTryFrequency(
    SPIClass &sharedSpi,
    uint32_t frequency) {
  const uint8_t TFT_CS_PIN = 5;
  const uint8_t TF_CS_PIN = 22;

  Serial.printf("[Xueersi SD] try %lu Hz\\n", (unsigned long)frequency);
  SD.end();
  sharedSpi.end();
  delay(2);

  pinMode(TFT_CS_PIN, OUTPUT);
  digitalWrite(TFT_CS_PIN, HIGH);
  pinMode(TF_CS_PIN, OUTPUT);
  digitalWrite(TF_CS_PIN, HIGH);

  // TFT and TF time-share the same HSPI peripheral and GPIO matrix routes.
  // GPIO19 must remain an input because it is TF MISO and panel RESET.
  if (!sharedSpi.begin(18, 19, 23, TF_CS_PIN)) {
    Serial.println("[Xueersi SD] HSPI begin failed");
    return false;
  }
  delay(2);

  if (!SD.begin(TF_CS_PIN, sharedSpi, frequency)
      || SD.cardType() == CARD_NONE) {
    Serial.printf("[Xueersi SD] mount failed at %lu Hz\\n",
      (unsigned long)frequency);
    SD.end();
    digitalWrite(TF_CS_PIN, HIGH);
    return false;
  }

  if (!xueersiEsp32SdProbeFilesystem()) {
    Serial.printf("[Xueersi SD] filesystem probe failed at %lu Hz\\n",
      (unsigned long)frequency);
    SD.end();
    digitalWrite(TF_CS_PIN, HIGH);
    return false;
  }

  xueersiEsp32SdActiveFrequency = frequency;
  Serial.printf("[Xueersi SD] ready at %lu Hz\\n",
    (unsigned long)xueersiEsp32SdActiveFrequency);
  return true;
}

static bool xueersiEsp32SdBegin(void) {
${spiInstance}
  static const uint32_t FREQUENCIES[] = {
    25000000UL,
    20000000UL,
    16000000UL,
    10000000UL,
    4000000UL
  };

  for (size_t i = 0; i < sizeof(FREQUENCIES) / sizeof(FREQUENCIES[0]); i++) {
    if (xueersiEsp32SdTryFrequency(sharedSpi, FREQUENCIES[i])) {
      return true;
    }
  }

  Serial.println("[Xueersi SD] no usable TF card");
  return false;
}`);
  return 'xueersiEsp32SdBegin();\n';
};

Arduino.forBlock['xueersi_esp32_sd_end'] = function(block, generator) {
  xueersiEsp32SdEnsureLibrary(generator);
  return 'SD.end();\n';
};

Arduino.forBlock['xueersi_esp32_sd_card_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'cardType';
  xueersiEsp32SdEnsureLibrary(generator);

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

Arduino.forBlock['xueersi_esp32_sd_card_type_name'] = function(block, generator) {
  xueersiEsp32SdEnsureLibrary(generator);

  const functionDef =
    'const char *xueersiEsp32SdCardTypeName() {\n' +
    '  switch (SD.cardType()) {\n' +
    '    case CARD_MMC: return "MMC";\n' +
    '    case CARD_SD: return "SDSC";\n' +
    '    case CARD_SDHC: return "SDHC/SDXC";\n' +
    '    case CARD_NONE: return "NONE";\n' +
    '    default: return "UNKNOWN";\n' +
    '  }\n' +
    '}\n';
  generator.addObject('xueersi_esp32_sd_card_type_name_function', functionDef, true);
  return ['String(xueersiEsp32SdCardTypeName())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_mountpoint'] = function(block, generator) {
  xueersiEsp32SdEnsureLibrary(generator);
  return ['String(SD.mountpoint() ? SD.mountpoint() : "")', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_file_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  return ['SD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

// Legacy value block: retained so saved workspaces continue to generate code.
Arduino.forBlock['xueersi_esp32_sd_open_file_to'] = function(block, generator) {
  const varName = xueersiEsp32SdRegisterFileVariable(block, generator);
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';
  xueersiEsp32SdEnsureLibrary(generator);
  return varName + ' = SD.open(' + path + ', ' + mode + ');\n';
};

Arduino.forBlock['xueersi_esp32_sd_close_file'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return varName + '.close();\n';
};

Arduino.forBlock['xueersi_esp32_sd_file_is_open'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return ['((bool)' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['xueersi_esp32_sd_write_file'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  return varName + '.print(String(' + content + '));\n';
};

Arduino.forBlock['xueersi_esp32_sd_read_file'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);

  const functionDef =
    'String xueersiEsp32SdReadRemaining(File &file) {\n' +
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
  generator.addObject('xueersi_esp32_sd_read_remaining_function', functionDef, true);
  return ['xueersiEsp32SdReadRemaining(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_read_file_bytes'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '64';
  xueersiEsp32SdEnsureLibrary(generator);

  const functionDef =
    'String xueersiEsp32SdReadBytes(File &file, size_t length) {\n' +
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
  generator.addObject('xueersi_esp32_sd_read_bytes_function', functionDef, true);
  return ['xueersiEsp32SdReadBytes(' + varName + ', ' + length + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_read_byte'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_peek_byte'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.peek()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_file_available'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return ['(' + varName + '.available() > 0)', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['xueersi_esp32_sd_file_available_bytes'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_file_size'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.size()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_file_position'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.position()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_seek_file'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  const mode = block.getFieldValue('MODE') || 'SeekSet';
  xueersiEsp32SdEnsureLibrary(generator);
  return [varName + '.seek(' + position + ', ' + mode + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_flush_file'] = function(block, generator) {
  const varName = xueersiEsp32SdFileVariable(block, 'file');
  xueersiEsp32SdEnsureLibrary(generator);
  return varName + '.flush();\n';
};

Arduino.forBlock['xueersi_esp32_sd_write_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void xueersiEsp32SdWriteFile(const char *path, const String &message) {\n' +
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
  generator.addObject('xueersi_esp32_sd_write_file_function', functionDef, true);
  return 'xueersiEsp32SdWriteFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['xueersi_esp32_sd_read_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String xueersiEsp32SdReadFile(const char *path) {\n' +
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
  generator.addObject('xueersi_esp32_sd_read_file_function', functionDef, true);
  return ['xueersiEsp32SdReadFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xueersi_esp32_sd_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void xueersiEsp32SdAppendFile(const char *path, const String &message) {\n' +
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
  generator.addObject('xueersi_esp32_sd_append_file_function', functionDef, true);
  return 'xueersiEsp32SdAppendFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['xueersi_esp32_sd_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.remove(' + path + ')) {\n';
  code += '  Serial.println("Delete failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['xueersi_esp32_sd_rename_file'] = function(block, generator) {
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("Rename failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['xueersi_esp32_sd_create_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("mkdir failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['xueersi_esp32_sd_remove_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("rmdir failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['xueersi_esp32_sd_list_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const levels = generator.valueToCode(block, 'LEVELS', generator.ORDER_ATOMIC) || '0';
  xueersiEsp32SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void xueersiEsp32SdListDir(fs::FS &fs, const char *dirname, uint8_t levels) {\n' +
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
    '        xueersiEsp32SdListDir(fs, file.path(), levels - 1);\n' +
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
  generator.addObject('xueersi_esp32_sd_list_dir_function', functionDef, true);
  return 'xueersiEsp32SdListDir(SD, ' + path + ', ' + levels + ');\n';
};

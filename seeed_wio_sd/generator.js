'use strict';

// Keep the removed FREQUENCY connection available only for restoring projects
// created with versions <= 1.0.1. The generator intentionally ignores it.
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  const legacyFrequencyExtension = 'seeed_wio_sd_legacy_frequency_input';
  if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(legacyFrequencyExtension)) {
    Blockly.Extensions.unregister(legacyFrequencyExtension);
  }
  Blockly.Extensions.register(legacyFrequencyExtension, function() {
    let legacyInput = this.getInput('FREQUENCY');
    if (!legacyInput) {
      legacyInput = this.appendValueInput('FREQUENCY').setCheck('Number');
    }

    const hideLegacyInput = () => {
      if (!this.rendered || !this.getInput('FREQUENCY')) {
        return;
      }
      legacyInput.setVisible(false);
      if (typeof this.render === 'function') {
        this.render();
      }
    };

    if (this.rendered) {
      hideLegacyInput();
    } else if (typeof Promise !== 'undefined') {
      Promise.resolve().then(hideLegacyInput);
    }
  });
}

// Helper: add Seeed_Arduino_FS library include
function ensureSeeedFS(generator) {
  generator.addLibrary('Seeed_Arduino_FS', '#include <Seeed_Arduino_FS.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function seeedFsGenerateOnboardSdBegin(generator) {
  generator.addMacro(
    'AILY_SEEED_FS_ONBOARD_SD_INIT',
    '#define AILY_SEEED_FS_ONBOARD_SD_INIT 1'
  );

  let code = '';
  code += 'if (!SD.begin(SDCARD_SS_PIN, SDCARD_SPI, 24000000UL)) {\n';
  code += '  Serial.println("Card Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';
  code += 'Serial.println("SD card initialized.");\n';
  return code;
}

Arduino.forBlock['seeed_fs_sd_begin'] = function(block, generator) {
  ensureSeeedFS(generator);
  ensureSerialBegin('Serial', generator);
  return seeedFsGenerateOnboardSdBegin(generator);
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

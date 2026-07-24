'use strict';

function esp8266SdEnsureLibrary(generator) {
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function esp8266SdFileVariable(block, fallback) {
  const field = block.getField('VAR');
  return field ? field.getText() : fallback;
}

function esp8266SdMonitorFileVariable(block) {
  if (block._esp8266SdFileVarMonitorAttached) {
    return;
  }

  const field = block.getField('VAR');
  if (!field) {
    return;
  }

  block._esp8266SdFileVarMonitorAttached = true;
  block._esp8266SdFileLastName = field.getText() || 'file';
  registerVariableToBlockly(block._esp8266SdFileLastName, 'File');

  const originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const oldName = block._esp8266SdFileLastName;
    if (newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, 'File');
      block._esp8266SdFileLastName = newName;
    }
  };
}

function esp8266SdRegisterFileVariable(block, generator) {
  esp8266SdMonitorFileVariable(block);
  const varName = esp8266SdFileVariable(block, 'file');
  registerVariableToBlockly(varName, 'File');
  generator.addObject('esp8266_sd_file_' + varName, 'File ' + varName + ';');
  return varName;
}

function esp8266SdMountCode(beginExpression) {
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

function esp8266SdFrequencyHz(block, generator) {
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '4';
  return '((uint32_t)((' + frequency + ') * 1000000.0))';
}

Arduino.forBlock['esp8266_sd_begin'] = function(block, generator) {
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);
  return esp8266SdMountCode('SD.begin(' + (block.getFieldValue('CS_PIN') || 'SS') + ')');
};



// Kept for compatibility with existing projects. This block installs its code in setup().




Arduino.forBlock['esp8266_sd_end'] = function(block, generator) {
  esp8266SdEnsureLibrary(generator);
  return 'SD.end();\n';
};







Arduino.forBlock['esp8266_sd_file_exists'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  return ['SD.exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

// Legacy value block: retained so saved workspaces continue to generate code.
Arduino.forBlock['esp8266_sd_open_file'] = function(block, generator) {
  const varName = esp8266SdRegisterFileVariable(block, generator);
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';
  esp8266SdEnsureLibrary(generator);
  return [varName + ' = SD.open(' + path + ', ' + mode + ')', generator.ORDER_ASSIGNMENT];
};

Arduino.forBlock['esp8266_sd_open_file_to'] = function(block, generator) {
  const varName = esp8266SdRegisterFileVariable(block, generator);
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';
  esp8266SdEnsureLibrary(generator);
  return varName + ' = SD.open(' + path + ', ' + mode + ');\n';
};

Arduino.forBlock['esp8266_sd_close_file'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return varName + '.close();\n';
};

Arduino.forBlock['esp8266_sd_file_is_open'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return ['((bool)' + varName + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp8266_sd_write_file'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  return varName + '.print(String(' + content + '));\n';
};

Arduino.forBlock['esp8266_sd_read_file'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);

  const functionDef =
    'String esp8266SdReadRemaining(File &file) {\n' +
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
  generator.addObject('esp8266_sd_read_remaining_function', functionDef, true);
  return ['esp8266SdReadRemaining(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_read_file_bytes'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '64';
  esp8266SdEnsureLibrary(generator);

  const functionDef =
    'String esp8266SdReadBytes(File &file, size_t length) {\n' +
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
  generator.addObject('esp8266_sd_read_bytes_function', functionDef, true);
  return ['esp8266SdReadBytes(' + varName + ', ' + length + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_read_byte'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_peek_byte'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return [varName + '.peek()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_file_available'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return ['(' + varName + '.available() > 0)', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['esp8266_sd_file_available_bytes'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return [varName + '.available()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_file_size'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return [varName + '.size()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_file_position'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return [varName + '.position()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_seek_file'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  const position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  const mode = block.getFieldValue('MODE') || 'SeekSet';
  esp8266SdEnsureLibrary(generator);
  return [varName + '.seek(' + position + ', ' + mode + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_flush_file'] = function(block, generator) {
  const varName = esp8266SdFileVariable(block, 'file');
  esp8266SdEnsureLibrary(generator);
  return varName + '.flush();\n';
};

Arduino.forBlock['esp8266_sd_write_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void esp8266SdWriteFile(const char *path, const String &message) {\n' +
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
  generator.addObject('esp8266_sd_write_file_function', functionDef, true);
  return 'esp8266SdWriteFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['esp8266_sd_read_file_quick'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'String esp8266SdReadFile(const char *path) {\n' +
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
  generator.addObject('esp8266_sd_read_file_function', functionDef, true);
  return ['esp8266SdReadFile(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266_sd_append_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  const functionDef =
    'void esp8266SdAppendFile(const char *path, const String &message) {\n' +
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
  generator.addObject('esp8266_sd_append_file_function', functionDef, true);
  return 'esp8266SdAppendFile(' + path + ', String(' + content + '));\n';
};

Arduino.forBlock['esp8266_sd_delete_file'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.remove(' + path + ')) {\n';
  code += '  Serial.println("Delete failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp8266_sd_rename_file'] = function(block, generator) {
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("Rename failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp8266_sd_create_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("mkdir failed");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['esp8266_sd_remove_dir'] = function(block, generator) {
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  esp8266SdEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  let code = '';
  code += 'if (!SD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("rmdir failed");\n';
  code += '}\n';
  return code;
};




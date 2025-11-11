'use strict';

Arduino.forBlock['esp32_sd_begin'] = function(block, generator) {
  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += 'if (!SD.begin()) {\n';
  code += '  Serial.println("Card Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';

  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['esp32_sd_begin_custom'] = function(block, generator) {
  const cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '5';
  const sck = generator.valueToCode(block, 'SCK', generator.ORDER_ATOMIC) || '18';
  const miso = generator.valueToCode(block, 'MISO', generator.ORDER_ATOMIC) || '19';
  const mosi = generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || '23';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '4000000';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += '// 初始化SPI总线和SD卡\n';
  code += 'SPI.begin(' + sck + ', ' + miso + ', ' + mosi + ', ' + cs + ');\n';
  code += 'if (!SD.begin(' + cs + ', SPI, ' + frequency + ')) {\n';
  code += '  Serial.println("Card Mount Failed");\n';
  code += '  return;\n';
  code += '}\n';

  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['esp32_sd_card_info'] = function(block, generator) {
  const info = block.getFieldValue('INFO') || 'cardType';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = '';
  switch (info) {
    case 'cardType':
      code = 'SD.cardType()';
      break;
    case 'cardSize':
      code = '(SD.cardSize() / (1024 * 1024))';
      break;
    case 'totalBytes':
      code = '(SD.totalBytes() / (1024 * 1024))';
      break;
    case 'usedBytes':
      code = '(SD.usedBytes() / (1024 * 1024))';
      break;
    default:
      code = '0';
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_exists'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'SD';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = varName + '.exists(' + path + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_open_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const mode = block.getFieldValue('MODE') || 'FILE_READ';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  // 注册文件变量
  registerVariableToBlockly(varName, 'File');
  generator.addVariable(varName, 'File ' + varName + ';');

  let code = varName + ' = SD.open(' + path + ', ' + mode + ')';
  
  return [code, generator.ORDER_ASSIGNMENT];
};

Arduino.forBlock['esp32_sd_close_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = varName + '.close();\n';
  
  return code;
};

Arduino.forBlock['esp32_sd_write_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = varName + '.print(' + content + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_sd_read_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = '';
  code += '(function() {\n';
  code += '  String result = "";\n';
  code += '  while (' + varName + '.available()) {\n';
  code += '    result += (char)' + varName + '.read();\n';
  code += '  }\n';
  code += '  return result;\n';
  code += '})()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = varName + '.available()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_file_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'file';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  let code = varName + '.size()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_write_file_quick'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += '{\n';
  code += '  File file = SD.open(' + path + ', FILE_WRITE);\n';
  code += '  if (!file) {\n';
  code += '    Serial.println("Failed to open file for writing");\n';
  code += '    return;\n';
  code += '  }\n';
  code += '  if (file.print(' + content + ')) {\n';
  code += '    Serial.println("File written");\n';
  code += '  } else {\n';
  code += '    Serial.println("Write failed");\n';
  code += '  }\n';
  code += '  file.close();\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_read_file_quick'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += '(function() {\n';
  code += '  String result = "";\n';
  code += '  File file = SD.open(' + path + ');\n';
  code += '  if (!file) {\n';
  code += '    Serial.println("Failed to open file for reading");\n';
  code += '    return result;\n';
  code += '  }\n';
  code += '  while (file.available()) {\n';
  code += '    result += (char)file.read();\n';
  code += '  }\n';
  code += '  file.close();\n';
  code += '  return result;\n';
  code += '})()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_sd_append_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
  const content = generator.valueToCode(block, 'CONTENT', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += '{\n';
  code += '  File file = SD.open(' + path + ', FILE_APPEND);\n';
  code += '  if (!file) {\n';
  code += '    Serial.println("Failed to open file for appending");\n';
  code += '    return;\n';
  code += '  }\n';
  code += '  if (file.print(' + content + ')) {\n';
  code += '    Serial.println("Message appended");\n';
  code += '  } else {\n';
  code += '    Serial.println("Append failed");\n';
  code += '  }\n';
  code += '  file.close();\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_delete_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += 'if (SD.remove(' + path + ')) {\n';
  code += '  Serial.println("File deleted");\n';
  code += '} else {\n';
  code += '  Serial.println("Delete failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_rename_file'] = function(block, generator) {
  const varField = block.getField('VAR');
  const oldPath = generator.valueToCode(block, 'OLD_PATH', generator.ORDER_ATOMIC) || '""';
  const newPath = generator.valueToCode(block, 'NEW_PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += 'if (SD.rename(' + oldPath + ', ' + newPath + ')) {\n';
  code += '  Serial.println("File renamed");\n';
  code += '} else {\n';
  code += '  Serial.println("Rename failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_create_dir'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += 'if (SD.mkdir(' + path + ')) {\n';
  code += '  Serial.println("Dir created");\n';
  code += '} else {\n';
  code += '  Serial.println("mkdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_remove_dir'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  let code = '';
  code += 'if (SD.rmdir(' + path + ')) {\n';
  code += '  Serial.println("Dir removed");\n';
  code += '} else {\n';
  code += '  Serial.println("rmdir failed");\n';
  code += '}\n';

  return code;
};

Arduino.forBlock['esp32_sd_list_dir'] = function(block, generator) {
  const varField = block.getField('VAR');
  const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '"/"';
  const levels = generator.valueToCode(block, 'LEVELS', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('FS', '#include <FS.h>');
  generator.addLibrary('SD', '#include <SD.h>');

  ensureSerialBegin("Serial", generator);

  // 添加递归列出目录的函数
  generator.addObject('listDir_function', 
`void listDir(fs::FS &fs, const char *dirname, uint8_t levels) {
  Serial.printf("Listing directory: %s\\n", dirname);

  File root = fs.open(dirname);
  if (!root) {
    Serial.println("Failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    if (file.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(file.name());
      if (levels) {
        listDir(fs, file.path(), levels - 1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(file.name());
      Serial.print("  SIZE: ");
      Serial.println(file.size());
    }
    file = root.openNextFile();
  }
}`, true);

  let code = 'listDir(SD, ' + path + ', ' + levels + ');\n';

  return code;
};
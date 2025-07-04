/**
 * @license
 * SD卡文件系统操作的Blockly to Arduino代码生成器（整合）
 */

'use strict';

// 工具方法：添加 SD/FS 库（去重）
function addSDFSLib(generator) {
  generator.addLibrary('SD_include', '#include <SD.h>');
  generator.addLibrary('FS_include', '#include <FS.h>');
}

// 一键初始化SPI和SD卡
Arduino.forBlock['esp32_spi_sd_init'] = function(block, generator) {
  // 添加必要的库
  generator.addLibrary('esp32_spi', '#include <SPI.h>');
  addSDFSLib(generator);
  // 移除重复的FS库，因为addSDFSLib函数会处理
  
  // 获取SPI配置参数
  const spiType = block.getFieldValue('SPI_TYPE') || 'HSPI';
  const spiVarName = block.getFieldValue('SPI_VAR_NAME') || 'spi';
  
  // 获取引脚参数
  const sckPin = generator.valueToCode(block, 'SCK_PIN', Arduino.ORDER_ATOMIC);
  const misoPin = generator.valueToCode(block, 'MISO_PIN', Arduino.ORDER_ATOMIC);
  const mosiPin = generator.valueToCode(block, 'MOSI_PIN', Arduino.ORDER_ATOMIC);
  const csPin = generator.valueToCode(block, 'CS_PIN', Arduino.ORDER_ATOMIC) || '5';
  
  // 创建SPI实例变量
  const spiCode = `SPIClass ${spiVarName} = SPIClass(${spiType});\n`;
  generator.addVariable(`spi_${spiVarName}`, spiCode);
  
  // 生成SPI初始化代码，使用较高优先级
  generator.addSetup('010_spi_begin', 
    `// 初始化SPI接口\n${spiVarName}.begin(${sckPin}, ${misoPin}, ${mosiPin}, ${csPin});\n`);
  
  // 生成SD卡初始化代码，使用较低优先级确保在SPI初始化之后执行
  const sdInitCode = 
`// 初始化SD卡
if (!SD.begin(${csPin}, ${spiVarName})) {
  Serial.println("SD card initialization failed!");
  while (1); // 无限循环
}
Serial.println("SD card initialization done.");
`;
  
  generator.addSetup('050_sd_begin', sdInitCode);
  
  return '';
};

// SD卡初始化 - SD.begin([csPin])
Arduino.forBlock['sd_begin'] = function(block, generator) {
  var pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC) || block.getFieldValue('CS_PIN') || '10';
  var spi = generator.valueToCode(block, 'SPI_INST', Arduino.ORDER_ATOMIC) || '';
  
  generator.addLibrary('SD', '#include <SD.h>');
  
  // 添加初始化代码，并包含错误处理
  var code = '';
  
  if (spi && spi.length > 0) {
    // 如果提供了SPI实例，使用指定的SPI
    code = `if (!SD.begin(${pin}, ${spi})) { // 初始化SD卡\n`;
  } else {
    // 否则使用默认SPI
    code = `if (!SD.begin(${pin})) { // 初始化SD卡\n`;
  }
  
  code += '  Serial.println("SD card initialization failed!");\n';
  code += '  while (1); // 无限循环\n';
  code += '}\n';
  
  // 使用数字前缀提高优先级（数字越大优先级越低）
  generator.addSetup('050_sd_begin', code);
  return '';
};

// 获取SD卡类型 - SD.cardType()
Arduino.forBlock['sd_card_type'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.cardType()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取SD卡容量 - SD.cardSize()
Arduino.forBlock['sd_card_size'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.cardSize()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取总空间 - SD.totalBytes()
Arduino.forBlock['sd_total_bytes'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.totalBytes()', Arduino.ORDER_FUNCTION_CALL];
};

// 获取已用空间 - SD.usedBytes()
Arduino.forBlock['sd_used_bytes'] = function(block, generator) {
  addSDFSLib(generator);
  return ['SD.usedBytes()', Arduino.ORDER_FUNCTION_CALL];
};

// 打开文件/目录 - SD.open(path [, mode])
// 读取文件并存储到变量 - 独立函数实现
// 读取文本文件并返回内容 - 作为值输出
Arduino.forBlock['sd_read_file'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  
  // 添加读取文本文件函数到全局
  const functionName = 'readTextFile';
  const functionCode = 
`String readTextFile(fs::FS &fs, const char * path) {
  Serial.printf("Reading text file: %s\\n", path);
  String result = "";
 
  File file = fs.open(path);
  if(!file) {
    Serial.println("Failed to open text file for reading");
    return result;
  }
  
  // 逐字符读取文本文件内容
  while(file.available()) {
    char c = file.read();
    result += c;
  }
  
  file.close();
  Serial.printf("Text file read complete, %d bytes\\n", result.length());
  return result;
}`;

  generator.addFunction(functionName, functionCode);
  
  // 直接返回函数调用表达式，作为值使用
  return [`readTextFile(SD, ${path})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['sd_write_file'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  const append = block.getFieldValue('MODE') === 'APPEND';
  
  // 添加writeFile函数到全局
  const functionName = 'writeStringToFile';
  const functionCode = 
`void writeStringToFile(fs::FS &fs, const char * path, const String &data, bool append) {
  Serial.printf("Writing to file: %s\\n", path);
  
  File file;
  if (append) {
    file = fs.open(path, FILE_APPEND);
  } else {
    file = fs.open(path, FILE_WRITE);
  }
  
  if(!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  
  if(file.print(data)) {
    Serial.println("File written successfully");
  } else {
    Serial.println("Write failed");
  }
  
  file.close();
}`;

  generator.addFunction(functionName, functionCode);
  
  // 生成函数调用代码
  return `writeStringToFile(SD, ${path}, ${data}, ${append});\n`;
};

// 创建目录 - SD.mkdir(path)
Arduino.forBlock['sd_mkdir'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.mkdir(${path});\n`;
};

// 删除目录 - SD.rmdir(path)
Arduino.forBlock['sd_rmdir'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.rmdir(${path});\n`;
};

// 删除文件 - SD.remove(path)
Arduino.forBlock['sd_remove'] = function(block, generator) {
  addSDFSLib(generator);
  const path = generator.valueToCode(block, 'PATH', Arduino.ORDER_ATOMIC);
  return `SD.remove(${path});\n`;
};

// 重命名文件/目录 - SD.rename(pathFrom, pathTo)
Arduino.forBlock['sd_rename'] = function(block, generator) {
  addSDFSLib(generator);
  const pathFrom = generator.valueToCode(block, 'PATH_FROM', Arduino.ORDER_ATOMIC);
  const pathTo = generator.valueToCode(block, 'PATH_TO', Arduino.ORDER_ATOMIC);
  return `SD.rename(${pathFrom}, ${pathTo});\n`;
};

// 判断文件是否为目录 - File::isDirectory()
Arduino.forBlock['file_is_directory'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.isDirectory()`, Arduino.ORDER_MEMBER];
};

// 遍历目录下的文件 - File::openNextFile()
Arduino.forBlock['file_open_next_file'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.openNextFile()`, Arduino.ORDER_MEMBER];
};

// 获取文件/目录名 - File::name()
Arduino.forBlock['file_name'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC) || generator.valueToCode(block, 'FILE', Arduino.ORDER_MEMBER);
  return [`${fileVar}.name()`, Arduino.ORDER_MEMBER];
};

// 获取文件大小 - File::size()
Arduino.forBlock['file_size'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.size()`, Arduino.ORDER_MEMBER];
};

// 获取最后修改时间 - File::getLastWrite()
Arduino.forBlock['file_get_last_write'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.getLastWrite()`, Arduino.ORDER_MEMBER];
};

// 可读取字节数 - File::available()
Arduino.forBlock['file_available'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.available()`, Arduino.ORDER_MEMBER];
};

// 读取数据 - File::read()
Arduino.forBlock['file_read'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return [`${fileVar}.read()`, Arduino.ORDER_MEMBER];
};

// 写入数据 - File::write(data)
Arduino.forBlock['file_write'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  return `${fileVar}.write(${data});\n`;
};

// 打印到文件 - File::print(data)
Arduino.forBlock['file_print'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC);
  return `${fileVar}.print(${data});\n`;
};

// 关闭文件 - File::close()
Arduino.forBlock['file_close'] = function(block, generator) {
  addSDFSLib(generator);
  const fileVar = generator.valueToCode(block, 'FILE_VAR', Arduino.ORDER_ATOMIC);
  return `${fileVar}.close();\n`;
};

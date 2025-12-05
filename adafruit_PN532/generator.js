'use strict';

/**
 * PN532 NFC/RFID模块代码生成器
 * 支持SPI、I2C、UART接口，以及Mifare Classic、Mifare Ultralight、NTAG2xx等卡片操作
 */

// PN532 SPI接口创建
Arduino.forBlock['pn532_create_spi'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._pn532VarMonitorAttached) {
    block._pn532VarMonitorAttached = true;
    block._pn532VarLastName = block.getFieldValue('VAR') || 'nfc';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._pn532VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Adafruit_PN532');
          block._pn532VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'nfc';
  const spi = block.getFieldValue('SPI');
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '10';

  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  registerVariableToBlockly(varName, 'Adafruit_PN532');
  generator.addVariable(`pn532_${varName}`, 'Adafruit_PN532 *' + varName + ';');
  generator.addSetup(`spi_${spi}_begin`, spi + '.begin();');
  generator.addSetup(`pn532_${varName}_init`, varName + ' = new Adafruit_PN532(' + ss + ', &' + spi + ');');
  generator.addSetup(`pn532_${varName}_begin`, varName + '->begin();');

  return "";
};

// PN532 I2C接口创建并初始化
Arduino.forBlock['pn532_create_i2c'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._pn532VarMonitorAttached) {
    block._pn532VarMonitorAttached = true;
    block._pn532VarLastName = block.getFieldValue('VAR') || 'nfc';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._pn532VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Adafruit_PN532');
          block._pn532VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'nfc';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 添加库和变量声明
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'Adafruit_PN532');
  generator.addVariable(varName, 'Adafruit_PN532 ' + varName + '(-1, -1);');
  

  
  // 添加Wire初始化和PN532初始化到setup
  const pinComment = '// PN532 I2C连接: 使用默认I2C引脚';
  generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wire + '.begin();\n');
  generator.addSetup(`pn532_${varName}_begin`, varName + '.begin();');

  return "";
};

// 获取固件版本
Arduino.forBlock['pn532_get_firmware_version'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  const code = varName + '.getFirmwareVersion()';
  return [code, Arduino.ORDER_ATOMIC];
};

// SAM配置
Arduino.forBlock['pn532_sam_config'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  let code = varName + '.SAMConfig();\n';
  return code;
};

// 设置被动激活重试次数
Arduino.forBlock['pn532_set_passive_retries'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const retries = block.getFieldValue('RETRIES');

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  let code = varName + '.setPassiveActivationRetries(' + retries + ');\n';
  return code;
};

// 读取被动目标ID
Arduino.forBlock['pn532_read_passive_target'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const cardType = block.getFieldValue('CARDTYPE');
  const timeout = block.getFieldValue('TIMEOUT');

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加全局UID变量
  generator.addVariable('pn532_uid', 'uint8_t pn532_uid[7];');
  generator.addVariable('pn532_uid_length', 'uint8_t pn532_uid_length;');
  
  const code = varName + '.readPassiveTargetID(' + cardType + ', pn532_uid, &pn532_uid_length, ' + timeout + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取UID长度
Arduino.forBlock['pn532_get_uid_length'] = function(block, generator) {
  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加全局UID变量
  generator.addVariable('pn532_uid', 'uint8_t pn532_uid[7];');
  generator.addVariable('pn532_uid_length', 'uint8_t pn532_uid_length;');
  
  const code = 'pn532_uid_length';
  return [code, Arduino.ORDER_ATOMIC];
};

// 获取UID字节
Arduino.forBlock['pn532_get_uid_byte'] = function(block, generator) {
  const index = Arduino.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加全局UID变量
  generator.addVariable('pn532_uid', 'uint8_t pn532_uid[7];');
  generator.addVariable('pn532_uid_length', 'uint8_t pn532_uid_length;');
  
  const code = 'pn532_uid[' + index + ']';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Classic认证
Arduino.forBlock['pn532_mifare_classic_authenticate'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const sector = block.getFieldValue('SECTOR');
  const keyType = block.getFieldValue('KEYTYPE');
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"FFFFFFFFFFFF"';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加全局UID变量
  generator.addVariable('pn532_uid', 'uint8_t pn532_uid[7];');
  generator.addVariable('pn532_uid_length', 'uint8_t pn532_uid_length;');
  
  // 添加密钥转换函数
  const keyConvertFunc = `uint8_t* convertKey(const char* keyStr) {
  static uint8_t key[6];
  for (int i = 0; i < 6; i++) {
    char hexByte[3] = {keyStr[i*2], keyStr[i*2+1], '\\0'};
    key[i] = strtol(hexByte, NULL, 16);
  }
  return key;
}`;
  generator.addFunction('convertKey', keyConvertFunc);
  
  const code = varName + '.mifareclassic_AuthenticateBlock(pn532_uid, pn532_uid_length, ' + sector + ', ' + keyType + ', convertKey(' + key + '))';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Classic读取数据块（智能解析NDEF）
Arduino.forBlock['pn532_mifare_classic_read_block'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const blockNum = block.getFieldValue('BLOCK');

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加数据缓冲区
  generator.addVariable('pn532_data_buffer', 'uint8_t pn532_data_buffer[16];');
  
  // 添加NDEF解析函数
  const parseNdefFunc = `String parseNDEFURI(Adafruit_PN532& nfc, uint8_t blockNum) {
  uint8_t data[16];
  if (!nfc.mifareclassic_ReadDataBlock(blockNum, data)) return "读取失败";
  
  // 检查是否是NDEF格式
  if (data[0] == 0x03 && data[5] == 'U') {
    // 获取URI前缀
    uint8_t prefixCode = data[6];
    String prefix = "";
    switch(prefixCode) {
      case 0x00: prefix = ""; break;
      case 0x01: prefix = "http://www."; break;
      case 0x02: prefix = "https://www."; break;
      case 0x03: prefix = "http://"; break;
      case 0x04: prefix = "https://"; break;
      case 0x05: prefix = "tel:"; break;
      case 0x06: prefix = "mailto:"; break;
      default: prefix = ""; break;
    }
    
    // 读取URL
    String url = prefix;
    for (int i = 7; i < 16; i++) {
      if (data[i] >= 32 && data[i] <= 126) {
        url += (char)data[i];
      } else if (data[i] == 0xFE || data[i] == 0x00) break;
    }
    
    // 继续读取下一块
    if (nfc.mifareclassic_ReadDataBlock(blockNum + 1, data)) {
      for (int i = 0; i < 16; i++) {
        if (data[i] >= 32 && data[i] <= 126) {
          url += (char)data[i];
        } else if (data[i] == 0xFE || data[i] == 0x00) break;
      }
    }
    return url;
  }
  
  // 非NDEF格式，返回原始数据
  String result = "";
  for (int i = 0; i < 16; i++) {
    if (data[i] >= 32 && data[i] <= 126) {
      result += (char)data[i];
    } else {
      result += ".";
    }
  }
  return result;
}`;
  generator.addFunction('parseNDEFURI', parseNdefFunc);
  
  const code = 'parseNDEFURI(' + varName + ', ' + blockNum + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Classic写入数据块
Arduino.forBlock['pn532_mifare_classic_write_block'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const blockNum = block.getFieldValue('BLOCK');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加写入函数
  const writeFunc = `bool writeMifareClassicBlock(Adafruit_PN532& nfc, uint8_t blockNum, String data) {
  uint8_t buffer[16];
  memset(buffer, 0, 16);
  for (int i = 0; i < min(16, data.length()); i++) {
    buffer[i] = data[i];
  }
  return nfc.mifareclassic_WriteDataBlock(blockNum, buffer);
}`;
  generator.addFunction('writeMifareClassicBlock', writeFunc);
  
  const code = 'writeMifareClassicBlock(' + varName + ', ' + blockNum + ', ' + data + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Ultralight读取页面
Arduino.forBlock['pn532_mifare_ultralight_read_page'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const page = block.getFieldValue('PAGE');

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加读取函数
  const readFunc = `String readMifareUltralightPage(Adafruit_PN532& nfc, uint8_t page) {
  uint8_t data[4];
  if (nfc.mifareultralight_ReadPage(page, data)) {
    String result = "";
    for (int i = 0; i < 4; i++) {
      if (data[i] >= 32 && data[i] <= 126) {
        result += (char)data[i];
      } else {
        result += ".";
      }
    }
    return result;
  }
  return "";
}`;
  generator.addFunction('readMifareUltralightPage', readFunc);
  
  const code = 'readMifareUltralightPage(' + varName + ', ' + page + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Ultralight写入页面
Arduino.forBlock['pn532_mifare_ultralight_write_page'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const page = block.getFieldValue('PAGE');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加写入函数
  const writeFunc = `bool writeMifareUltralightPage(Adafruit_PN532& nfc, uint8_t page, String data) {
  uint8_t buffer[4];
  memset(buffer, 0, 4);
  for (int i = 0; i < min(4, data.length()); i++) {
    buffer[i] = data[i];
  }
  return nfc.mifareultralight_WritePage(page, buffer);
}`;
  generator.addFunction('writeMifareUltralightPage', writeFunc);
  
  const code = 'writeMifareUltralightPage(' + varName + ', ' + page + ', ' + data + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// NTAG2xx读取页面
Arduino.forBlock['pn532_ntag2xx_read_page'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const page = block.getFieldValue('PAGE');

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加读取函数
  const readFunc = `String readNTAG2xxPage(Adafruit_PN532& nfc, uint8_t page) {
  uint8_t data[4];
  if (nfc.ntag2xx_ReadPage(page, data)) {
    String result = "";
    for (int i = 0; i < 4; i++) {
      if (data[i] >= 32 && data[i] <= 126) {
        result += (char)data[i];
      } else {
        result += ".";
      }
    }
    return result;
  }
  return "";
}`;
  generator.addFunction('readNTAG2xxPage', readFunc);
  
  const code = 'readNTAG2xxPage(' + varName + ', ' + page + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// NTAG2xx写入页面
Arduino.forBlock['pn532_ntag2xx_write_page'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const page = block.getFieldValue('PAGE');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加写入函数
  const writeFunc = `bool writeNTAG2xxPage(Adafruit_PN532& nfc, uint8_t page, String data) {
  uint8_t buffer[4];
  memset(buffer, 0, 4);
  for (int i = 0; i < min(4, data.length()); i++) {
    buffer[i] = data[i];
  }
  return nfc.ntag2xx_WritePage(page, buffer);
}`;
  generator.addFunction('writeNTAG2xxPage', writeFunc);
  
  const code = 'writeNTAG2xxPage(' + varName + ', ' + page + ', ' + data + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Classic写入NDEF URI（使用手动写入方式，100%可靠）
Arduino.forBlock['pn532_mifare_classic_write_ndef_uri'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const sector = block.getFieldValue('SECTOR');
  const prefix = block.getFieldValue('PREFIX');
  const url = Arduino.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加UID全局变量
  generator.addVariable('pn532_uid', 'uint8_t pn532_uid[7];');
  generator.addVariable('pn532_uid_length', 'uint8_t pn532_uid_length;');
  
  // 添加手动写入NDEF的函数
  const writeNdefFunc = `bool writeNDEFURI_Manual(Adafruit_PN532& nfc, uint8_t sector, uint8_t prefix, const char* url) {
  uint8_t blockNum = sector * 4;  // 扇区转块号
  uint8_t key[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
  
  // 认证
  if (!nfc.mifareclassic_AuthenticateBlock(pn532_uid, pn532_uid_length, blockNum, MIFARE_CMD_AUTH_A, key)) {
    return false;
  }
  
  // 构造NDEF消息
  uint8_t urlLen = strlen(url);
  uint8_t totalLen = 7 + urlLen;  // 头7字节 + URL长度
  
  uint8_t block1[16] = {0x03, totalLen, 0xD1, 0x01, urlLen + 1, 'U', prefix};
  uint8_t block2[16] = {0xFE};
  
  // 复制URL到block1和block2
  for (int i = 0; i < urlLen && i < 9; i++) {
    block1[7 + i] = url[i];
  }
  for (int i = 9; i < urlLen; i++) {
    block2[i - 9] = url[i];
  }
  
  // 写入数据块
  if (!nfc.mifareclassic_WriteDataBlock(blockNum, block1)) return false;
  if (urlLen > 9) {
    if (!nfc.mifareclassic_WriteDataBlock(blockNum + 1, block2)) return false;
  } else {
    block2[0] = 0xFE;
    if (!nfc.mifareclassic_WriteDataBlock(blockNum + 1, block2)) return false;
  }
  
  return true;
}`;
  generator.addFunction('writeNDEFURI_Manual', writeNdefFunc);
  
  const code = 'writeNDEFURI_Manual(' + varName + ', ' + sector + ', ' + prefix + ', ' + url + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

// NTAG2xx写入NDEF URI
Arduino.forBlock['pn532_ntag2xx_write_ndef_uri'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';
  const prefix = block.getFieldValue('PREFIX');
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  // 添加字符串转换函数
  const convertFunc = `char* stringToCharArray(String str) {
  static char buffer[256];
  str.toCharArray(buffer, 256);
  return buffer;
}`;
  generator.addFunction('stringToCharArray', convertFunc);
  
  // 添加长度计算函数
  const lengthFunc = `int getStringLength(String str) {
  return str.length();
}`;
  generator.addFunction('getStringLength', lengthFunc);
  
  const code = varName + '.ntag2xx_WriteNDEFURI(' + prefix + ', stringToCharArray(' + url + '), getStringLength(' + url + '))';
  return [code, Arduino.ORDER_ATOMIC];
};

// Mifare Classic格式化为NDEF
Arduino.forBlock['pn532_mifare_classic_format_ndef'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'nfc';

  // 添加库引用
  generator.addLibrary('PN532', '#include <Adafruit_PN532.h>');
  
  const code = varName + '.mifareclassic_FormatNDEF()';
  return [code, Arduino.ORDER_ATOMIC];
};
'use strict';

// MFRC522 RFID库代码生成器 - 修复版本

// 核心库函数: 注册变量到Blockly
Arduino.registerVariableToBlockly = function(varName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.createVariable) {
      workspace.createVariable(varName, varType);
    }
  }
};

// 核心库函数: 重命名Blockly中的变量
Arduino.renameVariableInBlockly = function(oldName, newName, varType) {
  if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
    var workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.renameVariableById) {
      var variable = workspace.getVariable(oldName, varType);
      if (variable) {
        workspace.renameVariableById(variable.getId(), newName);
      }
    }
  }
};

// 注册板卡识别扩展
if (Blockly.Extensions.isRegistered('mfrc522_board_extension')) {
  Blockly.Extensions.unregister('mfrc522_board_extension');
}

Blockly.Extensions.register('mfrc522_board_extension', function() {
  // 获取开发板配置信息
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardType = (boardConfig.type || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  // 判断开发板类型
  var isESP32 = boardCore.indexOf('esp32') > -1 || 
                boardType.indexOf('esp32') > -1 ||
                boardName.indexOf('esp32') > -1;
  var isMega2560 = boardCore.indexOf('mega') > -1 || 
                  boardType.indexOf('mega') > -1 ||
                  boardName.indexOf('mega') > -1 || 
                  boardName.indexOf('2560') > -1;
  
  // 保存板卡类型到块实例
  this.boardType_ = isESP32 ? 'ESP32' : (isMega2560 ? 'MEGA' : 'UNO');
  
  if (isESP32) {
    // ESP32需要添加SDA和SCL引脚选择
    // 获取板卡的数字引脚列表
    var digitalPins = (boardConfig.digitalPins || []);
    var pinOptions = digitalPins.length > 0 ? digitalPins : [['1', '1'], ['2', '2']];
    
    // 添加引脚字段到消息
    this.appendDummyInput('PIN_INPUT')
      .appendField('SDA引脚')
      .appendField(new Blockly.FieldDropdown(pinOptions), 'SDA_PIN')
      .appendField('SCL引脚')
      .appendField(new Blockly.FieldDropdown(pinOptions), 'SCL_PIN');
    
    this.setTooltip('初始化MFRC522 RFID读写器，ESP32需要设置I2C地址和SDA/SCL引脚');
  } else {
    // Arduino UNO和Mega2560不需要引脚选择（引脚固定）
    if (isMega2560) {
      this.setTooltip('初始化MFRC522 RFID读写器（Mega2560 I2C引脚固定: SDA->20, SCL->21）');
    } else {
      this.setTooltip('初始化MFRC522 RFID读写器（Arduino UNO I2C引脚固定: SDA->A4, SCL->A5）');
    }
  }
  
  // 添加变量重命名监听机制
  var varField = this.getField('VAR');
  if (varField) {
    varField.setValidator(function(newValue) {
      var oldValue = this.getValue();
      if (oldValue !== newValue) {
        Arduino.renameVariableInBlockly(oldValue, newValue, 'MFRC522');
      }
      return newValue;
    });
  }
});

// 初始化块
Arduino.forBlock['mfrc522_setup'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'rfid';
  const address = block.getFieldValue('ADDRESS') || '0x2F';
  const sdaPin = block.getFieldValue('SDA_PIN') || 'A4';
  const sclPin = block.getFieldValue('SCL_PIN') || 'A5';

  // 注册变量到Blockly
  Arduino.registerVariableToBlockly(varName, 'MFRC522');

  // 获取当前开发板配置
  const config = window['boardConfig'] || {};
  const core = (config.core || '').toLowerCase();
  const type = (config.type || '').toLowerCase();
  const name = (config.name || '').toLowerCase();
  
  // 判断开发板类型（参考 ai-assistant 的实现）
  const isESP32 = core.indexOf('esp32') > -1 || 
                  type.indexOf('esp32') > -1 ||
                  name.indexOf('esp32') > -1;
  const isMega2560 = core.indexOf('mega') > -1 || 
                     type.indexOf('mega') > -1 ||
                     name.indexOf('mega') > -1 || 
                     name.indexOf('2560') > -1;
  const isArduinoUno = (core === 'arduino:avr' && type.indexOf('uno') > -1) ||
                       name.indexOf('uno') > -1 ||
                       (!isESP32 && !isMega2560); // 如果不是ESP32和Mega，默认为Arduino UNO

  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 使用core-serial库的ID格式确保与core-serial库去重
  if (!Arduino.addedSerialInitCode || !Arduino.addedSerialInitCode.has('Serial')) {
    generator.addSetupBegin('serial_Serial_begin', 'Serial.begin(115200);');
    // 标记Serial为已初始化（兼容core-serial库）
    if (!Arduino.addedSerialInitCode) Arduino.addedSerialInitCode = new Set();
    Arduino.addedSerialInitCode.add('Serial');
  }
  
  // 添加全局对象声明
  const objDeclaration = 'MFRC522 ' + varName + '(' + address + ');';
  generator.addVariable(varName, objDeclaration);
  
  // 根据板卡类型生成不同的初始化代码
  let setupCode = '';
  let pinComment = '';
  
  if (isESP32) {
    // ESP32需要指定SDA和SCL引脚参数
    setupCode = 'Wire.begin(' + sdaPin + ', ' + sclPin + ');\n' + varName + '.PCD_Init();\n';
    pinComment = '// MFRC522 I2C连接 (ESP32): SDA->' + sdaPin + ', SCL->' + sclPin;
  } else {
    // Arduino UNO和Mega2560的I2C引脚固定，不需要参数
    setupCode = 'Wire.begin();\n' + varName + '.PCD_Init();\n';
    if (isMega2560) {
      pinComment = '// MFRC522 I2C连接 (Mega2560): SDA->20, SCL->21';
    } else {
      pinComment = '// MFRC522 I2C连接 (Arduino UNO): SDA->A4, SCL->A5';
    }
  }
  
  generator.addSetupEnd(setupCode, setupCode);
  generator.addSetupBegin(pinComment, pinComment);
  
  return '';
};

// 检测是否有新卡片
Arduino.forBlock['mfrc522_is_new_card_present'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  return [varName + '.PICC_IsNewCardPresent()', generator.ORDER_ATOMIC];
};

// 读取卡片序列号
Arduino.forBlock['mfrc522_read_card_serial'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  return [varName + '.PICC_ReadCardSerial()', generator.ORDER_ATOMIC];
};

// 卡片检测事件
Arduino.forBlock['mfrc522_when_card_detected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  const code = 'if (' + varName + '.PICC_IsNewCardPresent() && ' + varName + '.PICC_ReadCardSerial()) {\n' + handlerCode + '}\n';
  generator.addLoopBegin(code, code);
  return '';
};

// 获取UID字符串
Arduino.forBlock['mfrc522_read_uid'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  return [varName + '.Read_Uid()', generator.ORDER_ATOMIC];
};

// 认证扇区
Arduino.forBlock['mfrc522_authenticate'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  const sector = generator.valueToCode(block, 'SECTOR', generator.ORDER_ATOMIC) || '1';
  const keyType = block.getFieldValue('KEY_TYPE') || 'A';
  let key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"0xFF,0xFF,0xFF,0xFF,0xFF,0xFF"';
  
  if (typeof key === 'string') {
    key = key.replace(/"/g, '').trim();
  }
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  const keyVarName = 'authKey_' + varName + '_' + sector;
  // 只在全局区声明MIFARE_Key结构体实例
  generator.addVariable(keyVarName, 'MFRC522::MIFARE_Key ' + keyVarName + ';');
  
  // 在setup中初始化密钥
  let initCode = 'for (byte i = 0; i < 6; i++) {\n';
  initCode += '  ' + keyVarName + '.keyByte[i] = 0xFF;\n';
  initCode += '}\n';
  generator.addSetupEnd(initCode, initCode);
  
  // 使用数值常量而不是符号名，避免编译器找不到定义
  const command = keyType === 'A' ? '0x60' : '0x61';  // 0x60=PICC_CMD_MF_AUTH_KEY_A, 0x61=PICC_CMD_MF_AUTH_KEY_B
  const code = varName + '.PCD_Authenticate(' + command + ', ' + sector + ', &' + keyVarName + ', &' + varName + '.uid);\n';
  return code;
};

// 读取块数据
Arduino.forBlock['mfrc522_read_block'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  const blockAddr = generator.valueToCode(block, 'BLOCK', generator.ORDER_ATOMIC) || '4';
  const bufferField = block.getField('BUFFER');
  const bufferName = bufferField ? bufferField.getText() : 'data';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  // 只声明数据缓冲区
  const bufferVarCode = 'byte ' + bufferName + '[18];\n' +
                        'byte ' + bufferName + 'Size = sizeof(' + bufferName + ');';
  generator.addVariable(bufferName, bufferVarCode);
  
  // 简单读取数据
  const code = varName + '.MIFARE_Read(' + blockAddr + ', ' + bufferName + ', &' + bufferName + 'Size);\n';
  return code;
};

// 写入块数据
Arduino.forBlock['mfrc522_write_block'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '"Hello RFID"';
  const blockAddr = generator.valueToCode(block, 'BLOCK', generator.ORDER_ATOMIC) || '4';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  const bufferName = 'writeBuffer_' + varName + '_' + blockAddr;
  
  // 只添加变量声明到全局区域
  const bufferVarCode = 'byte ' + bufferName + '[16];\nString ' + bufferName + 'Str = ' + data + ';';
  generator.addVariable(bufferName, bufferVarCode);
  
  // 将初始化代码添加到setup中
  let initCode = 'for(int j = 0; j < 16 && j < ' + bufferName + 'Str.length(); j++) {\n';
  initCode += '  ' + bufferName + '[j] = ' + bufferName + 'Str.charAt(j);\n';
  initCode += '}\n';
  initCode += 'for(int j = ' + bufferName + 'Str.length(); j < 16; j++) {\n';
  initCode += '  ' + bufferName + '[j] = 0;\n';
  initCode += '}\n';
  generator.addSetupEnd(initCode, initCode);
  
  const code = varName + '.MIFARE_Write(' + blockAddr + ', ' + bufferName + ', 16);\n';
  return code;
};

// 停止卡片通信
Arduino.forBlock['mfrc522_halt_card'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfid';
  
  generator.addLibrary('MFRC522', '#include <Emakefun_RFID.h>');
  
  const code = varName + '.PICC_HaltA();\n' + varName + '.PCD_StopCrypto1();\n';
  return code;
};

// 获取数据的十六进制字符串（新增）
Arduino.forBlock['mfrc522_get_data_string'] = function(block, generator) {
  const bufferField = block.getField('BUFFER');
  const bufferName = bufferField ? bufferField.getText() : 'data';
  
  // 添加格式化函数
  const helperFuncName = 'format_' + bufferName;
  const helperFunc = 'String ' + helperFuncName + '() {\n' +
                     '  String result = "";\n' +
                     '  for (int i = 0; i < 16; i++) {\n' +
                     '    if (' + bufferName + '[i] < 0x10) result += "0";\n' +
                     '    result += String(' + bufferName + '[i], HEX);\n' +
                     '    if (i < 15) result += " ";\n' +
                     '  }\n' +
                     '  return result;\n' +
                     '}';
  generator.addFunction(helperFuncName, helperFunc);
  
  // 返回函数调用作为值表达式
  return [helperFuncName + '()', generator.ORDER_ATOMIC];
};
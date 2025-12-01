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

// 注册扩展（无需板卡识别）
if (Blockly.Extensions.isRegistered('mfrc522_board_extension')) {
  Blockly.Extensions.unregister('mfrc522_board_extension');
}

Blockly.Extensions.register('mfrc522_board_extension', function() {
  // 设置提示信息（使用默认I2C引脚）
  this.setTooltip('初始化MFRC522 RFID读写器（I2C默认引脚）');
  
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

  // 注册变量到Blockly
  Arduino.registerVariableToBlockly(varName, 'MFRC522');

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
  
  // 分离Wire初始化和传感器初始化
  const wireInitCode = 'Wire.begin();';
  const pinComment = '// MFRC522 I2C连接: 使用默认I2C引脚';
  const sensorInitCode = varName + '.PCD_Init();\n';
  
  // 使用统一的setupKey添加Wire初始化（可被aily_iic库覆盖）
  generator.addSetup('wire_Wire_begin', pinComment + '\n' + wireInitCode + '\n');
  
  // 传感器初始化使用独立的key
  generator.addSetup(`mfrc522_${varName}_init`, sensorInitCode);
  
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
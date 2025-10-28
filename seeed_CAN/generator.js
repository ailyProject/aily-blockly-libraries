'use strict';

// Seeed CAN库代码生成器
// 支持MCP2515和MCP2518FD CAN控制器

// 创建CAN对象
Arduino.forBlock['seeed_can_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._seeedCanVarMonitorAttached) {
    block._seeedCanVarMonitorAttached = true;
    block._seeedCanVarLastName = block.getFieldValue('VAR') || 'can';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._seeedCanVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'MCP_CAN');
          block._seeedCanVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'can';
  const csPin = block.getFieldValue('CS_PIN');

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'MCP_CAN');
  
  // 声明CAN对象变量
  generator.addVariable(varName, 'mcp2515_can ' + varName + '(' + csPin + ');');

  return '';
};

// 初始化CAN总线
Arduino.forBlock['seeed_can_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const speed = block.getFieldValue('SPEED');
  const clock = block.getFieldValue('CLOCK');

  // 添加库文件
// 发送CAN消息
Arduino.forBlock['seeed_can_send'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0x00';
  const ext = block.getFieldValue('EXT');
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '{0,0,0,0,0,0,0,0}';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成发送代码
  const code = varName + '.sendMsgBuf(' + id + ', ' + ext + ', 8, ' + data + ');\n';
  return code;
};
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0x00';
  const ext = block.getFieldValue('EXT');
// 读取接收到的CAN消息
Arduino.forBlock['seeed_can_receive'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  
  const lenField = block.getField('LEN');
  const lenVar = lenField ? lenField.getText() : 'len';
  
  const idField = block.getField('ID');
  const idVar = idField ? idField.getText() : 'id';
  
  const dataField = block.getField('DATA');
  const dataVar = dataField ? dataField.getText() : 'data';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 声明变量
  generator.addVariable(lenVar, 'byte ' + lenVar + ' = 0;');
  generator.addVariable(dataVar, 'byte ' + dataVar + '[8];');
  generator.addVariable(idVar, 'unsigned long ' + idVar + ' = 0;');

  // 生成读取代码
  let code = '';
  code += varName + '.readMsgBuf(&' + lenVar + ', ' + dataVar + ');\n';
  code += idVar + ' = ' + varName + '.getCanId();\n';

  return code;
};
Arduino.forBlock['seeed_can_receive'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  
  const lenField = block.getField('LEN');
  const lenVar = lenField ? lenField.getText() : 'len';
  
  const idField = block.getField('ID');
  const idVar = idField ? idField.getText() : 'id';
  
  const dataField = block.getField('DATA');
  const dataVar = dataField ? dataField.getText() : 'data';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 声明变量
  generator.addVariable(lenVar, 'byte ' + lenVar + ' = 0;');
  generator.addVariable(dataVar, 'byte ' + dataVar + '[8];');
  generator.addVariable(idVar, 'unsigned long ' + idVar + ' = 0;');

  // 生成读取代码
  let code = '';
  code += varName + '.readMsgBuf(&' + lenVar + ', ' + dataVar + ');\n';
  code += idVar + ' = ' + varName + '.getCanId();\n';

  return code;
};

// 获取消息ID
Arduino.forBlock['seeed_can_get_id'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成获取ID代码
  const code = varName + '.getCanId()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 设置掩码
Arduino.forBlock['seeed_can_init_mask'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const num = block.getFieldValue('NUM');
  const ext = block.getFieldValue('EXT');
  const mask = generator.valueToCode(block, 'MASK', generator.ORDER_ATOMIC) || '0x000';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成设置掩码代码
  const code = varName + '.init_Mask(' + num + ', ' + ext + ', ' + mask + ');\n';
  return code;
};

// 设置过滤器
Arduino.forBlock['seeed_can_init_filter'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const num = block.getFieldValue('NUM');
  const ext = block.getFieldValue('EXT');
  const filter = generator.valueToCode(block, 'FILTER', generator.ORDER_ATOMIC) || '0x000';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成设置过滤器代码
  const code = varName + '.init_Filt(' + num + ', ' + ext + ', ' + filter + ');\n';
  return code;
};

// 设置工作模式
Arduino.forBlock['seeed_can_set_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';
  const mode = block.getFieldValue('MODE');

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成设置模式代码
  const code = varName + '.setMode(' + mode + ');\n';
  return code;
};

// 进入睡眠模式
Arduino.forBlock['seeed_can_sleep'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成睡眠代码
  const code = varName + '.sleep();\n';
  return code;
};

// 唤醒
Arduino.forBlock['seeed_can_wake'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成唤醒代码
  const code = varName + '.wake();\n';
  return code;
};

// 检查错误
Arduino.forBlock['seeed_can_check_error'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'can';

  // 添加库文件
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');

  // 生成检查错误代码
  const code = varName + '.checkError()';
  return [code, generator.ORDER_FUNCTION_CALL];
};
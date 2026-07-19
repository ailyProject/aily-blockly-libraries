
// 为Wire库创建的Blockly代码生成器

// 初始化I2C通信
Arduino.forBlock['wire_begin'] = function(block, generator) {
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addSetupBegin('wire_begin', 'Wire.begin();');
  return '';
};

// 以从机地址初始化I2C通信
Arduino.forBlock['wire_begin_address'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addSetupBegin('wire_begin', `Wire.begin(${address});`);
  return '';
};

// 设置I2C时钟频率
Arduino.forBlock['wire_set_clock'] = function(block, generator) {
  const clockKHz = generator.valueToCode(block, 'CLOCK', Arduino.ORDER_ATOMIC) || '100';
  const clockHz = `((uint32_t)((${clockKHz}) * 1000.0))`;
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addSetupBegin('wire_set_clock', `Wire.setClock(${clockHz});`);
  return '';
};

// 结束I2C通信
Arduino.forBlock['wire_end'] = function(block, generator) {
  return 'Wire.end();\n';
};

// 开始与设备的传输
Arduino.forBlock['wire_begin_transmission'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('wire', '#include <Wire.h>');
  return `Wire.beginTransmission(${address});\n`;
};

// 结束传输
Arduino.forBlock['wire_end_transmission'] = function(block, generator) {
  const stop = block.getFieldValue('STOP') === 'TRUE' ? 'true' : 'false';
  return `Wire.endTransmission(${stop});\n`;
};

// 结束传输并返回状态码
Arduino.forBlock['wire_end_transmission_result'] = function(block, generator) {
  const stop = block.getFieldValue('STOP') === 'TRUE' ? 'true' : 'false';
  generator.addLibrary('wire', '#include <Wire.h>');
  return [`Wire.endTransmission(${stop})`, Arduino.ORDER_FUNCTION_CALL];
};

// 写入数据
Arduino.forBlock['wire_write'] = function(block, generator) {
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
  return `Wire.write(${data});\n`;
};

// 写入多个字节
Arduino.forBlock['wire_write_bytes'] = function(block, generator) {
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
  const length = generator.valueToCode(block, 'LENGTH', Arduino.ORDER_ATOMIC) || '0';
  return `Wire.write(${data}, ${length});\n`;
};

// 从设备请求数据
Arduino.forBlock['wire_request_from'] = function(block, generator) {
  const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC) || '0';
  const quantity = generator.valueToCode(block, 'QUANTITY', Arduino.ORDER_ATOMIC) || '1';
  const stop = block.getFieldValue('STOP') === 'TRUE' ? 'true' : 'false';
  generator.addLibrary('wire', '#include <Wire.h>');
  return `Wire.requestFrom(${address}, ${quantity}, ${stop});\n`;
};

// 检查是否有可用数据
Arduino.forBlock['wire_available'] = function(block, generator) {
  return ['Wire.available()', Arduino.ORDER_FUNCTION_CALL];
};

// 读取数据
Arduino.forBlock['wire_read'] = function(block, generator) {
  return ['Wire.read()', Arduino.ORDER_FUNCTION_CALL];
};

// 预览数据但不移动指针
Arduino.forBlock['wire_peek'] = function(block, generator) {
  return ['Wire.peek()', Arduino.ORDER_FUNCTION_CALL];
};

// 刷新缓冲区
Arduino.forBlock['wire_flush'] = function(block, generator) {
  return 'Wire.flush();\n';
};

// 设置接收回调
Arduino.forBlock['wire_on_receive'] = function(block, generator) {
  const functionName = generator.nameDB_.getName(
    block.getFieldValue('FUNCTION_NAME'), 'PROCEDURE');
  const callback = generator.statementToCode(block, 'CALLBACK');
  
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addFunction(`void ${functionName}(int numBytes)`, `void ${functionName}(int numBytes) {\n${callback}}\n`);
  generator.addSetupBegin('wire_on_receive', `Wire.onReceive(${functionName});`);
  
  return '';
};

// 设置请求回调
Arduino.forBlock['wire_on_request'] = function(block, generator) {
  const functionName = generator.nameDB_.getName(
    block.getFieldValue('FUNCTION_NAME'), 'PROCEDURE');
  const callback = generator.statementToCode(block, 'CALLBACK');
  
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addFunction(`void ${functionName}()`, `void ${functionName}() {\n${callback}}\n`);
  generator.addSetupBegin('wire_on_request', `Wire.onRequest(${functionName});`);
  
  return '';
};

// 设置超时
Arduino.forBlock['wire_set_timeout'] = function(block, generator) {
  const timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '25000';
  const reset = block.getFieldValue('RESET') === 'TRUE' ? 'true' : 'false';
  
  generator.addLibrary('wire', '#include <Wire.h>');
  return `Wire.setWireTimeout(${timeout}, ${reset});\n`;
};

// 获取超时标志
Arduino.forBlock['wire_get_timeout_flag'] = function(block, generator) {
  return ['Wire.getWireTimeoutFlag()', Arduino.ORDER_FUNCTION_CALL];
};

// 清除超时标志
Arduino.forBlock['wire_clear_timeout_flag'] = function(block, generator) {
  return 'Wire.clearWireTimeoutFlag();\n';
};

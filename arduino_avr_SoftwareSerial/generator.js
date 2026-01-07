/**
 * SoftwareSerial Blockly 代码生成器
 * 用于Arduino软件模拟串口通信
 */

// 初始化软串口
Arduino.forBlock['softwareserial_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._softserialVarMonitorAttached) {
    block._softserialVarMonitorAttached = true;
    block._softserialLastVarName = block.getFieldValue('VAR') || 'mySerial';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        if (block._softserialLastVarName && block._softserialLastVarName !== newName) {
          renameVariableInBlockly(block, block._softserialLastVarName, newName, 'SoftwareSerial');
          block._softserialLastVarName = newName;
        }
        return newName;
      });
    }
  }

  // 获取参数
  const varName = block.getFieldValue('VAR') || 'mySerial';
  const rxPin = block.getFieldValue('RX_PIN') || '10';
  const txPin = block.getFieldValue('TX_PIN') || '11';
  const baudRate = block.getFieldValue('BAUD') || '9600';

  // 添加库引用
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');

  // 注册变量到Blockly
  registerVariableToBlockly(varName, 'SoftwareSerial');

  // 声明SoftwareSerial对象
  generator.addObject(
    'SoftwareSerial_' + varName,
    'SoftwareSerial ' + varName + '(' + rxPin + ', ' + txPin + ');'
  );

  // 生成begin代码
  return varName + '.begin(' + baudRate + ');\n';
};

// 检查是否有数据可读
Arduino.forBlock['softwareserial_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';

  return [varName + '.available()', generator.ORDER_ATOMIC];
};

// 读取数据
Arduino.forBlock['softwareserial_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';
  const readType = block.getFieldValue('TYPE') || 'read()';

  return [varName + '.' + readType, generator.ORDER_ATOMIC];
};

// 输出数据（不换行）
Arduino.forBlock['softwareserial_print'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';

  return varName + '.print(' + data + ');\n';
};

// 输出数据（换行）
Arduino.forBlock['softwareserial_println'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';

  return varName + '.println(' + data + ');\n';
};

// 输出原始字节数据
Arduino.forBlock['softwareserial_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  return varName + '.write(' + data + ');\n';
};

// 设置为活动监听端口
Arduino.forBlock['softwareserial_listen'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';

  return varName + '.listen();\n';
};

// 检查是否正在监听
Arduino.forBlock['softwareserial_islistening'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';

  return [varName + '.isListening()', generator.ORDER_ATOMIC];
};

// 检查缓冲区溢出
Arduino.forBlock['softwareserial_overflow'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';

  return [varName + '.overflow()', generator.ORDER_ATOMIC];
};

// 关闭软串口
Arduino.forBlock['softwareserial_end'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'mySerial';

  return varName + '.end();\n';
};

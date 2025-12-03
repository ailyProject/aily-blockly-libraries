// TCA8418 Blockly Generator for Aily Platform

// 注意：registerVariableToBlockly 和 renameVariableInBlockly 由核心库提供

// TCA8418 创建块
Arduino.forBlock['tca8418_create'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._tca8418VarMonitorAttached) {
    block._tca8418VarMonitorAttached = true;
    block._tca8418VarLastName = block.getFieldValue('VAR') || 'keypad';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tca8418VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Adafruit_TCA8418');
          block._tca8418VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'keypad';
  
  // 添加库和变量
  generator.addLibrary('Adafruit_TCA8418', '#include <Adafruit_TCA8418.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'Adafruit_TCA8418');
  generator.addVariable(varName, 'Adafruit_TCA8418 ' + varName + ';');
  
  return '';
};

// TCA8418 初始化块
Arduino.forBlock['tca8418_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '52';
  
  // 添加库引用
  generator.addLibrary('Adafruit_TCA8418', '#include <Adafruit_TCA8418.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');

  
  // 动态获取Wire（支持Wire/Wire1等）
  const wire = block.getFieldValue('WIRE') || 'Wire'; // 从字段读取，默认Wire
  
  // 分离Wire初始化和传感器初始化
  const wireInitCode = wire + '.begin();';
  const pinComment = '// TCA8418 I2C连接: 使用默认I2C引脚';
  
  // 使用动态setupKey添加Wire初始化（支持多I2C总线）
  generator.addSetup(`wire_${wire}_begin`, pinComment + '\n' + wireInitCode + '\n');
  
  // 将十进制地址转换为十六进制字符串
  const addressNum = parseInt(address);
  const addressHex = isNaN(addressNum) ? address : '0x' + addressNum.toString(16);
  
  // 生成传感器初始化代码
  const code = 'if (!' + varName + '.begin(' + addressHex + ', &Wire)) {\n' +
    '  Serial.println("' + varName + ' not found, check wiring & pullups!");\n' +
    '  while (1);\n' +
    '}\n';
  
  return code;
};

// TCA8418 设置键盘矩阵块
Arduino.forBlock['tca8418_matrix'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const rows = generator.valueToCode(block, 'ROWS', generator.ORDER_ATOMIC) || '4';
  const columns = generator.valueToCode(block, 'COLUMNS', generator.ORDER_ATOMIC) || '3';
  
  const code = varName + '.matrix(' + rows + ', ' + columns + ');\n';
  return code;
};

// TCA8418 可用事件数量块
Arduino.forBlock['tca8418_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.available()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCA8418 获取事件块
Arduino.forBlock['tca8418_get_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.getEvent()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCA8418 清空缓冲区块
Arduino.forBlock['tca8418_flush'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.flush();\n';
  return code;
};

// TCA8418 设置引脚模式块
Arduino.forBlock['tca8418_pin_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '0';
  const mode = block.getFieldValue('MODE');
  
  const code = varName + '.pinMode(' + pin + ', ' + mode + ');\n';
  return code;
};

// TCA8418 数字读取块
Arduino.forBlock['tca8418_digital_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '0';
  
  const code = varName + '.digitalRead(' + pin + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCA8418 数字写入块
Arduino.forBlock['tca8418_digital_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '0';
  const level = block.getFieldValue('LEVEL');
  
  const code = varName + '.digitalWrite(' + pin + ', ' + level + ');\n';
  return code;
};

// TCA8418 启用中断块
Arduino.forBlock['tca8418_enable_interrupts'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.enableInterrupts();\n';
  return code;
};

// TCA8418 禁用中断块
Arduino.forBlock['tca8418_disable_interrupts'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.disableInterrupts();\n';
  return code;
};

// TCA8418 启用消抖块
Arduino.forBlock['tca8418_enable_debounce'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.enableDebounce();\n';
  return code;
};

// TCA8418 禁用消抖块
Arduino.forBlock['tca8418_disable_debounce'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  
  const code = varName + '.disableDebounce();\n';
  return code;
};

// TCA8418 按键事件处理块（hat模式）
Arduino.forBlock['tca8418_when_key_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 生成唯一的回调标识和事件变量名
  const loopKey = 'tca8418_key_event_' + varName;
  const eventVarName = '_' + varName + '_current_event';
  
  // 添加事件变量声明
  generator.addVariable(eventVarName, 'uint8_t ' + eventVarName + ' = 0;');
  
  // 在loop中添加事件检查和处理代码，自动保存事件到变量
  const loopCode = '  if (' + varName + '.available() > 0) {\n' +
    '    ' + eventVarName + ' = ' + varName + '.getEvent();\n' +
    handlerCode +
    '  }\n';
  
  generator.addLoop(loopKey, loopCode);
  
  return ''; // hat模式块返回空字符串
};

// TCA8418 当前事件（自动保存的事件变量）
Arduino.forBlock['tca8418_current_event'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keypad';
  const eventVarName = '_' + varName + '_current_event';
  
  // 确保事件变量已声明
  generator.addVariable(eventVarName, 'uint8_t ' + eventVarName + ' = 0;');
  
  return [eventVarName, Arduino.ORDER_ATOMIC];
};

// TCA8418 获取事件行号
Arduino.forBlock['tca8418_get_event_row'] = function(block, generator) {
  // 优先获取连接的输入，如果没有或者是当前事件块，则使用保存的变量
  let event = generator.valueToCode(block, 'EVENT', generator.ORDER_ATOMIC);
  
  const code = '(((' + event + ' & 0x7F) - 1) / 10)';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// TCA8418 获取事件列号
Arduino.forBlock['tca8418_get_event_col'] = function(block, generator) {
  let event = generator.valueToCode(block, 'EVENT', generator.ORDER_ATOMIC);
  
  const code = '(((' + event + ' & 0x7F) - 1) % 10)';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// TCA8418 获取事件按下状态
Arduino.forBlock['tca8418_get_event_pressed'] = function(block, generator) {
  let event = generator.valueToCode(block, 'EVENT', generator.ORDER_ATOMIC);
  
  const code = '(!(' + event + ' & 0x80))';
  return [code, generator.ORDER_FUNCTION_CALL];
};
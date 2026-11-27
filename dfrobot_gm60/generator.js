// DFRobot GM60 二维码扫描器 Blockly 代码生成器

// I2C模式初始化
Arduino.forBlock['gm60_init_i2c'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._gm60VarMonitorAttached) {
    block._gm60VarMonitorAttached = true;
    block._gm60VarLastName = block.getFieldValue('VAR') || 'gm60';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._gm60VarLastName, 'GM60');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._gm60VarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'GM60');
          block._gm60VarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'gm60';
  var address = block.getFieldValue('ADDRESS') || '0x1A';
  var wire = block.getFieldValue('WIRE') || 'Wire';

  // 注册Blockly变量

  // 添加库引用
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_GM60', '#include <DFRobot_GM60.h>');

  // 添加全局对象声明
  generator.addObject(varName, 'DFRobot_GM60_IIC ' + varName + '(&' + wire + ', ' + address + ');');

  // 生成Wire.begin()初始化
  var wireBeginKey = 'wire_' + wire + '_begin';
  var isAlreadyInitialized = false;
  if (generator.setupCodes_) {
    if (generator.setupCodes_[wireBeginKey]) {
      isAlreadyInitialized = true;
    }
  }
  if (!isAlreadyInitialized) {
    generator.addSetup(wireBeginKey, wire + '.begin();\n');
  }

  // 生成初始化代码
  var code = varName + '.begin();\n';

  return code;
};

// UART模式初始化
Arduino.forBlock['gm60_init_uart'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._gm60VarMonitorAttached) {
    block._gm60VarMonitorAttached = true;
    block._gm60VarLastName = block.getFieldValue('VAR') || 'gm60';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._gm60VarLastName, 'GM60');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._gm60VarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'GM60');
          block._gm60VarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'gm60';
  var rxPin = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC) || '2';
  var txPin = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC) || '3';
  var mode = block.getFieldValue('TRANSPORT') || 'AUTO';
  var index = mode === 'UART2' ? '2' : '1';
  var port = 'Serial' + index;
  var local = varName + 'Serial';

  generator.addLibrary('DFRobot_GM60', '#include <DFRobot_GM60.h>');
  var declaration;
  var setup;
  var softwarePort = 'SoftwareSerial ' + local + '(' + rxPin + ', ' + txPin + ');';
  var startSoftware = local + '.begin(9600);';
  var startEsp = local + '.begin(9600, SERIAL_8N1, ' + rxPin + ', ' + txPin + ');';
  if (mode === 'SOFTWARE') {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    declaration = softwarePort;
    setup = startSoftware;
  } else if (mode === 'AUTO') {
    // Keep existing pin-based sketches portable. ESP32 routes arbitrary pins through its UART matrix.
    generator.addLibrary('gm60_auto_serial', '#if !defined(ARDUINO_ARCH_ESP32)\n#include <SoftwareSerial.h>\n#endif');
    declaration = ['#if defined(ARDUINO_ARCH_ESP32)', 'auto &' + local + ' = Serial1;',
      '#else', softwarePort, '#endif'].join('\n');
    setup = ['#if defined(ARDUINO_ARCH_ESP32)', startEsp, '#else', startSoftware, '#endif'].join('\n');
  } else {
    var fallback = 'defined(ARDUINO_ARCH_STM32) && !defined(HAVE_HWSERIAL' + index + ') && defined(USART' + index + ')';
    var stmPort = 'ailyGm60Usart' + index;
    generator.addObject(stmPort, '#if ' + fallback + '\nUart ' + stmPort + '(USART' + index + ');\n#endif');
    declaration = ['#if ' + fallback, 'auto &' + local + ' = ' + stmPort + ';',
      '#else', 'auto &' + local + ' = ' + port + ';', '#endif'].join('\n');
    setup = ['#if defined(ARDUINO_ARCH_ESP32)', startEsp, '#else', '#if defined(ARDUINO_ARCH_STM32)',
      local + '.setRx(' + rxPin + ');', local + '.setTx(' + txPin + ');',
      '#endif', local + '.begin(9600);', '#endif'].join('\n');
  }
  generator.addObject(local, declaration);
  generator.addObject(varName, 'DFRobot_GM60_UART ' + varName + ';');
  var initialize = setup + '\n' + varName + '.begin(' + local + ');\n';
  // Respect the user's setup order: starting UART0 after UART1 can detach its pins on ESP32-S3.
  // Keep automatic setup for legacy projects that place the initialization block outside setup.
  var container = block;
  while (container && container.type !== 'arduino_setup') {
    container = typeof container.getSurroundParent === 'function' ? container.getSurroundParent() : null;
  }
  if (container) return initialize;
  generator.addSetupBegin('gm60_uart_begin_' + varName, initialize);
  return '';
};

// 设置编码格式
Arduino.forBlock['gm60_set_encode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gm60';
  var encode = block.getFieldValue('ENCODE') || 'eUTF8';

  var code = varName + '.encode(' + varName + '.' + encode + ');\n';
  return code;
};

// 设置码配置
Arduino.forBlock['gm60_setup_code'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gm60';
  var on = block.getFieldValue('ON') || 'true';
  var content = block.getFieldValue('CONTENT') || 'true';

  var code = varName + '.setupCode(' + on + ', ' + content + ');\n';
  return code;
};

// 设置识别模式
Arduino.forBlock['gm60_set_identify'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gm60';
  var barcode = block.getFieldValue('BARCODE') || 'eEnableAllBarcode';

  var code = varName + '.setIdentify(' + varName + '.' + barcode + ');\n';
  return code;
};

// 恢复出厂设置
Arduino.forBlock['gm60_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gm60';

  var code = varName + '.reset();\n';
  return code;
};

// 读取扫描数据
Arduino.forBlock['gm60_detection'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gm60';

  return [varName + '.detection()', generator.ORDER_FUNCTION_CALL];
};

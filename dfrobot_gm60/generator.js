// DFRobot GM60 二维码扫描器 Blockly 代码生成器

// I2C模式初始化
Arduino.forBlock['gm60_init_i2c'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._gm60VarMonitorAttached) {
    block._gm60VarMonitorAttached = true;
    block._gm60VarLastName = block.getFieldValue('VAR') || 'gm60';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._gm60VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'GM60');
          block._gm60VarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'gm60';
  var address = block.getFieldValue('ADDRESS') || '0x1A';
  var wire = block.getFieldValue('WIRE') || 'Wire';

  // 注册Blockly变量
  registerVariableToBlockly(varName, 'GM60');

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
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._gm60VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'GM60');
          block._gm60VarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'gm60';
  var rxPin = generator.valueToCode(block, 'RX', Arduino.ORDER_ATOMIC);
  var txPin = generator.valueToCode(block, 'TX', Arduino.ORDER_ATOMIC);

  // 注册Blockly变量
  registerVariableToBlockly(varName, 'GM60');

  // 添加库引用
  generator.addLibrary('DFRobot_GM60', '#include <DFRobot_GM60.h>');
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');

  // 添加全局对象声明
  generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rxPin + ', ' + txPin + ');');
  generator.addObject(varName, 'DFRobot_GM60_UART ' + varName + ';');

  // 在setup中初始化串口和模块
  var setupCode = varName + 'Serial.begin(9600);\n';
  setupCode += varName + '.begin(' + varName + 'Serial);\n';
  generator.addSetupBegin('gm60_uart_begin_' + varName, setupCode);

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

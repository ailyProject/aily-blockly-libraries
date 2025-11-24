'use strict';

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// 初始化块 - I2C接口
Arduino.forBlock['sscma_begin_i2c'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const wire = block.getFieldValue('WIRE');
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '98';

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'SSCMA');
  generator.addVariable(varName, 'SSCMA ' + varName + ';');

  generator.addSetup(`wire_${wire}_begin`, '' + wire + '.begin(); // 初始化I2C ' + wire);
  // 生成初始化代码
  let code = '';
  if (rst == -1) {
    code = varName + '.begin(&' + wire + ', -1, ' + address + ');\n';
  } else {
    code = varName + '.begin(&' + wire + ', ' + rst + ', ' + address + ');\n';
  }

  return code;
};

// 初始化块 - 串口接口
Arduino.forBlock['sscma_begin_serial'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const serial = block.getFieldValue('SERIAL');
  const baud = generator.valueToCode(block, 'BAUD', generator.ORDER_ATOMIC) || '921600';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';

  // const isESP32 = isESP32Core();
  // if (isESP32) {
  //   // // ESP32核心使用HardwareSerial对象
  //   // let atSerial = '';
  //   // if (serial === 'Serial') {
  //   //   atSerial = 'atSerial(0)';
  //   // } else if (serial === 'Serial1') {
  //   //   atSerial = 'atSerial(1)';
  //   // } else if (serial === 'Serial2') {
  //   //   atSerial = 'atSerial(2)';
  //   // } else {
  //   //   atSerial = 'atSerial(0)';
  //   // }
  //   // generator.addLibrary('HardwareSerial', '#include <HardwareSerial.h>');
  //   // generator.addVariable(serial, 'HardwareSerial ' + atSerial + ';');
  // } else {
  //   // 非ESP32核心使用Serial对象
  //   generator.addVariable(serial, '#define atSerial ' + serial + ';');
  // }

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  registerVariableToBlockly(varName, 'SSCMA');
  generator.addVariable(varName, 'SSCMA ' + varName + ';');

  // 生成串口初始化代码
  // let serialInitCode = serial + '.begin(' + baud + ');\n';
  // generator.addSetup(serialInitCode);

  // 生成SSCMA初始化代码
  let code = '';
  if (rst == -1) {
    code = varName + '.begin(&' + serial + ', -1, ' + baud + ');\n';
  } else {
    code = varName + '.begin(&' + serial + ', ' + rst + ', ' + baud + ');\n';
  }

  generator.addSetup(varName + '_sscma_serial_begin', code);

  return '';
};

// 初始化块 - SPI接口
Arduino.forBlock['sscma_begin_spi'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const spi = block.getFieldValue('SPI');
  const cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '-1';
  const sync = generator.valueToCode(block, 'SYNC', generator.ORDER_ATOMIC) || '-1';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  const clock = generator.valueToCode(block, 'CLOCK', generator.ORDER_ATOMIC) || '15000000';

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  registerVariableToBlockly(varName, 'SSCMA');
  generator.addVariable(varName, 'SSCMA ' + varName + ';');

  // 生成初始化代码
  let code = '';
  if (cs == -1 && sync == -1 && rst == -1) {
    code = varName + '.begin(&' + spi + ');\n';
  } else {
    code = varName + '.begin(&' + spi + ', ' + cs + ', ' + sync + ', ' + rst + ', ' + clock + ');\n';
  }

  generator.addSetup(`spi_${spi}_begin`, '' + spi + '.begin(); // 初始化SPI ' + spi);
  generator.addSetup(varName + '_sscma_spi_begin', code);

  return '';
};

// 执行AI推理
Arduino.forBlock['sscma_invoke'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const times = block.getFieldValue('TIMES');
  const filter = block.getFieldValue('FILTER');
  const show = block.getFieldValue('SHOW');

  const code = varName + '.invoke(' + times + ', ' + filter + ', ' + show + ')';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_return_status'] = function(block, generator) {
  const status = block.getFieldValue('STATUS');
  return [status, generator.ORDER_ATOMIC];
}

// 获取检测框数量
Arduino.forBlock['sscma_get_boxes_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  
  const code = varName + '.boxes().size()';
  return [code, generator.ORDER_ATOMIC];
};

// 获取检测框信息
Arduino.forBlock['sscma_get_box_info'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');

  const code = varName + '.boxes()[' + index + '].' + property;
  return [code, generator.ORDER_ATOMIC];
};

// 获取分类数量
Arduino.forBlock['sscma_get_classes_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  
  const code = varName + '.classes().size()';
  return [code, generator.ORDER_ATOMIC];
};

// 获取分类信息
Arduino.forBlock['sscma_get_class_info'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');

  const code = varName + '.classes()[' + index + '].' + property;
  return [code, generator.ORDER_ATOMIC];
};

// 获取关键点数量
Arduino.forBlock['sscma_get_points_count'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  
  const code = varName + '.points().size()';
  return [code, generator.ORDER_ATOMIC];
};

// 获取关键点信息
Arduino.forBlock['sscma_get_point_info'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');

  const code = varName + '.points()[' + index + '].' + property;
  return [code, generator.ORDER_ATOMIC];
};

// 获取性能信息
Arduino.forBlock['sscma_get_performance'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const stage = block.getFieldValue('STAGE');

  const code = varName + '.perf().' + stage;
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.available()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const array = generator.valueToCode(block, 'ARRAY', generator.ORDER_ATOMIC) || 'nullptr';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '0';

  const code = varName + '.read(' + array + ', ' + length + ');\n';
  return code;
};

Arduino.forBlock['sscma_write'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const array = generator.valueToCode(block, 'ARRAY', generator.ORDER_ATOMIC) || 'nullptr';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '0';

  const code = varName + '.write(' + array + ', ' + length + ')\n;';
  return code;
};

// 获取设备ID
Arduino.forBlock['sscma_get_device_id'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.ID()';
  return [code, generator.ORDER_ATOMIC];
};

// 获取设备名称
Arduino.forBlock['sscma_get_device_name'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.name()';
  return [code, generator.ORDER_ATOMIC];
};

// 获取设备信息
Arduino.forBlock['sscma_get_device_info'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.info()';
  return [code, generator.ORDER_ATOMIC];
};

// 重置设备
Arduino.forBlock['sscma_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.reset();\n';
  return code;
};

// 保存JPEG图像
Arduino.forBlock['sscma_save_jpeg'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.save_jpeg();\n';
  return code;
};

// 清理动作
Arduino.forBlock['sscma_clean_actions'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  const code = varName + '.clean_actions();\n';
  return code;
};
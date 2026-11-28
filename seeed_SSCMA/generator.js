'use strict';

// A blocking handshake in setup follows any pin-routing blocks above it.
function sscmaSetup(block, generator, key, code) {
  if (block.getRootBlock().type === 'arduino_setup') return code + '\n';
  generator.addSetup(key, code);
  return '';
}

// 初始化块 - I2C接口
Arduino.forBlock['sscma_begin_i2c'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._sscmaVarLastName, 'SSCMA');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const wire = block.getFieldValue('WIRE');
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '98';

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addObject(varName, 'SSCMA ' + varName + ';');

  return varName + '.begin(&' + wire + ', ' + rst + ', ' + address + ');\n';
};

// 初始化块 - 串口接口
Arduino.forBlock['sscma_begin_serial'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._sscmaVarLastName, 'SSCMA');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const serial = block.getFieldValue('SERIAL');
  const baud = generator.valueToCode(block, 'BAUD', generator.ORDER_ATOMIC) || '921600';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  generator.addObject(varName, 'SSCMA ' + varName + ';');

  let port = serial;
  if (serial === 'Serial') {
    port = 'ailySscmaPrimarySerial';
    generator.addObject(port,
      '#if defined(ARDUINO_ARCH_ESP32) && ARDUINO_USB_CDC_ON_BOOT\n' +
      'auto &' + port + ' = Serial0;\n#else\nauto &' + port + ' = Serial;\n#endif');
  }
  const code = varName + '.begin(&' + port + ', ' + rst + ', ' + baud + ');';
  return sscmaSetup(block, generator, varName + '_sscma_serial_begin', code);
};

// 初始化块 - SPI接口
Arduino.forBlock['sscma_begin_spi'] = function(block, generator) {
  // 设置变量重命名监听
  if (!block._sscmaVarMonitorAttached) {
    block._sscmaVarMonitorAttached = true;
    block._sscmaVarLastName = block.getFieldValue('VAR') || 'ai';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._sscmaVarLastName, 'SSCMA');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sscmaVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SSCMA');
          block._sscmaVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'ai';
  const spi = block.getFieldValue('SPI');
  const cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '-1';
  const sync = generator.valueToCode(block, 'SYNC', generator.ORDER_ATOMIC) || '-1';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  const clockMHz = generator.valueToCode(block, 'CLOCK', generator.ORDER_ATOMIC) || '15';
  const clockHz = '((uint32_t)((' + clockMHz + ') * 1000000.0))';

  // 添加库和变量
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addVariable(varName, 'SSCMA ' + varName + ';');

  const code = varName + '.begin(&' + spi + ', ' + cs + ', ' + sync + ', ' + rst + ', ' + clockHz + ');';
  return sscmaSetup(block, generator, varName + '_sscma_spi_begin', code);
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

// 检查最近一次推理结果是否包含图像数据
Arduino.forBlock['sscma_check_last_image'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  return [varName + '.last_image().length() > 0', generator.ORDER_RELATIONAL];
};

// 获取最近一次推理结果中的图像数据
Arduino.forBlock['sscma_get_last_image'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';

  return [varName + '.last_image()', generator.ORDER_FUNCTION_CALL];
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

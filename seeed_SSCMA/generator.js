// ========== 辅助函数 ==========

/**
 * 确保添加SSCMA库
 */
function ensureSSCMALib(generator) {
  generator.addLibrary('Seeed_Arduino_SSCMA', '#include <Seeed_Arduino_SSCMA.h>');
}

/**
 * 确保添加Serial
 */
function ensureSerial(generator) {
  if (!generator._serialInited) {
    generator._serialInited = true;
    generator.addSetup('serial_begin', 'Serial.begin(9600);', true);
  }
}

/**
 * 确保添加Wire库(I2C)
 */
function ensureWire(generator) {
  if (!generator._wireInited) {
    generator._wireInited = true;
    generator.addLibrary('Wire', '#include <Wire.h>');
  }
}

/**
 * 确保添加SPI库
 */
function ensureSPI(generator) {
  if (!generator._spiInited) {
    generator._spiInited = true;
    generator.addLibrary('SPI', '#include <SPI.h>');
  }
}

/**
 * 注册变量并设置重命名监听
 */
function registerAndMonitorVariable(block, generator, varName, varType) {
  // 注册变量到Blockly
  registerVariableToBlockly(varName, varType);
  
  // 设置变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    const varField = block.getField('VAR');
    if (varField) {
      const originalValidator = varField.getValidator();
      varField.setValidator(function(newValue) {
        const oldValue = this.getValue();
        if (oldValue && oldValue !== newValue) {
          renameVariableInBlockly(block, oldValue, newValue, varType);
        }
        if (originalValidator) {
          return originalValidator.call(this, newValue);
        }
        return newValue;
      });
    }
  }
}

// ========== 初始化块 ==========

/**
 * UART初始化 (默认方式)
 */
Arduino.forBlock['sscma_init'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ai';
  
  ensureSSCMALib(generator);
  ensureSerial(generator);
  registerAndMonitorVariable(block, generator, varName, 'SSCMA');
  
  // 添加变量声明
  generator.addVariable(varName, `SSCMA ${varName};`);
  
  // 添加初始化代码到setup
  generator.addSetup(`${varName}_begin`, `${varName}.begin();`, true);
  
  return '';
};

/**
 * I2C初始化
 */
Arduino.forBlock['sscma_init_i2c'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ai';
  const wire = generator.valueToCode(block, 'WIRE', generator.ORDER_ATOMIC) || '&Wire';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  const addr = generator.valueToCode(block, 'ADDR', generator.ORDER_ATOMIC) || '0x62';
  
  ensureSSCMALib(generator);
  ensureWire(generator);
  ensureSerial(generator);
  registerAndMonitorVariable(block, generator, varName, 'SSCMA');
  
  // 添加变量声明
  generator.addVariable(varName, `SSCMA ${varName};`);
  
  // 添加Wire初始化
  generator.addSetup('wire_begin', 'Wire.begin();', true);
  
  // 添加初始化代码
  generator.addSetup(`${varName}_begin`, `${varName}.begin(${wire}, ${rst}, ${addr});`, true);
  
  return '';
};

/**
 * SPI初始化
 */
Arduino.forBlock['sscma_init_spi'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ai';
  const spi = generator.valueToCode(block, 'SPI', generator.ORDER_ATOMIC) || '&SPI';
  const cs = generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '-1';
  const sync = generator.valueToCode(block, 'SYNC', generator.ORDER_ATOMIC) || '-1';
  const rst = generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1';
  
  ensureSSCMALib(generator);
  ensureSPI(generator);
  ensureSerial(generator);
  registerAndMonitorVariable(block, generator, varName, 'SSCMA');
  
  // 添加变量声明
  generator.addVariable(varName, `SSCMA ${varName};`);
  
  // 添加SPI初始化
  generator.addSetup('spi_begin', 'SPI.begin();', true);
  
  // 添加初始化代码
  generator.addSetup(`${varName}_begin`, `${varName}.begin(${spi}, ${cs}, ${sync}, ${rst});`, true);
  
  return '';
};

// ========== AI推理块 ==========

/**
 * 执行AI推理
 */
Arduino.forBlock['sscma_invoke'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const times = generator.valueToCode(block, 'TIMES', generator.ORDER_ATOMIC) || '1';
  const showImage = block.getFieldValue('SHOW_IMAGE') === 'TRUE';
  
  ensureSSCMALib(generator);
  
  return `${varName}.invoke(${times}, false, ${showImage ? 'true' : 'false'});\n`;
};

/**
 * 检查推理是否成功
 */
Arduino.forBlock['sscma_invoke_success'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`!${varName}.invoke()`, generator.ORDER_LOGICAL_NOT];
};

// ========== 目标检测(Boxes)块 ==========

/**
 * 获取检测目标数量
 */
Arduino.forBlock['sscma_boxes_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.boxes().size()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取目标边界框属性
 */
Arduino.forBlock['sscma_box_property'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.boxes()[${index}].${property}`, generator.ORDER_MEMBER];
};

// ========== 分类(Classes)块 ==========

/**
 * 获取分类结果数量
 */
Arduino.forBlock['sscma_classes_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.classes().size()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取分类属性
 */
Arduino.forBlock['sscma_class_property'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.classes()[${index}].${property}`, generator.ORDER_MEMBER];
};

// ========== 点检测(Points)块 ==========

/**
 * 获取检测点数量
 */
Arduino.forBlock['sscma_points_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.points().size()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取点属性
 */
Arduino.forBlock['sscma_point_property'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.points()[${index}].${property}`, generator.ORDER_MEMBER];
};

// ========== 关键点(Keypoints)块 ==========

/**
 * 获取关键点组数量
 */
Arduino.forBlock['sscma_keypoints_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.keypoints().size()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取关键点组的边界框属性
 */
Arduino.forBlock['sscma_keypoint_box'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.keypoints()[${index}].box.${property}`, generator.ORDER_MEMBER];
};

/**
 * 获取关键点组中的点数量
 */
Arduino.forBlock['sscma_keypoint_points_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.keypoints()[${index}].points.size()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取关键点组中指定点的属性
 */
Arduino.forBlock['sscma_keypoint_point'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const groupIndex = generator.valueToCode(block, 'GROUP_INDEX', generator.ORDER_ATOMIC) || '0';
  const pointIndex = generator.valueToCode(block, 'POINT_INDEX', generator.ORDER_ATOMIC) || '0';
  const property = block.getFieldValue('PROPERTY');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.keypoints()[${groupIndex}].points[${pointIndex}].${property}`, generator.ORDER_MEMBER];
};

// ========== 性能(Performance)块 ==========

/**
 * 获取推理性能数据
 */
Arduino.forBlock['sscma_perf'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  const stage = block.getFieldValue('STAGE');
  
  ensureSSCMALib(generator);
  
  return [`${varName}.perf().${stage}`, generator.ORDER_MEMBER];
};

// ========== 设备信息块 ==========

/**
 * 获取设备ID
 */
Arduino.forBlock['sscma_get_id'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.ID()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取设备名称
 */
Arduino.forBlock['sscma_get_name'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.name()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取模型信息
 */
Arduino.forBlock['sscma_get_info'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.info()`, generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取最后的图像数据
 */
Arduino.forBlock['sscma_get_image'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getVariable().name : 'ai';
  
  ensureSSCMALib(generator);
  
  return [`${varName}.last_image()`, generator.ORDER_FUNCTION_CALL];
};

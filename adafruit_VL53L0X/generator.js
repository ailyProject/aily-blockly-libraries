// VL53L0X激光测距传感器库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// // 确保Serial已初始化，兼容core-serial的去重机制
// function ensureSerialBegin(serialPort, generator) {
//   // 初始化Arduino的Serial相关全局变量，兼容core-serial
//   if (!Arduino.addedSerialInitCode) {
//     Arduino.addedSerialInitCode = new Set();
//   }
  
//   // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
//   if (!Arduino.addedSerialInitCode.has(serialPort)) {
//     // 只有在没有添加过任何初始化代码时才添加默认初始化
//     generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(9600);`);
//     // 标记为已添加初始化代码
//     Arduino.addedSerialInitCode.add(serialPort);
//   }
// }

// 确保Wire库和VL53L0X库
function ensureVL53L0XLibraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'adafruit_vl53l0x', '#include <Adafruit_VL53L0X.h>');
}

// 添加库和变量声明
function ensureVL53L0XSetup(varName, generator) {
  ensureVL53L0XLibraries(generator);
  
  // 使用传入的变量名
  // const variableKey = 'vl53l0x_sensor_' + varName;
  generator.addObject(varName, 'Adafruit_VL53L0X ' + varName + ';');
  
  return varName; // 返回使用的变量名，供后续引用
}

Arduino.forBlock['vl53l0x_ranging_test'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var measureVarName = 'measure';
  
  // 添加测量结果变量 - 放在loop函数开始部分而不是全局区域
  generator.addLoopBegin(measureVarName, 'VL53L0X_RangingMeasurementData_t ' + measureVarName + ';');
  
  // 进行测量
  var code = '// 获取距离数据（单位：毫米）\n';
  code += sensorVarName + '.rangingTest(&' + measureVarName + ', false);  // 进行一次测量\n';
  return code;
};

Arduino.forBlock['vl53l0x_check_range_valid'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 检查测量结果是否有效
  var code = measureVarName + '.RangeStatus != 4';
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['vl53l0x_get_range_mm'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 获取距离值
  var code = measureVarName + '.RangeMilliMeter';
  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['vl53l0x_init_with_wire'] = function(block, generator) {
  const varField = block.getField('SENSOR');
  const varName = varField ? varField.getText() : 'sensor';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 确保变量和库
  ensureVL53L0XSetup(varName, generator);
  ensureSerialBegin('Serial', generator);
  
  // 保存变量名，供后续块使用
  generator.sensorVarName = varName;
  
  // 处理Wire初始化
  const wireBeginKey = 'wire_begin_' + wire;
  
  // 检查是否已经初始化过这个Wire实例
  var isAlreadyInitialized = false;
  if (generator.setupCodes_) {
    if (generator.setupCodes_[wireBeginKey]) {
      isAlreadyInitialized = true;
    } else {
      // 检查是否存在该Wire实例的其他初始化记录
      for (var key in generator.setupCodes_) {
        if (key.startsWith('wire_begin_' + wire + '_') && key !== wireBeginKey) {
          isAlreadyInitialized = true;
          break;
        }
      }
    }
  }
  
  if (!isAlreadyInitialized) {
    // 获取I2C引脚信息并添加到注释中
    var pinComment = '';
    try {
      let pins = null;
      
      // 优先使用自定义引脚配置
      const customPins = window['customI2CPins'];
      if (customPins && customPins[wire]) {
        pins = customPins[wire];
      }
      // 回退到boardConfig中的引脚信息
      else {
        const boardConfig = window['boardConfig'];
        if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
          pins = boardConfig.i2cPins[wire];
        }
      }
      
      if (pins) {
        const sdaPin = pins.find(pin => pin[0] === 'SDA');
        const sclPin = pins.find(pin => pin[0] === 'SCL');
        if (sdaPin && sclPin) {
          pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
        }
      }
    } catch (e) {
      // 静默处理错误
    }
    
    generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
  }
  
  // 生成初始化代码
  let setupCode = '// 初始化VL53L0X激光测距传感器\n';
  
  if (wire && wire !== 'Wire') {
    setupCode += 'if (' + varName + '.begin(0x29, false, &' + wire + ')) {\n';
  } else {
    setupCode += 'if (' + varName + '.begin()) {\n';
  }
  
  setupCode += '  Serial.println("VL53L0X传感器初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: VL53L0X传感器初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  return setupCode;
};

// VL53L0X块的引脚信息显示扩展
function addVL53L0XPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // 注册VL53L0X的引脚信息显示扩展
    const extensionName = 'vl53l0x_init_with_wire_pin_info';
    
    if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
      Blockly.Extensions.register(extensionName, function() {
        setTimeout(() => {
          updateVL53L0XBlockWithPinInfo(this);
        }, 50);
      });
    }
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 更新VL53L0X块的Wire字段显示引脚信息
function updateVL53L0XBlockWithPinInfo(block) {
  try {
    // 检查block是否有WIRE字段
    if (!block || !block.getField || !block.getField('WIRE')) return;
    
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }
    
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    // 简单实现：如果有引脚信息就更新显示
    // 这里可以添加更多的引脚信息显示逻辑
    
  } catch (e) {
    // 忽略错误
  }
}

// 立即注册扩展
if (typeof Blockly !== 'undefined') {
  addVL53L0XPinInfoExtensions();
}
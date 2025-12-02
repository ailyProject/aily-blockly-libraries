// Generator.js: Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 integration

/**
 * Adafruit_NeoPixel, Adafruit_SSD1306, Adafruit_INA219 生成器统一处理
 */

// 带下拉选项的读取值块
Arduino.forBlock['ina219_read_value'] = function(block, generator) {
  // 从block中获取变量的文本值，而不是变量引用，与ina219_init_with_wire保持一致
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "ina219");
  const type = block.getFieldValue('TYPE') || 'BUS_VOLTAGE';
  
  // 根据下拉选项返回不同的函数调用
  switch(type) {
    case 'BUS_VOLTAGE':
      return [varName + '.getBusVoltage_V()', generator.ORDER_FUNCTION_CALL];
    case 'SHUNT_VOLTAGE':
      return [varName + '.getShuntVoltage_mV()', generator.ORDER_FUNCTION_CALL];
    case 'CURRENT':
      return [varName + '.getCurrent_mA()', generator.ORDER_FUNCTION_CALL];
    case 'POWER':
      return [varName + '.getPower_mW()', generator.ORDER_FUNCTION_CALL];
    default:
      return [varName + '.getBusVoltage_V()', generator.ORDER_FUNCTION_CALL];
  }
};

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

// 确保Wire库和INA219库
function ensureINA219Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'adafruit_ina219', '#include <Adafruit_INA219.h>');
}

// INA219初始化传感器（支持Wire实例选择）
Arduino.forBlock['ina219_init_with_wire'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._ina219VarMonitorAttached) {
    block._ina219VarMonitorAttached = true;
    block._ina219VarLastName = block.getFieldValue('VAR') || 'ina219';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._ina219VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'INA219');
          // const oldVar = workspace.getVariable(oldName, 'INA219');
          // const existVar = workspace.getVariable(newName, 'INA219');
          // console.log("Renaming INA219 variable from", oldName, "to", newName);
          // if (oldVar && !existVar) {
          //   workspace.renameVariableById(oldVar.getId(), newName);
          //   if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          // }
          block._ina219VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'ina219';
  const address = block.getFieldValue('ADDRESS') || '0x40'; // 从field_input获取地址
  const wire = block.getFieldValue('WIRE') || 'Wire'; // 从field_dropdown获取Wire

  // 1. 注册变量到Blockly变量系统和工具箱，类型固定为'INA219'，同名变量唯一
  // const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  // if (workspace) {
  //   let existVar = workspace.getVariable(varName, 'INA219');
  //   if (!existVar) {
  //     workspace.createVariable(varName, 'INA219');
  //     if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
  //   }
  // }
  registerVariableToBlockly(varName, 'INA219');

  // 添加必要的库
  ensureINA219Libraries(generator);

  // 确保Serial已初始化（兼容core-serial的去重机制）
  ensureSerialBegin('Serial', generator);

  // 添加INA219对象变量，使用用户选择的变量名
  generator.addVariable(varName, 'Adafruit_INA219 ' + varName + '(' + address + ');');

  // 保存变量名和地址，供后续块使用
  generator.sensorVarName = varName;
  generator.sensorAddress = address;

  // 生成初始化代码
  let setupCode = '// 初始化INA219电流传感器 ' + varName + '\n';
  
  // 如果指定了特定的Wire实例，使用该实例初始化
  if (wire && wire !== 'Wire' && wire !== '') {
    // 统一使用与new_iic库相同的setupKey命名规范
    const wireBeginKey = `wire_${wire}_begin`;
    
    // 检查是否已经初始化过这个Wire实例（包括wire_begin_with_settings的初始化）
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      // 检查基础key或任何以该Wire实例开头的key
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        // 检查是否存在该Wire实例的wire_begin_with_settings初始化记录
        for (var key in generator.setupCodes_) {
          if (key.startsWith(`wire_begin_${wire}_`) && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    
    if (!isAlreadyInitialized) {
      // 获取I2C引脚信息并添加到注释中（优先使用自定义引脚信息）
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
    
    setupCode += 'if (' + varName + '.begin(&' + wire + ')) {\n';
  } else {
    // 统一使用与new_iic库相同的setupKey命名规范
    const wireBeginKey = `wire_${wire}_begin`;
    
    // 检查是否已经初始化过Wire实例（包括wire_begin_with_settings的初始化）
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      // 检查基础key或任何以Wire开头的key
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        // 检查是否存在Wire实例的wire_begin_with_settings初始化记录
        for (var key in generator.setupCodes_) {
          if (key.startsWith(`wire_${wire}_begin`) && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    
    if (!isAlreadyInitialized) {    // 获取I2C引脚信息并添加到注释中（优先使用自定义引脚信息）
    var pinComment = '';
    try {
      let pins = null;
      
      // 优先使用自定义引脚配置
      const customPins = window['customI2CPins'];
      if (customPins && customPins['Wire']) {
        pins = customPins['Wire'];
      }
      // 回退到boardConfig中的引脚信息
      else {
        const boardConfig = window['boardConfig'];
        if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins['Wire']) {
          pins = boardConfig.i2cPins['Wire'];
        }
      }
      
      if (pins) {
        const sdaPin = pins.find(pin => pin[0] === 'SDA');
        const sclPin = pins.find(pin => pin[0] === 'SCL');
        if (sdaPin && sclPin) {
          pinComment = '  // Wire: SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
        }
      }
    } catch (e) {
      // 静默处理错误
    }
      
      generator.addSetup(wireBeginKey, pinComment + 'Wire.begin();\n');
    }
    
    setupCode += 'if (' + varName + '.begin()) {\n';
  }
  
  setupCode += '  Serial.println("INA219传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: INA219传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  // 返回初始化代码，让它可以插入到任何代码块中（setup、loop等）
  // 而不是强制添加到setup中
  return setupCode;
};

// INA219块的引脚信息显示扩展
function addINA219PinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // INA219需要支持引脚信息显示的block类型
    const ina219BlockTypes = [
      'ina219_init_with_wire'
    ];

    // 为每种block类型注册扩展
    ina219BlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeINA219Block(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化INA219块的WIRE字段显示
function initializeINA219Block(block) {
  try {
    // 检查block是否有WIRE字段（现在是field_dropdown类型）
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    // 延迟初始化，等待boardConfig加载
    setTimeout(() => {
      updateINA219BlockWithPinInfo(block);
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 更新INA219块的Wire字段显示引脚信息
function updateINA219BlockWithPinInfo(block) {
  try {
    // 检查block是否有WIRE字段（现在是field_dropdown类型）
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }
    
    // 创建带引脚信息的下拉选项
    // 由于WIRE字段是field_dropdown类型，引脚信息会通过board.i2c动态加载
    // 如果需要额外的引脚信息显示，可以在这里添加
    
  } catch (e) {
    // 忽略错误
  }
}

// 为INA219生成带引脚信息的I2C选项
function generateINA219I2COptionsWithPins(boardConfig) {
  const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
  
  return originalI2C.map(([displayName, value]) => {
    // 移除已有的引脚信息，重新生成
    const cleanDisplayName = displayName.replace(/\(SDA=\d+,\s*SCL=\d+\)/, '').trim();
    
    // 优先使用自定义引脚信息，再使用boardConfig中的引脚信息
    let pins = null;
    let isCustom = false;
    
    // 检查自定义引脚配置
    const customPins = window['customI2CPins'];
    if (customPins && customPins[value]) {
      pins = customPins[value];
      isCustom = true;
    }
    // 回退到boardConfig中的引脚信息
    else if (boardConfig.i2cPins && boardConfig.i2cPins[value]) {
      pins = boardConfig.i2cPins[value];
      isCustom = false;
    }
    
    if (pins) {
      const sdaPin = pins.find(pin => pin[0] === 'SDA');
      const sclPin = pins.find(pin => pin[0] === 'SCL');
      if (sdaPin && sclPin) {
        const suffix = isCustom ? ' (custom)' : '';
        return [cleanDisplayName + '(SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + ')' + suffix, value];
      }
    }
    
    return [cleanDisplayName, value];
  });
}

// 监听工作区变化，注册INA219扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addINA219PinInfoExtensions();

  // 添加工作区变化监听器
  const addINA219BlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 更新引脚信息
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'ina219_init_with_wire') {
              updateINA219BlockWithPinInfo(block);
            }
          });
        }
      }, 200);
    }
  };

  // 尝试添加监听器
  try {
    if (Blockly.getMainWorkspace) {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        workspace.addChangeListener(addINA219BlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addINA219BlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}




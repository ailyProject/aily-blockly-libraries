// BH1750光照传感器库的代码生成器

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

// 确保Wire库和BH1750库
function ensureBH1750Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'bh1750', '#include <BH1750.h>');
}

// 添加库和变量声明
function ensureBH1750Setup(varName, address, generator) {
  ensureBH1750Libraries(generator);
  
  // 使用传入的变量名和地址
  const variableKey = 'bh1750_sensor_' + varName;
  generator.addVariable(variableKey, 'BH1750 ' + varName + '(' + address + ');');
  
  return varName; // 返回使用的变量名，供后续引用
};

// 读取光照强度
Arduino.forBlock['bh1750_read_light_level'] = function(block, generator) {
  // 从block中获取变量的文本值，而不是变量引用
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "lightMeter");
  
  return [varName + '.readLightLevel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bh1750_init_with_wire'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._bh1750VarMonitorAttached) {
    block._bh1750VarMonitorAttached = true;
    block._bh1750VarLastName = block.getFieldValue('VAR') || 'lightMeter';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._bh1750VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'BH1750');
          // const oldVar = workspace.getVariable(oldName, 'BH1750');
          // const existVar = workspace.getVariable(newName, 'BH1750');
          // if (oldVar && !existVar) {
          //   workspace.renameVariableById(oldVar.getId(), newName);
          //   if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
          // }
          block._bh1750VarLastName = newName;
        }
        return newName;
      });
    }
  }

  let varName = block.getFieldValue('VAR') || 'lightMeter';
  const mode = block.getFieldValue('MODE') || 'CONTINUOUS_HIGH_RES_MODE';
  const address = block.getFieldValue('ADDRESS') || '0x23';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 1. 注册变量到Blockly变量系统和工具箱，类型固定为'BH1750'，同名变量唯一
  // const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  // if (workspace) {
  //   let existVar = workspace.getVariable(varName, 'BH1750');
  //   if (!existVar) {
  //     workspace.createVariable(varName, 'BH1750');
  //     if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
  //   }
  // }
  registerVariableToBlockly(varName, 'BH1750');

  // 2. 添加必要的库
  ensureBH1750Libraries(generator);
  ensureSerialBegin('Serial', generator);

  // 3. 添加BH1750对象变量到全局变量区域
  generator.addVariable(varName, 'BH1750 ' + varName + '(' + address + ');');

  // 保存变量名和地址，供后续块使用
  generator.sensorVarName = varName;
  generator.sensorAddress = address;

  // 生成初始化代码
  let setupCode = '// 初始化BH1750光照传感器 ' + varName + '\n';
  if (wire && wire !== 'Wire' && wire !== '') {
    const wireBeginKey = `wire_${wire}_begin`;
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_' + wire + '_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    if (!isAlreadyInitialized) {
      var pinComment = '';
      try {
        let pins = null;
        const customPins = window['customI2CPins'];
        if (customPins && customPins[wire]) {
          pins = customPins[wire];
        } else {
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
      } catch (e) {}
      generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
    }
    setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ', ' + address + ', &' + wire + ')) {\n';
  } else {
    const wireBeginKey = `wire_${wire}_begin`;
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_Wire_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    if (!isAlreadyInitialized) {
      var pinComment = '';
      try {
        let pins = null;
        const customPins = window['customI2CPins'];
        if (customPins && customPins['Wire']) {
          pins = customPins['Wire'];
        } else {
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
      } catch (e) {}
      generator.addSetup(wireBeginKey, pinComment + 'Wire.begin();\n');
    }
    if (mode === 'CONTINUOUS_HIGH_RES_MODE') {
      setupCode += 'if (' + varName + '.begin()) {\n';
    } else {
      setupCode += 'if (' + varName + '.begin(BH1750::' + mode + ')) {\n';
    }
  }
  setupCode += '  Serial.println("BH1750传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: BH1750传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  return setupCode;
}

// BH1750块的引脚信息显示扩展
function addBH1750PinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // BH1750需要支持引脚信息显示的block类型
    const bh1750BlockTypes = [
      'bh1750_init_with_wire'
    ];

    // 为每种block类型注册扩展
    bh1750BlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeBH1750Block(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化BH1750块的WIRE字段显示
function initializeBH1750Block(block) {
  try {
    // 由于WIRE字段是field_dropdown类型，我们需要确保它有正确的选项
    // 这里可以添加任何与WIRE字段相关的初始化代码
    
    // 如果需要，可以在这里添加引脚信息显示逻辑
    
  } catch (e) {
    // 忽略错误
  }
}

// 更新BH1750块的Wire字段显示引脚信息
function updateBH1750BlockWithPinInfo(block) {
  try {
    // 由于WIRE字段是field_dropdown类型，我们可以直接获取字段值
    const wireFieldName = block.getFieldValue('WIRE');
    if (!wireFieldName) return;
    
    // 这里可以添加任何需要动态更新的引脚信息显示逻辑
    // 例如更新下拉菜单选项或显示引脚信息
    
  } catch (e) {
    // 忽略错误
    console.error('Error in updateBH1750BlockWithPinInfo:', e);
  }
}

// 注释：由于WIRE字段已更改为input_value类型，不再需要生成引脚信息选项
// 此函数已被移除

// 监听工作区变化，注册BH1750扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addBH1750PinInfoExtensions();

  // 添加工作区变化监听器
  const addBH1750BlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 更新引脚信息
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'bh1750_init_with_wire') {
              updateBH1750BlockWithPinInfo(block);
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
        workspace.addChangeListener(addBH1750BlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addBH1750BlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// DFRobot_ASR_M语音识别模块库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和DFRobot_ASR_M库
function ensureASRLibraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'dfrobot_asr', '#include <DFRobot_ASR_M.h>');
}

// 初始化语音识别模块
Arduino.forBlock['dfrobot_asr_init'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._asrVarMonitorAttached) {
    block._asrVarMonitorAttached = true;
    block._asrVarLastName = block.getFieldValue('VAR') || 'asr';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._asrVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'DFRobot_ASR');
          block._asrVarLastName = newName;
        }
        return newName;
      });
    }
  }

  let varName = block.getFieldValue('VAR') || 'asr';
  const mode = block.getFieldValue('MODE') || 'LOOP';
  const micMode = block.getFieldValue('MIC_MODE') || 'MIC';
  const address = block.getFieldValue('ADDRESS') || '0x4F';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 1. 注册变量到Blockly变量系统，类型固定为'DFRobot_ASR'
  registerVariableToBlockly(varName, 'DFRobot_ASR');

  // 2. 添加必要的库
  ensureASRLibraries(generator);
  ensureSerialBegin('Serial', generator);

  // 3. 添加DFRobot_ASR对象变量到全局变量区域
  generator.addObject(varName, 'DFRobot_ASR ' + varName + '(&' + wire + ', ' + address + ');');

  // 保存变量名，供后续块使用
  generator.asrVarName = varName;

  // 生成初始化代码
  let setupCode = '// 初始化DFRobot语音识别模块 ' + varName + '\n';
  
  // 初始化Wire
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
  }

  // 初始化ASR模块
  setupCode += 'if (' + varName + '.begin(' + mode + ', ' + micMode + ') == 0) {\n';
  setupCode += '  Serial.println("DFRobot语音识别模块 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: DFRobot语音识别模块 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  return setupCode;
};

// 添加语音词条
Arduino.forBlock['dfrobot_asr_add_command'] = function(block, generator) {
  const words = block.getFieldValue('WORDS') || 'kai deng';
  const id = block.getFieldValue('ID') || '1';
  
  // 获取ASR变量名
  const varName = generator.asrVarName || 'asr';
  
  return varName + '.addCommand("' + words + '", ' + id + ');\n';
};

// 开始语音识别
Arduino.forBlock['dfrobot_asr_start'] = function(block, generator) {
  // 获取ASR变量名
  const varName = generator.asrVarName || 'asr';
  
  return varName + '.start();\n';
};

// 读取语音识别结果
Arduino.forBlock['dfrobot_asr_read'] = function(block, generator) {
  // 获取ASR变量名
  const varName = generator.asrVarName || 'asr';
  
  return [varName + '.read()', generator.ORDER_FUNCTION_CALL];
};

// 设置I2C地址
Arduino.forBlock['dfrobot_asr_set_i2c_addr'] = function(block, generator) {
  const addr = block.getFieldValue('ADDR') || '0x4F';
  
  // 获取ASR变量名
  const varName = generator.asrVarName || 'asr';
  
  return varName + '.setI2CAddr(' + addr + ');\n';
};

// DFRobot_ASR块的引脚信息显示扩展
function addASRPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // DFRobot_ASR需要支持引脚信息显示的block类型
    const asrBlockTypes = [
      'dfrobot_asr_init'
    ];

    // 为每种block类型注册扩展
    asrBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeASRBlock(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化DFRobot_ASR块的WIRE字段显示
function initializeASRBlock(block) {
  try {
    // 由于WIRE字段是field_dropdown类型，我们需要确保它有正确的选项
    // 这里可以添加任何与WIRE字段相关的初始化代码
    
    // 如果需要，可以在这里添加引脚信息显示逻辑
    
  } catch (e) {
    // 忽略错误
  }
}

// 更新DFRobot_ASR块的Wire字段显示引脚信息
function updateASRBlockWithPinInfo(block) {
  try {
    // 由于WIRE字段是field_dropdown类型，我们可以直接获取字段值
    const wireFieldName = block.getFieldValue('WIRE');
    if (!wireFieldName) return;
    
    // 这里可以添加任何需要动态更新的引脚信息显示逻辑
    // 例如更新下拉菜单选项或显示引脚信息
    
  } catch (e) {
    // 忽略错误
    console.error('Error in updateASRBlockWithPinInfo:', e);
  }
}

// 监听工作区变化，注册DFRobot_ASR扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addASRPinInfoExtensions();

  // 添加工作区变化监听器
  const addASRBlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 更新引脚信息
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'dfrobot_asr_init') {
              updateASRBlockWithPinInfo(block);
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
        workspace.addChangeListener(addASRBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addASRBlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// LTR308光照传感器库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和LTR308库
function ensureLTR308Libraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'ltr308', '#include <LTR308.h>');
}

// 初始化LTR308传感器
Arduino.forBlock['ltr308_init_with_wire'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._ltr308VarMonitorAttached) {
    block._ltr308VarMonitorAttached = true;
    block._ltr308VarLastName = block.getFieldValue('VAR') || 'ltr308';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._ltr308VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LTR308');
          block._ltr308VarLastName = newName;
        }
        return newName;
      });
    }
  }

  let varName = block.getFieldValue('VAR') || 'ltr308';
  const gain = block.getFieldValue('GAIN') || 'LTR308_GAIN_1';
  const integrationTime = block.getFieldValue('INTEGRATION_TIME') || 'LTR308_INTEGRATION_100MS';
  const measurementRate = block.getFieldValue('MEASUREMENT_RATE') || 'LTR308_RATE_500MS';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 1. 注册变量到Blockly变量系统和工具箱
  registerVariableToBlockly(varName, 'LTR308');

  // 2. 添加必要的库
  ensureLTR308Libraries(generator);
  ensureSerialBegin('Serial', generator);

  // 3. 添加LTR308对象变量到全局变量区域
  generator.addVariable(varName, 'LTR308 ' + varName + ';');

  // 保存变量名，供后续块使用
  generator.sensorVarName = varName;

  // 生成初始化代码
  let setupCode = '// 初始化LTR308光照传感器 ' + varName + '\n';
  
  // 初始化I2C总线
  if (wire && wire !== 'Wire' && wire !== '') {
    const wireBeginKey = 'wire_begin_' + wire;
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
    setupCode += 'if (' + varName + '.begin(&' + wire + ')) {\n';
  } else {
    const wireBeginKey = 'wire_begin_Wire';
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
    setupCode += 'if (' + varName + '.begin()) {\n';
  }
  
  setupCode += '  Serial.println("LTR308传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '  // 设置传感器参数\n';
  setupCode += '  ' + varName + '.setGain(' + gain + ');\n';
  setupCode += '  ' + varName + '.setIntegrationTime(' + integrationTime + ');\n';
  setupCode += '  ' + varName + '.setMeasurementRate(' + measurementRate + ');\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: LTR308传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  return setupCode;
};

// 读取光照强度
Arduino.forBlock['ltr308_read_light_level'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "ltr308");
  
  return [varName + '.getLux()', generator.ORDER_FUNCTION_CALL];
};

// 读取原始数据
Arduino.forBlock['ltr308_read_raw_data'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "ltr308");
  
  return [varName + '.getRawData()', generator.ORDER_FUNCTION_CALL];
};

// 检查数据是否准备好
Arduino.forBlock['ltr308_is_data_ready'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.sensorVarName || "ltr308");
  
  return [varName + '.isDataReady()', generator.ORDER_FUNCTION_CALL];
};

// LTR308块的引脚信息显示扩展
function addLTR308PinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // LTR308需要支持引脚信息显示的block类型
    const ltr308BlockTypes = [
      'ltr308_init_with_wire'
    ];

    // 为每种block类型注册扩展
    ltr308BlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeLTR308Block(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化LTR308块的WIRE字段显示
function initializeLTR308Block(block) {
  try {
    // 这里可以添加任何与WIRE字段相关的初始化代码
  } catch (e) {
    // 忽略错误
  }
}

// 更新LTR308块的Wire字段显示引脚信息
function updateLTR308BlockWithPinInfo(block) {
  try {
    const wireFieldName = block.getFieldValue('WIRE');
    if (!wireFieldName) return;
    
    // 这里可以添加任何需要动态更新的引脚信息显示逻辑
  } catch (e) {
    console.error('Error in updateLTR308BlockWithPinInfo:', e);
  }
}

// 监听工作区变化，注册LTR308扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addLTR308PinInfoExtensions();

  // 添加工作区变化监听器
  const addLTR308BlocksListener = function(event) {
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      setTimeout(() => {
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'ltr308_init_with_wire') {
              updateLTR308BlockWithPinInfo(block);
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
        workspace.addChangeListener(addLTR308BlocksListener);
      } else {
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addLTR308BlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}
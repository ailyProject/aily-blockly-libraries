// IMU9DOF传感器库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和IMU9DOF库
function ensureIMU9DOFLibraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'qmi8658a', '#include "QMI8658A.h"');
  ensureLibrary(generator, 'mmc5603nj', '#include "MMC5603NJ.h"');
  ensureLibrary(generator, 'imu9dof', '#include "IMU9DOF.h"');
}

// 初始化IMU9DOF传感器
Arduino.forBlock['imu9dof_init'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._imuVarMonitorAttached) {
    block._imuVarMonitorAttached = true;
    block._imuVarLastName = block.getFieldValue('VAR') || 'imu';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._imuVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'IMU9DOF');
          block._imuVarLastName = newName;
        }
        return newName;
      });
    }
  }

  let varName = block.getFieldValue('VAR') || 'imu';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 1. 注册变量到Blockly变量系统和工具箱
  registerVariableToBlockly(varName, 'IMU9DOF');

  // 2. 添加必要的库
  ensureIMU9DOFLibraries(generator);
  ensureSerialBegin('Serial', generator);

  // 3. 添加IMU9DOF对象变量到全局变量区域
  generator.addVariable(varName, 'IMU9DOF ' + varName + ';');

  // 保存变量名，供后续块使用
  generator.imuVarName = varName;

  // 生成初始化代码
  let setupCode = '// 初始化9轴IMU传感器 ' + varName + '\n';
  
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
  
  setupCode += '  Serial.println("9轴IMU传感器 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: 9轴IMU传感器 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  return setupCode;
};

// 读取加速度
Arduino.forBlock['imu9dof_read_accel'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const axis = block.getFieldValue('AXIS');
  
  let code = '';
  if (axis === 'X' || axis === 'Y' || axis === 'Z') {
    code += '({ float _ax, _ay, _az; ' + varName + '.readAccel(&_ax, &_ay, &_az); _a' + axis.toLowerCase() + '; })';
  } else {
    code += '0.0'; // 默认返回0
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 读取角速度
Arduino.forBlock['imu9dof_read_gyro'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const axis = block.getFieldValue('AXIS');
  
  let code = '';
  if (axis === 'X' || axis === 'Y' || axis === 'Z') {
    code += '({ float _gx, _gy, _gz; ' + varName + '.readGyro(&_gx, &_gy, &_gz); _g' + axis.toLowerCase() + '; })';
  } else {
    code += '0.0'; // 默认返回0
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 读取磁场强度
Arduino.forBlock['imu9dof_read_mag'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const axis = block.getFieldValue('AXIS');
  
  let code = '';
  if (axis === 'X' || axis === 'Y' || axis === 'Z') {
    code += '({ float _mx, _my, _mz; ' + varName + '.readMag(&_mx, &_my, &_mz); _m' + axis.toLowerCase() + '; })';
  } else {
    code += '0.0'; // 默认返回0
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 读取温度
Arduino.forBlock['imu9dof_read_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  
  return [varName + '.readTemperature()', generator.ORDER_FUNCTION_CALL];
};

// 计算姿态角
Arduino.forBlock['imu9dof_compute_angles'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  
  return varName + '.computeAngles();\n';
};

// 读取姿态角
Arduino.forBlock['imu9dof_read_angle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const angle = block.getFieldValue('ANGLE');
  
  let code = '';
  if (angle === 'ROLL') {
    code = varName + '.getRoll()';
  } else if (angle === 'PITCH') {
    code = varName + '.getPitch()';
  } else if (angle === 'YAW') {
    code = varName + '.getYaw()';
  } else {
    code = '0.0'; // 默认返回0
  }
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 校准磁力计
Arduino.forBlock['imu9dof_calibrate_mag'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  
  return varName + '.calibrateMag();\n';
};

// 设置加速度计量程
Arduino.forBlock['imu9dof_set_acc_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const range = block.getFieldValue('RANGE');
  
  return varName + '.setAccRange(' + range + ');\n';
};

// 设置陀螺仪量程
Arduino.forBlock['imu9dof_set_gyro_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : (generator.imuVarName || "imu");
  const range = block.getFieldValue('RANGE');
  
  return varName + '.setGyroRange(' + range + ');\n';
};

// IMU9DOF块的引脚信息显示扩展
function addIMU9DOFPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // IMU9DOF需要支持引脚信息显示的block类型
    const imu9dofBlockTypes = [
      'imu9dof_init'
    ];

    // 为每种block类型注册扩展
    imu9dofBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          setTimeout(() => {
            initializeIMU9DOFBlock(this);
          }, 50);
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 初始化IMU9DOF块的WIRE字段显示
function initializeIMU9DOFBlock(block) {
  try {
    // 这里可以添加任何与WIRE字段相关的初始化代码
  } catch (e) {
    // 忽略错误
  }
}

// 监听工作区变化，注册IMU9DOF扩展
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addIMU9DOFPinInfoExtensions();

  // 添加工作区变化监听器
  const addIMU9DOFBlocksListener = function(event) {
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      setTimeout(() => {
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'imu9dof_init') {
              // 更新引脚信息
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
        workspace.addChangeListener(addIMU9DOFBlocksListener);
      } else {
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addIMU9DOFBlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}
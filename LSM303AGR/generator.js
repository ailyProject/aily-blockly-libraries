// LSM303AGR 加速度计和磁力计传感器库的代码生成器

// 通用库管理函数
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保LSM303AGR相关库
function ensureLSM303AGRLibraries(generator, sensorType) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  if (sensorType === 'ACC') {
    ensureLibrary(generator, 'lsm303agr_acc', '#include <LSM303AGR_ACC_Sensor.h>');
  } else if (sensorType === 'MAG') {
    ensureLibrary(generator, 'lsm303agr_mag', '#include <LSM303AGR_MAG_Sensor.h>');
  }
}

// 确保Wire初始化
function ensureWireBegin(wire, generator) {
  const wireBeginKey = 'wire_' + wire + '_begin';
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
}

// ============ 加速度计初始化 ============
Arduino.forBlock['lsm303agr_acc_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._lsm303agrAccVarMonitorAttached) {
    block._lsm303agrAccVarMonitorAttached = true;
    block._lsm303agrAccVarLastName = block.getFieldValue('VAR') || 'Acc';
    registerVariableToBlockly(block._lsm303agrAccVarLastName, 'LSM303AGR_ACC');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lsm303agrAccVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LSM303AGR_ACC');
          block._lsm303agrAccVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'Acc';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 添加库
  ensureLSM303AGRLibraries(generator, 'ACC');

  // 添加全局对象
  generator.addObject(varName, 'LSM303AGR_ACC_Sensor ' + varName + '(&' + wire + ');');

  // 确保Wire初始化
  ensureWireBegin(wire, generator);

  // 生成初始化代码
  let code = '';
  code += varName + '.begin();\n';
  code += varName + '.Enable();\n';
  code += varName + '.EnableTemperatureSensor();\n';
  return code;
};

// ============ 磁力计初始化 ============
Arduino.forBlock['lsm303agr_mag_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._lsm303agrMagVarMonitorAttached) {
    block._lsm303agrMagVarMonitorAttached = true;
    block._lsm303agrMagVarLastName = block.getFieldValue('VAR') || 'Mag';
    registerVariableToBlockly(block._lsm303agrMagVarLastName, 'LSM303AGR_MAG');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lsm303agrMagVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LSM303AGR_MAG');
          block._lsm303agrMagVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'Mag';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 添加库
  ensureLSM303AGRLibraries(generator, 'MAG');

  // 添加全局对象
  generator.addObject(varName, 'LSM303AGR_MAG_Sensor ' + varName + '(&' + wire + ');');

  // 确保Wire初始化
  ensureWireBegin(wire, generator);

  // 生成初始化代码
  let code = '';
  code += varName + '.begin();\n';
  code += varName + '.Enable();\n';
  return code;
};

// ============ 读取加速度计轴数据 ============
Arduino.forBlock['lsm303agr_acc_get_axis'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'Acc';
  const axis = block.getFieldValue('AXIS') || '0';

  // 添加辅助函数：读取加速度计指定轴的数据
  const funcName = '_lsm303agr_acc_read_axis';
  const funcDef =
    'int32_t ' + funcName + '(LSM303AGR_ACC_Sensor &sensor, int axis) {\n' +
    '  int32_t axes[3];\n' +
    '  if (sensor.GetAxes(axes) != LSM303AGR_ACC_STATUS_OK) return INT32_MIN;\n' +
    '  return axes[axis];\n' +
    '}\n';
  generator.addFunction(funcName, funcDef, true);
  ensureLSM303AGRLibraries(generator, 'ACC');

  return [funcName + '(' + varName + ', ' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

// ============ 读取磁力计轴数据 ============
Arduino.forBlock['lsm303agr_mag_get_axis'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'Mag';
  const axis = block.getFieldValue('AXIS') || '0';

  // 添加辅助函数：读取磁力计指定轴的数据
  const funcName = '_lsm303agr_mag_read_axis';
  const funcDef =
    'int32_t ' + funcName + '(LSM303AGR_MAG_Sensor &sensor, int axis) {\n' +
    '  int32_t axes[3];\n' +
    '  if (sensor.GetAxes(axes) != LSM303AGR_MAG_STATUS_OK) return INT32_MIN;\n' +
    '  return axes[axis];\n' +
    '}\n';
  generator.addFunction(funcName, funcDef, true);
  ensureLSM303AGRLibraries(generator, 'MAG');

  return [funcName + '(' + varName + ', ' + axis + ')', generator.ORDER_FUNCTION_CALL];
};

// ============ 读取温度 ============
Arduino.forBlock['lsm303agr_acc_get_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'Acc';

  // 添加辅助函数：读取温度
  const funcName = '_lsm303agr_acc_read_temp';
  const funcDef =
    'float ' + funcName + '(LSM303AGR_ACC_Sensor &sensor) {\n' +
    '  float temperature;\n' +
    '  if (sensor.GetTemperature(&temperature) != LSM303AGR_ACC_STATUS_OK) return NAN;\n' +
    '  return temperature;\n' +
    '}\n';
  generator.addFunction(funcName, funcDef, true);
  ensureLSM303AGRLibraries(generator, 'ACC');

  return [funcName + '(' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

function ensureLSM303AGRFilter(generator) {
  ensureLibrary(generator, 'madgwick_ahrs', '#include <MadgwickAHRS.h>');
  generator.addObject('_lsm303agr_ahrs_filter', 'Madgwick _lsm303agr_ahrs_filter;');
  generator.addObject('_lsm303agr_ahrs_valid', 'bool _lsm303agr_ahrs_valid = false;');
}

// ============ AHRS姿态解算 - 更新 ============
Arduino.forBlock['lsm303agr_ahrs_update'] = function(block, generator) {
  const accField = block.getField('ACC_VAR');
  const accName = accField ? accField.getText() : 'Acc';
  const magField = block.getField('MAG_VAR');
  const magName = magField ? magField.getText() : 'Mag';

  // 确保库引用
  ensureLSM303AGRLibraries(generator, 'ACC');
  ensureLSM303AGRLibraries(generator, 'MAG');
  ensureLSM303AGRFilter(generator);

  // 添加AHRS更新辅助函数（使用Madgwick滤波器，无陀螺仪时gyro传0）
  const funcName = '_lsm303agr_ahrs_update';
  const funcDef =
    'void ' + funcName + '(LSM303AGR_ACC_Sensor &acc, LSM303AGR_MAG_Sensor &mag) {\n' +
    '  int32_t accAxes[3], magAxes[3];\n' +
    '  _lsm303agr_ahrs_valid = acc.GetAxes(accAxes) == LSM303AGR_ACC_STATUS_OK &&\n' +
    '      mag.GetAxes(magAxes) == LSM303AGR_MAG_STATUS_OK &&\n' +
    '      (accAxes[0] || accAxes[1] || accAxes[2]) && (magAxes[0] || magAxes[1] || magAxes[2]);\n' +
    '  if (!_lsm303agr_ahrs_valid) return;\n' +
    '  _lsm303agr_ahrs_filter.update(\n' +
    '    0, 0, 0,\n' +
    '    accAxes[0] / 1000.0f, accAxes[1] / 1000.0f, accAxes[2] / 1000.0f,\n' +
    '    magAxes[0] / 1000.0f, magAxes[1] / 1000.0f, magAxes[2] / 1000.0f\n' +
    '  );\n' +
    '}\n';
  generator.addFunction(funcName, funcDef, true);

  // 在setup中设置采样率（使用较高的beta值加速收敛，因为没有陀螺仪）
  generator.addSetup('_lsm303agr_ahrs_setup',
    '_lsm303agr_ahrs_filter.begin(100);\n' +
    '  _lsm303agr_ahrs_filter.setBeta(0.6);\n');

  return funcName + '(' + accName + ', ' + magName + ');\n';
};

// ============ AHRS姿态解算 - 获取角度 ============
Arduino.forBlock['lsm303agr_ahrs_get_angle'] = function(block, generator) {
  const angle = block.getFieldValue('ANGLE') || 'ROLL';

  ensureLSM303AGRFilter(generator);

  let methodCall;
  if (angle === 'ROLL') {
    methodCall = '_lsm303agr_ahrs_filter.getRoll()';
  } else if (angle === 'PITCH') {
    methodCall = '_lsm303agr_ahrs_filter.getPitch()';
  } else {
    methodCall = '_lsm303agr_ahrs_filter.getYaw()';
  }

  return ['(_lsm303agr_ahrs_valid ? ' + methodCall + ' : NAN)', generator.ORDER_ATOMIC];
};

// ============ 引脚信息扩展 ============
function addLSM303AGRPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;

  try {
    const blockTypes = ['lsm303agr_acc_init', 'lsm303agr_mag_init'];
    blockTypes.forEach(function(blockType) {
      const extensionName = blockType + '_pin_info';
      if (!Blockly.Extensions.isRegistered || !Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.register(extensionName, function() {
          // 扩展注册占位
        });
      }
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

if (typeof Blockly !== 'undefined') {
  addLSM303AGRPinInfoExtensions();
}

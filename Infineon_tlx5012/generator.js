// TLx5012B 磁性角度传感器库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保 TLx5012B 库已包含
function ensureTlx5012Libraries(generator) {
  ensureLibrary(generator, 'tlx5012', '#include <tlx5012-arduino.hpp>');
  generator.addVariable('_tlx5012_using_ns', 'using namespace tle5012;');
}

// 初始化 TLx5012B 传感器
Arduino.forBlock['tlx5012_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._tlx5012VarMonitorAttached) {
    block._tlx5012VarMonitorAttached = true;
    block._tlx5012VarLastName = block.getFieldValue('VAR') || 'angleSensor';
    registerVariableToBlockly(block._tlx5012VarLastName, 'TLx5012B');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tlx5012VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TLx5012B');
          block._tlx5012VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'angleSensor';
  const csPin = block.getFieldValue('CS_PIN') || '10';

  // 添加库
  ensureTlx5012Libraries(generator);

  // 添加对象声明
  generator.addObject(varName, 'Tle5012Ino ' + varName + ' = Tle5012Ino(' + csPin + ');');

  // 添加错误检查变量
  generator.addVariable(varName + '_err', 'errorTypes ' + varName + '_err = NO_ERROR;');

  // 生成初始化代码（放在 setup 中）
  let setupCode = varName + '_err = ' + varName + '.begin();\n';
  generator.addSetup('tlx5012_init_' + varName, setupCode);

  return '';
};

// 读取角度值
Arduino.forBlock['tlx5012_read_angle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  // 添加辅助函数
  generator.addFunction('tlx5012_getAngle_' + varName, 
    'double tlx5012_getAngle_' + varName + '() {\n' +
    '  double val = 0.0;\n' +
    '  ' + varName + '_err = ' + varName + '.getAngleValue(val);\n' +
    '  return ' + varName + '_err == NO_ERROR ? (double)val : NAN;\n' +
    '}\n'
  );

  return ['tlx5012_getAngle_' + varName + '()', generator.ORDER_FUNCTION_CALL];
};

// 读取角速度
Arduino.forBlock['tlx5012_read_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  generator.addFunction('tlx5012_getSpeed_' + varName,
    'double tlx5012_getSpeed_' + varName + '() {\n' +
    '  double val = 0.0;\n' +
    '  ' + varName + '_err = ' + varName + '.getAngleSpeed(val);\n' +
    '  return ' + varName + '_err == NO_ERROR ? (double)val : NAN;\n' +
    '}\n'
  );

  return ['tlx5012_getSpeed_' + varName + '()', generator.ORDER_FUNCTION_CALL];
};

// 读取旋转圈数
Arduino.forBlock['tlx5012_read_revolutions'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  generator.addFunction('tlx5012_getRevolutions_' + varName,
    'double tlx5012_getRevolutions_' + varName + '() {\n' +
    '  int16_t val = 0;\n' +
    '  ' + varName + '_err = ' + varName + '.getNumRevolutions(val);\n' +
    '  return ' + varName + '_err == NO_ERROR ? (double)val : NAN;\n' +
    '}\n'
  );

  return ['tlx5012_getRevolutions_' + varName + '()', generator.ORDER_FUNCTION_CALL];
};

// 读取温度
Arduino.forBlock['tlx5012_read_temperature'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  generator.addFunction('tlx5012_getTemperature_' + varName,
    'double tlx5012_getTemperature_' + varName + '() {\n' +
    '  double val = 0.0;\n' +
    '  ' + varName + '_err = ' + varName + '.getTemperature(val);\n' +
    '  return ' + varName + '_err == NO_ERROR ? (double)val : NAN;\n' +
    '}\n'
  );

  return ['tlx5012_getTemperature_' + varName + '()', generator.ORDER_FUNCTION_CALL];
};

// 读取角度范围
Arduino.forBlock['tlx5012_read_angle_range'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  generator.addFunction('tlx5012_getAngleRange_' + varName,
    'double tlx5012_getAngleRange_' + varName + '() {\n' +
    '  double val = 0.0;\n' +
    '  ' + varName + '_err = ' + varName + '.getAngleRange(val);\n' +
    '  return ' + varName + '_err == NO_ERROR ? (double)val : NAN;\n' +
    '}\n'
  );

  return ['tlx5012_getAngleRange_' + varName + '()', generator.ORDER_FUNCTION_CALL];
};

// 重置传感器
Arduino.forBlock['tlx5012_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'angleSensor';

  ensureTlx5012Libraries(generator);

  return varName + '_err = ' + varName + '.resetFirmware();\n';
};

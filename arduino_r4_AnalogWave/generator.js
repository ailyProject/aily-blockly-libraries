/**
 * AnalogWave Blockly Generator
 * 用于Arduino UNO R4 WiFi的模拟波形生成库
 */

// 初始化模拟波形对象
Arduino.forBlock['analogwave_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._analogwaveVarMonitorAttached) {
    block._analogwaveVarMonitorAttached = true;
    block._analogwaveVarLastName = block.getFieldValue('VAR') || 'wave';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const oldName = block._analogwaveVarLastName;
        if (oldName !== newName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, 'analogWave');
        }
        block._analogwaveVarLastName = newName;
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'wave';
  const pin = block.getFieldValue('PIN') || 'DAC';

  // 添加库引用
  generator.addLibrary('analogWave', '#include "analogWave.h"');
  
  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, 'analogWave');
  }
  
  // 声明对象
  generator.addObject('analogWave_' + varName, 'analogWave ' + varName + '(' + pin + ');');

  return '';
};

// 生成正弦波
Arduino.forBlock['analogwave_sine'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';
  const freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '10';

  return varName + '.sine(' + freq + ');\n';
};

// 生成方波
Arduino.forBlock['analogwave_square'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';
  const freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '10';

  return varName + '.square(' + freq + ');\n';
};

// 生成锯齿波
Arduino.forBlock['analogwave_saw'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';
  const freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '10';

  return varName + '.saw(' + freq + ');\n';
};

// 设置频率
Arduino.forBlock['analogwave_freq'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';
  const freq = generator.valueToCode(block, 'FREQ', generator.ORDER_ATOMIC) || '10';

  return varName + '.freq(' + freq + ');\n';
};

// 设置振幅
Arduino.forBlock['analogwave_amplitude'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';
  const amp = generator.valueToCode(block, 'AMP', generator.ORDER_ATOMIC) || '1.0';

  return varName + '.amplitude(' + amp + ');\n';
};

// 开始输出
Arduino.forBlock['analogwave_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';

  return varName + '.start();\n';
};

// 停止输出
Arduino.forBlock['analogwave_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'wave';

  return varName + '.stop();\n';
};

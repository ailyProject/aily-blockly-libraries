/**
 * @fileoverview NLCS21 颜色传感器库代码生成器
 */

'use strict';

// 初始化颜色传感器
Arduino.forBlock['nlcs21_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._nlcs21VarMonitorAttached) {
    block._nlcs21VarMonitorAttached = true;
    block._nlcs21VarLastName = block.getFieldValue('VAR') || 'colorSensor';
    registerVariableToBlockly(block._nlcs21VarLastName, 'ColorSensorNlcs21');

    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._nlcs21VarLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'ColorSensorNlcs21');
          block._nlcs21VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'colorSensor';
  const gain = block.getFieldValue('GAIN') || 'kGain1X';
  const integrationTime = block.getFieldValue('INTEGRATION_TIME') || 'kIntegrationTime132ms';

  // 添加库和变量
  generator.addLibrary('ColorSensorNlcs21', '#include <color_sensor_nlcs21.h>');
  registerVariableToBlockly(varName, 'ColorSensorNlcs21');
  generator.addVariable(varName, 'emakefun::ColorSensorNlcs21 ' + varName + '(emakefun::ColorSensorNlcs21::' + gain + ', emakefun::ColorSensorNlcs21::' + integrationTime + ');');
  generator.addVariable(varName + '_color', 'emakefun::ColorSensorNlcs21::Color ' + varName + '_color;');

  // 确保Wire初始化
  generator.addSetupBegin('Wire.begin()', 'Wire.begin();');

  return varName + '.Initialize();\n';
};

// 读取颜色数据
Arduino.forBlock['nlcs21_get_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';

  return [varName + '.GetColor(&' + varName + '_color)', generator.ORDER_ATOMIC];
};

// 获取颜色通道值
Arduino.forBlock['nlcs21_color_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  const channel = block.getFieldValue('CHANNEL') || 'r';

  return [varName + '_color.' + channel, generator.ORDER_ATOMIC];
};

// 设置阈值
Arduino.forBlock['nlcs21_set_threshold'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  const low = generator.valueToCode(block, 'LOW', generator.ORDER_ATOMIC) || '0';
  const high = generator.valueToCode(block, 'HIGH', generator.ORDER_ATOMIC) || '150';

  return varName + '.SetThreshold(' + low + ', ' + high + ');\n';
};

// 获取中断状态
Arduino.forBlock['nlcs21_get_interrupt'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';

  return [varName + '.GetInterruptStatus()', generator.ORDER_ATOMIC];
};

// 清除中断
Arduino.forBlock['nlcs21_clear_interrupt'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';

  return varName + '.ClearInterrupt();\n';
};

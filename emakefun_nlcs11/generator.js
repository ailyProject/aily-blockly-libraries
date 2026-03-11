/**
 * @fileoverview NLCS11 颜色传感器库代码生成器
 */

'use strict';

// 初始化颜色传感器
Arduino.forBlock['nlcs11_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._nlcs11VarMonitorAttached) {
    block._nlcs11VarMonitorAttached = true;
    block._nlcs11VarLastName = block.getFieldValue('VAR') || 'colorSensor';
    registerVariableToBlockly(block._nlcs11VarLastName, 'ColorSensorNlcs11');

    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._nlcs11VarLastName;
        if (newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'ColorSensorNlcs11');
          block._nlcs11VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'colorSensor';
  const gain = block.getFieldValue('GAIN') || 'kGain1X';
  const integrationTime = block.getFieldValue('INTEGRATION_TIME') || 'kIntegrationTime10ms';

  // 添加库和变量
  generator.addLibrary('ColorSensorNlcs11', '#include <color_sensor_nlcs11.h>');
  registerVariableToBlockly(varName, 'ColorSensorNlcs11');
  generator.addVariable(varName, 'emakefun::ColorSensorNlcs11 ' + varName + '(emakefun::ColorSensorNlcs11::' + gain + ', emakefun::ColorSensorNlcs11::' + integrationTime + ');');
  generator.addVariable(varName + '_color', 'emakefun::ColorSensorNlcs11::Color ' + varName + '_color;');

  // 确保Wire初始化
  generator.addSetupBegin('Wire.begin()', 'Wire.begin();');

  return varName + '.Initialize();\n';
};

// 读取颜色数据
Arduino.forBlock['nlcs11_get_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';

  return [varName + '.GetColor(&' + varName + '_color)', generator.ORDER_ATOMIC];
};

// 获取颜色通道值
Arduino.forBlock['nlcs11_color_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  const channel = block.getFieldValue('CHANNEL') || 'r';

  return [varName + '_color.' + channel, generator.ORDER_ATOMIC];
};

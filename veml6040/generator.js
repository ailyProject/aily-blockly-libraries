'use strict';

// VEML6040 颜色识别辅助函数（C++），供 get_color / is_color 使用
Arduino.veml6040ColorNameFn =
  'String veml6040ColorName(VEML6040 &s) {\n' +
  '  float r = s.getRed();\n' +
  '  float g = s.getGreen();\n' +
  '  float b = s.getBlue();\n' +
  '  uint16_t w = s.getWhite();\n' +
  '  if (w < 50) return "dark";\n' +
  '  float mx = r; if (g > mx) mx = g; if (b > mx) mx = b;\n' +
  '  float mn = r; if (g < mn) mn = g; if (b < mn) mn = b;\n' +
  '  if (mx <= 0) return "dark";\n' +
  '  if ((mx - mn) / mx < 0.2) return "white";\n' +
  '  float rn = r / mx, gn = g / mx, bn = b / mx;\n' +
  '  if (r >= g && r >= b) {\n' +
  '    if (gn >= 0.7 && bn < 0.6) return "yellow";\n' +
  '    return "red";\n' +
  '  } else if (g >= r && g >= b) {\n' +
  '    if (rn >= 0.7) return "yellow";\n' +
  '    if (bn >= 0.6) return "cyan";\n' +
  '    return "green";\n' +
  '  } else {\n' +
  '    if (gn >= 0.6) return "cyan";\n' +
  '    return "blue";\n' +
  '  }\n' +
  '}';

// 初始化 VEML6040：创建对象变量，选择 I2C 总线，设置积分时间
Arduino.forBlock['veml6040_init'] = function (block, generator) {
  const VEML_TYPE = 'VEML6040';

  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'colorSensor';
    registerVariableToBlockly(block._varLastName, VEML_TYPE);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const oldName = block._varLastName;
        if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, VEML_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'colorSensor';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const it = block.getFieldValue('IT');

  // 板卡适配：VEML6040 为标准 I2C 器件，各核心均通过 Wire 通信（无需按核心区分）
  const boardConfig = window['boardConfig'];
  if (boardConfig && boardConfig.core) {
    // 预留：如某核心需要特殊 I2C 处理可在此扩展
  }
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('veml6040', '#include <veml6040.h>');

  registerVariableToBlockly(varName, VEML_TYPE);
  generator.addObject(varName, 'VEML6040 ' + varName + ';');

  ensureSerialBegin("Serial", generator);
  generator.addSetup('wire_' + wire + '_begin', wire + '.begin();');

  let code = varName + '.begin(&' + wire + ');\n';
  code += varName + '.setConfiguration(' + it + ' + VEML6040_AF_AUTO + VEML6040_SD_ENABLE);\n';
  return code;
};

// 读取颜色传感器通道（值块）
Arduino.forBlock['veml6040_read'] = function (block, generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('veml6040', '#include <veml6040.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  const channel = block.getFieldValue('CHANNEL');
  return [`${varName}.${channel}()`, generator.ORDER_ATOMIC];
};

// 识别颜色名称（值块，返回文本）
Arduino.forBlock['veml6040_get_color'] = function (block, generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('veml6040', '#include <veml6040.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  generator.addFunction('veml6040ColorName', Arduino.veml6040ColorNameFn);
  return [`veml6040ColorName(${varName})`, generator.ORDER_ATOMIC];
};

// 检测到某颜色（布尔块）
Arduino.forBlock['veml6040_is_color'] = function (block, generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('veml6040', '#include <veml6040.h>');
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'colorSensor';
  const color = block.getFieldValue('COLOR');
  generator.addFunction('veml6040ColorName', Arduino.veml6040ColorNameFn);
  return [`(veml6040ColorName(${varName}) == "${color}")`, generator.ORDER_ATOMIC];
};

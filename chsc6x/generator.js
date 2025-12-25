'use strict';

// CHSC6X触摸屏库代码生成器

// 初始化块
Arduino.forBlock['chsc6x_setup'] = function(block, generator) {
  // 变量重命名监听
  if (!block._chsc6xVarMonitorAttached) {
    block._chsc6xVarMonitorAttached = true;
    block._chsc6xVarLastName = block.getFieldValue('VAR') || 'touch';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._chsc6xVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'CHSC6X');
          block._chsc6xVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'touch';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '7';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '240';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '240';
  const rotation = block.getFieldValue('ROTATION')  || '0';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0x2E';

  // 添加库和变量
  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  registerVariableToBlockly(varName, 'CHSC6X');
  generator.addVariable('CHSC6X_' + varName, 'CHSC6X ' + varName + '(' + width + ', ' + height + ', ' + rotation + ', ' + pin + ', ' + address + ', &' + wire + ');');

  // 添加初始化代码到setup
  // generator.addSetupEnd('CHSC6X_init_' + varName, varName + '.begin();');
  let setupCode = varName + '.begin();\n';

  return setupCode;
};

// 检测是否被触摸
Arduino.forBlock['chsc6x_is_pressed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.isPressed()', generator.ORDER_ATOMIC];
};

// 获取X坐标
Arduino.forBlock['chsc6x_get_x'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.getX()', generator.ORDER_ATOMIC];
};

// 获取Y坐标
Arduino.forBlock['chsc6x_get_y'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.getY()', generator.ORDER_ATOMIC];
};

// 获取坐标到变量
Arduino.forBlock['chsc6x_get_xy'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';
  const xVar = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || 'x';
  const yVar = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || 'y';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.getXY(' + xVar + ', ' + yVar + ')', generator.ORDER_ATOMIC];
};

// 设置旋转
Arduino.forBlock['chsc6x_set_rotation'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';
  const rotation = generator.valueToCode(block, 'ROTATION', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return varName + '.setRotation(' + rotation + ');\n';
};

// 获取旋转角度
Arduino.forBlock['chsc6x_get_rotation'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.getRotation()', generator.ORDER_ATOMIC];
};

// 设置屏幕大小
Arduino.forBlock['chsc6x_set_screen_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '240';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '240';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return varName + '.setScreenSize(' + width + ', ' + height + ');\n';
};

// 运行检测
Arduino.forBlock['chsc6x_run'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'touch';

  generator.addLibrary('CHSC6X', '#include <CHSC6X.h>');
  registerVariableToBlockly(varName, 'CHSC6X');

  return [varName + '.run()', generator.ORDER_ATOMIC];
};

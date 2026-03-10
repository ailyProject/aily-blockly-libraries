/**
 * Matrix Keyboard Library Generator
 * 矩阵键盘库代码生成器
 */

// 初始化矩阵键盘（合并创建和初始化）
Arduino.forBlock['matrix_keyboard_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'keyboard';
    registerVariableToBlockly(block._varLastName, 'MatrixKeyboard');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'MatrixKeyboard');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'keyboard';
  const i2cAddr = block.getFieldValue('I2C_ADDR') || 101;

  // 添加库和变量声明
  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');
  registerVariableToBlockly(varName, 'MatrixKeyboard');
  generator.addVariable(varName, 'emakefun::MatrixKeyboard ' + varName + '(Wire, ' + i2cAddr + ');');

  // 自动添加Tick()到loop开头
  generator.addLoopBegin(varName + '.Tick();', varName + '.Tick();');

  // 生成初始化代码，包含错误检查
  let code = 'Wire.begin();\n';
  code += 'if (' + varName + '.Initialize() != emakefun::MatrixKeyboard::ErrorCode::kOK) {\n';
  code += '  Serial.println("Matrix keyboard initialization failed!");\n';
  code += '  while(1);\n';
  code += '}\n';
  code += 'Serial.println("Matrix keyboard initialized successfully");\n';

  return code;
};

// 扫描矩阵键盘
Arduino.forBlock['matrix_keyboard_tick'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return varName + '.Tick();\n';
};

// 获取当前按下按键
Arduino.forBlock['matrix_keyboard_get_current_key'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return [varName + '.GetCurrentPressedKey()', generator.ORDER_ATOMIC];
};

// 检测按键是否被按下
Arduino.forBlock['matrix_keyboard_key_pressed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';
  const key = block.getFieldValue('KEY');

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return [varName + '.Pressed(emakefun::MatrixKeyboard::' + key + ')', generator.ORDER_ATOMIC];
};

// 检测按键是否正在按住
Arduino.forBlock['matrix_keyboard_key_pressing'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';
  const key = block.getFieldValue('KEY');

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return [varName + '.Pressing(emakefun::MatrixKeyboard::' + key + ')', generator.ORDER_ATOMIC];
};

// 检测按键是否被释放
Arduino.forBlock['matrix_keyboard_key_released'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';
  const key = block.getFieldValue('KEY');

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return [varName + '.Released(emakefun::MatrixKeyboard::' + key + ')', generator.ORDER_ATOMIC];
};

// 检测按键是否空闲
Arduino.forBlock['matrix_keyboard_key_idle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';
  const key = block.getFieldValue('KEY');

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return [varName + '.Idle(emakefun::MatrixKeyboard::' + key + ')', generator.ORDER_ATOMIC];
};

// 获取按键状态
Arduino.forBlock['matrix_keyboard_get_key_state'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'keyboard';
  const key = block.getFieldValue('KEY');

  generator.addLibrary('MatrixKeyboard', '#include <Wire.h>\n#include "matrix_keyboard.h"');

  return ['(int)' + varName + '.GetKeyState(emakefun::MatrixKeyboard::' + key + ')', generator.ORDER_ATOMIC];
};
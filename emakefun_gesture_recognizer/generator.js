/**
 * @fileoverview 手势识别传感器库代码生成器
 */

'use strict';

// 初始化手势识别传感器
Arduino.forBlock['gesture_recognizer_setup'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._gestureRecognizerVarMonitorAttached) {
    block._gestureRecognizerVarMonitorAttached = true;
    block._gestureRecognizerVarLastName = block.getFieldValue('VAR') || 'gesture';
    registerVariableToBlockly(block._gestureRecognizerVarLastName, 'GestureRecognizer');
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._gestureRecognizerVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'GestureRecognizer');
          block._gestureRecognizerVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'gesture';
  const i2cAddress = block.getFieldValue('I2C_ADDRESS') || '0x39';

  // 添加库和变量声明
  generator.addLibrary('gesture_recognizer', '#include <gesture_recognizer.h>');
  registerVariableToBlockly(varName, 'GestureRecognizer');
  generator.addVariable(varName, 'emakefun::GestureRecognizer ' + varName + '(Wire, ' + i2cAddress + ');');

  // 生成初始化代码
  const code = 'if (' + varName + '.Initialize() != 0) {\n' +
    '  Serial.println(F("手势识别传感器初始化失败"));\n' +
    '}\n';
  
  return code;
};

// 获取手势
Arduino.forBlock['gesture_recognizer_get_gesture'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gesture';
  
  return [varName + '.GetGesture()', generator.ORDER_ATOMIC];
};

// 手势类型常量
Arduino.forBlock['gesture_recognizer_gesture_type'] = function(block, generator) {
  const gestureType = block.getFieldValue('GESTURE_TYPE') || '0';
  
  return [gestureType, generator.ORDER_ATOMIC];
};
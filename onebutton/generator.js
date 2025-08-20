// OneButton Blockly库生成器
// 基于Arduino OneButton库的Blockly实现

'use strict';

// 创建按钮块
Arduino.forBlock['onebutton_setup'] = function(block, generator) {
  // 1. 设置变量重命名监听
  if (!block._onebuttonVarMonitorAttached) {
    block._onebuttonVarMonitorAttached = true;
    block._onebuttonVarLastName = block.getFieldValue('VAR') || 'button';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._onebuttonVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OneButton');
          block._onebuttonVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'button';
  const pin = block.getFieldValue('PIN');
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  // 3. 库和变量管理
  generator.addLibrary('#include <OneButton.h>', '#include <OneButton.h>');
  registerVariableToBlockly(varName, 'OneButton');
  generator.addVariable('OneButton ' + varName, 'OneButton ' + varName + ';');

  // 4. 自动添加tick()到主循环
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  // 5. 生成设置代码
  return varName + '.setup(' + pin + ', ' + pinMode + ', ' + activeLow + ');\n';
};

// 单击事件块
Arduino.forBlock['onebutton_attach_click'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  let callbackName = 'onebutton_click_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachClick(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code)
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 双击事件块
Arduino.forBlock['onebutton_attach_double_click'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_double_click_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachDoubleClick(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 多次点击事件块
Arduino.forBlock['onebutton_attach_multi_click'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_multi_click_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachMultiClick(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 按下事件块
Arduino.forBlock['onebutton_attach_press'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_press_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachPress(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 长按开始事件块
Arduino.forBlock['onebutton_attach_long_press_start'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_long_press_start_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachLongPressStart(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 长按期间事件块
Arduino.forBlock['onebutton_attach_during_long_press'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_during_long_press_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachDuringLongPress(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 长按结束事件块
Arduino.forBlock['onebutton_attach_long_press_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'onebutton_long_press_stop_' + varName;

  const functionDef = `void ${callbackName}() {
${handlerCode}
}`;

  let code = varName + '.attachLongPressStop(' + callbackName + ');\n';
  generator.addFunction(callbackName, functionDef);
  generator.addSetupEnd(code, code);
  generator.addLoopBegin(varName + '.tick();', varName + '.tick();');

  return '';
};

// 设置防抖时间块
Arduino.forBlock['onebutton_set_debounce_ms'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const ms = generator.valueToCode(block, 'MS', Arduino.ORDER_ATOMIC) || '50';
  
  return varName + '.setDebounceMs(' + ms + ');\n';
};

// 设置单击时间块
Arduino.forBlock['onebutton_set_click_ms'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const ms = generator.valueToCode(block, 'MS', Arduino.ORDER_ATOMIC) || '400';
  
  return varName + '.setClickMs(' + ms + ');\n';
};

// 设置长按时间块
Arduino.forBlock['onebutton_set_press_ms'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const ms = generator.valueToCode(block, 'MS', Arduino.ORDER_ATOMIC) || '800';
  
  return varName + '.setPressMs(' + ms + ');\n';
};

// 设置长按间隔时间块
Arduino.forBlock['onebutton_set_long_press_interval_ms'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';
  const ms = generator.valueToCode(block, 'MS', Arduino.ORDER_ATOMIC) || '0';
  
  return varName + '.setLongPressIntervalMs(' + ms + ');\n';
};

// 检查是否正在长按块
Arduino.forBlock['onebutton_is_long_pressed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';

  return [varName + '.isLongPressed()', Arduino.ORDER_ATOMIC];
};

// 获取按下时长块
Arduino.forBlock['onebutton_get_pressed_ms'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';

  return [varName + '.getPressedMs()', Arduino.ORDER_ATOMIC];
};

// 获取点击次数块
Arduino.forBlock['onebutton_get_number_clicks'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';

  return [varName + '.getNumberClicks()', Arduino.ORDER_ATOMIC];
};

// 重置按钮状态块
Arduino.forBlock['onebutton_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'button';

  return varName + '.reset();\n';
};
// OneButton Blockly库生成器
// 基于Arduino OneButton库的Blockly实现

'use strict';

// 板载按键按开发板选（做法同 TFT_eSPI 读 board.json 的 displayConfig）：读 board.json 的 buttonConfig
//   pins：按键名 → 引脚（如 linkbit 的 keyA/keyB/keyC，IBox S31 的 button）；activeLevel：按下时的电平
// 只改工具箱（flyout）里的积木：引脚默认选工作区里还没用到的第一个板载按键，变量名用按键名；
// activeLevel 为 0 时选上拉输入、低电平有效，为 1 时选高电平有效。打开已保存的程序时不改用户的值。
function onebuttonBoardButtons() {
  let board = null;
  try {
    board = window['boardConfig'];
  } catch (e) {
    board = null;
  }
  const config = board && board.buttonConfig;
  if (!config || typeof config !== 'object' || !config.pins || typeof config.pins !== 'object') return null;
  const keys = Array.isArray(config.pins)
    ? config.pins
        .filter(item => Array.isArray(item) && item.length > 1)
        .map(item => ({ name: String(item[0]), pin: String(item[1]) }))
    : Object.keys(config.pins).map(name => ({ name: name, pin: String(config.pins[name]) }));
  if (!keys.length) return null;
  const level = Number(config.activeLevel);
  return { keys: keys, activeLevel: level === 0 || level === 1 ? level : null };
}

if (Blockly.Extensions.isRegistered('onebutton_board_button')) {
  Blockly.Extensions.unregister('onebutton_board_button');
}
Blockly.Extensions.register('onebutton_board_button', function() {
  if (!this.isInFlyout) return;
  const config = onebuttonBoardButtons();
  if (!config) return;
  const pinField = this.getField('PIN');
  if (!pinField) return;
  let options = [];
  try {
    options = pinField.getOptions(false).map(option => option[1]);
  } catch (e) {
    options = [];
  }
  // 引脚列表里没有的按键不用
  const keys = config.keys.filter(key => options.indexOf(key.pin) > -1);
  if (!keys.length) return;

  // 主工作区里已经创建过的按钮：用过的引脚和变量名
  const usedPins = new Set();
  const usedNames = new Set();
  try {
    const main = (this.workspace && this.workspace.targetWorkspace) ||
      (Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    if (main && main !== this.workspace) {
      main.getBlocksByType('onebutton_setup', false).forEach(other => {
        usedPins.add(other.getFieldValue('PIN'));
        usedNames.add(other.getFieldValue('VAR'));
      });
    }
  } catch (e) {
    // 拿不到主工作区就按第一个按键
  }
  const unused = keys.find(key => !usedPins.has(key.pin));
  const key = unused || keys[0];
  pinField.setValue(key.pin);
  if (unused && /^[A-Za-z_][A-Za-z0-9_]*$/.test(key.name) && !usedNames.has(key.name)) {
    this.setFieldValue(key.name, 'VAR');
  }
  if (config.activeLevel === 0) {
    this.setFieldValue('INPUT_PULLUP', 'PIN_MODE');
    this.setFieldValue('TRUE', 'ACTIVE_LOW');
  } else if (config.activeLevel === 1) {
    this.setFieldValue('FALSE', 'ACTIVE_LOW');
  }
});

// 创建按钮块
Arduino.forBlock['onebutton_setup'] = function(block, generator) {
  // 1. 设置变量重命名监听
  if (!block._onebuttonVarMonitorAttached) {
    block._onebuttonVarMonitorAttached = true;
    block._onebuttonVarLastName = block.getFieldValue('VAR') || 'button';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._onebuttonVarLastName, 'OneButton');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._onebuttonVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'OneButton');
          block._onebuttonVarLastName = newName;
        }
      };
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'button';
  const pin = block.getFieldValue('PIN');
  const pinMode = block.getFieldValue('PIN_MODE');
  const activeLow = block.getFieldValue('ACTIVE_LOW') === 'TRUE';

  // 3. 库和变量管理
  generator.addLibrary('#include <OneButton.h>', '#include <OneButton.h>');
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
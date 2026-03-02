/**
 * CodexPad 蓝牙手柄 Blockly 代码生成器
 * 支持通过BLE连接CodexPad手柄，读取按键和摇杆输入
 */

// ============================================================
// 辅助函数
// ============================================================

/**
 * 从 field_variable 获取变量名
 */
function _codexpad_getVarName(block, fieldName, defaultName) {
  var varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// ============================================================
// 初始化块
// ============================================================

Arduino.forBlock['codexpad_init'] = function(block, generator) {
  // 变量重命名监听
  if (!block._codexpadVarMonitorAttached) {
    block._codexpadVarMonitorAttached = true;
    block._codexpadVarLastName = block.getFieldValue('VAR') || 'pad';
    var varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._codexpadVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'CodexPad');
          block._codexpadVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'pad';
  var mac = generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) || '"00:00:00:00:00:00"';

  // 添加库引用
  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  // 注册变量到 Blockly
  registerVariableToBlockly(varName, 'CodexPad');

  // 声明全局对象
  generator.addVariable(varName, 'CodexPad ' + varName + ';');

  // 在 setup 中初始化和连接
  generator.addSetupBegin(
    varName + '_init',
    varName + '.Init();\n  ' + varName + '.Connect(std::string(' + mac + '));'
  );

  // 自动在 loop 开头调用 Update()
  generator.addLoopBegin(
    varName + '.Update();',
    varName + '.Update();'
  );

  return '';
};

// ============================================================
// 连接状态查询
// ============================================================

Arduino.forBlock['codexpad_is_connected'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.is_connected()';
  return [code, generator.ORDER_ATOMIC];
};

// ============================================================
// 设置发射功率
// ============================================================

Arduino.forBlock['codexpad_set_tx_power'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var power = block.getFieldValue('POWER') || 'k0dBm';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  return varName + '.set_tx_power(CodexPad::TxPower::' + power + ');\n';
};

// ============================================================
// 按键检测块
// ============================================================

Arduino.forBlock['codexpad_button_pressed'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var button = block.getFieldValue('BUTTON') || 'kUp';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.pressed(CodexPad::Button::' + button + ')';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['codexpad_button_released'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var button = block.getFieldValue('BUTTON') || 'kUp';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.released(CodexPad::Button::' + button + ')';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['codexpad_button_holding'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var button = block.getFieldValue('BUTTON') || 'kUp';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.holding(CodexPad::Button::' + button + ')';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['codexpad_button_state'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var button = block.getFieldValue('BUTTON') || 'kUp';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.button_state(CodexPad::Button::' + button + ')';
  return [code, generator.ORDER_ATOMIC];
};

// ============================================================
// 摇杆轴值块
// ============================================================

Arduino.forBlock['codexpad_axis_value'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var axis = block.getFieldValue('AXIS') || 'kLeftStickX';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.axis_value(CodexPad::Axis::' + axis + ')';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['codexpad_axis_changed'] = function(block, generator) {
  var varName = _codexpad_getVarName(block, 'VAR', 'pad');
  var axis = block.getFieldValue('AXIS') || 'kLeftStickX';
  var threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '2';

  generator.addLibrary('codex_pad', '#include <codex_pad.h>');

  var code = varName + '.HasAxisValueChanged(CodexPad::Axis::' + axis + ', ' + threshold + ')';
  return [code, generator.ORDER_ATOMIC];
};

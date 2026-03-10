/**
 * L298N Motor Driver Library Generator
 * @brief 代码生成器 - 将Blockly块转换为Arduino C++代码
 */

// 核心库函数（假设已提供）
// registerVariableToBlockly(varName, varType) - 注册变量到Blockly系统
// renameVariableInBlockly(block, oldName, newName, varType) - 重命名变量

Arduino.forBlock['l298n_setup'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._lastName = block.getFieldValue('VAR') || 'motor';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    if (typeof registerVariableToBlockly === 'function') {
      registerVariableToBlockly(block._lastName, 'L298N');
    }
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'L298N');
          block._lastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'motor';
  const en = block.getFieldValue('EN') || '3';
  const in1 = block.getFieldValue('IN1') || '4';
  const in2 = block.getFieldValue('IN2') || '5';

  // 库和变量管理（generator自动去重）
  generator.addLibrary('L298N', '#include <L298N.h>');
  generator.addVariable(varName, 'L298N ' + varName + '(' + en + ', ' + in1 + ', ' + in2 + ');');

  return '';
};

Arduino.forBlock['l298n_setup_no_enable'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._lastName = block.getFieldValue('VAR') || 'motor';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    if (typeof registerVariableToBlockly === 'function') {
      registerVariableToBlockly(block._lastName, 'L298N');
    }
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._lastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'L298N');
          block._lastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'motor';
  const in1 = block.getFieldValue('IN1') || '4';
  const in2 = block.getFieldValue('IN2') || '5';

  generator.addLibrary('L298N', '#include <L298N.h>');
  generator.addVariable(varName, 'L298N ' + varName + '(' + in1 + ', ' + in2 + ');');

  return '';
};

Arduino.forBlock['l298n_set_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.setSpeed(' + speed + ');\n';
};

Arduino.forBlock['l298n_forward'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.forward();\n';
};

Arduino.forBlock['l298n_backward'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.backward();\n';
};

Arduino.forBlock['l298n_stop'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.stop();\n';
};

Arduino.forBlock['l298n_run'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const direction = block.getFieldValue('DIRECTION') || 'FORWARD';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.run(L298N::' + direction + ');\n';
};

Arduino.forBlock['l298n_forward_for'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '1000';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.forwardFor(' + delay + ');\n';
};

Arduino.forBlock['l298n_backward_for'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '1000';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.backwardFor(' + delay + ');\n';
};

Arduino.forBlock['l298n_run_for'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';
  const direction = block.getFieldValue('DIRECTION') || 'FORWARD';
  const delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '1000';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.runFor(' + delay + ', L298N::' + direction + ');\n';
};

Arduino.forBlock['l298n_get_speed'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return [varName + '.getSpeed()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['l298n_is_moving'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return [varName + '.isMoving()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['l298n_get_direction'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return [varName + '.getDirection()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['l298n_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'motor';

  generator.addLibrary('L298N', '#include <L298N.h>');

  return varName + '.reset();\n';
};

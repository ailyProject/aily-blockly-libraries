'use strict';

const CUBIC_PS3_TYPE = 'CubicPs3';

function cubicPs3GetVar(block, fallback) {
  const f = block.getField('VAR');
  return f ? f.getText() : fallback;
}

function cubicPs3AttachRename(block) {
  if (block._cubicPs3VarMonitorAttached) return;
  block._cubicPs3VarMonitorAttached = true;
  block._cubicPs3VarLastName = block.getFieldValue('VAR') || 'pad';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._cubicPs3VarLastName, CUBIC_PS3_TYPE);
  }
  const varField = block.getField('VAR');
  if (varField) {
    const originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function (newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      const workspace =
        block.workspace ||
        (typeof Blockly !== 'undefined' &&
          Blockly.getMainWorkspace &&
          Blockly.getMainWorkspace());
      const oldName = block._cubicPs3VarLastName;
      if (
        workspace &&
        newName &&
        newName !== oldName &&
        typeof renameVariableInBlockly === 'function'
      ) {
        renameVariableInBlockly(block, oldName, newName, CUBIC_PS3_TYPE);
        block._cubicPs3VarLastName = newName;
      }
    };
  }
}

function cubicPs3EnsureLib(generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  generator.addLibrary('esp_mac', '#include "esp_mac.h"');
  generator.addLibrary('CubicPs3', '#include <CubicPs3.h>');
}

// ========== 初始化（自动 MAC） ==========
Arduino.forBlock['cubic_ps3_init'] = function (block, generator) {
  cubicPs3AttachRename(block);
  const varName = block.getFieldValue('VAR') || 'pad';
  cubicPs3EnsureLib(generator);
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, CUBIC_PS3_TYPE);
  }
  generator.addVariable(varName, 'CubicPs3 ' + varName + ';');
  // 每 loop 更新按键上升沿
  generator.addLoopBegin(
    'cubic_ps3_update_' + varName,
    varName + '.update();'
  );
  return varName + '.begin();\n';
};

// ========== 初始化（指定 MAC） ==========
Arduino.forBlock['cubic_ps3_init_mac'] = function (block, generator) {
  cubicPs3AttachRename(block);
  const varName = block.getFieldValue('VAR') || 'pad';
  const mac =
    generator.valueToCode(block, 'MAC', generator.ORDER_ATOMIC) ||
    '"00:00:00:00:00:00"';
  cubicPs3EnsureLib(generator);
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, CUBIC_PS3_TYPE);
  }
  generator.addVariable(varName, 'CubicPs3 ' + varName + ';');
  generator.addLoopBegin(
    'cubic_ps3_update_' + varName,
    varName + '.update();'
  );
  return varName + '.begin(' + mac + ');\n';
};

// ========== 死区 ==========
Arduino.forBlock['cubic_ps3_set_deadzone'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const dz = generator.valueToCode(block, 'DZ', generator.ORDER_ATOMIC) || '30';
  cubicPs3EnsureLib(generator);
  return varName + '.deadzone = ' + dz + ';\n';
};

// ========== 连接状态 ==========
Arduino.forBlock['cubic_ps3_connected'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  cubicPs3EnsureLib(generator);
  return [varName + '.isConnected()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_ps3_just_connected'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  cubicPs3EnsureLib(generator);
  return [varName + '.justConnected()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_ps3_just_disconnected'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  cubicPs3EnsureLib(generator);
  return [varName + '.justDisconnected()', generator.ORDER_ATOMIC];
};

// ========== 按键 ==========
Arduino.forBlock['cubic_ps3_button'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const btn = block.getFieldValue('BTN') || 'BTN_CROSS';
  cubicPs3EnsureLib(generator);
  return [
    varName + '.button(CubicPs3::' + btn + ')',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['cubic_ps3_button_pressed'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const btn = block.getFieldValue('BTN') || 'BTN_CROSS';
  cubicPs3EnsureLib(generator);
  return [
    varName + '.buttonPressed(CubicPs3::' + btn + ')',
    generator.ORDER_ATOMIC
  ];
};

// ========== 摇杆 ==========
Arduino.forBlock['cubic_ps3_stick'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const stick = block.getFieldValue('STICK') || 'STICK_L';
  const axis = block.getFieldValue('AXIS') || 'AXIS_Y';
  cubicPs3EnsureLib(generator);
  return [
    varName +
      '.stick(CubicPs3::' +
      stick +
      ', CubicPs3::' +
      axis +
      ')',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['cubic_ps3_stick_raw'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const stick = block.getFieldValue('STICK') || 'STICK_L';
  const axis = block.getFieldValue('AXIS') || 'AXIS_Y';
  cubicPs3EnsureLib(generator);
  return [
    varName +
      '.stickRaw(CubicPs3::' +
      stick +
      ', CubicPs3::' +
      axis +
      ')',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['cubic_ps3_stick_mapped'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const stick = block.getFieldValue('STICK') || 'STICK_L';
  const axis = block.getFieldValue('AXIS') || 'AXIS_Y';
  const maxv =
    generator.valueToCode(block, 'MAX', generator.ORDER_ATOMIC) || '255';
  cubicPs3EnsureLib(generator);
  return [
    varName +
      '.stickMapped(CubicPs3::' +
      stick +
      ', CubicPs3::' +
      axis +
      ', ' +
      maxv +
      ')',
    generator.ORDER_ATOMIC
  ];
};

// ========== 玩家 / 震动 / MAC ==========
Arduino.forBlock['cubic_ps3_set_player'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const player = block.getFieldValue('PLAYER') || '1';
  cubicPs3EnsureLib(generator);
  return varName + '.setPlayer(' + player + ');\n';
};

Arduino.forBlock['cubic_ps3_rumble'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  const intensity =
    generator.valueToCode(block, 'INTENSITY', generator.ORDER_ATOMIC) || '50';
  const duration =
    generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '300';
  cubicPs3EnsureLib(generator);
  return varName + '.setRumble(' + intensity + ', ' + duration + ');\n';
};

Arduino.forBlock['cubic_ps3_address'] = function (block, generator) {
  const varName = cubicPs3GetVar(block, 'pad');
  cubicPs3EnsureLib(generator);
  return [varName + '.address()', generator.ORDER_ATOMIC];
};

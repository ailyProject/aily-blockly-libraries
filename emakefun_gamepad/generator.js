/**
 * Emakefun Gamepad Library Generator
 * @description 代码生成器 - 将积木块转换为Arduino代码
 */

'use strict';

// 手柄按键类型映射
const ButtonTypeMap = {
  '0': 'emakefun::GamepadModel::kButtonJoystick',
  '1': 'emakefun::GamepadModel::kButtonL',
  '2': 'emakefun::GamepadModel::kButtonR',
  '3': 'emakefun::GamepadModel::kButtonSelect',
  '4': 'emakefun::GamepadModel::kButtonMode',
  '5': 'emakefun::GamepadModel::kButtonA',
  '6': 'emakefun::GamepadModel::kButtonB',
  '7': 'emakefun::GamepadModel::kButtonC',
  '8': 'emakefun::GamepadModel::kButtonD'
};

// ========== 手柄初始化块 ==========
Arduino.forBlock['emakefun_gamepad_initialize'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'gamepad';
    registerVariableToBlockly(block._varLastName, 'Gamepad');
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
          renameVariableInBlockly(block, oldName, newName, 'Gamepad');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'gamepad';
  const enableGyro = block.getFieldValue('ENABLE_GYRO') === 'true';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addVariable(varName, 'emakefun::Gamepad ' + varName + ';');
  registerVariableToBlockly(varName, 'Gamepad');

  // 添加loop中的Tick调用
  generator.addLoopBegin(varName + '.Tick();', varName + '.Tick();');

  // 生成setup代码
  let code = varName + '.Initialize();\n';
  code += varName + '.EnableGyroscope(' + (enableGyro ? 'true' : 'false') + ');\n';

  return code;
};

// ========== 手柄模型创建块 ==========
Arduino.forBlock['emakefun_gamepad_model_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'gamepadModel';
    registerVariableToBlockly(block._varLastName, 'GamepadModel');
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
          renameVariableInBlockly(block, oldName, newName, 'GamepadModel');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'gamepadModel';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addVariable(varName, 'emakefun::GamepadModel ' + varName + ';');
  registerVariableToBlockly(varName, 'GamepadModel');

  return '';
};

// ========== 手柄绑定模型块 ==========
Arduino.forBlock['emakefun_gamepad_attach_model'] = function(block, generator) {
  const gamepadField = block.getField('GAMEPAD');
  const gamepadName = gamepadField ? gamepadField.getText() : 'gamepad';
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return gamepadName + '.AttachModel(&' + modelName + ');\n';
};

// ========== 模型添加观察者块 ==========
Arduino.forBlock['emakefun_gamepad_model_add_observer'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';
  const observerField = block.getField('OBSERVER');
  const observerName = observerField ? observerField.getText() : 'publisher';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return modelName + '.AddObserver(&' + observerName + ');\n';
};

// ========== 按键按下事件块 ==========
Arduino.forBlock['emakefun_gamepad_button_pressed'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';
  const button = block.getFieldValue('BUTTON');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const buttonType = ButtonTypeMap[button];
  const callbackName = 'gamepad_button_pressed_' + modelName + '_' + button;

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  // 生成回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  // 在loop中添加检查代码
  const checkCode = 'if (' + modelName + '.ButtonPressed(' + buttonType + ')) {\n  ' + callbackName + '();\n}\n';
  generator.addLoopBegin(checkCode, callbackName);

  return '';
};

// ========== 按键释放事件块 ==========
Arduino.forBlock['emakefun_gamepad_button_released'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';
  const button = block.getFieldValue('BUTTON');
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const buttonType = ButtonTypeMap[button];
  const callbackName = 'gamepad_button_released_' + modelName + '_' + button;

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  // 生成回调函数
  const functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  // 在loop中添加检查代码
  const checkCode = 'if (' + modelName + '.ButtonReleased(' + buttonType + ')) {\n  ' + callbackName + '();\n}\n';
  generator.addLoopBegin(checkCode, callbackName);

  return '';
};

// ========== 获取按键状态块 ==========
Arduino.forBlock['emakefun_gamepad_get_button_state'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';
  const button = block.getFieldValue('BUTTON');
  const buttonType = ButtonTypeMap[button];

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetButtonState(' + buttonType + ')', generator.ORDER_ATOMIC];
};

// ========== 获取摇杆X值块 ==========
Arduino.forBlock['emakefun_gamepad_get_joystick_x'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetJoystickCoordinate().x', generator.ORDER_ATOMIC];
};

// ========== 获取摇杆Y值块 ==========
Arduino.forBlock['emakefun_gamepad_get_joystick_y'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetJoystickCoordinate().y', generator.ORDER_ATOMIC];
};

// ========== 获取重力加速度X值块 ==========
Arduino.forBlock['emakefun_gamepad_get_gravity_x'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetGravityAcceleration().x', generator.ORDER_ATOMIC];
};

// ========== 获取重力加速度Y值块 ==========
Arduino.forBlock['emakefun_gamepad_get_gravity_y'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetGravityAcceleration().y', generator.ORDER_ATOMIC];
};

// ========== 获取重力加速度Z值块 ==========
Arduino.forBlock['emakefun_gamepad_get_gravity_z'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.GetGravityAcceleration().z', generator.ORDER_ATOMIC];
};

// ========== 检查摇杆坐标改变块 ==========
Arduino.forBlock['emakefun_gamepad_new_joystick_coordinate'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.NewJoystickCoordinate()', generator.ORDER_ATOMIC];
};

// ========== 检查重力加速度改变块 ==========
Arduino.forBlock['emakefun_gamepad_new_gravity_acceleration'] = function(block, generator) {
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return [modelName + '.NewGravityAcceleration()', generator.ORDER_ATOMIC];
};

// ========== 创建RF24发送器块 ==========
Arduino.forBlock['emakefun_gamepad_publisher_rf24_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'publisher';
    registerVariableToBlockly(block._varLastName, 'GamepadPublisherRf24');
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
          renameVariableInBlockly(block, oldName, newName, 'GamepadPublisherRf24');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'publisher';
  const cePin = generator.valueToCode(block, 'CE_PIN', generator.ORDER_ATOMIC) || '7';
  const csPin = generator.valueToCode(block, 'CS_PIN', generator.ORDER_ATOMIC) || '8';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '115';
  const addrWidth = generator.valueToCode(block, 'ADDR_WIDTH', generator.ORDER_ATOMIC) || '5';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0x0011000011LL';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addLibrary('RF24', '#include <RF24.h>');
  generator.addVariable(varName, 'emakefun::GamepadPublisherRf24 ' + varName + '(' + cePin + ', ' + csPin + ');');
  registerVariableToBlockly(varName, 'GamepadPublisherRf24');

  return varName + '.Initialize(' + channel + ', ' + addrWidth + ', ' + address + ');\n';
};

// ========== 创建RF24接收器块 ==========
Arduino.forBlock['emakefun_gamepad_subscriber_rf24_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'subscriber';
    registerVariableToBlockly(block._varLastName, 'GamepadSubscriberRf24');
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
          renameVariableInBlockly(block, oldName, newName, 'GamepadSubscriberRf24');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'subscriber';
  const cePin = generator.valueToCode(block, 'CE_PIN', generator.ORDER_ATOMIC) || '7';
  const csPin = generator.valueToCode(block, 'CS_PIN', generator.ORDER_ATOMIC) || '8';
  const channel = generator.valueToCode(block, 'CHANNEL', generator.ORDER_ATOMIC) || '115';
  const addrWidth = generator.valueToCode(block, 'ADDR_WIDTH', generator.ORDER_ATOMIC) || '5';
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0x0011000011LL';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addLibrary('RF24', '#include <RF24.h>');
  generator.addVariable(varName, 'emakefun::GamepadSubscriberRf24 ' + varName + '(' + cePin + ', ' + csPin + ');');
  registerVariableToBlockly(varName, 'GamepadSubscriberRf24');

  // 添加loop中的Tick调用
  generator.addLoopBegin(varName + '.Tick();', varName + '.Tick();');

  return varName + '.Initialize(' + channel + ', ' + addrWidth + ', ' + address + ');\n';
};

// ========== RF24接收器绑定模型块 ==========
Arduino.forBlock['emakefun_gamepad_subscriber_rf24_attach_model'] = function(block, generator) {
  const subscriberField = block.getField('SUBSCRIBER');
  const subscriberName = subscriberField ? subscriberField.getText() : 'subscriber';
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return subscriberName + '.AttachModel(&' + modelName + ');\n';
};

// ========== 创建BLE发送器块 ==========
Arduino.forBlock['emakefun_gamepad_publisher_ble_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'publisher';
    registerVariableToBlockly(block._varLastName, 'GamepadPublisherBle');
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
          renameVariableInBlockly(block, oldName, newName, 'GamepadPublisherBle');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'publisher';
  const serialPort = block.getFieldValue('SERIAL') || 'Serial';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addVariable(varName, 'emakefun::GamepadPublisherBle ' + varName + ';');
  registerVariableToBlockly(varName, 'GamepadPublisherBle');

  return varName + '.Initialize(' + serialPort + ');\n';
};

// ========== 创建BLE接收器块 ==========
Arduino.forBlock['emakefun_gamepad_subscriber_ble_create'] = function(block, generator) {
  // 变量重命名监听
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'subscriber';
    registerVariableToBlockly(block._varLastName, 'GamepadSubscriberBle');
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
          renameVariableInBlockly(block, oldName, newName, 'GamepadSubscriberBle');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'subscriber';
  const serialPort = block.getFieldValue('SERIAL') || 'Serial';

  // 添加库和变量
  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');
  generator.addVariable(varName, 'emakefun::GamepadSubscriberBle ' + varName + ';');
  registerVariableToBlockly(varName, 'GamepadSubscriberBle');

  // 添加loop中的Tick调用
  generator.addLoopBegin(varName + '.Tick();', varName + '.Tick();');

  return varName + '.Initialize(' + serialPort + ');\n';
};

// ========== BLE接收器绑定模型块 ==========
Arduino.forBlock['emakefun_gamepad_subscriber_ble_attach_model'] = function(block, generator) {
  const subscriberField = block.getField('SUBSCRIBER');
  const subscriberName = subscriberField ? subscriberField.getText() : 'subscriber';
  const modelField = block.getField('MODEL');
  const modelName = modelField ? modelField.getText() : 'gamepadModel';

  generator.addLibrary('emakefun_gamepad', '#include <gamepad.h>');

  return subscriberName + '.AttachModel(&' + modelName + ');\n';
};

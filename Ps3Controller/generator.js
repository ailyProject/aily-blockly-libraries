'use strict';

// PS3 Controller Library Generator for Aily Platform

// ========== PS3手柄初始化 ==========
Arduino.forBlock['ps3_init'] = function(block, generator) {
  const macAddr = generator.valueToCode(block, 'MAC_ADDR', Arduino.ORDER_ATOMIC) || '"a0:5a:5a:a0:10:09"';
  
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  //串口初始化
  ensureSerialBegin('Serial', generator);//原波特率115200，改为默认9600

  generator.addFunction('ps3_notify', 'void ps3_notify() {}');
  generator.addFunction('ps3_onConnect', 'void ps3_onConnect() {\n  Serial.println("PS3 Controller Connected");\n}');
  
  generator.addSetup('ps3_init', `Ps3.attach(ps3_notify);\nPs3.attachOnConnect(ps3_onConnect);\nPs3.begin(${macAddr});\nSerial.println("PS3 Controller Ready");`);
  
  return '';
};

// ========== PS3按键检测 ==========
Arduino.forBlock['ps3_button_pressed'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  const button = block.getFieldValue('BUTTON');
  const code = `Ps3.data.button.${button}`;
  return [code, Arduino.ORDER_MEMBER];
};

// ========== PS3摇杆值 ==========
Arduino.forBlock['ps3_stick_value'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  const stick = block.getFieldValue('STICK');
  const axis = block.getFieldValue('AXIS');
  const code = `Ps3.data.analog.stick.${stick}${axis}`;
  return [code, Arduino.ORDER_MEMBER];
};

// ========== PS3连接状态 ==========
Arduino.forBlock['ps3_is_connected'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  const code = `Ps3.isConnected()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== PS3震动控制 ==========
Arduino.forBlock['ps3_set_rumble'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  const intensity = generator.valueToCode(block, 'INTENSITY', Arduino.ORDER_ATOMIC) || '50';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '1000';
  
  return `Ps3.setRumble(${intensity}, ${duration});\n`;
};

// ========== PS3玩家编号设置 ==========
Arduino.forBlock['ps3_set_player'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  
  const player = block.getFieldValue('PLAYER');
  return `Ps3.setPlayer(${player});\n`;
};

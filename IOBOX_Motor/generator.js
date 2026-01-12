'use strict';

// 智能板卡适配函数
function ensureIOBOXLib(generator) {
  // 获取开发板配置
  const boardConfig = window['boardConfig'];

  // IOBOX_Motor库适用于所有支持I2C的开发板
  // 包括microbit、microbitV2、mpython、ESP32系列
  if (boardConfig && boardConfig.core) {
    const supportedCores = ['mpython', 'microbit', 'microbitV2', 'esp32:esp32:esp32', 'esp32:esp32:esp32s3'];
    const isSupported = supportedCores.some(core => boardConfig.core.indexOf(core) > -1);
    
    if (isSupported) {
      // 根据开发板类型选择合适的Wire库
      if (boardConfig.core.indexOf('esp32') > -1) {
        generator.addLibrary('Wire', '#include <Wire.h>');
      } else if (boardConfig.core.indexOf('microbit') > -1 || boardConfig.core.indexOf('mpython') > -1) {
        generator.addLibrary('Wire', '#include <Wire.h>');
      }
    }
  } else {
    // 默认使用标准Wire库
    generator.addLibrary('Wire', '#include <Wire.h>');
  }

  // 添加IOBOX_Motor库
  generator.addLibrary('IOBOX_Motor', '#include <IOBOX_Motor.h>');
}

// 初始化IOBOX电机驱动
Arduino.forBlock['iobox_motor_init'] = function(block, generator) {
  // 确保库引用正确
  ensureIOBOXLib(generator);
  
  // 添加全局对象声明
  generator.addObject('IOBOX_Motor motor', 'IOBOX_Motor motor;');
  
  // 注册全局对象到Blockly（用于类型检查和提示）
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly('motor', 'IOBOX_Motor');
  }
  
  // 注意：IOBOX_Motor库使用固定的全局对象名"motor"，不需要变量重命名监听机制
  // 如果需要添加调试输出，请确保在setup()中调用Serial.begin(115200);
  
  return '';
};

// IOBOX电机运行
Arduino.forBlock['iobox_motor_run'] = function(block, generator) {
  var index = block.getFieldValue('INDEX');
  var direction = block.getFieldValue('DIRECTION');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '255';

  // 添加速度范围限制（0-255）
  var code = 'motor.motorRun(' + index + ', ' + direction + ', constrain(' + speed + ', 0, 255));\n';

  return code;
};

// IOBOX电机停止
Arduino.forBlock['iobox_motor_stop'] = function(block, generator) {
  var index = block.getFieldValue('INDEX');

  var code = 'motor.motorStop(' + index + ');\n';

  return code;
};

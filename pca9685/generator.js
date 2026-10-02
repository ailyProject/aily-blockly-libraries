/**
 * PCA9685 电机/舵机库 - 代码生成器
 *
 * 引脚分配：
 *   LED0~LED7  -> 4 路直流电机（M1~M4，每路占用 2 个通道）
 *   LED8~LED15 -> 8 路舵机（S1~S8，每个占用 1 个通道）
 */

/* 确保库引用与对象存在（tag 相同，可自动去重，避免重复添加） */
Arduino.pca9685EnsureBase = function (generator) {
  generator.addLibrary('pca9685_lib', '#include <PCA9685.h>');
  generator.addObject('pca9685_obj', 'PCA9685 pca9685;');
};

/* 在工作区中查找“自定义 I2C 引脚”配置积木，返回其引脚值 */
Arduino.pca9685FindI2CPins = function (block) {
  try {
    const blocks = block.workspace.getAllBlocks(false);
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'pca9685_i2c_pins') {
        return {
          sda: blocks[i].getFieldValue('SDA'),
          scl: blocks[i].getFieldValue('SCL')
        };
      }
    }
  } catch (e) {
    /* 忽略，回退到默认 I2C 引脚 */
  }
  return null;
};

Arduino.forBlock['pca9685_init'] = function (block, generator) {
  const addr = block.getFieldValue('ADDR');
  const freq = block.getFieldValue('FREQ');

  Arduino.pca9685EnsureBase(generator);
  generator.addLibrary('pca9685_wire', '#include <Wire.h>');

  const pins = Arduino.pca9685FindI2CPins(block);
  const wireBegin = pins
    ? 'Wire.begin(' + pins.sda + ', ' + pins.scl + ');'
    : 'Wire.begin();';

  generator.addSetupBegin('pca9685_wire_begin', wireBegin);
  generator.addSetupBegin(
    'pca9685_begin',
    'pca9685.begin(' + addr + ');\n' +
    'pca9685.setPWMFreq(' + freq + ');'
  );
  return '';
};

/* 该积木仅作为初始化积木的配置项，本身不生成代码 */
Arduino.forBlock['pca9685_i2c_pins'] = function (block, generator) {
  return '';
};

Arduino.forBlock['pca9685_motor_set'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  const motor = block.getFieldValue('MOTOR');
  const speed = block.getFieldValue('SPEED');
  return 'pca9685.setMotor(' + motor + ', ' + speed + ');\n';
};

Arduino.forBlock['pca9685_motor_stop'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  return 'pca9685.stopMotor(' + block.getFieldValue('MOTOR') + ');\n';
};

Arduino.forBlock['pca9685_motor_stop_all'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  return 'pca9685.stopAllMotors();\n';
};

Arduino.forBlock['pca9685_servo_write'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  const servo = block.getFieldValue('SERVO');
  const angle = block.getFieldValue('ANGLE');
  return 'pca9685.setServoAngle(' + servo + ', ' + angle + ');\n';
};

Arduino.forBlock['pca9685_servo_write_us'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  const servo = block.getFieldValue('SERVO');
  const us = block.getFieldValue('US');
  return 'pca9685.setServoPulse(' + servo + ', ' + us + ');\n';
};

Arduino.forBlock['pca9685_servo_range'] = function (block, generator) {
  Arduino.pca9685EnsureBase(generator);
  const minUs = block.getFieldValue('MIN_US');
  const maxUs = block.getFieldValue('MAX_US');
  return 'pca9685.setServoPulseRange(' + minUs + ', ' + maxUs + ');\n';
};

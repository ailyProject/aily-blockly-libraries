/**
 * 舵机库代码生成器
 */

// 用于跟踪已初始化的舵机引脚
Arduino.servoInitialized = {};

Arduino.forBlock['esp8266_servo_write'] = function (block, generator) {
    // 获取舵机引脚和角度值
    var pin = block.getFieldValue('PIN');
    var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';

    // 添加Servo库引用
    generator.addLibrary('Servo', '#include <Servo.h>');

    // 为每个引脚创建一个舵机对象
    var servoName = 'esp8266_servo_' + pin;
    generator.addObject(servoName, 'Servo ' + servoName + ';');

    // 确保舵机在setup中初始化（只初始化一次）
    generator.addSetupBegin('esp8266_servo_' + pin, servoName + '.attach(' + pin + ');');

    // 生成控制舵机角度的代码
    var code = servoName + '.write(' + angle + ');\n';
    return code;
};

Arduino.forBlock['esp8266_servo_read'] = function (block, generator) {
    // 获取舵机引脚
    var pin = block.getFieldValue('PIN');

    // 添加Servo库引用
    generator.addLibrary('Servo', '#include <Servo.h>');

    // 为每个引脚创建一个舵机对象
    var servoName = 'esp8266_servo_' + pin;
    generator.addObject(servoName, 'Servo ' + servoName + ';');

    generator.addSetupBegin('esp8266_servo_' + pin, servoName + '.attach(' + pin + ');');

    // 生成读取舵机角度的代码
    var code = servoName + '.read()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp8266_servo_angle'] = function (block, generator) {
    // 获取角度值
    var angle = block.getFieldValue('ANGLE');
    return [angle, generator.ORDER_ATOMIC];
};
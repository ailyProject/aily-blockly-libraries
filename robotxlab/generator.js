/**
 * RobotXlab - Arduino UNO R3 机器人 Blockly 代码生成器
 * 
 * 支持功能：电机控制、舵机、LED、蜂鸣器、超声波、巡线、光敏、
 * 红外避障、红外遥控、PS2手柄
 * 
 * 硬件引脚定义（固定在RobotXlab PCB上）：
 * - 电机0: N1_0=4, N2_0=7, PWM_ENA_0=5
 * - 电机1: N1_1=2, N2_1=8, PWM_ENA_1=6
 * - 舵机: 引脚9
 * - LED/蜂鸣器: 引脚13
 * - 超声波: TRIG=A0(14), ECHO=A1(15)
 * - 用户按键: KEY (内部上拉)
 * - 巡线/光敏/红外: A2~A5
 */

// ============ 机器人硬件定义函数 ============

function ensureRobotDefinitions(generator) {
  generator.addVariable('robotxlab_pin_defs', [
    '// RobotXlab 电机引脚定义',
    '#define N1_0 4',
    '#define N2_0 7',
    '#define PWM_ENA_0 5',
    '#define N1_1 2',
    '#define N2_1 8',
    '#define PWM_ENA_1 6'
  ].join('\n'));

  generator.addFunction('robotxlab_run', [
    'void run(int motor, int speed) {',
    '  int n1, n2, pwm;',
    '  if (motor == 0) { n1 = N1_0; n2 = N2_0; pwm = PWM_ENA_0; }',
    '  else { n1 = N1_1; n2 = N2_1; pwm = PWM_ENA_1; }',
    '  if (speed > 0) {',
    '    digitalWrite(n1, HIGH);',
    '    digitalWrite(n2, LOW);',
    '    analogWrite(pwm, speed);',
    '  } else if (speed < 0) {',
    '    digitalWrite(n1, LOW);',
    '    digitalWrite(n2, HIGH);',
    '    analogWrite(pwm, -speed);',
    '  } else {',
    '    digitalWrite(n1, LOW);',
    '    digitalWrite(n2, LOW);',
    '    analogWrite(pwm, 0);',
    '  }',
    '}'
  ].join('\n'));
}

function ensureMotorSetup(generator, motor) {
  ensureRobotDefinitions(generator);
  generator.addSetupBegin('motor_' + motor + '_pins', [
    'pinMode(N1_' + motor + ', OUTPUT);',
    'pinMode(N2_' + motor + ', OUTPUT);',
    'pinMode(PWM_ENA_' + motor + ', OUTPUT);'
  ].join('\n  '));
}

function ensureServoPulseFunction(generator) {
  generator.addVariable('robotxlab_servopin', 'int servopin = 9;');
  generator.addFunction('robotxlab_servopulse', [
    'void servopulse(int angle) {',
    '  int pulsewidth = (angle * 11) + 500;',
    '  digitalWrite(servopin, HIGH);',
    '  delayMicroseconds(pulsewidth);',
    '  digitalWrite(servopin, LOW);',
    '  delayMicroseconds(20000 - pulsewidth);',
    '}'
  ].join('\n'));
  generator.addSetupBegin('robotxlab_servopin_mode', 'pinMode(servopin, OUTPUT);');
}

function ensureIRRemote(generator) {
  generator.addLibrary('IRremote', '#include <IRremote.h>');
  generator.addVariable('robotxlab_ir_defs', [
    '// RobotXlab 红外遥控键值定义',
    '#define IR_0 0',
    '#define IR_1 1',
    '#define IR_2 2',
    '#define IR_3 3',
    '#define IR_4 4',
    '#define IR_5 5',
    '#define IR_6 6',
    '#define IR_7 7',
    '#define IR_8 8',
    '#define IR_9 9',
    '#define IR_10 10',
    '#define IR_11 11',
    '#define IR_12 12',
    '#define IR_13 13',
    '#define IR_14 14',
    '#define IR_15 15',
    '#define IR_16 16'
  ].join('\n'));
  generator.addVariable('robotxlab_irrecv', 'IRrecv irrecv(11);');
  generator.addVariable('robotxlab_ir_results', 'decode_results results;');
  generator.addVariable('robotxlab_ir_last_key', 'int lastIRKey = -1;');

  generator.addFunction('robotxlab_Get_IRremote', [
    'int Get_IRremote() {',
    '  if (irrecv.decode(&results)) {',
    '    unsigned long val = results.value;',
    '    irrecv.resume();',
    '    // 根据NEC编码映射',
    '    switch(val) {',
    '      case 0xFF6897: return 0;',
    '      case 0xFF30CF: return 1;',
    '      case 0xFF18E7: return 2;',
    '      case 0xFF7A85: return 3;',
    '      case 0xFF10EF: return 4;',
    '      case 0xFF38C7: return 5;',
    '      case 0xFF5AA5: return 6;',
    '      case 0xFF42BD: return 7;',
    '      case 0xFF4AB5: return 8;',
    '      case 0xFF52AD: return 9;',
    '      case 0xFF22DD: return 10; // *',
    '      case 0xFF02FD: return 11; // #',
    '      case 0xFF629D: return 12; // up',
    '      case 0xFF22DD: return 13; // left',
    '      case 0xFF02FD: return 14; // ok',
    '      case 0xFFC23D: return 15; // right',
    '      case 0xFFA857: return 16; // down',
    '      default: return -1;',
    '    }',
    '  }',
    '  return -1;',
    '}'
  ].join('\n'));

  generator.addSetupBegin('robotxlab_ir_enable', 'irrecv.enableIRIn();');
}

function ensurePS2(generator) {
  generator.addVariable('robotxlab_ps2_key', 'int ps2_key = -1;');
  generator.addFunction('robotxlab_Get_PS2_key', [
    'int Get_PS2_key() {',
    '  if (Serial.available() > 0) {',
    '    int val = Serial.parseInt();',
    '    if (val > 0) return val;',
    '  }',
    '  return -1;',
    '}'
  ].join('\n'));
  generator.addFunction('robotxlab_Get_PS2_rocker', [
    'int Get_PS2_rocker(int rocker, int direction) {',
    '  // 摇杆模拟值读取',
    '  // rocker: 0=左, 1=右',
    '  // direction: 0=前后轴值, 1=左右轴值, -1=无',
    '  if (direction == -1) return 0;',
    '  if (Serial.available() > 0) {',
    '    return Serial.parseInt();',
    '  }',
    '  return 0;',
    '}'
  ].join('\n'));
  generator.addSetupBegin('robotxlab_serial_begin', 'Serial.begin(9600);');
}

function ensureButtonFunction(generator) {
  generator.addVariable('robotxlab_key_pin', '#define KEY A6');
  generator.addFunction('robotxlab_My_click', [
    'int My_click() {',
    '  if (analogRead(KEY) < 100) {',
    '    delay(20);',
    '    if (analogRead(KEY) < 100) return 1;',
    '  }',
    '  return 0;',
    '}'
  ].join('\n'));
  generator.addSetupBegin('robotxlab_key_input', 'pinMode(KEY, INPUT_PULLUP);');
}

// ============ 电机控制 ============

Arduino.forBlock['robotxlab_motor'] = function(block, generator) {
  var motor = block.getFieldValue('DIRECTION');
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  
  ensureMotorSetup(generator, motor);
  
  return 'run(' + motor + ', ' + speed + ');\n';
};

// ============ 舵机控制（Servo库） ============

Arduino.forBlock['robotxlab_servo'] = function(block, generator) {
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  generator.addLibrary('Servo', '#include <Servo.h>');
  generator.addObject('robotxlab_myservo', 'Servo myservo;');
  generator.addVariable('robotxlab_servo_val', 'unsigned int val;');
  generator.addSetupBegin('robotxlab_servo_attach', 'myservo.attach(9);');
  
  return 'myservo.write(' + angle + ');\n';
};

// ============ 舵机控制（脉冲方式） ============

Arduino.forBlock['robotxlab_servo_pulse'] = function(block, generator) {
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '90';
  
  ensureServoPulseFunction(generator);
  
  return 'servopulse(' + angle + ');\n';
};

// ============ LED控制 ============

Arduino.forBlock['robotxlab_led'] = function(block, generator) {
  var state = block.getFieldValue('STATE');
  
  generator.addVariable('robotxlab_led_pin', 'int led = 13;');
  generator.addSetupBegin('robotxlab_led_mode', 'pinMode(led, OUTPUT);');
  
  return 'digitalWrite(led, ' + state + ');\n';
};

// ============ 蜂鸣器控制 ============

Arduino.forBlock['robotxlab_buzzer'] = function(block, generator) {
  var state = block.getFieldValue('STATE');
  
  generator.addVariable('robotxlab_buzz_pin', 'int buzz = 13;');
  generator.addSetupBegin('robotxlab_buzz_mode', 'pinMode(buzz, OUTPUT);');
  
  return 'digitalWrite(buzz, ' + state + ');\n';
};

// ============ 超声波测距 ============

Arduino.forBlock['robotxlab_ultrasonic'] = function(block, generator) {
  generator.addLibrary('SR04', '#include <SR04.h>');
  generator.addVariable('robotxlab_sr04_defs', [
    '#define TRIG_PIN 14',
    '#define ECHO_PIN 15'
  ].join('\n'));
  generator.addObject('robotxlab_sr04', 'SR04 sr04 = SR04(ECHO_PIN, TRIG_PIN);');
  
  return ['sr04.Distance()', generator.ORDER_FUNCTION_CALL];
};

// ============ 用户按键 ============

Arduino.forBlock['robotxlab_button'] = function(block, generator) {
  var state = block.getFieldValue('STATE');
  
  ensureButtonFunction(generator);
  
  return ['My_click() == ' + state, generator.ORDER_EQUALITY];
};

// ============ 巡线传感器 ============

Arduino.forBlock['robotxlab_line_tracking'] = function(block, generator) {
  var port = block.getFieldValue('PORT');
  var value = block.getFieldValue('VALUE');
  
  generator.addVariable('robotxlab_sensor_' + port, 'const int Sensor_' + port + ' = A' + port + ';');
  generator.addSetupBegin('robotxlab_sensor_' + port + '_mode', 'pinMode(Sensor_' + port + ', INPUT);');
  
  return ['digitalRead(Sensor_' + port + ') == ' + value, generator.ORDER_EQUALITY];
};

// ============ 光敏传感器（模拟值） ============

Arduino.forBlock['robotxlab_light_analog'] = function(block, generator) {
  var port = block.getFieldValue('PORT');
  
  generator.addVariable('robotxlab_light_' + port, 'const int LightSensor_' + port + ' = A' + port + ';');
  
  return ['analogRead(LightSensor_' + port + ')', generator.ORDER_FUNCTION_CALL];
};

// ============ 光敏传感器（数字值） ============

Arduino.forBlock['robotxlab_light_digital'] = function(block, generator) {
  var port = block.getFieldValue('PORT');
  var value = block.getFieldValue('VALUE');
  
  generator.addVariable('robotxlab_light_' + port, 'const int LightSensor_' + port + ' = A' + port + ';');
  generator.addSetupBegin('robotxlab_light_' + port + '_mode', 'pinMode(LightSensor_' + port + ', INPUT);');
  
  return ['digitalRead(LightSensor_' + port + ') == ' + value, generator.ORDER_EQUALITY];
};

// ============ 红外避障传感器 ============

Arduino.forBlock['robotxlab_ir_obstacle'] = function(block, generator) {
  var port = block.getFieldValue('PORT');
  var value = block.getFieldValue('VALUE');
  
  generator.addVariable('robotxlab_red_' + port, 'const int RedSensor_' + port + ' = A' + port + ';');
  generator.addSetupBegin('robotxlab_red_' + port + '_mode', 'pinMode(RedSensor_' + port + ', INPUT);');
  
  return ['digitalRead(RedSensor_' + port + ') == ' + value, generator.ORDER_EQUALITY];
};

// ============ 红外遥控器 ============

Arduino.forBlock['robotxlab_ir_remote'] = function(block, generator) {
  var key = block.getFieldValue('KEY');
  
  ensureIRRemote(generator);
  
  return ['Get_IRremote() == IR_' + key, generator.ORDER_EQUALITY];
};

// ============ PS2手柄按键 ============

Arduino.forBlock['robotxlab_ps2_button'] = function(block, generator) {
  var key = block.getFieldValue('KEY');
  
  ensurePS2(generator);
  
  generator.addVariable('robotxlab_sp2key_defs', [
    '#define SP2Key_1 1',
    '#define SP2Key_2 2',
    '#define SP2Key_3 3',
    '#define SP2Key_4 4',
    '#define SP2Key_5 5',
    '#define SP2Key_6 6',
    '#define SP2Key_7 7',
    '#define SP2Key_8 8',
    '#define SP2Key_9 9',
    '#define SP2Key_10 10',
    '#define SP2Key_11 11',
    '#define SP2Key_12 12',
    '#define SP2Key_13 13',
    '#define SP2Key_14 14',
    '#define SP2Key_15 15',
    '#define SP2Key_16 16',
    '#define SP2Key_17 17'
  ].join('\n'));
  
  return ['Get_PS2_key() == SP2Key_' + key, generator.ORDER_EQUALITY];
};

// ============ PS2手柄摇杆 ============

Arduino.forBlock['robotxlab_ps2_rocker'] = function(block, generator) {
  var rocker = block.getFieldValue('ROCKER');
  var dir = block.getFieldValue('DIR');
  
  ensurePS2(generator);
  
  return ['Get_PS2_rocker(' + rocker + ', ' + dir + ')', generator.ORDER_FUNCTION_CALL];
};

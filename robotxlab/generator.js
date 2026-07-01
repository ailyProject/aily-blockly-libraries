/**
 * RobotXlab - Arduino UNO R3 机器人 Blockly 代码生成器
 * 
 * 支持功能：电机控制、舵机、LED、蜂鸣器、
 * 超声波、巡线、光敏、红外避障、
 * 红外遥控、PS2手柄
 * 
 * 硬件引脚定义（固定在RobotXlab PCB上）：
 * - 电机0: N1_0=4, N2_0=11, PWM_ENA_0=5
 * - 电机1: N1_1=6, N2_1=12, PWM_ENA_1=10
 * - 舵机: 引脚9
 * - LED/蜂鸣器: 引脚13
 * - 超声波: TRIG=A0(14), ECHO=A1(15)
 * - 用户按键: KEY (内部上拉)，引脚8
 * - 巡线/光敏/红外: A2~A5
 */

// ============ 电机引脚定义函数 ============

function ensureRobotDefinitions(generator) {
  generator.addVariable('robotxlab_pin_defs', [
    '// RobotXlab 电机引脚定义',
    '#define N1_0 4',
    '#define N2_0 11',
    '#define PWM_ENA_0 5',
    '#define N1_1 6',
    '#define N2_1 12',
    '#define PWM_ENA_1 10'
  ].join('\n'));

  generator.addFunction('robotxlab_run', [
    'void run(int motor, int speed) {',
    '  int n1, n2, pwm;',
    '  if (motor == 0) { n1 = N1_0; n2 = N2_0; pwm = PWM_ENA_0; }',
    '  else { n1 = N1_1; n2 = N2_1; pwm = PWM_ENA_1; }',
    '  speed = constrain(speed, -255, 255);',
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
// ============ 在Setup里面初始化电机引脚============
function ensureMotorSetup(generator, motor) {
  ensureRobotDefinitions(generator);
  generator.addSetupBegin('motor_' + motor + '_pins', [
    'pinMode(N1_' + motor + ', OUTPUT);',
    'pinMode(N2_' + motor + ', OUTPUT);',
    'pinMode(PWM_ENA_' + motor + ', OUTPUT);'
  ].join('\n  '));
}

// ============ 设定舵机引脚和舵机脉冲函数============
function ensureServoPulseFunction(generator) {
  generator.addVariable('robotxlab_servopin', 'const int servopin = 9;');
  generator.addFunction('robotxlab_servopulse', [
    'void servopulse(int angle) {',
    '  int pulsewidth_MIN=880;',
    '  int pulsewidth_MAX=2500;',
    '  int pulsewidth=angle*((pulsewidth_MAX-pulsewidth_MIN)/180)+pulsewidth_MIN;',
    '  digitalWrite(servopin, HIGH);',
    '  delayMicroseconds(pulsewidth);',
    '  digitalWrite(servopin, LOW);',
    '  delayMicroseconds(20000-pulsewidth);',
    '}'
  ].join('\n'));
  generator.addSetupBegin('robotxlab_servopin_mode', 'pinMode(servopin, OUTPUT);');
}

// ============ 设定红外遥控器按键数值 ============
function ensureIRRemote(generator) {
  generator.addLibrary('IRremote', '#include <IRremote.h>');
  generator.addVariable('robotxlab_ir_defs', [
    '// RobotXlab 红外遥控键值定义',
    'float IR_0 =  16750695;',
    'float IR_1 = 16753245;',
    'float IR_2 = 16736925;',
    'float IR_3 = 16769565;',
    'float IR_4 = 16720605;',
    'float IR_5 = 16712445;',
    'float IR_6 = 16761405;',
    'float IR_7 = 16769055;',
    'float IR_8 = 16754775;',
    'float IR_9 = 16748655;',
    'float IR_10=16738455;',
    'float IR_11=16756815;',
    'float IR_12=16718055;',
    'float IR_13=16716015;',
    'float IR_14=16726215;',
    'float IR_15=16734885;',
    'float IR_16=16730805;'
   ].join('\n'));
  generator.addVariable('robotxlab_RECV_PIN', 'const int RECV_PIN = 2;');
  generator.addVariable('robotxlab_irrecv', 'IRrecv irrecv(RECV_PIN);');
  generator.addVariable('robotxlab_ir_results', 'decode_results results;');
  generator.addVariable('robotxlab_ir_flag_ir', 'float flag_ir;');

// ============读取红外遥控按键值============
  generator.addFunction('robotxlab_Get_IRremote', [
    'float Get_IRremote() {',
    ' float i;',
    '  if (irrecv.decode(&results)) {',
      '   if(results.value == IR_1 || results.value == IR_2 || results.value == IR_3 || results.value == IR_4 || results.value == IR_5 || results.value == IR_6 || results.value == IR_7 || results.value == IR_8 || results.value == IR_9 || results.value == IR_10 || results.value == IR_0 || results.value == IR_11 || results.value == IR_12 || results.value == IR_13 || results.value == IR_14 || results.value == IR_15 || results.value == IR_16){ ',
         ' flag_ir=results.value;',
         ' i=results.value;',
        '}',
       ' irrecv.resume();',
       ' return i;',
      '}',
     'return flag_ir;',
    '}'
  ].join('\n'));


  generator.addSetupBegin('robotxlab_ir_enable', 'irrecv.enableIRIn();');
}

function ensurePS2(generator) {
  generator.addVariable('robotxlab_BUFFER_SIZE', '#define BUFFER_SIZE 34');
  generator.addVariable('robotxlab_comdate', 'char comdate[BUFFER_SIZE];');
  generator.addVariable('robotxlab_speeds', 'unsigned int speeds[4] = {0,0,0,0};');
  generator.addVariable('robotxlab_newData', 'bool newData = false;');
  generator.addVariable('robotxlab_returnval', "char returnval = '0';");

  generator.addSetupBegin('robotxlab_serial_begin', 'Serial.begin(9600);');
  generator.addSetupBegin('robotxlab_memset', 'memset(comdate, 0, BUFFER_SIZE);');

  generator.addFunction('robotxlab_readSerialData', [
    'void readSerialData() {',
    '  static byte index = 0;',
    '  while (Serial.available() > 0) {',
    '    char c = Serial.read();',
    "    if (c == '\\n' || c == '\\r') {",
    '      if (index > 0) {',
    '        comdate[index] = \'\\0\';',
    '        newData = true;',
    '        index = 0;',
    '      }',
    '    } else if (index < BUFFER_SIZE - 1) {',
    '      comdate[index++] = c;',
    '    } else {',
    '      index = 0;',
    '    }',
    '  }',
    '}'
  ].join('\n'));

  generator.addFunction('robotxlab_parseJoystickData', [
    'void parseJoystickData() {',
    '  unsigned int sum = 0;',
    '  int a, b, c;',
    '  for (a = 0; a < 4; a++) {',
    "    if (comdate[7 * (a + 1)] == 'T') {",
    '      for (c = 0; c < a + 1; c++) {',
    '        int z = 100;',
    '        sum = 0;',
    '        for (b = 3; b < 6; b++) {',
    "          sum += (((int)comdate[b + c * 7]) - '0') * z;",
    '          z = z / 10;',
    '        }',
    "        int ch = comdate[c * 7 + 1] - '1';",
    '        if (ch >= 0 && ch < 4) {',
    '          speeds[ch] = sum;',
    '        }',
    '      }',
    '      break;',
    '    }',
    '  }',
    '}'
  ].join('\n'));

  generator.addFunction('robotxlab_Get_PS2_key', [
    'char Get_PS2_key() {',
    '  readSerialData();',
    '  if (newData) {',
    '    char cmd = comdate[0];',
    "    if (cmd == '#') {",
    '      parseJoystickData();',
    '    } else if (cmd >= \'A\' && cmd <= \'R\') {',
    '      returnval = cmd;',
    '    }',
    '    newData = false;',
    '  }',
    '  return returnval;',
    '}'
  ].join('\n'));

  generator.addFunction('robotxlab_Get_PS2_rocker', [
    'unsigned int Get_PS2_rocker(int rocker, int direction) {',
    '  readSerialData();',
    '  if (newData) {',
    '    if (comdate[0] == \'#\') {',
    '      parseJoystickData();',
    '    }',
    '    newData = false;',
    '  }',
    '  if (rocker == 0) {',
    '    if (direction == 0) return speeds[2];',
    '    if (direction == 2) return speeds[3];',
    '  }',
    '  if (rocker == 1) {',
    '    if (direction == 0) return speeds[0];',
    '    if (direction == 2) return speeds[1];',
    '  }',
    '  return 0;',
    '}'
  ].join('\n'));
}

// ============ 用户按键函数 ============
function ensureButtonFunction(generator) {
  generator.addVariable('robotxlab_key_pin', '#define KEY 8');
  generator.addFunction('robotxlab_My_click', [
    'unsigned char My_click(void) {',
    '  if (digitalRead(KEY) == 0) {',
    '    delay(5);',
    '    if (digitalRead(KEY) == 0) return 1;',
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
  generator.addVariable('robotxlab_servopin', 'const int servopin = 9;');
  generator.addSetupBegin('robotxlab_servo_attach', 'myservo.attach(servopin);');
  
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

// ============ PS2手柄按键指令和定义键值 ============

Arduino.forBlock['robotxlab_ps2_button'] = function(block, generator) {
  var key = block.getFieldValue('KEY');
  ensurePS2(generator);

  generator.addVariable('robotxlab_sp2key_defs', [
    '// RobotXlab PS2手柄键值定义',
    'char SP2Key_1 = \'A\';',
    'char SP2Key_2 = \'B\';',
    'char SP2Key_3 = \'C\';',
    'char SP2Key_4 = \'D\';',
    'char SP2Key_5 = \'E\';',
    'char SP2Key_6 = \'F\';',
    'char SP2Key_7 = \'G\';',
    'char SP2Key_8 = \'H\';',
    'char SP2Key_9 = \'I\';',
    'char SP2Key_10 = \'J\';',
    'char SP2Key_11 = \'K\';',
    'char SP2Key_12 = \'L\';',
    'char SP2Key_13 = \'M\';',
    'char SP2Key_14 = \'N\';',
    'char SP2Key_15 = \'O\';',
    'char SP2Key_16 = \'P\';',
    'char SP2Key_17 = \'Q\';'
  ].join('\n'));
  return ['Get_PS2_key() == SP2Key_' + key, generator.ORDER_EQUALITY];
};

// ============ PS2手柄摇杆指令 ============

Arduino.forBlock['robotxlab_ps2_rocker'] = function(block, generator) {
  var rocker = block.getFieldValue('ROCKER');
  var dir = block.getFieldValue('DIR');
  
  ensurePS2(generator);
  
  return ['Get_PS2_rocker(' + rocker + ', ' + dir + ')', generator.ORDER_FUNCTION_CALL];
};

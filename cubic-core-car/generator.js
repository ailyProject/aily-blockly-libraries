'use strict';

// ============================================================
// Cubic Core 乐高小车 —— Aily 图形化库
// PS3手柄直连 + I2C四驱 + 编码电机 + 舵机 + 灯 + OLED
// 引脚固定为 Cubic Core 主控；OLED 与 I2C 马达共用总线，
// 采用"电机优先 + OLED分块刷新"仲裁，保证电机实时。
// ============================================================

// 编码电机闭环参数(由 cubic_init 块从其字段读取; 闭环块创建 em 对象时取用)
let cubicClosedCfg = { ppr: '3', red: '48', m0: 'em::EncoderMotor::kBPhaseLeads', m1: 'em::EncoderMotor::kAPhaseLeads' };

// 统一注入：库、全局对象、引脚定义与全部 helper 函数
function cubicEnsureCore(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('ESP32Servo', '#include <ESP32Servo.h>');
  generator.addLibrary('U8g2lib', '#include <U8g2lib.h>');

  generator.addObject('cubic_servos', 'Servo cubicServo1, cubicServo2, cubicServo3, cubicServo4;');
  generator.addObject('cubic_u8g2', 'U8G2_SSD1306_128X64_NONAME_F_HW_I2C cubic_u8g2(U8G2_R0, U8X8_PIN_NONE);');

  generator.addFunction('cubic_core_defs', CUBIC_DEFS);
}

// ADC(板载按键 + 电池电压): 惰性配置 ADC 分辨率与衰减
function cubicEnsureAdc(generator) {
  cubicEnsureCore(generator);
  generator.addSetup('cubic_adc',
    'analogReadResolution(12);\n' +
    'analogSetPinAttenuation(CUBIC_BTN_ADC, ADC_11db);\n' +
    'analogSetPinAttenuation(CUBIC_VBAT_ADC, ADC_11db);');
}

// 舵机: 惰性: 用到舵机块时才分配定时器(attach 由 cubicServoWrite 首次调用时完成)
function cubicEnsureServo(generator) {
  cubicEnsureCore(generator);
  generator.addSetup('cubic_servo_timers',
    'ESP32PWM::allocateTimer(0); ESP32PWM::allocateTimer(1); ESP32PWM::allocateTimer(2); ESP32PWM::allocateTimer(3);');
}

// 开环编码电机(LEDC PWM, 不碰 I2C): 惰性建立 LEDC, 被开环块调用
function cubicEnsureEncLedc(generator) {
  cubicEnsureCore(generator);
  generator.addSetup('cubic_enc_ledc',
    'ledcAttach(CUBIC_ENC_M0_IN1, 1000, 8); ledcAttach(CUBIC_ENC_M0_IN2, 1000, 8);\n' +
    'ledcAttach(CUBIC_ENC_M1_IN1, 1000, 8); ledcAttach(CUBIC_ENC_M1_IN2, 1000, 8);');
}

// 闭环编码电机(em::EncoderMotor, 会占用中断/后台线程, 与 I2C 冲突): 惰性建立, 被闭环块调用
function cubicEnsureEncClosed(generator) {
  cubicEnsureCore(generator);
  generator.addLibrary('encoder_motor', '#include <encoder_motor.h>');
  generator.addLibrary('encoder_motor_lib', '#include <encoder_motor_lib.h>');
  // 引脚固定; PPR/减速比/相位取自 cubic_init 块的参数(cubicClosedCfg)
  const c = cubicClosedCfg;
  generator.addObject('cubic_encM0', 'em::EncoderMotor cubicEncM0(GPIO_NUM_14, GPIO_NUM_15, GPIO_NUM_34, GPIO_NUM_39, ' + c.ppr + ', ' + c.red + ', ' + c.m0 + ');');
  generator.addObject('cubic_encM1', 'em::EncoderMotor cubicEncM1(GPIO_NUM_17, GPIO_NUM_12, GPIO_NUM_35, GPIO_NUM_36, ' + c.ppr + ', ' + c.red + ', ' + c.m1 + ');');
  generator.addSetupBegin('cubic_enc_closed_init',
    'cubicEncM0.Init(); cubicEncM1.Init(); cubicEncM0.SetSpeedPid(3, 2, 1); cubicEncM1.SetSpeedPid(3, 2, 1);');
}

// 所有引脚定义、状态变量、helper 函数（一次性注入）
const CUBIC_DEFS = [
  '// ===== Cubic Core 引脚(固定) =====',
  '#define CUBIC_I2C_ADDR 0x10',
  '#define CUBIC_SDA 21',
  '#define CUBIC_SCL 22',
  '#define CUBIC_I2C_FREQ 100000',
  '#define CUBIC_SERVO1 25',
  '#define CUBIC_SERVO2 19',
  '#define CUBIC_SERVO3 2',
  '#define CUBIC_SERVO4 18',
  '#define CUBIC_ENC_M0_IN1 14',
  '#define CUBIC_ENC_M0_IN2 15',
  '#define CUBIC_ENC_M1_IN1 17',
  '#define CUBIC_ENC_M1_IN2 12',
  '#define CUBIC_BTN_ADC 0',
  '#define CUBIC_VBAT_ADC 32',
  '',
  '// ===== 可调参数 =====',
  'static int cubic_deadzone = 30;',
  'static int cubic_invLY = -1, cubic_invLX = 1, cubic_invRY = -1, cubic_invRX = 1;',
  '',
  '// ===== I2C 马达(裸协议, 3字节) =====',
  'bool cubicMotor(uint8_t id, uint8_t dir, uint8_t spd) {',
  '  if (id > 3) return false;',
  '  uint8_t cmd[3] = {id, dir, spd};',
  '  for (uint8_t t = 0; t < 3; t++) {           // 失败重试2次, 兜底偶发 NACK(马达电噪声)',
  '    Wire.beginTransmission(CUBIC_I2C_ADDR);',
  '    Wire.write(cmd, 3);',
  '    uint8_t err = Wire.endTransmission();',
  '    delay(1);                                 // 给从机处理时间, 避免背靠背丢帧',
  '    if (err == 0) return true;',
  '  }',
  '  return false;',
  '}',
  '',
  '// ===== 开环编码电机(LEDC PWM), 速度 -255~255 =====',
  'void cubicSetEnc(uint8_t in1, uint8_t in2, int spd) {',
  '  spd = constrain(spd, -255, 255);',
  '  if (spd > 0)      { ledcWrite(in1, spd);  ledcWrite(in2, 0); }',
  '  else if (spd < 0) { ledcWrite(in1, 0);    ledcWrite(in2, -spd); }',
  '  else              { ledcWrite(in1, 0);    ledcWrite(in2, 0); }',
  '}',
  '',
  '// ===== 全部停车: I2C四马达 + 开环编码电机(闭环模式下 ledcWrite 对未挂载脚是空操作, 无害) =====',
  'void cubicStopAll() {',
  '  for (uint8_t i = 0; i < 4; i++) cubicMotor(i, 1, 0);',
  '  cubicSetEnc(CUBIC_ENC_M0_IN1, CUBIC_ENC_M0_IN2, 0);',
  '  cubicSetEnc(CUBIC_ENC_M1_IN1, CUBIC_ENC_M1_IN2, 0);',
  '}',
  '',
  '// ===== 舵机: 惰性attach(用到才attach+写角度, 开机不动) =====',
  'Servo* cubicServos[4] = {&cubicServo1, &cubicServo2, &cubicServo3, &cubicServo4};',
  'static const uint8_t cubicServoPins[4] = {CUBIC_SERVO1, CUBIC_SERVO2, CUBIC_SERVO3, CUBIC_SERVO4};',
  'void cubicServoWrite(uint8_t i, int angle) {',
  '  if (i > 3) return;',
  '  if (!cubicServos[i]->attached()) { cubicServos[i]->setPeriodHertz(50); cubicServos[i]->attach(cubicServoPins[i], 500, 2500); }',
  '  cubicServos[i]->write(constrain(angle, 0, 180));',
  '}',
  '',
  '// ===== 板载3按键(共GPIO0, ADC电阻分压): 返回按下的键号1/2/3, 无按下返回0 =====',
  'uint8_t cubicKeyRead() {',
  '  int a = analogRead(CUBIC_BTN_ADC);',
  '  if (a < 300) return 1;',
  '  if (a > 2000 && a < 3000) return 2;',
  '  if (a > 3000 && a < 4000) return 3;',
  '  return 0;',
  '}',
  '',
  '// ===== 电池电压(V): IO32 分压1/2, 平均32次 =====',
  'float cubicBatteryV() {',
  '  uint32_t sum = 0;',
  '  for (int i = 0; i < 32; i++) sum += analogReadMilliVolts(CUBIC_VBAT_ADC);',
  '  return (sum / 32.0f) / 1000.0f * 2.0f * 0.989f;',
  '}',
  '',
  '// ===== 按键上升沿(每个按键一个 idx) =====',
  'bool cubicRising(int idx, bool cur) {',
  '  static bool last[24] = {false};',
  '  if (idx < 0 || idx >= 24) return false;',
  '  bool r = cur && !last[idx];',
  '  last[idx] = cur;',
  '  return r;',
  '}',
  '',
  '// ===== I2C 总线硬复位(解锁卡死的SDA) =====',
  'void cubicI2CRecover() {',
  '  pinMode(CUBIC_SCL, OUTPUT_OPEN_DRAIN);',
  '  pinMode(CUBIC_SDA, OUTPUT_OPEN_DRAIN);',
  '  digitalWrite(CUBIC_SCL, HIGH); digitalWrite(CUBIC_SDA, HIGH);',
  '  delayMicroseconds(10);',
  '  for (int i = 0; i < 9; i++) {',
  '    digitalWrite(CUBIC_SCL, LOW);  delayMicroseconds(10);',
  '    digitalWrite(CUBIC_SCL, HIGH); delayMicroseconds(10);',
  '    if (digitalRead(CUBIC_SDA)) break;',
  '  }',
  '  digitalWrite(CUBIC_SDA, LOW);  delayMicroseconds(10);',
  '  digitalWrite(CUBIC_SCL, HIGH); delayMicroseconds(10);',
  '  digitalWrite(CUBIC_SDA, HIGH); delayMicroseconds(10);',
  '  pinMode(CUBIC_SCL, INPUT); pinMode(CUBIC_SDA, INPUT);',
  '}',
  '',
  '// ===== OLED 分块刷新(每次1/8屏, 与电机交错, 保证实时) =====',
  'void cubicOledStream() {',
  '  static uint8_t row = 0;',
  '  static uint32_t t = 0;',
  '  uint32_t now = millis();',
  '  if (now - t < 15) return;   // 每行至少隔15ms(100k下一行~11ms), 给电机让路',
  '  t = now;',
  '  cubic_u8g2.updateDisplayArea(0, row, 16, 1);',
  '  row = (row + 1) & 7;',
  '}',
  '',
  '// ===== PS3 连接/断开回调(用户可选挂载, 用函数指针避免未定义链接错误) =====',
  'void (*cubicConnCb)() = 0;',
  'void (*cubicDiscCb)() = 0;',
  'void cubicOnConnect() {',
  '  Serial.println("PS3 connected");',
  '  if (cubicConnCb) cubicConnCb();',
  '}',
  'void cubicOnDisconnect() {',
  '  cubicStopAll();',
  '  Serial.println("PS3 disconnected -> stop");',
  '  if (cubicDiscCb) cubicDiscCb();',
  '}'
].join('\n');

// ==================== 初始化 ====================
Arduino.forBlock['cubic_init'] = function(block, generator) {
  cubicEnsureCore(generator);
  generator.addLibrary('esp_log', '#include "esp_log.h"');
  ensureSerialBegin('Serial', generator);

  // 读编码电机闭环参数存起来(不在此创建em, 保证I2C默认安全; 用到闭环块时才按此参数建em)
  cubicClosedCfg = {
    ppr: generator.valueToCode(block, 'PPR', Arduino.ORDER_ATOMIC) || '3',
    red: generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '48',
    m0: block.getFieldValue('M0PH') || 'em::EncoderMotor::kBPhaseLeads',
    m1: block.getFieldValue('M1PH') || 'em::EncoderMotor::kAPhaseLeads'
  };

  const setup = [
    '// ---- Cubic Core 小车初始化 ----',
    'esp_log_level_set("i2c.master", ESP_LOG_NONE);  // 偶发NACK有重试兜底, 关掉刷屏日志',
    'cubicI2CRecover();',
    'Wire.begin(CUBIC_SDA, CUBIC_SCL, CUBIC_I2C_FREQ);',
    'cubic_u8g2.setBusClock(100000);  // I2C 100kHz: 马达板+OLED共用总线, 400k易NACK, 100k稳',
    'cubic_u8g2.begin();',
    'cubic_u8g2.setFont(u8g2_font_6x13_tf);',
    'cubic_u8g2.clearBuffer(); cubic_u8g2.sendBuffer();',
    'cubicStopAll();'
  ].join('\n');
  generator.addSetup('cubic_init', setup);
  return '';
};

// ==================== PS3 连接 ====================
Arduino.forBlock['cubic_ps3_begin'] = function(block, generator) {
  cubicEnsureCore(generator);
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  ensureSerialBegin('Serial', generator);
  const mac = generator.valueToCode(block, 'MAC', Arduino.ORDER_ATOMIC) || '"auto"';

  // cubicOnConnect/cubicOnDisconnect 定义在 CUBIC_DEFS 中(总是注入)，此处仅挂载
  const setup = [
    'String cubicMac = String(' + mac + ');',
    'if (cubicMac == "auto") {',
    '  Ps3.begin(); cubicMac = Ps3.getAddress(); Ps3.end();',
    '  Serial.print("PS3 pair to this MAC: "); Serial.println(cubicMac);',
    '}',
    'Ps3.attachOnConnect(cubicOnConnect);',
    'Ps3.attachOnDisconnect(cubicOnDisconnect);',
    'Ps3.begin(cubicMac.c_str());',
    'Serial.println("Waiting for PS3 controller...");'
  ].join('\n');
  generator.addSetup('cubic_ps3_begin', setup);
  return '';
};

Arduino.forBlock['cubic_ps3_connected'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  return ['Ps3.isConnected()', Arduino.ORDER_FUNCTION_CALL];
};

// 事件块：把用户语句放进对应回调实现
Arduino.forBlock['cubic_on_connect'] = function(block, generator) {
  cubicEnsureCore(generator);
  const body = generator.statementToCode(block, 'DO') || '';
  generator.addFunction('cubic_conn_cb_impl', 'void cubicConnCbImpl() {\n' + body + '}');
  generator.addSetup('cubic_conn_cb_reg', 'cubicConnCb = cubicConnCbImpl;');
  return '';
};

Arduino.forBlock['cubic_on_disconnect'] = function(block, generator) {
  cubicEnsureCore(generator);
  const body = generator.statementToCode(block, 'DO') || '';
  generator.addFunction('cubic_disc_cb_impl', 'void cubicDiscCbImpl() {\n' + body + '}');
  generator.addSetup('cubic_disc_cb_reg', 'cubicDiscCb = cubicDiscCbImpl;');
  return '';
};

// ==================== 手柄输入 ====================
Arduino.forBlock['cubic_stick'] = function(block, generator) {
  cubicEnsureCore(generator);
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');  
  // cubicStick 依赖 Ps3, 只在用了摇杆块时才注入(否则无 PS3 程序会报 Ps3 未声明)
  generator.addFunction('cubic_stick_fn', [
    'int cubicStick(char stick, char axis) {',
    '  int v;',
    '  if (stick == \'l\') v = (axis == \'x\') ? cubic_invLX * Ps3.data.analog.stick.lx',
    '                                         : cubic_invLY * Ps3.data.analog.stick.ly;',
    '  else                v = (axis == \'x\') ? cubic_invRX * Ps3.data.analog.stick.rx',
    '                                         : cubic_invRY * Ps3.data.analog.stick.ry;',
    '  v = constrain(v, -127, 127);',
    '  if (abs(v) < cubic_deadzone) v = 0;',
    '  return v;',
    '}'
  ].join('\n'));
  const stick = block.getFieldValue('STICK');
  const axis = block.getFieldValue('AXIS');
  return ["cubicStick('" + stick + "', '" + axis + "')", Arduino.ORDER_FUNCTION_CALL];
};

// 按键 idx 映射(上升沿静态数组用)
const CUBIC_BTN_IDX = {
  cross: 0, circle: 1, triangle: 2, square: 3, l1: 4, r1: 5, l2: 6, r2: 7,
  up: 8, down: 9, left: 10, right: 11, select: 12, start: 13, ps: 14
};

Arduino.forBlock['cubic_button'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  const btn = block.getFieldValue('BTN');
  return ['Ps3.data.button.' + btn, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['cubic_button_pressed'] = function(block, generator) {
  cubicEnsureCore(generator);
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  const btn = block.getFieldValue('BTN');
  const idx = CUBIC_BTN_IDX[btn] !== undefined ? CUBIC_BTN_IDX[btn] : 0;
  return ['cubicRising(' + idx + ', Ps3.data.button.' + btn + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cubic_rumble'] = function(block, generator) {
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  const p = generator.valueToCode(block, 'POWER', Arduino.ORDER_ATOMIC) || '100';
  const ms = generator.valueToCode(block, 'MS', Arduino.ORDER_ATOMIC) || '300';
  return 'Ps3.setRumble(' + p + ', ' + ms + ');\n';
};

// ==================== 电机 ====================
Arduino.forBlock['cubic_stop_all'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubicStopAll();\n';
};

// ---- I2C 四驱马达(单控) ----
Arduino.forBlock['cubic_i2c_motor'] = function(block, generator) {
  cubicEnsureCore(generator);
  const m = block.getFieldValue('M');
  const dir = block.getFieldValue('DIR');
  const spd = generator.valueToCode(block, 'SPD', Arduino.ORDER_ATOMIC) || '0';
  return 'cubicMotor(' + m + ', ' + dir + ', constrain(' + spd + ', 0, 255));\n';
};

Arduino.forBlock['cubic_i2c_all'] = function(block, generator) {
  cubicEnsureCore(generator);
  const dir = block.getFieldValue('DIR');
  const spd = generator.valueToCode(block, 'SPD', Arduino.ORDER_ATOMIC) || '0';
  return 'for (uint8_t i = 0; i < 4; i++) cubicMotor(i, ' + dir + ', constrain(' + spd + ', 0, 255));\n';
};

// ---- 编码电机: M -> LEDC 引脚 / em 对象名 ----
function cubicEncPins(block) {
  return (block.getFieldValue('M') === '0')
    ? ['CUBIC_ENC_M0_IN1', 'CUBIC_ENC_M0_IN2']
    : ['CUBIC_ENC_M1_IN1', 'CUBIC_ENC_M1_IN2'];
}
function cubicEncObj(block) { return 'cubicEncM' + block.getFieldValue('M'); }

// ===== 开环块(默认, LEDC PWM, 不碰 I2C) =====
Arduino.forBlock['cubic_enc_run_pwm'] = function(block, generator) {
  cubicEnsureEncLedc(generator);
  const pins = cubicEncPins(block);
  const pwm = generator.valueToCode(block, 'PWM', Arduino.ORDER_ATOMIC) || '0';
  return 'cubicSetEnc(' + pins[0] + ', ' + pins[1] + ', ' + pwm + ');\n';
};

Arduino.forBlock['cubic_enc_stop'] = function(block, generator) {
  cubicEnsureEncLedc(generator);
  const pins = cubicEncPins(block);
  return 'cubicSetEnc(' + pins[0] + ', ' + pins[1] + ', 0);\n';
};

// ===== 闭环块(惰性引入 em::EncoderMotor; 用了这些块 I2C 会受影响) =====
Arduino.forBlock['cubic_enc_run_speed'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  const rpm = generator.valueToCode(block, 'RPM', Arduino.ORDER_ATOMIC) || '0';
  return cubicEncObj(block) + '.RunSpeed(constrain(' + rpm + ', -300, 300));\n';
};

Arduino.forBlock['cubic_enc_speed'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  return [cubicEncObj(block) + '.SpeedRpm()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cubic_enc_pulse'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  return [cubicEncObj(block) + '.EncoderPulseCount()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cubic_enc_revolutions'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  return [cubicEncObj(block) + '.GetRevolutions()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cubic_enc_reset'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  return cubicEncObj(block) + '.ResetPulseCount();\n';
};

Arduino.forBlock['cubic_enc_pid'] = function(block, generator) {
  cubicEnsureEncClosed(generator);
  const p = generator.valueToCode(block, 'P', Arduino.ORDER_ATOMIC) || '3.0';
  const i = generator.valueToCode(block, 'I', Arduino.ORDER_ATOMIC) || '1.0';
  const d = generator.valueToCode(block, 'D', Arduino.ORDER_ATOMIC) || '1.0';
  return cubicEncObj(block) + '.SetSpeedPid(' + p + ', ' + i + ', ' + d + ');\n';
};

// ==================== 舵机 ====================
Arduino.forBlock['cubic_servo'] = function(block, generator) {
  cubicEnsureServo(generator);
  const s = parseInt(block.getFieldValue('S'), 10) - 1;
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  return 'cubicServoWrite(' + s + ', ' + angle + ');\n';
};

Arduino.forBlock['cubic_servo_all'] = function(block, generator) {
  cubicEnsureServo(generator);
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  return 'for (uint8_t i = 0; i < 4; i++) cubicServoWrite(i, ' + angle + ');\n';
};

Arduino.forBlock['cubic_servo_center'] = function(block, generator) {
  cubicEnsureServo(generator);
  return 'for (uint8_t i = 0; i < 4; i++) cubicServoWrite(i, 90);\n';
};

// ==================== OLED ====================
Arduino.forBlock['cubic_oled_clear'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubic_u8g2.clearBuffer();\n';
};

Arduino.forBlock['cubic_oled_text'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '12';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return 'cubic_u8g2.setCursor(' + x + ', ' + y + '); cubic_u8g2.print(' + text + ');\n';
};

Arduino.forBlock['cubic_oled_refresh_full'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubic_u8g2.sendBuffer();\n';
};

Arduino.forBlock['cubic_oled_refresh_stream'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubicOledStream();\n';
};

Arduino.forBlock['cubic_oled_logo'] = function(block, generator) {
  cubicEnsureCore(generator);
  generator.addFunction('cubic_logo_data', CUBIC_LOGO);
  return 'cubic_u8g2.clearBuffer();\n' +
         'cubic_u8g2.drawXBMP(0, 0, 128, 64, cubic_logo_bmp);\n' +
         'cubic_u8g2.sendBuffer();\n';
};

// ==================== OLED 绘图(画进缓冲, 需配合刷新块) ====================
Arduino.forBlock['cubic_oled_pixel'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  return 'cubic_u8g2.drawPixel(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['cubic_oled_line'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC) || '0';
  return 'cubic_u8g2.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ');\n';
};

Arduino.forBlock['cubic_oled_rect'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', Arduino.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', Arduino.ORDER_ATOMIC) || '0';
  const fn = (block.getFieldValue('FILL') === '1') ? 'drawBox' : 'drawFrame';
  return 'cubic_u8g2.' + fn + '(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
};

Arduino.forBlock['cubic_oled_circle'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
  const r = generator.valueToCode(block, 'R', Arduino.ORDER_ATOMIC) || '0';
  const fn = (block.getFieldValue('FILL') === '1') ? 'drawDisc' : 'drawCircle';
  return 'cubic_u8g2.' + fn + '(' + x + ', ' + y + ', ' + r + ');\n';
};

Arduino.forBlock['cubic_oled_num'] = function(block, generator) {
  cubicEnsureCore(generator);
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '12';
  const num = generator.valueToCode(block, 'NUM', Arduino.ORDER_ATOMIC) || '0';
  return 'cubic_u8g2.setCursor(' + x + ', ' + y + '); cubic_u8g2.print(' + num + ');\n';
};

Arduino.forBlock['cubic_oled_font'] = function(block, generator) {
  cubicEnsureCore(generator);
  const map = { s: 'u8g2_font_6x10_tf', m: 'u8g2_font_7x13_tf', l: 'u8g2_font_10x20_tf' };
  const f = map[block.getFieldValue('SIZE')] || map.m;
  return 'cubic_u8g2.setFont(' + f + ');\n';
};

Arduino.forBlock['cubic_oled_color'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubic_u8g2.setDrawColor(' + block.getFieldValue('COLOR') + ');\n';
};

Arduino.forBlock['cubic_oled_contrast'] = function(block, generator) {
  cubicEnsureCore(generator);
  const v = generator.valueToCode(block, 'VAL', Arduino.ORDER_ATOMIC) || '128';
  return 'cubic_u8g2.setContrast(constrain(' + v + ', 0, 255));\n';
};

Arduino.forBlock['cubic_oled_power'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubic_u8g2.setPowerSave(' + block.getFieldValue('MODE') + ');\n';
};

Arduino.forBlock['cubic_oled_flip'] = function(block, generator) {
  cubicEnsureCore(generator);
  return 'cubic_u8g2.setFlipMode(' + block.getFieldValue('MODE') + ');\n';
};

// ==================== 板载按键 + 电量 ====================
Arduino.forBlock['cubic_key'] = function(block, generator) {
  cubicEnsureAdc(generator);
  const n = block.getFieldValue('KEY');
  return ['(cubicKeyRead() == ' + n + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['cubic_key_pressed'] = function(block, generator) {
  cubicEnsureAdc(generator);
  const n = parseInt(block.getFieldValue('KEY'), 10);
  return ['cubicRising(' + (14 + n) + ', cubicKeyRead() == ' + n + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['cubic_battery'] = function(block, generator) {
  cubicEnsureAdc(generator);
  return ['cubicBatteryV()', Arduino.ORDER_FUNCTION_CALL];
};

// ==================== 参数 ====================
Arduino.forBlock['cubic_set_deadzone'] = function(block, generator) {
  cubicEnsureCore(generator);
  const val = generator.valueToCode(block, 'VAL', Arduino.ORDER_ATOMIC) || '30';
  return 'cubic_deadzone = constrain(' + val + ', 0, 127);\n';
};

Arduino.forBlock['cubic_invert_axis'] = function(block, generator) {
  cubicEnsureCore(generator);
  const axis = block.getFieldValue('AXIS');
  const mode = block.getFieldValue('MODE');
  return 'cubic_inv' + axis + ' = ' + mode + ';\n';
};

// 开机图标位图(128x64, XBM)
const CUBIC_LOGO = [
  'static const unsigned char cubic_logo_bmp[] PROGMEM = {',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF8,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xF0,0xFF,0xFF,0xFF,0xFF,0x03,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFC,0xFF,0xFF,0xFF,0xFF,0x0F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFE,0xFF,0xFF,0xFF,0xFF,0x1F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x3F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x3F,0xFE,0x1F,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x1F,0xFC,0x0F,0xFE,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x1F,0xFC,0x0F,0xFE,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x1F,0xFC,0x0F,0xFE,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x1F,0xFC,0x0F,0xFE,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0x3F,0xFE,0x1F,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x80,0xBF,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x7F,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x80,0xFF,0xFF,0xFF,0xFF,0xFF,0x7F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x3F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFE,0xFF,0xFF,0xFF,0xFF,0x1F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xFC,0xFF,0xFF,0xFF,0xFF,0x0F,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0xF8,0xFF,0xFF,0xFF,0xFF,0x07,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,',
  '  0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00',
  '};'
].join(String.fromCharCode(10));

// 智能小车综合控制库 Generator for Aily Platform

// ========== AI-Assistant板卡识别扩展 ==========
if (Blockly.Extensions.isRegistered('ai_assistant_board_extension')) {
  Blockly.Extensions.unregister('ai_assistant_board_extension');
}

Blockly.Extensions.register('ai_assistant_board_extension', function() {
  var boardConfig = window['boardConfig'] || {};
  var boardCore = (boardConfig.core || '').toLowerCase();
  var boardType = (boardConfig.type || '').toLowerCase();
  var boardName = (boardConfig.name || '').toLowerCase();
  
  var isESP32 = boardCore.indexOf('esp32') > -1 || 
                boardType.indexOf('esp32') > -1 ||
                boardName.indexOf('esp32') > -1;
  var isMega2560 = boardCore.indexOf('mega') > -1 || 
                  boardType.indexOf('mega') > -1 ||
                  boardName.indexOf('mega') > -1 || 
                  boardName.indexOf('2560') > -1;
  var isArduinoUno = (boardCore === 'arduino:avr' && boardType.indexOf('uno') > -1) ||
                    boardName.indexOf('uno') > -1 ||
                    (!isESP32 && !isMega2560);
  
  var dummyInput = this.getInput('SERIAL_OPTION');
  
  if (!dummyInput) {
    return;
  }
  
  if (isESP32) {
    dummyInput.appendField('选择串口：');
    var serialDropdown = new Blockly.FieldDropdown([
      ['Serial0 (RX:GPIO43/TX:GPIO44)', 'UART0'],
      ['Serial1 (RX:GPIO17/TX:GPIO18)', 'UART1'],
      ['Serial2 (可配置引脚)', 'UART2']
    ]);
    dummyInput.appendField(serialDropdown, 'SERIAL_OPTION');
    
    // 为Serial2添加可配置引脚下拉菜单（动态获取板卡引脚）
    var rxOptions = [];
    var txOptions = [];
    var digitalPins = boardConfig.digitalPins || [];
    
    if (digitalPins.length > 0) {
      for (var i = 0; i < digitalPins.length; i++) {
        var pinValue = digitalPins[i][1];
        var pinLabel = digitalPins[i][0];
        rxOptions.push([pinLabel, pinValue.toString()]);
        txOptions.push([pinLabel, pinValue.toString()]);
      }
    } else {
      // 默认ESP32引脚选项
      for (var i = 0; i <= 39; i++) {
        rxOptions.push(['GPIO' + i, i.toString()]);
        txOptions.push(['GPIO' + i, i.toString()]);
      }
    }
    
    var uart2Pins = this.appendDummyInput('UART2_PINS')
      .appendField('RX:')
      .appendField(new Blockly.FieldDropdown(rxOptions), 'UART2_RX')
      .appendField('TX:')
      .appendField(new Blockly.FieldDropdown(txOptions), 'UART2_TX');
    uart2Pins.setVisible(false);
    
    // 设置默认值
    this.setFieldValue('15', 'UART2_RX');
    this.setFieldValue('16', 'UART2_TX');
    
    // 添加串口选择验证器，控制引脚输入框显示
    serialDropdown.setValidator(function(newValue) {
      var uart2Pins = this.sourceBlock_.getInput('UART2_PINS');
      if (uart2Pins) {
        uart2Pins.setVisible(newValue === 'UART2');
        
        try {
          if (this.sourceBlock_ && this.sourceBlock_.workspace) {
            this.sourceBlock_.workspace.render();
          }
        } catch (e) {
          console.log('渲染块时出错:', e);
        }
      }
      return newValue;
    });
    
    // 保留隐藏的RX_PIN和TX_PIN字段用于兼容性
    this.appendDummyInput('RX_PIN_INPUT')
      .appendField(new Blockly.FieldLabelSerializable('17'), 'RX_PIN')
      .setVisible(false);
    this.appendDummyInput('TX_PIN_INPUT')
      .appendField(new Blockly.FieldLabelSerializable('18'), 'TX_PIN')
      .setVisible(false);
    
  } else if (isMega2560) {
    dummyInput.appendField('选择串口：');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['Serial (RX:0/TX:1)', 'UART0'],
      ['Serial1 (RX:19/TX:18)', 'UART1'],
      ['Serial2 (RX:17/TX:16)', 'UART2'],
      ['Serial3 (RX:15/TX:14)', 'UART3']
    ]), 'SERIAL_OPTION');
    
  } else {
    dummyInput.appendField('串口类型：');
    dummyInput.appendField(new Blockly.FieldDropdown([
      ['硬件串口(RX:0/TX:1)', 'HARDWARE'],
      ['软件串口', 'SOFTWARE']
    ]), 'SERIAL_TYPE');
    
    var softwareSerial = this.appendDummyInput('SOFTWARE_SERIAL')
      .appendField('软串口引脚：');
    
    var rxOptions = [];
    var txOptions = [];
    
    var digitalPins = boardConfig.digitalPins || [];
    
    if (digitalPins.length > 0) {
      for (var i = 0; i < digitalPins.length; i++) {
        var pinValue = digitalPins[i][1];
        var pinLabel = digitalPins[i][0];
        if (pinValue !== '0' && pinValue !== '1' && pinValue !== 0 && pinValue !== 1) {
          rxOptions.push([pinLabel, pinValue.toString()]);
          txOptions.push([pinLabel, pinValue.toString()]);
        }
      }
    } else {
      for (var i = 2; i <= 13; i++) {
        rxOptions.push([i.toString(), i.toString()]);
        txOptions.push([i.toString(), i.toString()]);
      }
      var analogPins = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
      for (var i = 0; i < analogPins.length; i++) {
        rxOptions.push([analogPins[i], analogPins[i]]);
        txOptions.push([analogPins[i], analogPins[i]]);
      }
    }
    
    softwareSerial.appendField('RX');
    softwareSerial.appendField(new Blockly.FieldDropdown(rxOptions), 'RX_PIN');
    softwareSerial.appendField('TX');
    softwareSerial.appendField(new Blockly.FieldDropdown(txOptions), 'TX_PIN');
    
    softwareSerial.setVisible(false);
    
    this.setFieldValue('2', 'RX_PIN');
    this.setFieldValue('3', 'TX_PIN');
    
    var serialType = this.getField('SERIAL_TYPE');
    if (serialType) {
      serialType.setValidator(function(newValue) {
        var softwareSerial = this.sourceBlock_.getInput('SOFTWARE_SERIAL');
        if (softwareSerial) {
          softwareSerial.setVisible(newValue === 'SOFTWARE');
          
          try {
            if (this.sourceBlock_ && this.sourceBlock_.workspace) {
              this.sourceBlock_.workspace.render();
            }
          } catch (e) {
            console.log('渲染块时出错:', e);
          }
        }
        return newValue;
      });
    }
  }
  
});

// ========== 按键检测 ==========
Arduino.forBlock['car_is_key_pressed'] = function(block, generator) {
  const key = block.getFieldValue('KEY');
  
  generator.addLibrary('key_function', `
int readKeyEvent() {
    int val = analogRead(0);
    if (val < 200) return 0;
    if (val >= 300 && val < 900) return 1;
    if (val > 1000 && val < 1500) return 2;
    return -1;
}
`);
  
  const code = `(readKeyEvent() == ${key})`;
  return [code, Arduino.ORDER_RELATIONAL];
};

// ========== 超声波测距 ==========
Arduino.forBlock['car_ultrasonic_distance'] = function(block, generator) {
  const trig = block.getFieldValue('TRIG');
  const echo = block.getFieldValue('ECHO');
  
  generator.addLibrary('URM10', '#include "DFRobot_URM10.h"');
  generator.addVariable('urm10', 'DFRobot_URM10 urm10;');
  
  const code = `urm10.getDistanceCM(${trig}, ${echo})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== 巡线传感器 ==========
Arduino.forBlock['car_line_init'] = function(block, generator) {
  // 固定引脚: SDA=21, SCL=22
  const sda = 21;
  const scl = 22;
  
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  generator.addVariable('sensor', `EspReceive sensor(${sda}, ${scl});`);
  generator.addSetup('sensor_begin', 'sensor.begin();');
  
  return '';
};

Arduino.forBlock['car_line_is_state'] = function(block, generator) {
  const state = block.getFieldValue('STATE');
  
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  const code = `(sensor.calculateDigitalState(sensor.getLatestData()) == ${state})`;
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['car_line_offset'] = function(block, generator) {
  generator.addLibrary('offset_calc', `
float calculateLineOffset() {
    // 八路传感器偏移量计算 (A0-A7)
    int a0 = sensor.getSensorCurrent(sensor.getLatestData(), 0);
    int a1 = sensor.getSensorCurrent(sensor.getLatestData(), 1);
    int a2 = sensor.getSensorCurrent(sensor.getLatestData(), 2);
    int a3 = sensor.getSensorCurrent(sensor.getLatestData(), 3);
    int a4 = sensor.getSensorCurrent(sensor.getLatestData(), 4);
    int a5 = sensor.getSensorCurrent(sensor.getLatestData(), 5);
    int a6 = sensor.getSensorCurrent(sensor.getLatestData(), 6);
    int a7 = sensor.getSensorCurrent(sensor.getLatestData(), 7);
    
    // 权重分配：A0=-7, A1=-5, A2=-3, A3=-1, A4=1, A5=3, A6=5, A7=7
    float weightedOffset = (a0 * (-7.0) + a1 * (-5.0) + a2 * (-3.0) + a3 * (-1.0) + 
                           a4 * (1.0) + a5 * (3.0) + a6 * (5.0) + a7 * (7.0));
    int totalSum = a0 + a1 + a2 + a3 + a4 + a5 + a6 + a7;
    float offset = 0;
    if (totalSum > 0) {
        offset = weightedOffset / (float)totalSum;
    }
    return offset;
}
`);
  
  const code = `calculateLineOffset()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['car_line_sensor_value'] = function(block, generator) {
  const sensor_id = block.getFieldValue('SENSOR');
  
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  const code = `sensor.getSensorCurrent(sensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['car_line_sensor_reference'] = function(block, generator) {
  const sensor_id = block.getFieldValue('SENSOR');
  
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  const code = `sensor.getSensorReference(sensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['car_line_sensor_digital'] = function(block, generator) {
  const sensor_id = block.getFieldValue('SENSOR');
  
  generator.addLibrary('EspReceive', '#include "EspReceive.h"');
  const code = `sensor.getSensorColor(sensor.getLatestData(), ${sensor_id})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};


// ========== STM32多功能板I2C控制 ==========
function ensureStm32I2c(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  generator.addLibrary('stm32_defines', `
#define STM32_I2C_ADDR    0x10
#define I2C_SDA_PIN       21
#define I2C_SCL_PIN       22
#define I2C_FREQ          100000
#define DEVICE_SERVO      0x00
#define DEVICE_TT_MOTOR   0x01
#define DEVICE_STEPPER    0x02
#define DEVICE_SYSTEM     0x03
#define MOTOR_STOP        0
#define MOTOR_FORWARD     1
#define MOTOR_BACKWARD    2
#define STEPPER_CW        0
#define STEPPER_CCW       1
#define SYS_CMD_STOP_ALL  0
#define SYS_CMD_SERVO_MID 1
#define SYS_CMD_READ_JY61P 0x10
#define SYS_CMD_ZERO_JY61P 0x11
#define SYS_CMD_READ_ACC   0x12
#define SYS_CMD_READ_GYRO  0x13
#define ACK_SUCCESS       0x06
#define ACK_FAILURE       0x15
#define ACK_TIMEOUT       0xFF
`);
  
  generator.addSetup('stm32_i2c_init', `Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);\nWire.setClock(I2C_FREQ);`);
  
  generator.addLibrary('stm32_send_cmd', `
bool sendStm32Command(uint8_t device_type, uint8_t device_num, uint8_t param1, uint8_t param2) {
  Wire.beginTransmission(STM32_I2C_ADDR);
  Wire.write(device_type);
  Wire.write(device_num);
  Wire.write(param1);
  Wire.write(param2);
  uint8_t error = Wire.endTransmission();
  if (error != 0) return false;
  delay(50);
  uint8_t bytesRead = Wire.requestFrom(STM32_I2C_ADDR, 5);
  if (bytesRead != 5) return false;
  uint8_t ack = Wire.read();
  for (int i = 0; i < 4; i++) Wire.read();
  return (ack == ACK_SUCCESS);
}
`);
}

// ========== 舵机控制(通过STM32) ==========
Arduino.forBlock['car_servo_init'] = function(block, generator) {
  ensureStm32I2c(generator);
  return '';
};

Arduino.forBlock['car_servo_angle'] = function(block, generator) {
  ensureStm32I2c(generator);
  const servoNum = block.getFieldValue('PIN');
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  
  return `sendStm32Command(DEVICE_SERVO, ${servoNum}, 0, ${angle});\n`;
};

Arduino.forBlock['car_servo_dual_angle'] = function(block, generator) {
  ensureStm32I2c(generator);
  const angle = generator.valueToCode(block, 'ANGLE', Arduino.ORDER_ATOMIC) || '90';
  
  // 设置所有6个舵机(S1-S6, 编号0-5)为相同角度
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += `sendStm32Command(DEVICE_SERVO, ${i}, 0, ${angle});\n`;
  }
  return code;
};

// ========== TT马达控制(通过STM32) ==========
Arduino.forBlock['car_motor_control_single'] = function(block, generator) {
  ensureStm32I2c(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const direction = block.getFieldValue('DIRECTION');
  const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '128';
  
  // 添加速度范围限制
  const speedConstrained = `constrain(${speed}, 0, 255)`;
  
  return `sendStm32Command(DEVICE_TT_MOTOR, ${motorId}, ${direction}, ${speedConstrained});\n`;
};

Arduino.forBlock['car_motor_stop_single'] = function(block, generator) {
  ensureStm32I2c(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  
  return `sendStm32Command(DEVICE_TT_MOTOR, ${motorId}, MOTOR_STOP, 0);\n`;
};

// ========== 步进电机控制(通过STM32) ==========
Arduino.forBlock['car_stepper_control'] = function(block, generator) {
  ensureStm32I2c(generator);
  const stepperNum = block.getFieldValue('STEPPER_NUM');
  const direction = block.getFieldValue('DIRECTION');
  const degrees = generator.valueToCode(block, 'DEGREES', Arduino.ORDER_ATOMIC) || '360';
  
  return `{
  uint8_t device_num = ${stepperNum} | (${direction} << 1);
  uint16_t angle = ${degrees};
  uint8_t angle_high = (angle >> 8) & 0xFF;
  uint8_t angle_low = angle & 0xFF;
  sendStm32Command(DEVICE_STEPPER, device_num, angle_high, angle_low);
}\n`;
};

Arduino.forBlock['car_stepper_control_turns'] = function(block, generator) {
  ensureStm32I2c(generator);
  const stepperNum = block.getFieldValue('STEPPER_NUM');
  const direction = block.getFieldValue('DIRECTION');
  const turns = generator.valueToCode(block, 'TURNS', Arduino.ORDER_ATOMIC) || '1';
  
  return `{
  uint8_t device_num = ${stepperNum} | (${direction} << 1);
  uint16_t angle = (uint16_t)(${turns} * 360);  // 圈数转换为角度
  uint8_t angle_high = (angle >> 8) & 0xFF;
  uint8_t angle_low = angle & 0xFF;
  sendStm32Command(DEVICE_STEPPER, device_num, angle_high, angle_low);
}\n`;
};

Arduino.forBlock['car_stop_all_motors'] = function(block, generator) {
  ensureStm32I2c(generator);
  return `sendStm32Command(DEVICE_SYSTEM, 0, 0, 0);\n`;
};

Arduino.forBlock['car_servo_to_mid'] = function(block, generator) {
  ensureStm32I2c(generator);
  return `sendStm32Command(DEVICE_SYSTEM, 1, 0, 0);\n`;
};

// ========== 编码电机控制 ==========
// 全局配置变量（用户可通过配置块修改）
let g_encoder_ppr = 3;
let g_encoder_reduction = 48;

function ensureEncoderMotor(generator) {
  generator.addLibrary('encoder_motor', '#include "encoder_motor.h"');
  generator.addLibrary('encoder_motor_lib', '#include "encoder_motor_lib.h"');
  
  // 添加命名空间和常量定义（与官方示例一致）
  generator.addVariable('encoder_motor_namespace_begin', `namespace {
constexpr uint32_t kPPR = ${g_encoder_ppr};              // Pulses per revolution.
constexpr uint32_t kReductionRation = ${g_encoder_reduction};  // Reduction ratio.
`);

  generator.addVariable('encoder_motor_0', `
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
em::EncoderMotor g_encoder_motor_0(  // E0
    GPIO_NUM_12,                     // The pin number of the motor's positive pole.
    GPIO_NUM_14,                     // The pin number of the motor's negative pole.
    GPIO_NUM_35,                     // The pin number of the encoder's A phase.
    GPIO_NUM_36,                     // The pin number of the encoder's B phase.
    kPPR,                            // Pulses per revolution.
    kReductionRation,                // Reduction ratio.
    em::EncoderMotor::kBPhaseLeads   // Phase relationship (B phase leads)
);
#else  // The ESP32 Arduino Core Version is less than 3.0.0
em::EncoderMotor g_encoder_motor_0(  // E0
    GPIO_NUM_12,                     // The pin number of the motor's positive pole.
    0,                               // The positive pole of the motor is attached to LED Control (LEDC) Channel 0.
    GPIO_NUM_14,                     // The pin number of the motor's negative pole.
    1,                               // The negative pole of the motor is attached to LED Control (LEDC) Channel 1.
    GPIO_NUM_35,                     // The pin number of the encoder's A phase.
    GPIO_NUM_36,                     // The pin number of the encoder's B phase.
    kPPR,                            // Pulses per revolution.
    kReductionRation,                // Reduction ratio.
    em::EncoderMotor::kBPhaseLeads   // Phase relationship (B phase leads)
);
#endif`);

  generator.addVariable('encoder_motor_1', `
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
em::EncoderMotor g_encoder_motor_1(  // E1
    GPIO_NUM_15,                     // The pin number of the motor's positive pole.
    GPIO_NUM_17,                     // The pin number of the motor's negative pole.
    GPIO_NUM_34,                     // The pin number of the encoder's A phase.
    GPIO_NUM_39,                     // The pin number of the encoder's B phase.
    kPPR,                            // Pulses per revolution.
    kReductionRation,                // Reduction ratio.
    em::EncoderMotor::kBPhaseLeads   // Phase relationship (B phase leads)
);
#else  // The ESP32 Arduino Core Version is less than 3.0.0
em::EncoderMotor g_encoder_motor_1(  // E1
    GPIO_NUM_15,                     // The pin number of the motor's positive pole.
    2,                               // The positive pole of the motor is attached to LED Control (LEDC) Channel 2.
    GPIO_NUM_17,                     // The pin number of the motor's negative pole.
    3,                               // The negative pole of the motor is attached to LED Control (LEDC) Channel 3.
    GPIO_NUM_34,                     // The pin number of the encoder's A phase.
    GPIO_NUM_39,                     // The pin number of the encoder's B phase.
    kPPR,                            // Pulses per revolution.
    kReductionRation,                // Reduction ratio.
    em::EncoderMotor::kBPhaseLeads   // Phase relationship (B phase leads)
);
#endif`);

  generator.addVariable('encoder_motor_namespace_end', `}  // namespace`);

  generator.addSetup('encoder_motor_init', 'g_encoder_motor_0.Init();\n  g_encoder_motor_1.Init();');
  
  // UpdateRpm()是私有函数，库在Init()时自动创建后台线程调用，无需手动调用
}

Arduino.forBlock['car_encoder_config'] = function(block, generator) {
  // 读取用户设置的PPR和减速比，更新全局变量
  g_encoder_ppr = block.getFieldValue('PPR');
  g_encoder_reduction = block.getFieldValue('REDUCTION');
  
  // 这个块不生成实际代码，只影响后续代码生成
  // 必须在任何其他编码电机块之前使用
  return '';
};

Arduino.forBlock['car_encoder_set_pid'] = function(block, generator) {
  ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const p = generator.valueToCode(block, 'P', Arduino.ORDER_ATOMIC) || '5.0';
  const i = generator.valueToCode(block, 'I', Arduino.ORDER_ATOMIC) || '2.0';
  const d = generator.valueToCode(block, 'D', Arduino.ORDER_ATOMIC) || '1.0';
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.SetSpeedPid(${p}, ${i}, ${d});\n  g_encoder_motor_1.SetSpeedPid(${p}, ${i}, ${d});\n`;
  } else {
    return `g_encoder_motor_${motorId}.SetSpeedPid(${p}, ${i}, ${d});\n`;
  }
};

Arduino.forBlock['car_encoder_run_speed'] = function(block, generator) {
  ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '0';
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.RunSpeed(${speed});\n  g_encoder_motor_1.RunSpeed(${speed});\n`;
  } else {
    return `g_encoder_motor_${motorId}.RunSpeed(${speed});\n`;
  }
};

Arduino.forBlock['car_encoder_run_pwm'] = function(block, generator) {
  ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  const duty = generator.valueToCode(block, 'DUTY', Arduino.ORDER_ATOMIC) || '0';
  const mappedDuty = `map(${duty}, -100, 100, -1023, 1023)`;
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.RunPwmDuty(${mappedDuty});\n  g_encoder_motor_1.RunPwmDuty(${mappedDuty});\n`;
  } else {
    return `g_encoder_motor_${motorId}.RunPwmDuty(${mappedDuty});\n`;
  }
};

Arduino.forBlock['car_encoder_stop'] = function(block, generator) {
  ensureEncoderMotor(generator);
  const motorId = block.getFieldValue('MOTOR_ID');
  
  if (motorId === '-1') {
    return `g_encoder_motor_0.Stop();\n  g_encoder_motor_1.Stop();\n`;
  } else {
    return `g_encoder_motor_${motorId}.Stop();\n`;
  }
};

Arduino.forBlock['car_encoder_get_degree'] = function(block, generator) {
  const motorId = block.getFieldValue('MOTOR_ID');
  const code = `(g_encoder_motor_${motorId}.EncoderPulseCount() * 360.0 / (3 * 48))`;
  return [code, Arduino.ORDER_MULTIPLICATIVE];
};

Arduino.forBlock['car_encoder_reset_degree'] = function(block, generator) {
  const motorId = block.getFieldValue('MOTOR_ID');
  return `g_encoder_motor_${motorId}.ResetPulseCount();\n`;
};

Arduino.forBlock['car_encoder_get_speed'] = function(block, generator) {
  const motorId = block.getFieldValue('MOTOR_ID');
  const code = `g_encoder_motor_${motorId}.SpeedRpm()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== PS3手柄控制 ==========
Arduino.forBlock['car_ps3_init'] = function(block, generator) {
  const macAddr = generator.valueToCode(block, 'MAC_ADDR', Arduino.ORDER_ATOMIC) || '"a0:5a:5a:a0:10:09"';
  
  generator.addLibrary('Ps3Controller', '#include <Ps3Controller.h>');
  generator.addLibrary('ps3_callback', `
void ps3_notify() {}
void ps3_onConnect() {
    Serial.println("PS3 Controller Connected");
}
`);
  generator.addSetup('ps3_init', `Ps3.attach(ps3_notify);\nPs3.attachOnConnect(ps3_onConnect);\nPs3.begin(${macAddr});\nSerial.println("PS3 Controller Ready");`);
  
  return '';
};

Arduino.forBlock['car_ps3_button_pressed'] = function(block, generator) {
  const button = block.getFieldValue('BUTTON');
  const code = `Ps3.data.button.${button}`;
  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['car_ps3_stick_value'] = function(block, generator) {
  const stick = block.getFieldValue('STICK');
  const axis = block.getFieldValue('AXIS');
  const code = `Ps3.data.analog.stick.${stick}${axis}`;
  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['car_ps3_is_connected'] = function(block, generator) {
  const code = `Ps3.isConnected()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== AI-Assistant ==========
// 注意：板卡识别扩展已在文件开头注册

Arduino.forBlock['ai_assistant_config'] = function(block, generator) {
  // 获取当前开发板配置
  const config = window['boardConfig'] || {};
  const core = (config.core || '').toLowerCase();
  const type = (config.type || '').toLowerCase();
  const name = (config.name || '').toLowerCase();
  
  // 判断开发板类型
  const esp32 = core.indexOf('esp32') > -1 || type.indexOf('esp32') > -1 || name.indexOf('esp32') > -1;
  const mega2560 = core.indexOf('mega') > -1 || type.indexOf('mega') > -1 || name.indexOf('mega') > -1 || name.indexOf('2560') > -1;
  const arduinoUno = !esp32 && !mega2560;
  
  // 串口配置
  let serialType = arduinoUno ? (block.getFieldValue('SERIAL_TYPE') || 'HARDWARE') : 'HARDWARE';
  let serialOption = block.getFieldValue('SERIAL_OPTION') || (esp32 ? 'UART2' : 'UART0');
  
  // 保存配置供其他块使用
  Arduino.aiAssistantConfig = {serialType: serialType, serialOption: serialOption};
  
  // 软串口引脚
  let rxPin = '2', txPin = '3';
  if (serialType === 'SOFTWARE') {
    rxPin = block.getFieldValue('RX_PIN') || (esp32 ? '16' : '2');
    txPin = block.getFieldValue('TX_PIN') || (esp32 ? '17' : '3');
  }
  
  // 添加全局变量
  generator.addVariable('receivedCommand', 'String receivedCommand = "";');
  generator.addVariable('cmdCount', 'int cmdCount = 0;');
  generator.addVariable('lastCmdTime', 'unsigned long lastCmdTime = 0;');
  
  // ESP32配置
  if (esp32) {
    if (serialType === 'HARDWARE') {
      let serialName = serialOption === 'UART0' ? 'Serial' : (serialOption === 'UART1' ? 'Serial1' : 'Serial2');
      let initCode;
      
      // UART2使用可配置引脚
      if (serialOption === 'UART2') {
        let uart2Rx = block.getFieldValue('UART2_RX') || '15';
        let uart2Tx = block.getFieldValue('UART2_TX') || '16';
        initCode = `  ${serialName}.begin(9600, SERIAL_8N1, ${uart2Rx}, ${uart2Tx});`;
      } else {
        // UART0和UART1使用固定引脚
        initCode = `  ${serialName}.begin(9600);`;
      }
      
      generator.addSetupBegin('esp32_serial_begin', initCode);
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add(serialName);
      Arduino.initializedSerialPorts.add(serialName);
      
      if (serialOption !== 'UART0') {
        generator.addSetupBegin('esp32_debug_serial', '  Serial.begin(9600);');
        Arduino.addedSerialInitCode.add('Serial');
        Arduino.initializedSerialPorts.add('Serial');
      }
      
      let debugOutput = serialOption !== 'UART0' ? `
              Serial.print("收到命令: ");
              Serial.println(receivedCommand);` : '';
      
      generator.addLoop('receive_command', `// 从ESP32的${serialName}获取命令
      if (${serialName}.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (${serialName}.available()) {
                  char c = ${serialName}.read();
                if (c == 10 || c == 13) break;
                cmd += c;
                delay(2);
              }
          }
          delay(10);
          while (${serialName}.available()) {
              char c = ${serialName}.peek();
              if (c == 10 || c == 13) {
                  ${serialName}.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;${debugOutput}
          }
      }
      `);
    } else {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);');
      
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) break;
                  cmd += c;
                  delay(2);
              }
          }
          delay(10);
          while (mySerial.available()) {
              char c = mySerial.peek();
              if (c == 10 || c == 13) {
                  mySerial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
          }
      }
      `);
    }
  } else if (mega2560) {
    // Mega2560配置(类似ESP32)
    if (serialType === 'HARDWARE') {
      let serialName = 'Serial';
      let serialInit = '';
      
      switch (serialOption) {
        case 'UART0': serialName = 'Serial'; serialInit = '  Serial.begin(9600);'; break;
        case 'UART1': serialName = 'Serial1'; serialInit = '  Serial1.begin(9600);'; break;
        case 'UART2': serialName = 'Serial2'; serialInit = '  Serial2.begin(9600);'; break;
        case 'UART3': serialName = 'Serial3'; serialInit = '  Serial3.begin(9600);'; break;
        default: serialName = 'Serial'; serialInit = '  Serial.begin(9600);'; break;
      }
      
      generator.addSetupBegin('mega_serial_begin', serialInit);
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add(serialName);
      Arduino.initializedSerialPorts.add(serialName);
      
      if (serialOption !== 'UART0') {
        generator.addSetupBegin('mega_debug_serial', '  Serial.begin(9600);');
        Arduino.addedSerialInitCode.add('Serial');
        Arduino.initializedSerialPorts.add('Serial');
      }
      
      let debugOutput = serialOption !== 'UART0' ? `
              Serial.print("收到命令: ");
              Serial.println(receivedCommand);` : '';
      
      generator.addLoop('receive_command', `// 从Mega2560的${serialName}获取命令
      if (${serialName}.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (${serialName}.available()) {
                  char c = ${serialName}.read();
                if (c == 10 || c == 13) break;
                cmd += c;
                delay(2);
              }
          }
          delay(10);
          while (${serialName}.available()) {
              char c = ${serialName}.peek();
              if (c == 10 || c == 13) {
                  ${serialName}.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;${debugOutput}
          }
      }
      `);
    } else {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);');
      
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) break;
                  cmd += c;
                  delay(2);
              }
          }
          delay(10);
          while (mySerial.available()) {
              char c = mySerial.peek();
              if (c == 10 || c == 13) {
                  mySerial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
          }
      }
      `);
    }
  } else {
    // Arduino UNO配置
    if (serialType === 'HARDWARE') {
      generator.addSetupBegin('serial_begin', '  Serial.begin(9600);');
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add('Serial');
      Arduino.initializedSerialPorts.add('Serial');
      
      generator.addLoop('receive_command', `// 从Arduino UNO硬件串口获取命令
      if (Serial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (Serial.available()) {
                  char c = Serial.read();
                  if (c == 10 || c == 13) break;
                  cmd += c;
                  delay(2);
              }
          }
          delay(10);
          while (Serial.available()) {
              char c = Serial.peek();
              if (c == 10 || c == 13) {
                  Serial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              receivedCommand = cmd;
          }
      }
      `);
    } else {
      generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
      generator.addObject('mySerial', 'SoftwareSerial mySerial(' + rxPin + ', ' + txPin + ');');
      generator.addSetupBegin('myserial_begin', '  mySerial.begin(9600);');
      
      Arduino.addedSerialInitCode = Arduino.addedSerialInitCode || new Set();
      Arduino.initializedSerialPorts = Arduino.initializedSerialPorts || new Set();
      Arduino.addedSerialInitCode.add('mySerial');
      Arduino.initializedSerialPorts.add('mySerial');
      
      generator.addLoop('receive_command', `// 从软串口获取命令
      if (mySerial.available()) {
          String cmd = "";
          unsigned long startTime = millis();
          while (millis() - startTime < 100) {
              if (mySerial.available()) {
                  char c = mySerial.read();
                  if (c == 10 || c == 13) break;
                  cmd += c;
                  delay(2);
              }
          }
          delay(10);
          while (mySerial.available()) {
              char c = mySerial.peek();
              if (c == 10 || c == 13) {
                  mySerial.read();
              } else {
                  break;
              }
          }
          if (cmd.length() > 0) {
              unsigned long currentTime = millis();
              if (cmd != receivedCommand || (currentTime - lastCmdTime) > 200) {
                  receivedCommand = cmd;
                  lastCmdTime = currentTime;
                  cmdCount++;
                  Serial.print("[");
                  Serial.print(cmdCount);
                  Serial.print("] 软串口收到命令: ");
                  Serial.print(receivedCommand);
                  Serial.print(" (长度:");
                  Serial.print(cmd.length());
                  Serial.println(")");
              } else {
                  Serial.println("  -> 忽略重复命令");
              }
          }
      }
      `);
    }
  }
  
  return '';
};

Arduino.forBlock['serial_command_handler'] = function (block, generator) {
  let actionType = block.getFieldValue('ACTION') || "MOVE_FORWARD";
  
  let code = "false";
  
  switch(actionType) {
    case "MOVE_FORWARD":
      code = "(receivedCommand.indexOf(\"MOVE F\") >= 0)";
      break;
    case "MOVE_BACKWARD":
      code = "(receivedCommand.indexOf(\"MOVE B\") >= 0)";
      break;
    case "TURN_LEFT":
      code = "(receivedCommand.indexOf(\"MOVE L\") >= 0)";
      break;
    case "TURN_RIGHT":
      code = "(receivedCommand.indexOf(\"MOVE R\") >= 0)";
      break;
    case "STOP":
      code = "(receivedCommand.indexOf(\"MOVE S\") >= 0)";
      break;
    case "LED_ON":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"ON\") > 0)";
      break;
    case "LED_OFF":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"OFF\") > 0)";
      break;
    case "LED_BLINK":
      code = "(receivedCommand.indexOf(\"LED\") == 0 && receivedCommand.indexOf(\"BLINK\") > 0)";
      break;
    case "SERVO_ROTATE":
      code = "(receivedCommand.indexOf(\"SERVO\") >= 0)";
      break;
    case "FAN_SPEED":
      code = "(receivedCommand.indexOf(\"FAN_SPEED\") >= 0)";
      break;
    case "FAN_ON":
      code = "(receivedCommand.indexOf(\"FAN_ON\") >= 0)";
      break;
    case "FAN_OFF":
      code = "(receivedCommand.indexOf(\"FAN_OFF\") >= 0)";
      break;
    case "RGB_ON":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"ON\") >= 0)";
      break;
    case "RGB_OFF":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"OFF\") >= 0)";
      break;
    case "RGB_BRIGHTNESS":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"LIGHT\") >= 0)";
      break;
    case "RGB_GRADIENT":
      code = "(receivedCommand.indexOf(\"RGB\") == 0 && receivedCommand.indexOf(\"GRADIENT\") >= 0)";
      break;
    case "ARM_GRAB":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"GRAB\") >= 0)";
      break;
    case "ARM_RELEASE":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"RELEASE\") >= 0)";
      break;
    case "ARM_DOWN":
      code = "(receivedCommand.indexOf(\"ARM\") == 0 && receivedCommand.indexOf(\"DOWN\") >= 0)";
      break;
    case "RELAY_ON":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"ON\") >= 0)";
      break;
    case "RELAY_OFF":
      code = "(receivedCommand.indexOf(\"RELAY\") == 0 && receivedCommand.indexOf(\"OFF\") >= 0)";
      break;
    default:
      code = "false";
  }
  
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['serial_custom_command'] = function (block, generator) {
  let customCmd = block.getFieldValue('CUSTOM_CMD') || "";
  customCmd = customCmd.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  let code = `(receivedCommand.indexOf("${customCmd}") >= 0)`;
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['serial_clear_command'] = function (block, generator) {
  return 'receivedCommand = "";\n';
};

// ========== JY61P六轴传感器 (通过STM32 I2C从机) ==========
Arduino.forBlock['jy61p_set_zero'] = function(block, generator) {
  ensureStm32I2c(generator);
  
  // 生成设置JY61P零点代码 - 完全参照 ESP32_I2C_Master.ino
  const code = '// 设置JY61P零点\n' +
    'Wire.beginTransmission(STM32_I2C_ADDR);\n' +
    'Wire.write(DEVICE_SYSTEM);\n' +
    'Wire.write(SYS_CMD_ZERO_JY61P);\n' +
    'Wire.write(0x00);\n' +
    'Wire.write(0x00);\n' +
    'Wire.endTransmission();\n' +
    'delay(50);\n' +
    'Wire.requestFrom(STM32_I2C_ADDR, 5);\n' +
    'if(Wire.available() >= 5) {\n' +
    '  Wire.read(); Wire.read(); Wire.read(); Wire.read(); Wire.read();\n' +
    '}\n';
  
  return code;
};

Arduino.forBlock['jy61p_get_angle'] = function(block, generator) {
  const angleType = block.getFieldValue('ANGLE_TYPE');
  
  ensureStm32I2c(generator);
  
  // 根据类型选择返回值
  let returnStatement;
  if (angleType === 'YAW') {
    returnStatement = 'return yaw;';
  } else if (angleType === 'PITCH') {
    returnStatement = 'return pitch;';
  } else {
    returnStatement = 'return roll;';
  }
  
  // 添加读取函数
  const funcName = 'readJY61PAngle_' + angleType;
  generator.addFunction(funcName, 
    'float ' + funcName + '() {\n' +
    '  Wire.beginTransmission(STM32_I2C_ADDR);\n' +
    '  Wire.write(DEVICE_SYSTEM);\n' +
    '  Wire.write(SYS_CMD_READ_JY61P);\n' +
    '  Wire.write(0x00);\n' +
    '  Wire.write(0x00);\n' +
    '  if(Wire.endTransmission() != 0) return 0.0;\n' +
    '  \n' +
    '  delay(50);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 5) < 5) return 0.0;\n' +
    '  uint8_t ack = Wire.read();\n' +
    '  Wire.read(); Wire.read(); Wire.read(); Wire.read();\n' +
    '  if(ack != ACK_SUCCESS) return 0.0;\n' +
    '  \n' +
    '  delay(10);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 8) < 8) return 0.0;\n' +
    '  uint8_t data[8];\n' +
    '  for(int i=0; i<8; i++) data[i] = Wire.read();\n' +
    '  \n' +
    '  if(data[0] == 0xAA) {\n' +
    '    float roll = data[1] + data[2] / 100.0;\n' +
    '    float pitch = data[3] + data[4] / 100.0;\n' +
    '    float yaw = data[5] * 2 + data[6] / 100.0;\n' +
    '    ' + returnStatement + '\n' +
    '  }\n' +
    '  return 0.0;\n' +
    '}\n'
  );
  
  const code = funcName + '()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['jy61p_get_acceleration'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  
  ensureStm32I2c(generator);
  
  // 根据轴选择返回值
  let returnStatement;
  if (axis === 'X') {
    returnStatement = 'return acc_x / 100.0;';
  } else if (axis === 'Y') {
    returnStatement = 'return acc_y / 100.0;';
  } else {
    returnStatement = 'return acc_z / 100.0;';
  }
  
  // 添加读取函数
  const funcName = 'readJY61PAcc_' + axis;
  generator.addFunction(funcName,
    'float ' + funcName + '() {\n' +
    '  Wire.beginTransmission(STM32_I2C_ADDR);\n' +
    '  Wire.write(DEVICE_SYSTEM);\n' +
    '  Wire.write(SYS_CMD_READ_ACC);\n' +
    '  Wire.write(0x00);\n' +
    '  Wire.write(0x00);\n' +
    '  if(Wire.endTransmission() != 0) return 0.0;\n' +
    '  \n' +
    '  delay(50);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 5) < 5) return 0.0;\n' +
    '  uint8_t ack = Wire.read();\n' +
    '  Wire.read(); Wire.read(); Wire.read(); Wire.read();\n' +
    '  if(ack != ACK_SUCCESS) return 0.0;\n' +
    '  \n' +
    '  delay(10);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 8) < 8) return 0.0;\n' +
    '  uint8_t data[8];\n' +
    '  for(int i=0; i<8; i++) data[i] = Wire.read();\n' +
    '  \n' +
    '  if(data[0] == 0xBB && data[7] == 0xBB) {\n' +
    '    int16_t acc_x = (data[1] << 8) | data[2];\n' +
    '    int16_t acc_y = (data[3] << 8) | data[4];\n' +
    '    int16_t acc_z = (data[5] << 8) | data[6];\n' +
    '    ' + returnStatement + '\n' +
    '  }\n' +
    '  return 0.0;\n' +
    '}\n'
  );
  
  const code = funcName + '()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['jy61p_get_gyro'] = function(block, generator) {
  const axis = block.getFieldValue('AXIS');
  
  ensureStm32I2c(generator);
  
  // 根据轴选择返回值
  let returnStatement;
  if (axis === 'X') {
    returnStatement = 'return gyro_x / 100.0;';
  } else if (axis === 'Y') {
    returnStatement = 'return gyro_y / 100.0;';
  } else {
    returnStatement = 'return gyro_z / 100.0;';
  }
  
  // 添加读取函数
  const funcName = 'readJY61PGyro_' + axis;
  generator.addFunction(funcName,
    'float ' + funcName + '() {\n' +
    '  Wire.beginTransmission(STM32_I2C_ADDR);\n' +
    '  Wire.write(DEVICE_SYSTEM);\n' +
    '  Wire.write(SYS_CMD_READ_GYRO);\n' +
    '  Wire.write(0x00);\n' +
    '  Wire.write(0x00);\n' +
    '  if(Wire.endTransmission() != 0) return 0.0;\n' +
    '  \n' +
    '  delay(50);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 5) < 5) return 0.0;\n' +
    '  uint8_t ack = Wire.read();\n' +
    '  Wire.read(); Wire.read(); Wire.read(); Wire.read();\n' +
    '  if(ack != ACK_SUCCESS) return 0.0;\n' +
    '  \n' +
    '  delay(10);\n' +
    '  if(Wire.requestFrom(STM32_I2C_ADDR, 8) < 8) return 0.0;\n' +
    '  uint8_t data[8];\n' +
    '  for(int i=0; i<8; i++) data[i] = Wire.read();\n' +
    '  \n' +
    '  if(data[0] == 0xCC && data[7] == 0xCC) {\n' +
    '    int16_t gyro_x = (data[1] << 8) | data[2];\n' +
    '    int16_t gyro_y = (data[3] << 8) | data[4];\n' +
    '    int16_t gyro_z = (data[5] << 8) | data[6];\n' +
    '    ' + returnStatement + '\n' +
    '  }\n' +
    '  return 0.0;\n' +
    '}\n'
  );
  
  const code = funcName + '()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== WS2812 NeoPixel控制 ==========
function ensureWS2812(generator) {
  generator.addLibrary('Adafruit_NeoPixel', '#include "Adafruit_NeoPixel.h"');
}

Arduino.forBlock['ws2812_init'] = function(block, generator) {
  const pin = block.getFieldValue('PIN');
  const count = generator.valueToCode(block, 'COUNT', Arduino.ORDER_ATOMIC) || '4';
  const brightness = generator.valueToCode(block, 'BRIGHTNESS', Arduino.ORDER_ATOMIC) || '50';
  
  // 添加库文件
  generator.addLibrary('Adafruit_NeoPixel', '#include "Adafruit_NeoPixel.h"');
  
  // 添加对象声明
  generator.addObject('strip', `Adafruit_NeoPixel strip(${count}, ${pin}, NEO_GRB + NEO_KHZ800);`);
  
  // 添加初始化代码
  generator.addSetup('strip_begin', `strip.begin();\nstrip.setBrightness(${brightness});\nstrip.show();`);
  
  return '';
};

Arduino.forBlock['ws2812_set_single_color'] = function(block, generator) {
  ensureWS2812(generator);
  
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '0';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '0';
  
  return `strip.setPixelColor(${index}, strip.Color(${red}, ${green}, ${blue}));\nstrip.show();\n`;
};

Arduino.forBlock['ws2812_set_preset_color'] = function(block, generator) {
  ensureWS2812(generator);
  
  const color = block.getFieldValue('COLOR');
  let r = 0, g = 0, b = 0;
  
  switch(color) {
    case 'RED': r = 255; break;
    case 'GREEN': g = 255; break;
    case 'BLUE': b = 255; break;
    case 'WHITE': r = 255; g = 255; b = 255; break;
    case 'YELLOW': r = 255; g = 255; break;
    case 'CYAN': g = 255; b = 255; break;
    case 'MAGENTA': r = 255; b = 255; break;
    case 'ORANGE': r = 255; g = 165; break;
    case 'PURPLE': r = 128; b = 128; break;
    case 'PINK': r = 255; g = 192; b = 203; break;
  }
  
  return `for(int i=0; i<strip.numPixels(); i++) {\n  strip.setPixelColor(i, strip.Color(${r}, ${g}, ${b}));\n}\nstrip.show();\n`;
};

Arduino.forBlock['ws2812_clear'] = function(block, generator) {
  ensureWS2812(generator);
  return `strip.clear();\nstrip.show();\n`;
};

Arduino.forBlock['ws2812_show'] = function(block, generator) {
  ensureWS2812(generator);
  return `strip.show();\n`;
};

Arduino.forBlock['ws2812_set_brightness'] = function(block, generator) {
  ensureWS2812(generator);
  
  const brightness = generator.valueToCode(block, 'BRIGHTNESS', Arduino.ORDER_ATOMIC) || '50';
  return `strip.setBrightness(${brightness});\nstrip.show();\n`;
};

Arduino.forBlock['ws2812_color_wipe'] = function(block, generator) {
  ensureWS2812(generator);
  
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '0';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '0';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '50';
  
  generator.addFunction('colorWipe', `void colorWipe(uint32_t color, int wait) {
  for(int i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, color);
    strip.show();
    delay(wait);
  }
}`);
  
  return `colorWipe(strip.Color(${red}, ${green}, ${blue}), ${wait});\n`;
};

Arduino.forBlock['ws2812_rainbow'] = function(block, generator) {
  ensureWS2812(generator);
  
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '1';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '10';
  
  generator.addFunction('rainbow', `void rainbow(int wait) {
  for(long firstPixelHue = 0; firstPixelHue < 65536; firstPixelHue += 256) {
    strip.rainbow(firstPixelHue);
    strip.show();
    delay(wait);
  }
}`);
  
  return `for(int j=0; j<${cycles}; j++) {\n  rainbow(${wait});\n}\n`;
};

Arduino.forBlock['ws2812_rainbow_cycle'] = function(block, generator) {
  ensureWS2812(generator);
  
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '1';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '20';
  
  generator.addFunction('rainbowCycle', `void rainbowCycle(int wait) {
  for(int j=0; j<256*2; j++) {
    for(int i=0; i<strip.numPixels(); i++) {
      int hue = (i * 65536L / strip.numPixels()) + j * 256;
      strip.setPixelColor(i, strip.ColorHSV(hue));
    }
    strip.show();
    delay(wait);
  }
}`);
  
  return `for(int k=0; k<${cycles}; k++) {\n  rainbowCycle(${wait});\n}\n`;
};

Arduino.forBlock['ws2812_theater_chase'] = function(block, generator) {
  ensureWS2812(generator);
  
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '0';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '0';
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '5';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '100';
  
  generator.addFunction('theaterChase', `void theaterChase(uint32_t color, int wait, int cycles) {
  for(int a=0; a<cycles; a++) {
    for(int b=0; b<3; b++) {
      strip.clear();
      for(int c=b; c<strip.numPixels(); c += 3) {
        strip.setPixelColor(c, color);
      }
      strip.show();
      delay(wait);
    }
  }
}`);
  
  return `theaterChase(strip.Color(${red}, ${green}, ${blue}), ${wait}, ${cycles});\n`;
};

Arduino.forBlock['ws2812_breathing'] = function(block, generator) {
  ensureWS2812(generator);
  
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '255';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '0';
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '2';
  const step = generator.valueToCode(block, 'STEP', Arduino.ORDER_ATOMIC) || '5';
  
  generator.addFunction('breathing', `void breathing(uint8_t r, uint8_t g, uint8_t b, int cycles, int step) {
  for(int j=0; j<cycles; j++) {
    for(int brightness=0; brightness<=255; brightness+=step) {
      for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(r*brightness/255, g*brightness/255, b*brightness/255));
      }
      strip.show();
      delay(30);
    }
    for(int brightness=255; brightness>=0; brightness-=step) {
      for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(r*brightness/255, g*brightness/255, b*brightness/255));
      }
      strip.show();
      delay(30);
    }
  }
}`);
  
  return `breathing(${red}, ${green}, ${blue}, ${cycles}, ${step});\n`;
};

Arduino.forBlock['ws2812_running_light'] = function(block, generator) {
  ensureWS2812(generator);
  
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '255';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '0';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '0';
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '3';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '200';
  
  generator.addFunction('runningLight', `void runningLight(uint32_t color, int wait, int cycles) {
  for(int j=0; j<cycles; j++) {
    for(int i=0; i<strip.numPixels(); i++) {
      strip.clear();
      strip.setPixelColor(i, color);
      strip.show();
      delay(wait);
    }
  }
}`);
  
  return `runningLight(strip.Color(${red}, ${green}, ${blue}), ${wait}, ${cycles});\n`;
};

Arduino.forBlock['ws2812_sparkle'] = function(block, generator) {
  ensureWS2812(generator);
  
  const red = generator.valueToCode(block, 'RED', Arduino.ORDER_ATOMIC) || '255';
  const green = generator.valueToCode(block, 'GREEN', Arduino.ORDER_ATOMIC) || '255';
  const blue = generator.valueToCode(block, 'BLUE', Arduino.ORDER_ATOMIC) || '255';
  const count = generator.valueToCode(block, 'COUNT', Arduino.ORDER_ATOMIC) || '10';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '100';
  
  generator.addFunction('sparkle', `void sparkle(uint32_t color, int wait, int count) {
  for(int j=0; j<count; j++) {
    int pixel = random(strip.numPixels());
    strip.setPixelColor(pixel, color);
    strip.show();
    delay(wait);
    strip.setPixelColor(pixel, 0);
    strip.show();
  }
}`);
  
  return `sparkle(strip.Color(${red}, ${green}, ${blue}), ${wait}, ${count});\n`;
};

Arduino.forBlock['ws2812_sine_wave'] = function(block, generator) {
  ensureWS2812(generator);
  
  const cycles = generator.valueToCode(block, 'CYCLES', Arduino.ORDER_ATOMIC) || '3';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '20';
  
  generator.addFunction('sineWave', `void sineWave(int wait, int cycles) {
  for(int j=0; j<cycles*256; j++) {
    for(int i=0; i<strip.numPixels(); i++) {
      float angle = (i + j) * 2.0 * 3.14159 / strip.numPixels();
      uint8_t brightness = (sin(angle) + 1.0) * 127.5;
      int hue = (i * 65536L / strip.numPixels()) + j * 256;
      uint32_t color = strip.ColorHSV(hue, 255, brightness);
      strip.setPixelColor(i, color);
    }
    strip.show();
    delay(wait);
  }
}`);
  
  return `sineWave(${wait}, ${cycles});\n`;
};

Arduino.forBlock['ws2812_hsv_cycle'] = function(block, generator) {
  ensureWS2812(generator);
  
  const step = generator.valueToCode(block, 'STEP', Arduino.ORDER_ATOMIC) || '512';
  const wait = generator.valueToCode(block, 'WAIT', Arduino.ORDER_ATOMIC) || '10';
  
  generator.addFunction('hsvCycle', `void hsvCycle(int step, int wait) {
  for(uint16_t hue=0; hue<65536; hue+=step) {
    uint32_t color = strip.ColorHSV(hue);
    for(int i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, color);
    }
    strip.show();
    delay(wait);
  }
}`);
  
  return `hsvCycle(${step}, ${wait});\n`;
};

Arduino.forBlock['ws2812_get_led_count'] = function(block, generator) {
  ensureWS2812(generator);
  const code = 'strip.numPixels()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['ws2812_get_brightness'] = function(block, generator) {
  ensureWS2812(generator);
  const code = 'strip.getBrightness()';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ========== Sentry2视觉传感器 ==========
Arduino.forBlock['sentry2_begin_i2c'] = function(block, generator) {
  const sda_pin = block.getFieldValue('SDA_PIN');
  const scl_pin = block.getFieldValue('SCL_PIN');
  const addr = block.getFieldValue('ADDR');
  generator.addLibrary('SentryInclude', '#include <Sentry.h>');
  generator.addLibrary('WireInclude', '#include <Wire.h>');
  generator.addObject('sentry.Object', 'Sentry2 sentry(' + addr + ');');
  let code = 'Wire.begin(' + sda_pin + ', ' + scl_pin + ');\n';
  code += 'while (SENTRY_OK != sentry.begin(&Wire)) {yield();}\n';
  return code;
};

Arduino.forBlock['sentry2_camera_set_awb'] = function(block, generator) {
  const awb = block.getFieldValue('AWB');
  return 'sentry.CameraSetAwb(' + awb + ');\n';
};

Arduino.forBlock['sentry2_vision_set'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const vision_sta = block.getFieldValue('VISION_STA');
  return vision_sta === 'ON' ? 'sentry.VisionBegin(' + vision_type + ');\n' : 'sentry.VisionEnd(' + vision_type + ');\n';
};

Arduino.forBlock['sentry2_set_param_num'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  return 'sentry.SetParamNum(' + vision_type + ', (int)' + num + ');\n';
};

Arduino.forBlock['sentry2_set_color_param'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const x = block.getFieldValue('XVALUE');
  const y = block.getFieldValue('YVALUE');
  const w = block.getFieldValue('WIDTH');
  const h = block.getFieldValue('HIGHT');
  generator.addObject('param_obj', 'sentry_object_t param;');
  let code = 'param.x_value = ' + x + ';\nparam.y_value = ' + y + ';\nparam.width = ' + w + ';\nparam.height = ' + h + ';\n';
  code += 'sentry.SetParam(Sentry2::kVisionColor, &param, (int)' + num + ');\n';
  return code;
};

Arduino.forBlock['sentry2_set_blob_param'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const l = block.getFieldValue('COLOR_LABLE');
  const w = block.getFieldValue('WIDTH');
  const h = block.getFieldValue('HIGHT');
  generator.addObject('param_obj', 'sentry_object_t param;');
  let code = 'param.width = ' + w + ';\nparam.height = ' + h + ';\nparam.label = ' + l + ';\n';
  code += 'sentry.SetParam(Sentry2::kVisionBlob, &param, (int)' + num + ');\n';
  return code;
};

Arduino.forBlock['sentry2_get_vision_result'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  return ['sentry.GetValue(' + vision_type + ', kStatus)', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_color_value'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  return ['sentry.GetValue(Sentry2::kVisionColor, ' + obj + ', (int)' + num + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_value'] = function(block, generator) {
  const vision_type = block.getFieldValue('VISION_TYPE');
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('OBJ_INFO');
  return ['sentry.GetValue(' + vision_type + ', ' + obj + ', (int)' + num + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_qrcode_value_str'] = function(block, generator) {
  return ['String(sentry.GetQrCodeValue())', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['sentry2_get_color_label'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('COLOR_LABLE');
  return ['sentry.GetValue(Sentry2::kVisionColor, kLabel, (int)' + num + ') == ' + obj, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['sentry2_get_card_label'] = function(block, generator) {
  const num = block.getFieldValue('NUM');
  const obj = block.getFieldValue('CARD_LABLE');
  return ['sentry.GetValue(Sentry2::kVisionCard, kLabel, (int)' + num + ') == ' + obj, Arduino.ORDER_RELATIONAL];
};

// ========== 变量管理核心函数 ==========
/**
 * 注册变量到Blockly工作区
 * @param {string} varName - 变量名
 * @param {string} varType - 变量类型（可选）
 * @param {Object} workspace - Blockly工作区对象
 */
function registerVariableToBlockly(varName, varType, workspace) {
  if (!workspace) {
    workspace = Blockly.getMainWorkspace();
  }
  
  if (!workspace) {
    console.warn('无法获取Blockly工作区');
    return;
  }
  
  // 检查变量是否已存在
  const existingVar = workspace.getVariable(varName, varType || '');
  if (!existingVar) {
    // 创建新变量
    workspace.createVariable(varName, varType || '');
  }
}

/**
 * 重命名Blockly中的变量
 * @param {string} oldName - 旧变量名
 * @param {string} newName - 新变量名
 * @param {Object} workspace - Blockly工作区对象
 */
function renameVariableInBlockly(oldName, newName, workspace) {
  if (!workspace) {
    workspace = Blockly.getMainWorkspace();
  }
  
  if (!workspace) {
    console.warn('无法获取Blockly工作区');
    return;
  }
  
  // 获取旧变量
  const oldVar = workspace.getVariable(oldName);
  if (oldVar) {
    // 重命名变量
    workspace.renameVariableById(oldVar.getId(), newName);
  }
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerVariableToBlockly,
    renameVariableInBlockly
  };
}

// Generator file end

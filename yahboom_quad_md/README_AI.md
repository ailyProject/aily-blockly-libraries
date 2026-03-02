# Yahboom 四路电机驱动

Yahboom 四路电机驱动模块，支持 I2C / 串口双模式通信，控制 4 路带编码器或无编码器电机。

## 库信息
- **库名**: @aily-project/lib-yahboom-quad-motor-driver
- **版本**: 1.0.0
- **兼容**: Arduino AVR、MegaAVR、ESP32

## 块定义

### I2C 模式

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `yahboom_md_iic_init` | 语句块 | VAR(field_input), ADDR(dropdown), MOTOR_TYPE(dropdown) | `yahboom_md_iic_init("motor", 0x26, MOTOR_310)` | `MotorDriverIIC motor(0x26);` + `motor.begin(); motor.setMotorType(MOTOR_310);` |
| `yahboom_md_iic_set_deadzone` | 语句块 | VAR(field_variable:YahboomMD_IIC), DEADZONE(input_value) | `yahboom_md_iic_set_deadzone($motor, math_number(1300))` | `motor.setDeadzone(1300); delay(100);` |
| `yahboom_md_iic_set_pulse_line` | 语句块 | VAR(field_variable:YahboomMD_IIC), LINE(input_value) | `yahboom_md_iic_set_pulse_line($motor, math_number(13))` | `motor.setPulseLine(13); delay(100);` |
| `yahboom_md_iic_set_pulse_phase` | 语句块 | VAR(field_variable:YahboomMD_IIC), PHASE(input_value) | `yahboom_md_iic_set_pulse_phase($motor, math_number(20))` | `motor.setPulsePhase(20); delay(100);` |
| `yahboom_md_iic_set_wheel_diameter` | 语句块 | VAR(field_variable:YahboomMD_IIC), DIAMETER(input_value) | `yahboom_md_iic_set_wheel_diameter($motor, math_number(48))` | `motor.setWheelDiameter(48); delay(100);` |
| `yahboom_md_iic_control_speed` | 语句块 | VAR(field_variable:YahboomMD_IIC), M1-M4(input_value) | `yahboom_md_iic_control_speed($motor, 100, 100, 100, 100)` | `motor.controlSpeed(100, 100, 100, 100);` |
| `yahboom_md_iic_control_pwm` | 语句块 | VAR(field_variable:YahboomMD_IIC), M1-M4(input_value) | `yahboom_md_iic_control_pwm($motor, 200, 200, 200, 200)` | `motor.controlPWM(200, 200, 200, 200);` |
| `yahboom_md_iic_encoder_offset` | 值块(Number) | VAR(field_variable:YahboomMD_IIC), MOTOR(dropdown) | `yahboom_md_iic_encoder_offset($motor, 0)` | `readEncoderOffset_motor(0)` (辅助函数) |
| `yahboom_md_iic_encoder_total` | 值块(Number) | VAR(field_variable:YahboomMD_IIC), MOTOR(dropdown) | `yahboom_md_iic_encoder_total($motor, 0)` | `readEncoderTotal_motor(0)` (辅助函数) |

### 串口模式

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `yahboom_md_usart_init` | 语句块 | VAR(field_input), SERIAL(dropdown), MOTOR_TYPE(dropdown) | `yahboom_md_usart_init("motor", Serial, MOTOR_310)` | `MotorDriverUSART motor(Serial);` + setup + loop:receive |
| `yahboom_md_usart_set_deadzone` | 语句块 | VAR(field_variable:YahboomMD_USART), DEADZONE(input_value) | `yahboom_md_usart_set_deadzone($motor, math_number(1300))` | `motor.setDeadzone(1300); delay(100);` |
| `yahboom_md_usart_set_pulse_line` | 语句块 | VAR(field_variable:YahboomMD_USART), LINE(input_value) | `yahboom_md_usart_set_pulse_line($motor, math_number(13))` | `motor.setPulseLine(13); delay(100);` |
| `yahboom_md_usart_set_pulse_phase` | 语句块 | VAR(field_variable:YahboomMD_USART), PHASE(input_value) | `yahboom_md_usart_set_pulse_phase($motor, math_number(20))` | `motor.setPulsePhase(20); delay(100);` |
| `yahboom_md_usart_set_wheel_diameter` | 语句块 | VAR(field_variable:YahboomMD_USART), DIAMETER(input_value) | `yahboom_md_usart_set_wheel_diameter($motor, math_number(48))` | `motor.setWheelDiameter(48); delay(100);` |
| `yahboom_md_usart_set_pid` | 语句块 | VAR(field_variable:YahboomMD_USART), P/I/D(input_value) | `yahboom_md_usart_set_pid($motor, 0.1, 0.01, 0.001)` | `motor.setPID(0.1, 0.01, 0.001); delay(100);` |
| `yahboom_md_usart_set_upload_data` | 语句块 | VAR(field_variable:YahboomMD_USART), ALL_ENCODER/TEN_ENCODER/SPEED(dropdown) | `yahboom_md_usart_set_upload_data($motor, true, false, false)` | `motor.setUploadData(true, false, false); delay(100);` |
| `yahboom_md_usart_control_speed` | 语句块 | VAR(field_variable:YahboomMD_USART), M1-M4(input_value) | `yahboom_md_usart_control_speed($motor, 100, 100, 100, 100)` | `motor.controlSpeed(100, 100, 100, 100);` |
| `yahboom_md_usart_control_pwm` | 语句块 | VAR(field_variable:YahboomMD_USART), M1-M4(input_value) | `yahboom_md_usart_control_pwm($motor, 200, 200, 200, 200)` | `motor.controlPWM(200, 200, 200, 200);` |
| `yahboom_md_usart_data_available` | 值块(Boolean) | VAR(field_variable:YahboomMD_USART) | `yahboom_md_usart_data_available($motor)` | `motor.recvFlag == 1` |
| `yahboom_md_usart_parse_data` | 语句块 | VAR(field_variable:YahboomMD_USART) | `yahboom_md_usart_parse_data($motor)` | `motor.recvFlag = 0; motor.parseData();` |
| `yahboom_md_usart_encoder_offset` | 值块(Number) | VAR(field_variable:YahboomMD_USART), MOTOR(dropdown) | `yahboom_md_usart_encoder_offset($motor, 0)` | `motor.encoderOffset[0]` |
| `yahboom_md_usart_encoder_total` | 值块(Number) | VAR(field_variable:YahboomMD_USART), MOTOR(dropdown) | `yahboom_md_usart_encoder_total($motor, 0)` | `motor.encoderNow[0]` |
| `yahboom_md_usart_speed` | 值块(Number) | VAR(field_variable:YahboomMD_USART), MOTOR(dropdown) | `yahboom_md_usart_speed($motor, 0)` | `motor.speed[0]` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| ADDR | 0x26(默认), 0x27, 0x28, 0x29 | I2C地址 |
| SERIAL | ${board.serialPort} | 串口 |
| MOTOR_TYPE | MOTOR_520, MOTOR_310, MOTOR_TT_ENCODER, MOTOR_TT, MOTOR_520_L | 电机类型 |
| MOTOR | 0(M1), 1(M2), 2(M3), 3(M4) | 电机通道 |
| ALL_ENCODER | true(开启), false(关闭) | 总编码器上报 |
| TEN_ENCODER | true(开启), false(关闭) | 10ms编码器上报 |
| SPEED | true(开启), false(关闭) | 速度上报 |

## ABS 示例

### I2C 模式 - 310电机速度控制
```
arduino_setup()
    yahboom_md_iic_init("motor", 0x26, MOTOR_310)
    yahboom_md_iic_set_pulse_phase($motor, math_number(20))
    yahboom_md_iic_set_pulse_line($motor, math_number(13))
    yahboom_md_iic_set_wheel_diameter($motor, math_number(48))
    yahboom_md_iic_set_deadzone($motor, math_number(1300))

arduino_loop()
    yahboom_md_iic_control_speed($motor, math_number(100), math_number(100), math_number(100), math_number(100))
    time_delay(math_number(100))
    serial_println(Serial, yahboom_md_iic_encoder_total($motor, 0))
```

### 串口模式 - 310电机速度控制 + 编码器读取
```
arduino_setup()
    yahboom_md_usart_init("motor", Serial, MOTOR_310)
    yahboom_md_usart_set_pulse_phase($motor, math_number(20))
    yahboom_md_usart_set_pulse_line($motor, math_number(13))
    yahboom_md_usart_set_wheel_diameter($motor, math_number(48))
    yahboom_md_usart_set_deadzone($motor, math_number(1300))
    yahboom_md_usart_set_upload_data($motor, true, false, false)

arduino_loop()
    controls_if(yahboom_md_usart_data_available($motor))
        yahboom_md_usart_parse_data($motor)
        yahboom_md_usart_control_speed($motor, math_number(100), math_number(100), math_number(100), math_number(100))
```

### I2C 模式 - TT直流电机PWM控制
```
arduino_setup()
    yahboom_md_iic_init("motor", 0x26, MOTOR_TT)
    yahboom_md_iic_set_pulse_phase($motor, math_number(48))
    yahboom_md_iic_set_deadzone($motor, math_number(1000))

arduino_loop()
    yahboom_md_iic_control_pwm($motor, math_number(500), math_number(500), math_number(500), math_number(500))
```

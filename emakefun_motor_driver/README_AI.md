# Emakefun 电机驱动板

Emakefun Motor Driver Board，I2C 多功能电机驱动扩展板，支持直流电机、舵机、步进电机。

## 库信息
- **库名**: @aily-project/lib-emakefun-motor-driver
- **版本**: 1.0.0
- **兼容**: Arduino AVR、MegaAVR、ESP32

## 块定义

| 块类型 | 连接 | 参数 | ABS格式 | 生成代码 |
|--------|------|------|---------|----------|
| `emakefun_md_init` | 语句块 | VAR(field_input), ADDR(dropdown), FREQ(dropdown) | `emakefun_md_init("mMotor", 0x60, 50)` | `Emakefun_MotorDriver mMotor = Emakefun_MotorDriver(0x60);` + setup: `mMotor.begin(50);` |
| `emakefun_md_dc_run` | 语句块 | VAR(field_variable), MOTOR(dropdown), SPEED(input_value), DIR(dropdown) | `emakefun_md_dc_run($mMotor, 1, math_number(200), FORWARD)` | `mMotor_dc1->setSpeed(200); mMotor_dc1->run(FORWARD);` |
| `emakefun_md_dc_stop` | 语句块 | VAR(field_variable), MOTOR(dropdown), ACTION(dropdown) | `emakefun_md_dc_stop($mMotor, 1, BRAKE)` | `mMotor_dc1->run(BRAKE);` |
| `emakefun_md_servo_write` | 语句块 | VAR(field_variable), SERVO(dropdown), ANGLE(input_value) | `emakefun_md_servo_write($mMotor, 1, math_number(90))` | `mMotor_servo1->writeServo(90);` |
| `emakefun_md_servo_write_speed` | 语句块 | VAR(field_variable), SERVO(dropdown), ANGLE(input_value), SPEED(input_value) | `emakefun_md_servo_write_speed($mMotor, 1, math_number(90), math_number(5))` | `mMotor_servo1->writeServo(90, 5);` |
| `emakefun_md_servo_read` | 值块 | VAR(field_variable), SERVO(dropdown) | `emakefun_md_servo_read($mMotor, 1)` | `mMotor_servo1->readDegrees()` |
| `emakefun_md_stepper_speed` | 语句块 | VAR(field_variable), STEPPER(dropdown), RPM(input_value) | `emakefun_md_stepper_speed($mMotor, 1, math_number(400))` | `mMotor_stepper1->setSpeed(400);` |
| `emakefun_md_stepper_step` | 语句块 | VAR(field_variable), STEPPER(dropdown), STEPS(input_value), DIR(dropdown), STYLE(dropdown) | `emakefun_md_stepper_step($mMotor, 1, math_number(200), FORWARD, SINGLE)` | `mMotor_stepper1->step(200, FORWARD, SINGLE);` |
| `emakefun_md_stepper_release` | 语句块 | VAR(field_variable), STEPPER(dropdown) | `emakefun_md_stepper_release($mMotor, 1)` | `mMotor_stepper1->release();` |

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| ADDR | 0x60(默认), 0x61, 0x62, 0x63 | I2C地址 |
| FREQ | 50(舵机/直流), 1600(步进) | PWM频率Hz |
| MOTOR | 1(M1), 2(M2), 3(M3), 4(M4) | 直流电机通道 |
| DIR | FORWARD(正转), BACKWARD(反转) | 运动方向 |
| ACTION | BRAKE(刹车), RELEASE(释放) | 停止动作 |
| SERVO | 1-8(S1-S8) | 舵机通道 |
| STEPPER | 1, 2 | 步进电机通道 |
| STYLE | SINGLE(单步), DOUBLE(双步), INTERLEAVE(交错), MICROSTEP(微步) | 步进模式 |

## ABS 示例

### 直流电机控制
```
arduino_setup()
    emakefun_md_init("mMotor", 0x60, 50)

arduino_loop()
    emakefun_md_dc_run($mMotor, 1, math_number(200), FORWARD)
    time_delay(math_number(2000))
    emakefun_md_dc_run($mMotor, 1, math_number(200), BACKWARD)
    time_delay(math_number(2000))
    emakefun_md_dc_stop($mMotor, 1, BRAKE)
    time_delay(math_number(2000))
```

### 舵机控制
```
arduino_setup()
    emakefun_md_init("mMotor", 0x60, 50)

arduino_loop()
    emakefun_md_servo_write($mMotor, 1, math_number(0))
    time_delay(math_number(1000))
    emakefun_md_servo_write($mMotor, 1, math_number(90))
    time_delay(math_number(1000))
    emakefun_md_servo_write($mMotor, 1, math_number(180))
    time_delay(math_number(1000))
```

### 步进电机控制
```
arduino_setup()
    emakefun_md_init("mMotor", 0x60, 1600)
    emakefun_md_stepper_speed($mMotor, 1, math_number(400))

arduino_loop()
    emakefun_md_stepper_step($mMotor, 1, math_number(200), FORWARD, DOUBLE)
    emakefun_md_stepper_release($mMotor, 1)
    time_delay(math_number(1000))
    emakefun_md_stepper_step($mMotor, 1, math_number(200), BACKWARD, DOUBLE)
    emakefun_md_stepper_release($mMotor, 1)
    time_delay(math_number(1000))
```

## 注意事项

1. **初始化**: `emakefun_md_init` 放在 `arduino_setup()` 中，设置 I2C 地址和 PWM 频率
2. **变量引用**: 初始化后用 `$mMotor` 引用驱动板对象
3. **PWM频率**: 舵机/直流电机用 50Hz，步进电机用 1600Hz，不建议混用
4. **直流电机速度**: 范围 0-255
5. **舵机角度**: 范围 0-180 度
6. **舵机速度**: 范围 1-10，10 最快
7. **步进步数**: 标准步进电机 200 步 = 1 圈
8. **步进模式**: SINGLE(单步精度高)、DOUBLE(双步力矩大)、INTERLEAVE(交错精度更高)、MICROSTEP(微步最平滑)

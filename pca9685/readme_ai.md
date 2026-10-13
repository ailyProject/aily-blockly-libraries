# PCA9685 电机舵机驱动库

基于 I2C 的 PCA9685 16 路 PWM 驱动库，用一颗芯片同时驱动 4 路直流电机（M1~M4，占用 LED0~LED7）与 8 路舵机（S1~S8，占用 LED8~LED15），适用于 Arduino UNO/MEGA、ESP32 系列（含 C3/S3）、Arduino UNO R4 等开发板。

## Library Info
- **Name**: @aily-project/lib-pca9685
- **Version**: 0.0.1

## Block Definitions
| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|------------------------------|------------|----------------|
| `pca9685_init` | Statement | ADDR(dropdown), FREQ(dropdown) | `pca9685_init("0x40", "50")` | `Wire.begin(); ↵ pca9685.begin(0x40); ↵ pca9685.setPWMFreq(50);` |
| `pca9685_i2c_pins` | Statement | SDA(dropdown), SCL(dropdown) | `pca9685_i2c_pins("21", "22")` | 仅作为 `pca9685_init` 的配置项，本身不生成代码 |
| `pca9685_motor_set` | Statement | MOTOR(dropdown), SPEED(field_number) | `pca9685_motor_set("1", 50)` | `pca9685.setMotor(1, 50);` |
| `pca9685_motor_stop` | Statement | MOTOR(dropdown) | `pca9685_motor_stop("1")` | `pca9685.stopMotor(1);` |
| `pca9685_motor_stop_all` | Statement | （无参数） | `pca9685_motor_stop_all()` | `pca9685.stopAllMotors();` |
| `pca9685_servo_write` | Statement | SERVO(dropdown), ANGLE(field_number) | `pca9685_servo_write("1", 90)` | `pca9685.setServoAngle(1, 90);` |
| `pca9685_servo_write_us` | Statement | SERVO(dropdown), US(field_number) | `pca9685_servo_write_us("1", 1500)` | `pca9685.setServoPulse(1, 1500);` |
| `pca9685_servo_range` | Statement | MIN_US(field_number), MAX_US(field_number) | `pca9685_servo_range(500, 2500)` | `pca9685.setServoPulseRange(500, 2500);` |

## Parameter Options
| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F | `pca9685_init` 的 I2C 地址，默认 0x40 |
| FREQ | 50, 60, 100, 200, 300, 400, 500, 1000, 1600 | `pca9685_init` 的 PWM 频率(Hz)，同时用舵机时必须为 50 |
| SDA / SCL | 开发板可用数字引脚 | `pca9685_i2c_pins` 自定义 I2C 引脚 |
| MOTOR | 1(M1), 2(M2), 3(M3), 4(M4) | `pca9685_motor_set` / `pca9685_motor_stop` |
| SPEED | -100 ~ 100 (field_number) | 正值正转，负值反转，0 为停止 |
| SERVO | 1(S1), 2(S2), 3(S3), 4(S4), 5(S5), 6(S6), 7(S7), 8(S8) | `pca9685_servo_write` / `pca9685_servo_write_us` |
| ANGLE | 0 ~ 180 (field_number) | 舵机角度(°) |
| US | 0 ~ 20000 (field_number) | 舵机脉宽(μs)，常用 500~2500，1500 为中位 |
| MIN_US / MAX_US | 0 ~ 20000 (field_number) | 舵机 0° / 180° 对应的脉宽(μs) |

## ABS Examples
### 基础用法
```
arduino_setup()
    pca9685_init("0x40", "50")
    pca9685_servo_range(500, 2500)
arduino_loop()
    pca9685_servo_write("1", 90)
    pca9685_motor_set("1", 50)
    time_delay(math_number(1000))
    pca9685_motor_set("1", -50)
    time_delay(math_number(1000))
    pca9685_motor_stop_all()
```

## Notes
1. **PWM 频率全局共用**：PCA9685 的 16 个通道共用一个频率；同时使用舵机时频率必须为 50Hz，仅驱动直流电机时可用 1000Hz 以上。
2. **通道分配**：直流电机 M1~M4 占用 LED0~LED7（每路 2 个通道，正转/反转）；舵机 S1~S8 占用 LED8~LED15。
3. **电机方向**：SPEED 为负值即为反转，0 为停止；停止为自由停止（两路输出关闭）。
4. **参数顺序**：ABS 参数顺序与 `block.json` 的 args0 顺序一致。
5. **输入值**：`field_number` 直接写字面量（如 `50`）；`field_dropdown` 写选项值字符串（如 `"1"`）。
6. **自定义 I2C 引脚**：`pca9685_i2c_pins` 不单独生成代码，仅影响 `pca9685_init` 生成的 `Wire.begin(SDA, SCL)`。

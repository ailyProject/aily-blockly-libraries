# PCA9685舵机驱动

PCA9685 I2C 16通道PWM舵机驱动库，支持舵机角度控制、PWM输出、微秒脉宽控制等功能

## Library Info
- **Name**: @aily-project/lib-adafruit-pca9685
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pca9685_create` | Statement | VAR(field_input) | `pca9685_create("pwm")` | `` |
| `pca9685_begin` | Statement | VAR(field_variable), ADDRESS(input_value) | `pca9685_begin($pwm, math_number(0))` | (dynamic code) |
| `pca9685_set_freq` | Statement | VAR(field_variable), FREQ(input_value) | `pca9685_set_freq($pwm, math_number(0))` | (dynamic code) |
| `pca9685_set_servo_angle` | Statement | VAR(field_variable), CHANNEL(input_value), ANGLE(input_value) | `pca9685_set_servo_angle($pwm, math_number(0), math_number(0))` | (dynamic code) |
| `pca9685_set_pwm` | Statement | VAR(field_variable), CHANNEL(input_value), ON(input_value), OFF(input_value) | `pca9685_set_pwm($pwm, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `pca9685_set_microseconds` | Statement | VAR(field_variable), CHANNEL(input_value), MICROSECONDS(input_value) | `pca9685_set_microseconds($pwm, math_number(0), math_number(0))` | (dynamic code) |
| `pca9685_config_servo` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `pca9685_config_servo($pwm, math_number(0), math_number(0))` | `//` |
| `pca9685_set_all_servos` | Statement | VAR(field_variable), ANGLE(input_value) | `pca9685_set_all_servos($pwm, math_number(0))` | `for (int i = 0; i < 16; i++) {\n` |
| `pca9685_sleep` | Statement | VAR(field_variable) | `pca9685_sleep($pwm)` | (dynamic code) |
| `pca9685_wakeup` | Statement | VAR(field_variable) | `pca9685_wakeup($pwm)` | (dynamic code) |
| `pca9685_set_servo_range` | Statement | VAR(field_variable), CHANNEL(input_value), MIN_ANGLE(input_value), MIN_PWM(input_value), MAX_ANGLE(input_value), MAX_PWM(input_value) | `pca9685_set_servo_range($pwm, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `// 通道` |
| `pca9685_angle_to_pwm` | Value | VAR(field_variable), ANGLE(input_value) | `pca9685_angle_to_pwm($pwm, math_number(0))` | `map(` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pca9685_create("pwm")
    pca9685_begin($pwm, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pca9685_angle_to_pwm($pwm, math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `pca9685_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

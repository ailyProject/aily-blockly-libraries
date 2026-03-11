# Summer STM32 Driver

ESP32 Summer Board智能小车综合控制库，支持编码电机、舵机等

## Library Info
- **Name**: @aily-project/lib-summer-stm-driver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `car_is_key_pressed` | Value | KEY(dropdown) | `car_is_key_pressed(0)` | `(readKeyEvent() == ...)` |
| `car_servo_angle` | Statement | PIN(dropdown), ANGLE(input_value) | `car_servo_angle(0, math_number(0))` | `STM32_I2C.servoAngle(..., ...);\n` |
| `car_motor_control_single` | Statement | MOTOR_ID(dropdown), DIRECTION(dropdown), SPEED(input_value) | `car_motor_control_single(0, 0, math_number(9600))` | `STM32_I2C.motorControl(..., ..., constrain(..., 0, 255));\n` |
| `car_motor_stop_single` | Statement | MOTOR_ID(dropdown) | `car_motor_stop_single(0)` | `STM32_I2C.motorStop(...);\n` |
| `car_stepper_control` | Statement | STEPPER_NUM(dropdown), DIRECTION(dropdown), DEGREES(input_value), SPEED(input_value) | `car_stepper_control(0, 0, math_number(0), math_number(9600))` | `STM32_I2C.stepperControlSpeed(..., ..., ..., ...);\n` |
| `car_stepper_control_turns` | Statement | STEPPER_NUM(dropdown), DIRECTION(dropdown), TURNS(input_value), SPEED(input_value) | `car_stepper_control_turns(0, 0, math_number(0), math_number(9600))` | `STM32_I2C.stepperControlTurns(..., ..., ..., ...);\n` |
| `jy61p_set_zero` | Statement | (none) | `jy61p_set_zero()` | `STM32_I2C.jy61pSetZero();\n` |
| `jy61p_get_angle` | Value | ANGLE_TYPE(dropdown) | `jy61p_get_angle(YAW)` | `STM32_I2C.jy61pGetAngle(` |
| `jy61p_get_acceleration` | Value | AXIS(dropdown) | `jy61p_get_acceleration(X)` | `STM32_I2C.jy61pGetAcceleration(` |
| `jy61p_get_gyro` | Value | AXIS(dropdown) | `jy61p_get_gyro(X)` | `STM32_I2C.jy61pGetGyro(` |
| `car_servo_angle_value` | Value | ANGLE(field_angle) | `car_servo_angle_value(90)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | 0, 1, 2 | A / B / C |
| PIN | 0, 1, 2, 3, 4, 5 | S1 / S2 / S3 / S4 / S5 / S6 |
| MOTOR_ID | 0, 1, 2, 3 | EL1 / ER1 / EL2 / ER2 |
| DIRECTION | 0, 1, 2 | 停止 / 正转 / 反转 |
| STEPPER_NUM | 0, 1 | L / R |
| ANGLE_TYPE | YAW, PITCH, ROLL | Yaw (航向角) / Pitch (俯仰角) / Roll (横滚角) |
| AXIS | X, Y, Z | X轴 / Y轴 / Z轴 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, car_is_key_pressed(0))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

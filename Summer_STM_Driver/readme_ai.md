# Summer STM32 Driver

ESP32 Summer Board smart car comprehensive control library supports coding motors, servos, etc.

## Library Info
- **Name**: @aily-project/lib-summer-stm-driver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `car_is_key_pressed` | Value | KEY(dropdown) | `car_is_key_pressed("0")` | (readKeyEvent() == ...) |
| `car_servo_angle` | Statement | PIN(dropdown), ANGLE(input_value) | `car_servo_angle("0", math_number(90))` | STM32_I2C.servoAngle(..., ...);\n |
| `car_motor_control_single` | Statement | MOTOR_ID(dropdown), DIRECTION(dropdown), SPEED(input_value) | `car_motor_control_single("0", "0", math_number(9600))` | STM32_I2C.motorControl(..., ..., constrain(..., 0, 255));\n |
| `car_motor_stop_single` | Statement | MOTOR_ID(dropdown) | `car_motor_stop_single("0")` | STM32_I2C.motorStop(...);\n |
| `car_stepper_control` | Statement | STEPPER_NUM(dropdown), DIRECTION(dropdown), DEGREES(input_value), SPEED(input_value) | `car_stepper_control("0", "0", math_number(90), math_number(9600))` | STM32_I2C.stepperControlSpeed(..., ..., ..., ...);\n |
| `car_stepper_control_turns` | Statement | STEPPER_NUM(dropdown), DIRECTION(dropdown), TURNS(input_value), SPEED(input_value) | `car_stepper_control_turns("0", "0", math_number(0), math_number(9600))` | STM32_I2C.stepperControlTurns(..., ..., ..., ...);\n |
| `jy61p_set_zero` | Statement | (none) | `jy61p_set_zero()` | STM32_I2C.jy61pSetZero();\n |
| `jy61p_get_angle` | Value | ANGLE_TYPE(dropdown) | `jy61p_get_angle(YAW)` | STM32_I2C.jy61pGetAngle('...') |
| `jy61p_get_acceleration` | Value | AXIS(dropdown) | `jy61p_get_acceleration(X)` | STM32_I2C.jy61pGetAcceleration('...') |
| `jy61p_get_gyro` | Value | AXIS(dropdown) | `jy61p_get_gyro(X)` | STM32_I2C.jy61pGetGyro('...') |
| `car_servo_angle_value` | Value | ANGLE(field_angle) | `car_servo_angle_value(90)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY | 0, 1, 2 | car_is_key_pressed |
| PIN | 0, 1, 2, 3, 4, 5 | car_servo_angle |
| MOTOR_ID | 0, 1, 2, 3 | car_motor_control_single, car_motor_stop_single |
| DIRECTION | 0, 1, 2 | car_motor_control_single |
| STEPPER_NUM | 0, 1 | car_stepper_control, car_stepper_control_turns |
| DIRECTION | 0, 1 | car_stepper_control, car_stepper_control_turns |
| ANGLE_TYPE | YAW, PITCH, ROLL | jy61p_get_angle |
| AXIS | X, Y, Z | jy61p_get_acceleration, jy61p_get_gyro |

## ABS Examples

### Basic Usage
```
arduino_setup()
    car_servo_angle("0", math_number(90))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, car_is_key_pressed("0"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

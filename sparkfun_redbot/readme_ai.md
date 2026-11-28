# SparkFun RedBot Robot Platform

Blockly wrapper for the SparkFun RedBot robotics platform.

## Library Info
- **Name**: @aily-project/lib-sparkfun-redbot
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `redbot_motors_init` | Statement | VAR(field_input) | `redbot_motors_init("motors")` | `RedBotMotors motors;` |
| `redbot_motors_drive` | Statement | VAR(field_variable), SPEED(input_value) | `redbot_motors_drive($motors, math_number(9600))` | `motors.drive(1);` |
| `redbot_motors_pivot` | Statement | VAR(field_variable), SPEED(input_value) | `redbot_motors_pivot($motors, math_number(9600))` | `motors.pivot(1);` |
| `redbot_motors_stop` | Statement | VAR(field_variable) | `redbot_motors_stop($motors)` | `motors.stop();` |
| `redbot_motors_brake` | Statement | VAR(field_variable) | `redbot_motors_brake($motors)` | `motors.brake();` |
| `redbot_sensor_init` | Statement | VAR(field_input), PIN(input_value) | `redbot_sensor_init("sensor1", math_number(2))` | `RedBotSensor sensor1(1);` |
| `redbot_sensor_read` | Value | VAR(field_variable) | `redbot_sensor_read($sensor1)` | `sensor1.read()` |
| `redbot_bumper_init` | Statement | VAR(field_input), PIN(input_value) | `redbot_bumper_init("bumper1", math_number(2))` | `RedBotBumper bumper1(1);` |
| `redbot_bumper_read` | Value | VAR(field_variable) | `redbot_bumper_read($bumper1)` | `bumper1.read() == LOW` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    redbot_motors_init("motors")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, redbot_sensor_read($sensor1))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `redbot_motors_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

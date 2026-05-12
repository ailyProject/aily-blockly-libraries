# SparkFun RedBot Robot Platform

Blockly wrapper for the SparkFun RedBot robotics platform.

## Library Info
- **Name**: @aily-project/lib-sparkfun-redbot
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `redbot_motors_init` | Statement | VAR(field_input) | `redbot_motors_init("motors")` | Dynamic code |
| `redbot_motors_drive` | Statement | VAR(field_variable), SPEED(input_value) | `redbot_motors_drive(variables_get($motors), math_number(9600))` | Dynamic code |
| `redbot_motors_pivot` | Statement | VAR(field_variable), SPEED(input_value) | `redbot_motors_pivot(variables_get($motors), math_number(9600))` | Dynamic code |
| `redbot_motors_stop` | Statement | VAR(field_variable) | `redbot_motors_stop(variables_get($motors))` | Dynamic code |
| `redbot_motors_brake` | Statement | VAR(field_variable) | `redbot_motors_brake(variables_get($motors))` | Dynamic code |
| `redbot_sensor_init` | Statement | VAR(field_input), PIN(input_value) | `redbot_sensor_init("sensor1", math_number(2))` | Dynamic code |
| `redbot_sensor_read` | Value | VAR(field_variable) | `redbot_sensor_read(variables_get($sensor1))` | Dynamic code |
| `redbot_bumper_init` | Statement | VAR(field_input), PIN(input_value) | `redbot_bumper_init("bumper1", math_number(2))` | Dynamic code |
| `redbot_bumper_read` | Value | VAR(field_variable) | `redbot_bumper_read(variables_get($bumper1))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    redbot_motors_init("motors")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, redbot_sensor_read(variables_get($sensor1)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `redbot_motors_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

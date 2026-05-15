# SparkFun HMC6343 3-Axis Compass

Blockly wrapper for the SparkFun HMC6343 3-axis compass sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hmc6343
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hmc6343_init` | Statement | VAR(field_input) | `hmc6343_init("compass")` | Wire.begin();\n |
| `hmc6343_read_heading` | Statement | VAR(field_variable) | `hmc6343_read_heading(variables_get($compass))` | Dynamic code |
| `hmc6343_read_mag` | Statement | VAR(field_variable) | `hmc6343_read_mag(variables_get($compass))` | Dynamic code |
| `hmc6343_read_accel` | Statement | VAR(field_variable) | `hmc6343_read_accel(variables_get($compass))` | Dynamic code |
| `hmc6343_get_value` | Value | VAR(field_variable), FIELD(dropdown) | `hmc6343_get_value(variables_get($compass), heading)` | Dynamic code |
| `hmc6343_set_orientation` | Statement | VAR(field_variable), ORIENT(dropdown) | `hmc6343_set_orientation(variables_get($compass), "0")` | Dynamic code |
| `hmc6343_sleep_control` | Statement | VAR(field_variable), MODE(dropdown) | `hmc6343_sleep_control(variables_get($compass), sleep)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | heading, pitch, roll, magX, magY, magZ, accelX, accelY, accelZ, temperature | hmc6343_get_value |
| ORIENT | 0, 1, 2 | hmc6343_set_orientation |
| MODE | sleep, wake | hmc6343_sleep_control |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hmc6343_init("compass")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hmc6343_get_value(variables_get($compass), heading))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `hmc6343_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

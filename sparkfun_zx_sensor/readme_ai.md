# SparkFun ZX Distance and Gesture Sensor

Blockly wrapper for the SparkFun ZX distance and gesture sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-zx-sensor
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zx_sensor_init` | Statement | VAR(field_input) | `zx_sensor_init("gesture")` | Wire.begin();\n |
| `zx_sensor_position_available` | Value | VAR(field_variable) | `zx_sensor_position_available(variables_get($gesture))` | Dynamic code |
| `zx_sensor_gesture_available` | Value | VAR(field_variable) | `zx_sensor_gesture_available(variables_get($gesture))` | Dynamic code |
| `zx_sensor_read_x` | Value | VAR(field_variable) | `zx_sensor_read_x(variables_get($gesture))` | Dynamic code |
| `zx_sensor_read_z` | Value | VAR(field_variable) | `zx_sensor_read_z(variables_get($gesture))` | Dynamic code |
| `zx_sensor_read_gesture` | Value | VAR(field_variable) | `zx_sensor_read_gesture(variables_get($gesture))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    zx_sensor_init("gesture")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, zx_sensor_position_available(variables_get($gesture)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `zx_sensor_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

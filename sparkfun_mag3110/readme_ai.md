# SparkFun MAG3110 3-Axis Magnetometer

Blockly wrapper for SparkFun MAG3110 3-axis magnetometer.

## Library Info
- **Name**: @aily-project/lib-sparkfun-mag3110
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mag3110_init` | Statement | VAR(field_input) | `mag3110_init("mag")` | Wire.begin();\n |
| `mag3110_start` | Statement | VAR(field_variable) | `mag3110_start(variables_get($mag))` | Dynamic code |
| `mag3110_data_ready` | Value | VAR(field_variable) | `mag3110_data_ready(variables_get($mag))` | Dynamic code |
| `mag3110_read_axis` | Value | VAR(field_variable), AXIS(dropdown) | `mag3110_read_axis(variables_get($mag), X)` | (mag3110ReadMag_ |
| `mag3110_read_heading` | Value | VAR(field_variable) | `mag3110_read_heading(variables_get($mag))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| AXIS | X, Y, Z | mag3110_read_axis |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mag3110_init("mag")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mag3110_data_ready(variables_get($mag)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `mag3110_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

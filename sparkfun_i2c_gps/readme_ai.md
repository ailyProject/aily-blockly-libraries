# SparkFun I2C GPS Module

Blockly wrapper for SparkFun I2C GPS library, reads NMEA data over I2C.

## Library Info
- **Name**: @aily-project/lib-sparkfun-i2c-gps
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `i2cgps_init` | Statement | VAR(field_input) | `i2cgps_init("gps")` | Wire.begin();\n |
| `i2cgps_available` | Value | VAR(field_variable) | `i2cgps_available(variables_get($gps))` | Dynamic code |
| `i2cgps_read` | Value | VAR(field_variable) | `i2cgps_read(variables_get($gps))` | Dynamic code |
| `i2cgps_check` | Statement | VAR(field_variable) | `i2cgps_check(variables_get($gps))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    i2cgps_init("gps")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, i2cgps_available(variables_get($gps)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `i2cgps_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun VEML6075 UV Sensor

Blockly wrapper for the SparkFun VEML6075 UVA/UVB UV index sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml6075
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml6075_init` | Statement | VAR(field_input) | `veml6075_init("uv")` | Wire.begin();\n |
| `veml6075_uva` | Value | VAR(field_variable) | `veml6075_uva(variables_get($uv))` | Dynamic code |
| `veml6075_uvb` | Value | VAR(field_variable) | `veml6075_uvb(variables_get($uv))` | Dynamic code |
| `veml6075_index` | Value | VAR(field_variable) | `veml6075_index(variables_get($uv))` | Dynamic code |
| `veml6075_raw_uva` | Value | VAR(field_variable) | `veml6075_raw_uva(variables_get($uv))` | Dynamic code |
| `veml6075_raw_uvb` | Value | VAR(field_variable) | `veml6075_raw_uvb(variables_get($uv))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    veml6075_init("uv")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, veml6075_uva(variables_get($uv)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `veml6075_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

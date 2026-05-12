# SparkFun SHTC3 Humidity and Temperature Sensor

Blockly wrapper for the SparkFun SHTC3 I2C humidity and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-shtc3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `shtc3_init` | Statement | VAR(field_input) | `shtc3_init("shtc3")` | Wire.begin();\n |
| `shtc3_update` | Statement | VAR(field_variable) | `shtc3_update(variables_get($shtc3))` | Dynamic code |
| `shtc3_temp_c` | Value | VAR(field_variable) | `shtc3_temp_c(variables_get($shtc3))` | Dynamic code |
| `shtc3_temp_f` | Value | VAR(field_variable) | `shtc3_temp_f(variables_get($shtc3))` | Dynamic code |
| `shtc3_humidity` | Value | VAR(field_variable) | `shtc3_humidity(variables_get($shtc3))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    shtc3_init("shtc3")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, shtc3_temp_c(variables_get($shtc3)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `shtc3_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

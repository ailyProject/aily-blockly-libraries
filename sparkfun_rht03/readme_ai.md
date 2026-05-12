# SparkFun RHT03 Humidity and Temperature Sensor

Blockly wrapper for the SparkFun RHT03 single-wire humidity and temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rht03
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rht03_init` | Statement | VAR(field_input), PIN(field_number) | `rht03_init("rht", 2)` | Dynamic code |
| `rht03_update` | Value | VAR(field_variable) | `rht03_update(variables_get($rht))` | Dynamic code |
| `rht03_temp_c` | Value | VAR(field_variable) | `rht03_temp_c(variables_get($rht))` | Dynamic code |
| `rht03_temp_f` | Value | VAR(field_variable) | `rht03_temp_f(variables_get($rht))` | Dynamic code |
| `rht03_humidity` | Value | VAR(field_variable) | `rht03_humidity(variables_get($rht))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rht03_init("rht", 2)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rht03_update(variables_get($rht)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rht03_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

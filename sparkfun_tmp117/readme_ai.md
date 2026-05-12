# SparkFun TMP117 High Accuracy Temperature Sensor

Blockly wrapper for the SparkFun TMP117 high-accuracy I2C temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-tmp117
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tmp117_init` | Statement | VAR(field_input), ADDR(dropdown) | `tmp117_init("tmp117", "0x48")` | Wire.begin();\n |
| `tmp117_read_temp_c` | Value | VAR(field_variable) | `tmp117_read_temp_c(variables_get($tmp117))` | Dynamic code |
| `tmp117_read_temp_f` | Value | VAR(field_variable) | `tmp117_read_temp_f(variables_get($tmp117))` | Dynamic code |
| `tmp117_data_ready` | Value | VAR(field_variable) | `tmp117_data_ready(variables_get($tmp117))` | Dynamic code |
| `tmp117_set_conversion_mode` | Statement | VAR(field_variable), MODE(dropdown) | `tmp117_set_conversion_mode(variables_get($tmp117), CONTINUOUS)` | Dynamic code |
| `tmp117_set_high_limit` | Statement | VAR(field_variable), TEMP(input_value) | `tmp117_set_high_limit(variables_get($tmp117), math_number(0))` | Dynamic code |
| `tmp117_set_low_limit` | Statement | VAR(field_variable), TEMP(input_value) | `tmp117_set_low_limit(variables_get($tmp117), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x48, 0x49, 0x4A, 0x4B | tmp117_init |
| MODE | CONTINUOUS, ONESHOT, SHUTDOWN | tmp117_set_conversion_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tmp117_init("tmp117", "0x48")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tmp117_read_temp_c(variables_get($tmp117)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tmp117_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun TMP102 Temperature Sensor

Blockly wrapper for the SparkFun TMP102 I2C digital temperature sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-tmp102
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tmp102_init` | Statement | VAR(field_input), ADDR(dropdown) | `tmp102_init("tmp", "0x48")` | Wire.begin();\n |
| `tmp102_read_temp_c` | Value | VAR(field_variable) | `tmp102_read_temp_c(variables_get($tmp))` | Dynamic code |
| `tmp102_read_temp_f` | Value | VAR(field_variable) | `tmp102_read_temp_f(variables_get($tmp))` | Dynamic code |
| `tmp102_sleep` | Statement | VAR(field_variable) | `tmp102_sleep(variables_get($tmp))` | Dynamic code |
| `tmp102_wakeup` | Statement | VAR(field_variable) | `tmp102_wakeup(variables_get($tmp))` | Dynamic code |
| `tmp102_alert` | Value | VAR(field_variable) | `tmp102_alert(variables_get($tmp))` | Dynamic code |
| `tmp102_set_high_temp_c` | Statement | VAR(field_variable), TEMP(input_value) | `tmp102_set_high_temp_c(variables_get($tmp), math_number(0))` | Dynamic code |
| `tmp102_set_low_temp_c` | Statement | VAR(field_variable), TEMP(input_value) | `tmp102_set_low_temp_c(variables_get($tmp), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x48, 0x49, 0x4A, 0x4B | tmp102_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tmp102_init("tmp", "0x48")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tmp102_read_temp_c(variables_get($tmp)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tmp102_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

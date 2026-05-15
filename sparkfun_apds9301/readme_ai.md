# SparkFun APDS9301 lux sensor

Blockly wrapper for the SparkFun APDS9301 lux sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-apds9301
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `apds9301_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `apds9301_init("apds9301", "0x39")` | Wire.begin();\n |
| `apds9301_is_ready` | Value | VAR(field_variable) | `apds9301_is_ready(variables_get($apds9301))` | Dynamic code |
| `apds9301_read_lux` | Value | VAR(field_variable) | `apds9301_read_lux(variables_get($apds9301))` | Dynamic code |
| `apds9301_read_channel` | Value | VAR(field_variable), CHANNEL(dropdown) | `apds9301_read_channel(variables_get($apds9301), readCH0Level)` | Dynamic code |
| `apds9301_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `apds9301_set_gain(variables_get($apds9301), APDS9301::LOW_GAIN)` | Dynamic code |
| `apds9301_set_integration_time` | Statement | VAR(field_variable), TIME(dropdown) | `apds9301_set_integration_time(variables_get($apds9301), APDS9301::INT_TIME_13_7_MS)` | Dynamic code |
| `apds9301_enable_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `apds9301_enable_interrupt(variables_get($apds9301), APDS9301::INT_ON)` | Dynamic code |
| `apds9301_set_threshold` | Statement | VAR(field_variable), BOUND(dropdown), THRESHOLD(input_value) | `apds9301_set_threshold(variables_get($apds9301), LOW, math_number(0))` | Dynamic code |
| `apds9301_power` | Statement | VAR(field_variable), STATE(dropdown) | `apds9301_power(variables_get($apds9301), APDS9301::POW_ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x39, 0x29, 0x49 | apds9301_init |
| CHANNEL | readCH0Level, readCH1Level | apds9301_read_channel |
| GAIN | APDS9301::LOW_GAIN, APDS9301::HIGH_GAIN | apds9301_set_gain |
| TIME | APDS9301::INT_TIME_13_7_MS, APDS9301::INT_TIME_101_MS, APDS9301::INT_TIME_402_MS | apds9301_set_integration_time |
| STATE | APDS9301::INT_ON, APDS9301::INT_OFF | apds9301_enable_interrupt |
| BOUND | LOW, HIGH | apds9301_set_threshold |
| STATE | APDS9301::POW_ON, APDS9301::POW_OFF | apds9301_power |

## ABS Examples

### Basic Usage
```
arduino_setup()
    apds9301_init("apds9301", "0x39")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, apds9301_is_ready(variables_get($apds9301)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `apds9301_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

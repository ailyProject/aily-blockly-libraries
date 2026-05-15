# SparkFun VEML6030 ambient light sensor

Blockly wrapper for the SparkFun VEML6030 ambient light sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml6030
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml6030_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `veml6030_init("veml6030", "0x48")` | Wire.begin();\n |
| `veml6030_is_ready` | Value | VAR(field_variable) | `veml6030_is_ready(variables_get($veml6030))` | Dynamic code |
| `veml6030_read_light` | Value | VAR(field_variable) | `veml6030_read_light(variables_get($veml6030))` | Dynamic code |
| `veml6030_read_white` | Value | VAR(field_variable) | `veml6030_read_white(variables_get($veml6030))` | Dynamic code |
| `veml6030_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `veml6030_set_gain(variables_get($veml6030), "0.125")` | Dynamic code |
| `veml6030_set_integration_time` | Statement | VAR(field_variable), TIME(dropdown) | `veml6030_set_integration_time(variables_get($veml6030), "25")` | Dynamic code |
| `veml6030_set_interrupt_threshold` | Statement | VAR(field_variable), BOUND(dropdown), LUX(input_value) | `veml6030_set_interrupt_threshold(variables_get($veml6030), LOW, math_number(0))` | Dynamic code |
| `veml6030_enable_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `veml6030_enable_interrupt(variables_get($veml6030), ENABLE)` | Dynamic code |
| `veml6030_read_interrupt` | Value | VAR(field_variable) | `veml6030_read_interrupt(variables_get($veml6030))` | Dynamic code |
| `veml6030_power` | Statement | VAR(field_variable), STATE(dropdown) | `veml6030_power(variables_get($veml6030), ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x48, 0x10 | veml6030_init |
| GAIN | 0.125, 0.25, 1.0, 2.0 | veml6030_set_gain |
| TIME | 25, 50, 100, 200, 400, 800 | veml6030_set_integration_time |
| BOUND | LOW, HIGH | veml6030_set_interrupt_threshold |
| STATE | ENABLE, DISABLE | veml6030_enable_interrupt |
| STATE | ON, OFF | veml6030_power |

## ABS Examples

### Basic Usage
```
arduino_setup()
    veml6030_init("veml6030", "0x48")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, veml6030_is_ready(variables_get($veml6030)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `veml6030_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

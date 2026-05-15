# SparkFun LP55231 9-Channel LED Driver

Blockly wrapper for SparkFun LP55231 9-channel I2C LED driver.

## Library Info
- **Name**: @aily-project/lib-sparkfun-lp55231
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lp55231_init` | Statement | VAR(field_input), ADDR(dropdown) | `lp55231_init("ledDriver", "0x32")` | Dynamic code |
| `lp55231_set_channel_pwm` | Statement | VAR(field_variable), CHANNEL(input_value), VALUE(input_value) | `lp55231_set_channel_pwm(variables_get($ledDriver), math_number(0), math_number(0))` | Dynamic code |
| `lp55231_set_master_fader` | Statement | VAR(field_variable), FADER(dropdown), VALUE(input_value) | `lp55231_set_master_fader(variables_get($ledDriver), "0", math_number(0))` | Dynamic code |
| `lp55231_enable` | Statement | VAR(field_variable) | `lp55231_enable(variables_get($ledDriver))` | Dynamic code |
| `lp55231_disable` | Statement | VAR(field_variable) | `lp55231_disable(variables_get($ledDriver))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x32, 0x33, 0x34, 0x35 | lp55231_init |
| FADER | 0, 1, 2 | lp55231_set_master_fader |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lp55231_init("ledDriver", "0x32")
    serial_begin(Serial, 9600)

arduino_loop()
    lp55231_set_channel_pwm(variables_get($ledDriver), math_number(0), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `lp55231_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# NLCS21 color sensor

Emakefun NLCS21 color sensor module supports RGBC color detection, gain and integration time configuration, and interrupt threshold setting

## Library Info
- **Name**: @aily-project/lib-emakefun-nlcs21
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nlcs21_init` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown) | `nlcs21_init("colorSensor", kGain1X, kIntegrationTime2ms)` | Dynamic code |
| `nlcs21_get_color` | Value | VAR(field_variable) | `nlcs21_get_color(variables_get($colorSensor))` | Dynamic code |
| `nlcs21_color_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `nlcs21_color_value(variables_get($colorSensor), r)` | Dynamic code |
| `nlcs21_set_threshold` | Statement | VAR(field_variable), LOW(input_value), HIGH(input_value) | `nlcs21_set_threshold(variables_get($colorSensor), math_number(0), math_number(0))` | Dynamic code |
| `nlcs21_get_interrupt` | Value | VAR(field_variable) | `nlcs21_get_interrupt(variables_get($colorSensor))` | Dynamic code |
| `nlcs21_clear_interrupt` | Statement | VAR(field_variable) | `nlcs21_clear_interrupt(variables_get($colorSensor))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | kGain1X, kGain4X, kGain8X, kGain32X, kGain96X, kGain192X | nlcs21_init |
| INTEGRATION_TIME | kIntegrationTime2ms, kIntegrationTime8ms, kIntegrationTime33ms, kIntegrationTime132ms | nlcs21_init |
| CHANNEL | r, g, b, c | nlcs21_color_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nlcs21_init("colorSensor", kGain1X, kIntegrationTime2ms)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nlcs21_get_color(variables_get($colorSensor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `nlcs21_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

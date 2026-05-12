# NLCS11 color sensor

Emakefun NLCS11 color sensor module supports RGBC color detection, gain and integration time configuration

## Library Info
- **Name**: @aily-project/lib-emakefun-nlcs11
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nlcs11_init` | Statement | VAR(field_input), GAIN(dropdown), INTEGRATION_TIME(dropdown) | `nlcs11_init("colorSensor", kGain1X, kIntegrationTime10ms)` | Dynamic code |
| `nlcs11_get_color` | Value | VAR(field_variable) | `nlcs11_get_color(variables_get($colorSensor))` | Dynamic code |
| `nlcs11_color_value` | Value | VAR(field_variable), CHANNEL(dropdown) | `nlcs11_color_value(variables_get($colorSensor), r)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | kGain1X, kGain1p5X, kGain2X, kGain2p5X | nlcs11_init |
| INTEGRATION_TIME | kIntegrationTime10ms, kIntegrationTime20ms, kIntegrationTime40ms, kIntegrationTime80ms, kIntegrationTime100ms, kIntegrationTime200ms, kIntegrationTime400ms, kIntegrationTime800ms | nlcs11_init |
| CHANNEL | r, g, b, c | nlcs11_color_value |

## ABS Examples

### Basic Usage
```
arduino_setup()
    nlcs11_init("colorSensor", kGain1X, kIntegrationTime10ms)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, nlcs11_get_color(variables_get($colorSensor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `nlcs11_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

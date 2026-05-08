# SparkFun APDS9301

Lux sensor blocks for APDS9301.

## Library Info
- **Name**: @aily-project/lib-sparkfun-apds9301
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `apds9301_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `apds9301_init("apds9301", 0x39)` | `APDS9301 apds9301; apds9301.begin(addr);` |
| `apds9301_is_ready` | Value | VAR(field_variable) | `apds9301_is_ready(variables_get($apds9301))` | `apds9301_ready` |
| `apds9301_read_lux` | Value | VAR(field_variable) | `apds9301_read_lux(variables_get($apds9301))` | `apds9301.readLuxLevel()` |
| `apds9301_read_channel` | Value | VAR(field_variable), CHANNEL(dropdown) | `apds9301_read_channel(variables_get($apds9301), readCH0Level)` | `readCH0Level/readCH1Level()` |
| `apds9301_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `apds9301_set_gain(variables_get($apds9301), APDS9301::LOW_GAIN)` | `apds9301.setGain(gain);` |
| `apds9301_set_integration_time` | Statement | VAR(field_variable), TIME(dropdown) | `apds9301_set_integration_time(variables_get($apds9301), APDS9301::INT_TIME_13_7_MS)` | `setIntegrationTime(time);` |
| `apds9301_enable_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `apds9301_enable_interrupt(variables_get($apds9301), APDS9301::INT_ON)` | `enableInterrupt(state);` |
| `apds9301_set_threshold` | Statement | VAR(field_variable), BOUND(dropdown), THRESHOLD(input_value) | `apds9301_set_threshold(variables_get($apds9301), HIGH, math_number(1000))` | `setHighThreshold/LowThreshold(value);` |
| `apds9301_power` | Statement | VAR(field_variable), STATE(dropdown) | `apds9301_power(variables_get($apds9301), APDS9301::POW_ON)` | `powerEnable(state);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x39, 0x29, 0x49 | I2C address |
| CHANNEL | readCH0Level, readCH1Level | VIS+IR or IR raw channel |
| GAIN | APDS9301::LOW_GAIN, APDS9301::HIGH_GAIN | Sensor gain |
| TIME | APDS9301::INT_TIME_13_7_MS, APDS9301::INT_TIME_101_MS, APDS9301::INT_TIME_402_MS | Integration time |
| BOUND | LOW, HIGH | Interrupt threshold side |

## ABS Examples

```text
arduino_setup()
    apds9301_init("apds9301", 0x39)
    apds9301_set_gain(variables_get($apds9301), APDS9301::LOW_GAIN)

arduino_loop()
    serial_println(Serial, apds9301_read_lux(variables_get($apds9301)))
```

## Notes

The Arduino library uses class-scoped enum values such as `APDS9301::LOW_GAIN`.
# SparkFun VEML6030

Ambient and white light blocks for VEML6030.

## Library Info
- **Name**: @aily-project/lib-sparkfun-veml6030
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml6030_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `veml6030_init("veml6030", 0x48)` | `SparkFun_Ambient_Light veml6030(addr); veml6030.begin(Wire);` |
| `veml6030_is_ready` | Value | VAR(field_variable) | `veml6030_is_ready(variables_get($veml6030))` | `veml6030_ready` |
| `veml6030_read_light` | Value | VAR(field_variable) | `veml6030_read_light(variables_get($veml6030))` | `veml6030.readLight()` |
| `veml6030_read_white` | Value | VAR(field_variable) | `veml6030_read_white(variables_get($veml6030))` | `veml6030.readWhiteLight()` |
| `veml6030_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `veml6030_set_gain(variables_get($veml6030), 0.125)` | `veml6030.setGain(gain);` |
| `veml6030_set_integration_time` | Statement | VAR(field_variable), TIME(dropdown) | `veml6030_set_integration_time(variables_get($veml6030), 100)` | `veml6030.setIntegTime(time);` |
| `veml6030_set_interrupt_threshold` | Statement | VAR(field_variable), BOUND(dropdown), LUX(input_value) | `veml6030_set_interrupt_threshold(variables_get($veml6030), HIGH, math_number(1000))` | `setIntHighThresh/LowThresh(lux);` |
| `veml6030_enable_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `veml6030_enable_interrupt(variables_get($veml6030), ENABLE)` | `enableInt/disableInt();` |
| `veml6030_read_interrupt` | Value | VAR(field_variable) | `veml6030_read_interrupt(variables_get($veml6030))` | `veml6030.readInterrupt()` |
| `veml6030_power` | Statement | VAR(field_variable), STATE(dropdown) | `veml6030_power(variables_get($veml6030), ON)` | `powerOn/shutDown();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x48, 0x10 | I2C address |
| GAIN | 0.125, 0.25, 1.0, 2.0 | Sensor gain |
| TIME | 25, 50, 100, 200, 400, 800 | Integration time ms |
| BOUND | LOW, HIGH | Interrupt threshold side |
| STATE | ENABLE/DISABLE or ON/OFF | Interrupt or power state |

## ABS Examples

```text
arduino_setup()
    veml6030_init("veml6030", 0x48)
    veml6030_set_gain(variables_get($veml6030), 0.125)

arduino_loop()
    serial_println(Serial, veml6030_read_light(variables_get($veml6030)))
```

## Notes

Threshold values are lux values and are converted by the Arduino library using current gain and integration time.
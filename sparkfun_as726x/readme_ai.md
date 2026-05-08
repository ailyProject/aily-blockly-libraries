# SparkFun AS726X

Six-channel spectral sensor blocks for AS726X.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as726x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as726x_init` | Statement | VAR(field_input), GAIN(dropdown), MODE(dropdown) | `as726x_init("as726x", 3, 3)` | `AS726X as726x; as726x.begin(Wire, gain, mode);` |
| `as726x_take_measurements` | Statement | VAR(field_variable), BULB(dropdown) | `as726x_take_measurements(variables_get($as726x), NO)` | `takeMeasurements()` or `takeMeasurementsWithBulb()` |
| `as726x_data_available` | Value | VAR(field_variable) | `as726x_data_available(variables_get($as726x))` | `as726x.dataAvailable()` |
| `as726x_read_raw` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_raw(variables_get($as726x), getViolet)` | `as726x.getViolet()` etc. |
| `as726x_read_calibrated` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_calibrated(variables_get($as726x), getCalibratedViolet)` | `as726x.getCalibratedViolet()` etc. |
| `as726x_read_temperature` | Value | VAR(field_variable) | `as726x_read_temperature(variables_get($as726x))` | `as726x.getTemperature()` |
| `as726x_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as726x_set_gain(variables_get($as726x), 3)` | `as726x.setGain(gain);` |
| `as726x_set_measurement_mode` | Statement | VAR(field_variable), MODE(dropdown) | `as726x_set_measurement_mode(variables_get($as726x), 3)` | `as726x.setMeasurementMode(mode);` |
| `as726x_set_integration_time` | Statement | VAR(field_variable), TIME(input_value) | `as726x_set_integration_time(variables_get($as726x), math_number(50))` | `as726x.setIntegrationTime(value);` |
| `as726x_bulb` | Statement | VAR(field_variable), STATE(dropdown) | `as726x_bulb(variables_get($as726x), ON)` | `enableBulb/disableBulb();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | 0, 1, 2, 3 | 1x, 4x, 16x, 64x |
| MODE | 0, 1, 2, 3 | 4-channel, alternate 4-channel, 6-channel continuous, 6-channel one-shot |
| BULB | NO, YES | Use illumination bulb during measurement |
| CHANNEL raw | getViolet, getBlue, getGreen, getYellow, getOrange, getRed, getR..getW, getX, getY, getZ, getNir, getDark, getClear | Sensor-dependent channels |
| CHANNEL calibrated | getCalibratedViolet..getCalibratedRed, getCalibratedR..W, getCalibratedX/Y/Z | Calibrated channels |

## ABS Examples

```text
arduino_setup()
    as726x_init("as726x", 3, 3)

arduino_loop()
    as726x_take_measurements(variables_get($as726x), NO)
    serial_println(Serial, as726x_read_calibrated(variables_get($as726x), getCalibratedViolet))
```

## Notes

Call a measurement block before reading channels unless using continuous mode with data-ready polling.
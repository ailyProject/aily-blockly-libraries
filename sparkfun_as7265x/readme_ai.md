# SparkFun AS7265X

18-channel UV/VIS/NIR spectral triad blocks for AS7265X.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as7265x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as7265x_init` | Statement | VAR(field_input) | `as7265x_init("as7265x")` | `AS7265X as7265x; as7265x.begin(Wire);` |
| `as7265x_is_ready` | Value | VAR(field_variable) | `as7265x_is_ready(variables_get($as7265x))` | `as7265x_ready` |
| `as7265x_is_connected` | Value | VAR(field_variable) | `as7265x_is_connected(variables_get($as7265x))` | `as7265x.isConnected()` |
| `as7265x_take_measurements` | Statement | VAR(field_variable), BULB(dropdown) | `as7265x_take_measurements(variables_get($as7265x), NO)` | `takeMeasurements()` or `takeMeasurementsWithBulb()` |
| `as7265x_data_available` | Value | VAR(field_variable) | `as7265x_data_available(variables_get($as7265x))` | `as7265x.dataAvailable()` |
| `as7265x_read_calibrated` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7265x_read_calibrated(variables_get($as7265x), getCalibratedA)` | `as7265x.getCalibratedA()` etc. |
| `as7265x_read_raw` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7265x_read_raw(variables_get($as7265x), getA)` | `as7265x.getA()` etc. |
| `as7265x_read_temperature` | Value | VAR(field_variable), DEVICE(dropdown) | `as7265x_read_temperature(variables_get($as7265x), AS72651_NIR)` | `as7265x.getTemperature(device)` |
| `as7265x_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as7265x_set_gain(variables_get($as7265x), AS7265X_GAIN_64X)` | `as7265x.setGain(gain);` |
| `as7265x_set_measurement_mode` | Statement | VAR(field_variable), MODE(dropdown) | `as7265x_set_measurement_mode(variables_get($as7265x), AS7265X_MEASUREMENT_MODE_6CHAN_ONE_SHOT)` | `as7265x.setMeasurementMode(mode);` |
| `as7265x_set_integration_cycles` | Statement | VAR(field_variable), CYCLES(input_value) | `as7265x_set_integration_cycles(variables_get($as7265x), math_number(50))` | `as7265x.setIntegrationCycles(cycles);` |
| `as7265x_bulb` | Statement | VAR(field_variable), DEVICE(dropdown), STATE(dropdown) | `as7265x_bulb(variables_get($as7265x), AS72653_UV, ON)` | `enableBulb/disableBulb(device);` |
| `as7265x_set_bulb_current` | Statement | VAR(field_variable), DEVICE(dropdown), CURRENT(dropdown) | `as7265x_set_bulb_current(variables_get($as7265x), AS72653_UV, AS7265X_LED_CURRENT_LIMIT_12_5MA)` | `setBulbCurrent(current, device);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHANNEL | getCalibratedA..getCalibratedL, getCalibratedR..getCalibratedW; raw getA..getL, getR..getW | 18 spectral channels |
| DEVICE | AS72651_NIR, AS72652_VISIBLE, AS72653_UV | Internal device / LED bank |
| GAIN | AS7265X_GAIN_1X, AS7265X_GAIN_37X, AS7265X_GAIN_16X, AS7265X_GAIN_64X | Gain |
| MODE | AS7265X_MEASUREMENT_MODE_4CHAN, 4CHAN_2, 6CHAN_CONTINUOUS, 6CHAN_ONE_SHOT | Measurement mode |
| CURRENT | AS7265X_LED_CURRENT_LIMIT_12_5MA, 25MA, 50MA, 100MA | Bulb current |

## ABS Examples

```text
arduino_setup()
    as7265x_init("as7265x")
    as7265x_set_gain(variables_get($as7265x), AS7265X_GAIN_64X)

arduino_loop()
    as7265x_take_measurements(variables_get($as7265x), NO)
    serial_println(Serial, as7265x_read_calibrated(variables_get($as7265x), getCalibratedA))
```

## Notes

Call `as7265x_take_measurements` before reading channels unless you manage continuous mode manually.
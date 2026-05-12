# SparkFun AS7265X spectral triad

Blockly wrapper for the SparkFun AS7265X 18-channel spectral triad.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as7265x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as7265x_init` | Statement | VAR(field_input) | `as7265x_init("as7265x")` | Wire.begin();\n |
| `as7265x_is_ready` | Value | VAR(field_variable) | `as7265x_is_ready(variables_get($as7265x))` | Dynamic code |
| `as7265x_is_connected` | Value | VAR(field_variable) | `as7265x_is_connected(variables_get($as7265x))` | Dynamic code |
| `as7265x_take_measurements` | Statement | VAR(field_variable), BULB(dropdown) | `as7265x_take_measurements(variables_get($as7265x), NO)` | Dynamic code |
| `as7265x_data_available` | Value | VAR(field_variable) | `as7265x_data_available(variables_get($as7265x))` | Dynamic code |
| `as7265x_read_calibrated` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7265x_read_calibrated(variables_get($as7265x), getCalibratedA)` | Dynamic code |
| `as7265x_read_raw` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7265x_read_raw(variables_get($as7265x), getA)` | Dynamic code |
| `as7265x_read_temperature` | Value | VAR(field_variable), DEVICE(dropdown) | `as7265x_read_temperature(variables_get($as7265x), AS72651_NIR)` | Dynamic code |
| `as7265x_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as7265x_set_gain(variables_get($as7265x), AS7265X_GAIN_1X)` | Dynamic code |
| `as7265x_set_measurement_mode` | Statement | VAR(field_variable), MODE(dropdown) | `as7265x_set_measurement_mode(variables_get($as7265x), AS7265X_MEASUREMENT_MODE_4CHAN)` | Dynamic code |
| `as7265x_set_integration_cycles` | Statement | VAR(field_variable), CYCLES(input_value) | `as7265x_set_integration_cycles(variables_get($as7265x), math_number(0))` | Dynamic code |
| `as7265x_bulb` | Statement | VAR(field_variable), DEVICE(dropdown), STATE(dropdown) | `as7265x_bulb(variables_get($as7265x), AS72651_NIR, ON)` | Dynamic code |
| `as7265x_set_bulb_current` | Statement | VAR(field_variable), DEVICE(dropdown), CURRENT(dropdown) | `as7265x_set_bulb_current(variables_get($as7265x), AS72651_NIR, AS7265X_LED_CURRENT_LIMIT_12_5MA)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BULB | NO, YES | as7265x_take_measurements |
| CHANNEL | getCalibratedA, getCalibratedB, getCalibratedC, getCalibratedD, getCalibratedE, getCalibratedF, getCalibratedG, getCalibratedH, getCalibratedI, getCalibratedJ, getCalibratedK, getCalibratedL, getCalibratedR, getCalibr... | as7265x_read_calibrated |
| CHANNEL | getA, getB, getC, getD, getE, getF, getG, getH, getI, getJ, getK, getL, getR, getS, getT, getU, getV, getW | as7265x_read_raw |
| DEVICE | AS72651_NIR, AS72652_VISIBLE, AS72653_UV | as7265x_read_temperature, as7265x_bulb, as7265x_set_bulb_current |
| GAIN | AS7265X_GAIN_1X, AS7265X_GAIN_37X, AS7265X_GAIN_16X, AS7265X_GAIN_64X | as7265x_set_gain |
| MODE | AS7265X_MEASUREMENT_MODE_4CHAN, AS7265X_MEASUREMENT_MODE_4CHAN_2, AS7265X_MEASUREMENT_MODE_6CHAN_CONTINUOUS, AS7265X_MEASUREMENT_MODE_6CHAN_ONE_SHOT | as7265x_set_measurement_mode |
| STATE | ON, OFF | as7265x_bulb |
| CURRENT | AS7265X_LED_CURRENT_LIMIT_12_5MA, AS7265X_LED_CURRENT_LIMIT_25MA, AS7265X_LED_CURRENT_LIMIT_50MA, AS7265X_LED_CURRENT_LIMIT_100MA | as7265x_set_bulb_current |

## ABS Examples

### Basic Usage
```
arduino_setup()
    as7265x_init("as7265x")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, as7265x_is_ready(variables_get($as7265x)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `as7265x_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

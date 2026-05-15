# SparkFun AS726X spectral sensor

Blockly wrapper for the SparkFun AS726X six-channel spectral sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as726x
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as726x_init` | Statement | VAR(field_input), GAIN(dropdown), MODE(dropdown) | `as726x_init("as726x", "0", "0")` | Wire.begin();\n |
| `as726x_take_measurements` | Statement | VAR(field_variable), BULB(dropdown) | `as726x_take_measurements(variables_get($as726x), NO)` | Dynamic code |
| `as726x_data_available` | Value | VAR(field_variable) | `as726x_data_available(variables_get($as726x))` | Dynamic code |
| `as726x_read_raw` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_raw(variables_get($as726x), getViolet)` | Dynamic code |
| `as726x_read_calibrated` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_calibrated(variables_get($as726x), getCalibratedViolet)` | Dynamic code |
| `as726x_read_temperature` | Value | VAR(field_variable) | `as726x_read_temperature(variables_get($as726x))` | Dynamic code |
| `as726x_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as726x_set_gain(variables_get($as726x), "0")` | Dynamic code |
| `as726x_set_measurement_mode` | Statement | VAR(field_variable), MODE(dropdown) | `as726x_set_measurement_mode(variables_get($as726x), "0")` | Dynamic code |
| `as726x_set_integration_time` | Statement | VAR(field_variable), TIME(input_value) | `as726x_set_integration_time(variables_get($as726x), math_number(1000))` | Dynamic code |
| `as726x_bulb` | Statement | VAR(field_variable), STATE(dropdown) | `as726x_bulb(variables_get($as726x), ON)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | 0, 1, 2, 3 | as726x_init, as726x_set_gain |
| MODE | 0, 1, 2, 3 | as726x_init, as726x_set_measurement_mode |
| BULB | NO, YES | as726x_take_measurements |
| CHANNEL | getViolet, getBlue, getGreen, getYellow, getOrange, getRed, getR, getS, getT, getU, getV, getW, getX, getY, getZ, getNir, getDark, getClear | as726x_read_raw |
| CHANNEL | getCalibratedViolet, getCalibratedBlue, getCalibratedGreen, getCalibratedYellow, getCalibratedOrange, getCalibratedRed, getCalibratedR, getCalibratedS, getCalibratedT, getCalibratedU, getCalibratedV, getCalibratedW, g... | as726x_read_calibrated |
| STATE | ON, OFF | as726x_bulb |

## ABS Examples

### Basic Usage
```
arduino_setup()
    as726x_init("as726x", "0", "0")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, as726x_data_available(variables_get($as726x)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `as726x_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

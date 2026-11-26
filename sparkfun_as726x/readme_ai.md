# SparkFun AS726X spectral sensor

Blockly wrapper for the SparkFun AS726X six-channel spectral sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as726x
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as726x_init` | Statement | VAR(field_input), GAIN(dropdown), MODE(dropdown) | `as726x_init("as726x", "0", "0")` | `Wire.begin(); ↵ as726x_ready = as726x.begin(Wire, 0, 0);` |
| `as726x_take_measurements` | Statement | VAR(field_variable), BULB(dropdown) | `as726x_take_measurements($as726x, NO)` | `as726x.takeMeasurements();` |
| `as726x_data_available` | Value | VAR(field_variable) | `as726x_data_available($as726x)` | `as726x.dataAvailable()` |
| `as726x_read_raw` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_raw($as726x, getViolet)` | `as726x.getViolet()` |
| `as726x_read_calibrated` | Value | VAR(field_variable), CHANNEL(dropdown) | `as726x_read_calibrated($as726x, getCalibratedViolet)` | `as726x.getCalibratedViolet()` |
| `as726x_read_temperature` | Value | VAR(field_variable) | `as726x_read_temperature($as726x)` | `as726x.readTemperatureCelsius()` |
| `as726x_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as726x_set_gain($as726x, "0")` | `as726x.setGain(0);` |
| `as726x_set_measurement_mode` | Statement | VAR(field_variable), MODE(dropdown) | `as726x_set_measurement_mode($as726x, "0")` | `as726x.setMeasurementMode(0);` |
| `as726x_set_integration_time` | Statement | VAR(field_variable), TIME(input_value) | `as726x_set_integration_time($as726x, math_number(1000))` | `as726x.setIntegrationTime(1000);` |
| `as726x_bulb` | Statement | VAR(field_variable), STATE(dropdown) | `as726x_bulb($as726x, ON)` | `as726x.enableBulb();` |

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
    serial_println(Serial, as726x_data_available($as726x))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `as726x_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

Integration time is an unsigned 8-bit register in 2.8 ms units. Use 1–255 for measurements, for example `as726x.setIntegrationTime(50);` for 140 ms per bank. The contract table shows the generic TIME probe before C++ argument conversion.

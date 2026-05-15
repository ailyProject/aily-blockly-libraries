# SparkFun AS7331 spectral UV sensor

Blockly wrapper for the SparkFun AS7331 spectral UV sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as7331
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as7331_init` | Statement | VAR(field_input), ADDRESS(dropdown), MODE(dropdown) | `as7331_init("as7331", "0x74", MEAS_MODE_CMD)` | Wire.begin();\n |
| `as7331_is_ready` | Value | VAR(field_variable) | `as7331_is_ready(variables_get($as7331))` | Dynamic code |
| `as7331_is_connected` | Value | VAR(field_variable) | `as7331_is_connected(variables_get($as7331))` | Dynamic code |
| `as7331_take_measurement` | Statement | VAR(field_variable) | `as7331_take_measurement(variables_get($as7331))` | as7331TakeMeasurement( |
| `as7331_read_uv` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7331_read_uv(variables_get($as7331), getUVA)` | Dynamic code |
| `as7331_read_temperature` | Value | VAR(field_variable) | `as7331_read_temperature(variables_get($as7331))` | as7331ReadTemperature( |
| `as7331_data_ready` | Value | VAR(field_variable) | `as7331_data_ready(variables_get($as7331))` | as7331DataReady( |
| `as7331_prepare_measurement` | Statement | VAR(field_variable), MODE(dropdown) | `as7331_prepare_measurement(variables_get($as7331), MEAS_MODE_CMD)` | Dynamic code |
| `as7331_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as7331_set_gain(variables_get($as7331), GAIN_1)` | Dynamic code |
| `as7331_set_conversion_time` | Statement | VAR(field_variable), TIME(dropdown) | `as7331_set_conversion_time(variables_get($as7331), TIME_1MS)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x74, 0x75, 0x76, 0x77 | as7331_init |
| MODE | MEAS_MODE_CMD, MEAS_MODE_CONT, MEAS_MODE_SYNS, MEAS_MODE_SYND | as7331_init, as7331_prepare_measurement |
| CHANNEL | getUVA, getUVB, getUVC | as7331_read_uv |
| GAIN | GAIN_1, GAIN_2, GAIN_4, GAIN_8, GAIN_16, GAIN_32, GAIN_64, GAIN_128, GAIN_256, GAIN_512, GAIN_1024, GAIN_2048 | as7331_set_gain |
| TIME | TIME_1MS, TIME_2MS, TIME_4MS, TIME_8MS, TIME_16MS, TIME_32MS, TIME_64MS, TIME_128MS, TIME_256MS, TIME_512MS, TIME_1024MS | as7331_set_conversion_time |

## ABS Examples

### Basic Usage
```
arduino_setup()
    as7331_init("as7331", "0x74", MEAS_MODE_CMD)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, as7331_is_ready(variables_get($as7331)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `as7331_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

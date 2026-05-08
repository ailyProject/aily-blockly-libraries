# SparkFun AS7331

UVA/UVB/UVC spectral UV blocks for AS7331.

## Library Info
- **Name**: @aily-project/lib-sparkfun-as7331
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `as7331_init` | Statement | VAR(field_input), ADDRESS(dropdown), MODE(dropdown) | `as7331_init("as7331", 0x74, MEAS_MODE_CMD)` | `SfeAS7331ArdI2C as7331; as7331.begin(addr, Wire); prepareMeasurement(mode);` |
| `as7331_is_ready` | Value | VAR(field_variable) | `as7331_is_ready(variables_get($as7331))` | `as7331_ready` |
| `as7331_is_connected` | Value | VAR(field_variable) | `as7331_is_connected(variables_get($as7331))` | `as7331.isConnected()` |
| `as7331_take_measurement` | Statement | VAR(field_variable) | `as7331_take_measurement(variables_get($as7331))` | `setStartState(true); delay; readAllUV();` |
| `as7331_read_uv` | Value | VAR(field_variable), CHANNEL(dropdown) | `as7331_read_uv(variables_get($as7331), getUVA)` | `as7331.getUVA()` etc. |
| `as7331_read_temperature` | Value | VAR(field_variable) | `as7331_read_temperature(variables_get($as7331))` | `readTemp(); getTemp();` |
| `as7331_data_ready` | Value | VAR(field_variable) | `as7331_data_ready(variables_get($as7331))` | `as7331DataReady(sensor)` |
| `as7331_prepare_measurement` | Statement | VAR(field_variable), MODE(dropdown) | `as7331_prepare_measurement(variables_get($as7331), MEAS_MODE_CMD)` | `as7331.prepareMeasurement(mode);` |
| `as7331_set_gain` | Statement | VAR(field_variable), GAIN(dropdown) | `as7331_set_gain(variables_get($as7331), GAIN_2)` | `as7331.setGain(gain);` |
| `as7331_set_conversion_time` | Statement | VAR(field_variable), TIME(dropdown) | `as7331_set_conversion_time(variables_get($as7331), TIME_64MS)` | `as7331.setConversionTime(time);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x74, 0x75, 0x76, 0x77 | I2C address |
| MODE | MEAS_MODE_CMD, MEAS_MODE_CONT, MEAS_MODE_SYNS, MEAS_MODE_SYND | Measurement mode |
| CHANNEL | getUVA, getUVB, getUVC | UV output channel |
| GAIN | GAIN_1, GAIN_2, GAIN_4, GAIN_8, GAIN_16, GAIN_32, GAIN_64, GAIN_128, GAIN_256, GAIN_512, GAIN_1024, GAIN_2048 | Sensor gain |
| TIME | TIME_1MS, TIME_2MS, TIME_4MS, TIME_8MS, TIME_16MS, TIME_32MS, TIME_64MS, TIME_128MS, TIME_256MS, TIME_512MS, TIME_1024MS | Conversion time |

## ABS Examples

```text
arduino_setup()
    as7331_init("as7331", 0x74, MEAS_MODE_CMD)

arduino_loop()
    as7331_take_measurement(variables_get($as7331))
    serial_println(Serial, as7331_read_uv(variables_get($as7331), getUVA))
```

## Notes

The package includes SparkFun Toolkit source because the AS7331 driver depends on it. In command mode, call `as7331_take_measurement` before reading UV values.
# SparkFun BME280

Temperature, humidity, pressure, altitude, and dew point blocks for BME280.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bme280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bme280_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown) | `bme280_init_i2c("bme280", 0x77)` | `BME280 bme280; bme280.setI2CAddress(0x77); bme280.beginI2C();` |
| `bme280_init_spi` | Statement | VAR(field_input), CS(field_number) | `bme280_init_spi("bme280", 10)` | `BME280 bme280; bme280.beginSPI(10);` |
| `bme280_is_ready` | Value | VAR(field_variable) | `bme280_is_ready(variables_get($bme280))` | `bme280_ready` |
| `bme280_read_temperature` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_read_temperature(variables_get($bme280), C)` | `bme280.readTempC()` |
| `bme280_read_pressure` | Value | VAR(field_variable) | `bme280_read_pressure(variables_get($bme280))` | `bme280.readFloatPressure()` |
| `bme280_read_humidity` | Value | VAR(field_variable) | `bme280_read_humidity(variables_get($bme280))` | `bme280.readFloatHumidity()` |
| `bme280_read_altitude` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_read_altitude(variables_get($bme280), M)` | `bme280.readFloatAltitudeMeters()` |
| `bme280_dew_point` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_dew_point(variables_get($bme280), C)` | `bme280.dewPointC()` |
| `bme280_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `bme280_set_mode(variables_get($bme280), MODE_NORMAL)` | `bme280.setMode(MODE_NORMAL);` |
| `bme280_set_oversampling` | Statement | VAR(field_variable), SENSOR(dropdown), OVERSAMPLE(dropdown) | `bme280_set_oversampling(variables_get($bme280), TEMP, 16)` | `bme280.setTempOverSample(16);` |
| `bme280_set_filter` | Statement | VAR(field_variable), FILTER(dropdown) | `bme280_set_filter(variables_get($bme280), 4)` | `bme280.setFilter(4);` |
| `bme280_is_measuring` | Value | VAR(field_variable) | `bme280_is_measuring(variables_get($bme280))` | `bme280.isMeasuring()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x77, 0x76 | I2C address |
| UNIT | C, F, M, FT | Temperature or altitude unit |
| MODE | MODE_NORMAL, MODE_FORCED, MODE_SLEEP | Measurement mode |
| SENSOR | TEMP, PRESSURE, HUMIDITY | Oversampling target |
| OVERSAMPLE | 0, 1, 2, 4, 8, 16 | Oversampling multiplier; 0 disables that channel |
| FILTER | 0, 1, 2, 3, 4 | IIR filter setting |

## ABS Examples

```text
arduino_setup()
    bme280_init_i2c("bme280", 0x77)
    bme280_set_mode(variables_get($bme280), MODE_NORMAL)

arduino_loop()
    serial_println(Serial, bme280_read_temperature(variables_get($bme280), C))
```

## Notes

`bme280_init_i2c("name", ...)` or `bme280_init_spi("name", ...)` creates variable `$name`.
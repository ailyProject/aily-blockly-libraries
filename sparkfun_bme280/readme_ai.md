# SparkFun BME280 Environmental Sensor

Blockly wrapper for the SparkFun BME280 temperature, humidity and pressure sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-bme280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bme280_init_i2c` | Statement | VAR(field_input), ADDRESS(dropdown) | `bme280_init_i2c("bme280", "0x77")` | Wire.begin();\n |
| `bme280_init_spi` | Statement | VAR(field_input), CS(field_number) | `bme280_init_spi("bme280", 10)` | SPI.begin();\n |
| `bme280_is_ready` | Value | VAR(field_variable) | `bme280_is_ready(variables_get($bme280))` | Dynamic code |
| `bme280_read_temperature` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_read_temperature(variables_get($bme280), C)` | Dynamic code |
| `bme280_read_pressure` | Value | VAR(field_variable) | `bme280_read_pressure(variables_get($bme280))` | Dynamic code |
| `bme280_read_humidity` | Value | VAR(field_variable) | `bme280_read_humidity(variables_get($bme280))` | Dynamic code |
| `bme280_read_altitude` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_read_altitude(variables_get($bme280), M)` | Dynamic code |
| `bme280_dew_point` | Value | VAR(field_variable), UNIT(dropdown) | `bme280_dew_point(variables_get($bme280), C)` | Dynamic code |
| `bme280_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `bme280_set_mode(variables_get($bme280), MODE_NORMAL)` | Dynamic code |
| `bme280_set_oversampling` | Statement | VAR(field_variable), SENSOR(dropdown), OVERSAMPLE(dropdown) | `bme280_set_oversampling(variables_get($bme280), TEMP, "0")` | Dynamic code |
| `bme280_set_filter` | Statement | VAR(field_variable), FILTER(dropdown) | `bme280_set_filter(variables_get($bme280), "0")` | Dynamic code |
| `bme280_is_measuring` | Value | VAR(field_variable) | `bme280_is_measuring(variables_get($bme280))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x77, 0x76 | bme280_init_i2c |
| UNIT | C, F | bme280_read_temperature, bme280_dew_point |
| UNIT | M, FT | bme280_read_altitude |
| MODE | MODE_NORMAL, MODE_FORCED, MODE_SLEEP | bme280_set_mode |
| SENSOR | TEMP, PRESSURE, HUMIDITY | bme280_set_oversampling |
| OVERSAMPLE | 0, 1, 2, 4, 8, 16 | bme280_set_oversampling |
| FILTER | 0, 1, 2, 3, 4 | bme280_set_filter |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bme280_init_i2c("bme280", "0x77")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bme280_is_ready(variables_get($bme280)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `bme280_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# BME280传感器库

用于读取BME280传感器的数据，包括温度、压力、海拔高度和湿度，并将数据输出至串行监视器

## Library Info
- **Name**: @aily-project/lib-bme280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bme280_init` | Statement | ADDRESS(field_input) | `bme280_init("BME280_ADDRESS")` | `` |
| `bme280_read_temperature` | Value | (none) | `bme280_read_temperature()` | `bme.readTemperature()` |
| `bme280_read_pressure` | Value | (none) | `bme280_read_pressure()` | `bme.readPressure() / 100.0F` |
| `bme280_read_humidity` | Value | (none) | `bme280_read_humidity()` | `bme.readHumidity()` |
| `bme280_read_altitude` | Value | SEALEVEL(input_value) | `bme280_read_altitude(math_number(0))` | `bme.readAltitude(` |
| `bme280_take_forced_measurement` | Statement | (none) | `bme280_take_forced_measurement()` | `bme.takeForcedMeasurement();\n` |
| `bme280_set_sampling` | Statement | MODE(dropdown), TEMP_SAMPLING(dropdown), PRESS_SAMPLING(dropdown), HUM_SAMPLING(dropdown), FILTER(dropdown), STANDBY(dropdown) | `bme280_set_sampling(0, 0, 0, 0, 0, 0.5)` | `bme.setSampling(` |
| `bme280_read_and_print_all` | Statement | (none) | `bme280_read_and_print_all()` | `Serial.print(` |
| `bme280_sea_level_for_altitude` | Value | ALTITUDE(input_value), PRESSURE(input_value) | `bme280_sea_level_for_altitude(math_number(0), math_number(0))` | `bme.seaLevelForAltitude(` |
| `bme280_sensor_id` | Value | (none) | `bme280_sensor_id()` | `bme.sensorID()` |
| `bme280_temperature_compensation` | Statement | COMPENSATION(input_value) | `bme280_temperature_compensation(math_number(0))` | `bme.setTemperatureCompensation(` |
| `bme280_get_temperature_compensation` | Value | (none) | `bme280_get_temperature_compensation()` | `bme.getTemperatureCompensation()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0, 1, 2 | 正常 / 省电 / 强制 |
| TEMP_SAMPLING | 0, 1, 2 | 低 / 标准 / 高 |
| PRESS_SAMPLING | 0, 1, 2 | 低 / 标准 / 高 |
| HUM_SAMPLING | 0, 1, 2 | 低 / 标准 / 高 |
| FILTER | 0, 2, 4, 8, 16 | 关闭 / 2 / 4 / 8 / 16 |
| STANDBY | 0.5, 10, 20, 62.5, 125, 250, 500 | 0.5ms / 10ms / 20ms / 62.5ms / 125ms / 250ms / 500ms |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bme280_init("BME280_ADDRESS")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bme280_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

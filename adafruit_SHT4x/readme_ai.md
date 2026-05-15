# SHT4x temperature and humidity sensor

SHT40/SHT41/SHT45 temperature and humidity sensor support library supports high-precision temperature and humidity measurement

## Library Info
- **Name**: @aily-project/lib-adafruit-sht4x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sht4x_init` | Statement | ADDRESS(dropdown) | `sht4x_init("0x44")` | Dynamic code |
| `sht4x_read_temperature` | Value | (none) | `sht4x_read_temperature()` | ({ sht4.getEvent(&humidity, &temp); temp.temperature; }) |
| `sht4x_read_humidity` | Value | (none) | `sht4x_read_humidity()` | ({ sht4.getEvent(&humidity, &temp); humidity.relative_humidity; }) |
| `sht4x_read_both` | Statement | (none) | `sht4x_read_both()` | sht4.getEvent(&humidity, &temp);\n |
| `sht4x_get_last_temperature` | Value | (none) | `sht4x_get_last_temperature()` | sht4x_last_temperature |
| `sht4x_get_last_humidity` | Value | (none) | `sht4x_get_last_humidity()` | sht4x_last_humidity |
| `sht4x_set_precision` | Statement | PRECISION(dropdown) | `sht4x_set_precision(SHT4X_HIGH_PRECISION)` | sht4.setPrecision( |
| `sht4x_set_heater` | Statement | HEATER(dropdown) | `sht4x_set_heater(SHT4X_NO_HEATER)` | sht4.setHeater( |
| `sht4x_read_serial` | Value | (none) | `sht4x_read_serial()` | sht4.readSerial() |
| `sht4x_reset` | Statement | (none) | `sht4x_reset()` | sht4.reset(); |
| `sht4x_simple_read` | Value | TYPE(dropdown), ADDRESS(dropdown) | `sht4x_simple_read(temperature, "0x44")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x44, 0x45 | sht4x_init, sht4x_simple_read |
| PRECISION | SHT4X_HIGH_PRECISION, SHT4X_MED_PRECISION, SHT4X_LOW_PRECISION | sht4x_set_precision |
| HEATER | SHT4X_NO_HEATER, SHT4X_HIGH_HEATER_1S, SHT4X_HIGH_HEATER_100MS, SHT4X_MED_HEATER_1S, SHT4X_MED_HEATER_100MS, SHT4X_LOW_HEATER_1S, SHT4X_LOW_HEATER_100MS | sht4x_set_heater |
| TYPE | temperature, humidity | sht4x_simple_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sht4x_init("0x44")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sht4x_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

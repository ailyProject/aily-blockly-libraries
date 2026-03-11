# SHT4x温湿度传感器

SHT40/SHT41/SHT45温湿度传感器支持库，支持高精度温湿度测量

## Library Info
- **Name**: @aily-project/lib-adafruit-sht4x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sht4x_init` | Statement | ADDRESS(dropdown) | `sht4x_init(0x44)` | `` |
| `sht4x_read_temperature` | Value | (none) | `sht4x_read_temperature()` | `({ sht4.getEvent(&humidity, &temp); temp.temperature; })` |
| `sht4x_read_humidity` | Value | (none) | `sht4x_read_humidity()` | `({ sht4.getEvent(&humidity, &temp); humidity.relative_humidity; })` |
| `sht4x_read_both` | Statement | (none) | `sht4x_read_both()` | `sht4.getEvent(&humidity, &temp);\n` |
| `sht4x_get_last_temperature` | Value | (none) | `sht4x_get_last_temperature()` | `sht4x_last_temperature` |
| `sht4x_get_last_humidity` | Value | (none) | `sht4x_get_last_humidity()` | `sht4x_last_humidity` |
| `sht4x_set_precision` | Statement | PRECISION(dropdown) | `sht4x_set_precision(SHT4X_HIGH_PRECISION)` | `sht4.setPrecision(` |
| `sht4x_set_heater` | Statement | HEATER(dropdown) | `sht4x_set_heater(SHT4X_NO_HEATER)` | `sht4.setHeater(` |
| `sht4x_read_serial` | Value | (none) | `sht4x_read_serial()` | `sht4.readSerial()` |
| `sht4x_reset` | Statement | (none) | `sht4x_reset()` | `sht4.reset();` |
| `sht4x_simple_read` | Value | TYPE(dropdown), ADDRESS(dropdown) | `sht4x_simple_read(temperature, 0x44)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x44, 0x45 | 0x44 (默认) / 0x45 |
| PRECISION | SHT4X_HIGH_PRECISION, SHT4X_MED_PRECISION, SHT4X_LOW_PRECISION | 高精度 / 中等精度 / 低精度 |
| HEATER | SHT4X_NO_HEATER, SHT4X_HIGH_HEATER_1S, SHT4X_HIGH_HEATER_100MS, SHT4X_MED_HEATER_1S, SHT4X_MED_HEATER_100MS, SHT4X_LOW_HEATER_1S, SHT4X_LOW_HEATER_100MS | 不加热 / 高温1秒 / 高温0.1秒 / 中温1秒 / 中温0.1秒 / 低温1秒 / 低温0.1秒 |
| TYPE | temperature, humidity | 温度 / 湿度 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sht4x_init(0x44)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sht4x_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

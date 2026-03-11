# BMP280气压传感器

用于BMP280气压传感器，通过I2C接口实现温度、气压的高精度测量、海拔高度计算，适用于Arduino、ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-bmp280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp280_init` | Statement | ADDR(dropdown), WIRE(dropdown) | `bmp280_init(0x76, WIRE)` | `` |
| `bmp280_read_temperature` | Value | (none) | `bmp280_read_temperature()` | `bmp.readTemperature()` |
| `bmp280_read_pressure` | Value | (none) | `bmp280_read_pressure()` | `(bmp.readPressure() / 100.0F)` |
| `bmp280_read_altitude` | Value | SEAPRESSURE(field_number) | `bmp280_read_altitude(1013.25)` | `bmp.readAltitude(` |
| `bmp280_set_sampling` | Statement | MODE(dropdown), TEMP_OS(dropdown), PRES_OS(dropdown), FILTER(dropdown), DURATION(dropdown) | `bmp280_set_sampling(MODE_NORMAL, SAMPLING_X4, SAMPLING_X4, FILTER_X4, STANDBY_MS_1)` | `bmp.setSampling(Adafruit_BMP280::` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x76, 0x77 | 0x76 (默认) / 0x77 (备选) |
| MODE | MODE_NORMAL, MODE_FORCED, MODE_SLEEP | 正常 / 强制 / 睡眠 |
| TEMP_OS | SAMPLING_X4, SAMPLING_NONE, SAMPLING_X1, SAMPLING_X2, SAMPLING_X8, SAMPLING_X16 | 4倍 / 无过采样 / 1倍 / 2倍 / 8倍 / 16倍 |
| PRES_OS | SAMPLING_X4, SAMPLING_NONE, SAMPLING_X1, SAMPLING_X2, SAMPLING_X8, SAMPLING_X16 | 4倍 / 无过采样 / 1倍 / 2倍 / 8倍 / 16倍 |
| FILTER | FILTER_X4, FILTER_OFF, FILTER_X2, FILTER_X8, FILTER_X16 | 4倍 / 关闭 / 2倍 / 8倍 / 16倍 |
| DURATION | STANDBY_MS_1, STANDBY_MS_63, STANDBY_MS_125, STANDBY_MS_250, STANDBY_MS_500, STANDBY_MS_1000, STANDBY_MS_2000, STANDBY_MS_4000 | 1ms / 63ms / 125ms / 250ms / 500ms / 1000ms / 2000ms / 4000ms |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmp280_init(0x76, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp280_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

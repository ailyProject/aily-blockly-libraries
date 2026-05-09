# AHT20 温湿度传感器

AHT20高精度I2C温湿度传感器，±0.3°C/±2%RH精度。

## Library Info
- **Name**: @aily-project/lib-seeed-aht20
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `aht20_init` | Statement | — | `aht20_init()` | `Wire.begin(); aht20_sensor.begin();` |
| `aht20_read_temperature` | Value | — | `aht20_read_temperature()` | `aht20_getTemperature()` 返回float(°C) |
| `aht20_read_humidity` | Value | — | `aht20_read_humidity()` | `aht20_getHumidity()` 返回float(%RH) |

## ABS Examples

```
arduino_setup()
    aht20_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("温度: "))
    serial_println(Serial, aht20_read_temperature())
    serial_print(Serial, text("湿度: "))
    serial_println(Serial, aht20_read_humidity())
    time_delay(math_number(1000))
```

## Notes

1. **全局对象**: 使用固定名称 `aht20_sensor`
2. **I2C地址**: 固定0x38，无法修改
3. **预热时间**: 首次上电后需约20ms稳定

# BME68x 环境传感器

BME680/BME688四合一传感器，检测温度/湿度/气压/气体（VOC）。

## Library Info
- **Name**: @aily-project/lib-seeed-bme68x
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bme68x_init` | Statement | ADDRESS(dropdown) | `bme68x_init(0x76)` | `Seeed_BME680 bme68x_sensor(0x76); Wire.begin(); bme68x_sensor.init();` |
| `bme68x_update` | Statement | — | `bme68x_update()` | `bme68x_sensor.read_sensor_data();` |
| `bme68x_read_temperature` | Value | — | `bme68x_read_temperature()` | `bme68x_sensor.read_temperature()` 返回float(°C) |
| `bme68x_read_humidity` | Value | — | `bme68x_read_humidity()` | `bme68x_sensor.read_humidity()` 返回float(%RH) |
| `bme68x_read_pressure` | Value | — | `bme68x_read_pressure()` | `(bme68x_sensor.read_pressure() / 100.0)` 返回float(hPa) |
| `bme68x_read_gas` | Value | — | `bme68x_read_gas()` | `bme68x_sensor.read_gas()` 返回float(Ω) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x76, 0x77 | I2C地址（由SDO引脚决定） |

## ABS Examples

```
arduino_setup()
    bme68x_init(0x76)
    serial_begin(Serial, 9600)

arduino_loop()
    bme68x_update()
    serial_print(Serial, text("温度: "))
    serial_println(Serial, bme68x_read_temperature())
    serial_print(Serial, text("湿度: "))
    serial_println(Serial, bme68x_read_humidity())
    serial_print(Serial, text("气压: "))
    serial_println(Serial, bme68x_read_pressure())
    serial_print(Serial, text("气体阻值: "))
    serial_println(Serial, bme68x_read_gas())
    time_delay(math_number(2000))
```

## Notes

1. **全局对象**: 使用固定名称 `bme68x_sensor`，初始化时地址嵌入定义中
2. **更新顺序**: 每次读取前必须先调用 `bme68x_update()` 获取最新数据
3. **气压单位**: 库返回Pa，已自动除以100转换为hPa
4. **气体阻值**: 数值越大表示空气质量越好（低VOC浓度）

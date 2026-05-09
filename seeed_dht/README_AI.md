# Grove DHT温湿度传感器

支持DHT11/DHT22/DHT10的温湿度传感器驱动。

## Library Info
- **Name**: @aily-project/lib-seeed-dht
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dht_init` | Statement | PIN(input_value), TYPE(dropdown) | `dht_init(math_number(2), DHT11)` | `DHT dht_sensor(2, DHT11); dht_sensor.begin();` |
| `dht_read_temperature` | Value | UNIT(dropdown) | `dht_read_temperature(C)` | `dht_sensor.readTemperature(false)` |
| `dht_read_humidity` | Value | — | `dht_read_humidity()` | `dht_sensor.readHumidity()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | DHT11, DHT22, DHT10 | 传感器型号 |
| UNIT | C, F | 温度单位（摄氏/华氏） |

## ABS Examples

```
arduino_setup()
    dht_init(math_number(2), DHT22)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("温度: "))
    serial_println(Serial, dht_read_temperature(C))
    serial_print(Serial, text("湿度: "))
    serial_println(Serial, dht_read_humidity())
    time_delay(math_number(2000))
```

## Notes

1. **全局对象**: 使用固定名称 `dht_sensor`，无需创建变量
2. **DHT10**: 使用I2C接口，引脚参数将被忽略
3. **读取间隔**: 两次读取之间至少间隔2秒

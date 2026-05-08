# SparkFun HTU21D 温湿度传感器

I2C 接口温湿度传感器库，通过 `HTU21D` 对象读取温度和相对湿度。

## Library Info
- **Name**: @aily-project/lib-sparkfun-htu21d
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `htu21d_init` | Statement | VAR(field_input) | `htu21d_init("htu21d")` | `HTU21D htu21d; Wire.begin(); htu21d.begin();` |
| `htu21d_read_humidity` | Value | VAR(field_variable) | `htu21d_read_humidity(variables_get($htu21d))` | `htu21d.readHumidity()` |
| `htu21d_read_temperature` | Value | VAR(field_variable) | `htu21d_read_temperature(variables_get($htu21d))` | `htu21d.readTemperature()` |
| `htu21d_set_resolution` | Statement | VAR(field_variable), RES(field_dropdown) | `htu21d_set_resolution(variables_get($htu21d), RH12_TEMP14)` | `htu21d.setResolution(0x00);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RES | RH12_TEMP14(0x00), RH8_TEMP12(0x01), RH10_TEMP13(0x80), RH11_TEMP11(0x81) | 测量分辨率 |

## ABS Examples

### 基本用法
```
arduino_setup()
    htu21d_init("sensor")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("湿度: "))
    serial_println(Serial, htu21d_read_humidity(variables_get($sensor)))
    serial_print(Serial, text("温度: "))
    serial_println(Serial, htu21d_read_temperature(variables_get($sensor)))
    time_delay(math_number(1000))
```

## Notes

1. **初始化**: 在 `arduino_setup()` 中调用 `htu21d_init`，已自动包含 `Wire.begin()`
2. **变量引用**: 使用 `variables_get($name)` 在值槽中引用变量

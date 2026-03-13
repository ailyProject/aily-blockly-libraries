# BME280温湿度气压传感器

Grove BME280温湿度气压传感器库，支持读取温度、湿度、气压和海拔高度。

## 库信息
- **名称**: @aily-project/lib-bme280
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数(args0顺序) | ABS格式 | 生成代码 |
|--------|----------|-----------------|---------|----------|
| `bme280_init` | Statement | VAR(field_input), I2C_ADDR(field_dropdown) | `bme280_init("name", 0x76)` | `BME280 name; if (!name.init(0x76)) { Serial.println("BME280初始化失败!"); }` |
| `bme280_get_temperature` | Value | VAR(field_variable) | `bme280_get_temperature($name)` | `name.getTemperature()` |
| `bme280_get_pressure` | Value | VAR(field_variable) | `bme280_get_pressure($name)` | `name.getPressure()` |
| `bme280_get_humidity` | Value | VAR(field_variable) | `bme280_get_humidity($name)` | `name.getHumidity()` |
| `bme280_calc_altitude` | Value | VAR(field_variable), PRESSURE(input_value) | `bme280_calc_altitude($name, math_number(101325))` | `name.calcAltitude(101325)` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| I2C_ADDR | 0x76, 0x77 | I2C地址，默认0x76 |

## ABS示例

### 基本使用
```
arduino_setup()
    bme280_init("bme", 0x76)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("温度: "))
    serial_print(Serial, bme280_get_temperature(variables_get($bme)))
    serial_print(Serial, text(" C, 湿度: "))
    serial_print(Serial, bme280_get_humidity(variables_get($bme)))
    serial_print(Serial, text(" %, 气压: "))
    serial_print(Serial, bme280_get_pressure(variables_get($bme)))
    serial_println(Serial, text(" Pa"))
    time_delay(math_number(1000))
```

## 注意事项

1. **初始化**: 在`arduino_setup()`中调用`bme280_init`初始化传感器
2. **变量引用**: 使用`variables_get($name)`在值槽中引用已创建的传感器变量
3. **I2C地址**: 默认地址为0x76，部分模块可能使用0x77
4. **单位**: 温度单位为摄氏度(°C)，气压单位为帕斯卡(Pa)，湿度单位为百分比(%)，海拔单位为米(m)
# adafruit_DHT

DHT 温湿度传感器库

## 库信息
- **库名**: @aily-project/lib-adafruit-dht
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接 | 参数 | DSL格式 | 生成代码 |
|--------|------|------|---------|----------|
| `dht_init` | 语句块 | VAR(field_input), TYPE(dropdown), PIN/WIRE(dropdown) | `dht_init("dht", DHT22, 2)` | `DHT var(pin, TYPE); var.begin();` |
| `dht_read_temperature` | 值块 | VAR(field_variable) | `dht_read_temperature($dht)` | `var.readTemperature()` |
| `dht_read_humidity` | 值块 | VAR(field_variable) | `dht_read_humidity($dht)` | `var.readHumidity()` |
| `dht_read_success` | 值块 | VAR(field_variable) | `dht_read_success($dht)` | `!isnan(...)` |

**说明**: `dht_init` 会自动创建变量并注册到 Blockly，后续用 `$变量名` 引用。

## DSL 示例

### 初始化 DHT22（单总线）
```
dht_init("dht", DHT22, 2)
```

### 初始化 DHT20（I2C）
```
dht_init("dht", DHT20, Wire)
```

### 完整示例：读取温湿度
```
arduino_setup()
    dht_init("dht", DHT22, 2)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if(dht_read_success($dht))
        serial_print(Serial, text("温度: "))
        serial_println(Serial, dht_read_temperature($dht))
        serial_print(Serial, text("湿度: "))
        serial_println(Serial, dht_read_humidity($dht))
    time_delay(number(2000))
```

## 参数选项

| 参数 | 可选值 | 说明 |
|------|--------|------|
| TYPE | DHT11, DHT22, DHT21, DHT20 | 传感器类型 |
| PIN | 2-13 | 数字引脚（DHT11/22/21） |
| WIRE | Wire, Wire1 | I2C 接口（仅 DHT20） |

## 注意事项

1. **初始化位置**: `dht_init` 放在 `arduino_setup()` 中
2. **读取间隔**: DHT11 ≥1秒，DHT22/21/20 ≥2秒
3. **DHT20 特殊**: 使用 I2C，第三个参数是 Wire 而非 PIN
4. **变量引用**: 用 `$变量名` 引用，如 `dht_read_temperature($dht)`
5. **读取检查**: 建议用 `dht_read_success($dht)` 检查读取是否成功

## 技术规格

| 型号 | 温度范围 | 精度 | 湿度范围 | 接口 |
|------|----------|------|----------|------|
| DHT11 | 0-50°C | ±2°C | 20-80%RH | 单总线 |
| DHT22 | -40-80°C | ±0.5°C | 0-100%RH | 单总线 |
| DHT21 | -40-80°C | ±0.3°C | 0-100%RH | 单总线 |
| DHT20 | -40-80°C | ±0.3°C | 0-100%RH | I2C |
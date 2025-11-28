# adafruit_DHT

DHT温湿度传感器操作库

## 库信息
- **库名**: @aily-project/lib-adafruit-dht
- **版本**: 1.0.0
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `dht_init` | 语句块 | VAR(field_input), TYPE(field_dropdown), PIN(field_dropdown) / WIRE(field_dropdown) (动态) | `"fields":{"VAR":"dht","TYPE":"DHT22"}` | `// DHT11/22/21: DHT dht(pin, TYPE); dht.begin();\n// DHT20: DHT20 dht(&I2C0); dht.begin();` |
| `dht_read_temperature` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `dht.readTemperature()` |
| `dht_read_humidity` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `dht.readHumidity()` |
| `dht_read_success` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `!isnan(dht.readTemperature()) && !isnan(dht.readHumidity())` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | DHT变量对象 | `"VAR": {"id": "dht_id", "name": "dht", "type": "DHT"}` |
| field_input | 字符串 | `"VAR": "dht"` (创建块使用，generator 会注册变量到 Blockly) |
| field_dropdown(动态) | 字符串 | `"WIRE": "Wire"`（DHT20 使用，选项来自 `boardConfig.i2c`） |
| field_dropdown | 字符串 | `"TYPE": "DHT22"` |
| field_number | 数值字符串 | `"PIN": "2"` |

## 连接规则

- **语句块**: dht_init有previousStatement/nextStatement，通过`next`字段连接
- **值块**: dht_read_temperature、dht_read_humidity、dht_read_success有output，连接到`inputs`中
## 连接规则

- **语句块**: `dht_init`、`ntpclient` 等初始化/控制类为语句块，具有 `previousStatement`/`nextStatement`。
- **值块**: 读取类（如 `dht_read_temperature`）为值块，有 `output` 可作为表达式使用。
- **特殊规则**: 
  - DHT 实例有两种类型：`DHT`（单总线：DHT11/DHT22/DHT21）和 `DHT20`（I2C 总线）。
  - `dht_init` 使用 `field_input` 创建变量名（文本），生成器会调用 `registerVariableToBlockly(varName, 'DHT')` 或 `registerVariableToBlockly(varName, 'DHT20')`，并在生成代码中声明相应对象与 `begin()` 初始化代码。
  - 对于 `DHT20`，`dht_init` 会显示 `WIRE` 下拉（I2C 接口），而非 `PIN`。
  - 读取块根据内部类型映射（generator 中的 `Arduino.dhtTypeMap`）在生成时代码对 `DHT20` 使用 `read()` + `getTemperature()/getHumidity()` 的调用序列。

## 使用示例

### DHT 传感器初始化（单线 DHT11/22/21）
```json
{
  "type": "dht_init",
  "id": "dht_setup",
  "fields": {
    "VAR": "dht",
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### DHT20 (I2C) 初始化示例
```json
{
  "type": "dht_init",
  "id": "dht20_setup",
  "fields": {
    "VAR": "dht_i2c",
    "TYPE": "DHT20",
    "WIRE": "Wire"
  }
}
```

### 温湿度读取（示例）
```json
{
  "type": "variables_set",
  "id": "set_temp",
  "fields": {"VAR": {"id": "temp_var"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "dht_read_temperature",
        "fields": {"VAR": {"id": "dht_var"}}
      }
    }
  }
}
```

### 读取状态检测
```json
{
  "type": "controls_if",
  "id": "check_dht",
  "inputs": {
    "IF0": {
      "block": {
        "type": "dht_read_success",
        "fields": {"VAR": {"id": "dht_var"}}
      }
    },
    "DO0": {
      "block": {
        "type": "serial_print",
        "inputs": {
          "CONTENT": {
            "block": {
              "type": "dht_read_temperature",
              "fields": {"VAR": {"id": "dht_var"}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: DHT 传感器需要在 `setup()` 中初始化（`dht_init` 会在生成器中把 `begin()` 加入 setup），读取间隔要求：DHT11 ≥1 秒，DHT22/DHT21 ≥2 秒。
2. **连接限制**: `dht_init` 为语句块，通常放在 setup 区域；读取块为值块，可在表达式中使用。
3. **变量管理**: `dht_init` 使用文本 `VAR` 创建变量名，生成器会注册该变量为 `DHT` 或 `DHT20` 类型，后续读取块使用 `field_variable` 引用该变量。如果你希望显式变量对象（`{"id":"..."}`）形式，请在 Blockly 中使用变量选择器并确保名称一致。
4. **DHT20 特殊注意**: 对于 `DHT20`，读取前需要调用 `read()`，生成器会在读取表达式中插入 `var.read()` 调用（例如 `(var.read(), var.getTemperature())`）；`dht_read_success` 对 `DHT20` 使用 `var.read() == DHT20_OK` 判断成功。
5. **常见错误**: ❌ 未初始化直接读取；❌ 读取频率过高；❌ 对 DHT20 使用 PIN 字段而非 I2C 接口。

## 支持的字段选项
- **TYPE(传感器类型)**: "DHT11", "DHT22", "DHT21", "DHT20"
- **PIN(引脚范围)**: 0-255（数字I/O引脚）
- **变量类型**: "DHT"（专用类型，用于DHT传感器实例）

## 技术规格
- **DHT11**: 温度0-50°C(±2°C), 湿度20-80%RH(±5%RH), 读取间隔≥1秒
- **DHT22**: 温度-40-80°C(±0.5°C), 湿度0-100%RH(±2-5%RH), 读取间隔≥2秒  
- **DHT21**: 温度-40-80°C(±0.3°C), 湿度0-100%RH(±3%RH), 读取间隔≥2秒
- **DHT20**: 温度-40-80°C(±0.3°C), 湿度0-100%RH(±2%RH), 读取间隔≥2秒, I2C接口
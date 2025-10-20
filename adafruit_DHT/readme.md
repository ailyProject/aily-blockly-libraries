# adafruit_DHT

DHT温湿度传感器操作库

## 库信息
- **库名**: @aily-project/lib-adafruit-dht
- **版本**: 1.0.0
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `dht_init` | 语句块 | VAR(field_variable), TYPE(field_dropdown), PIN(field_number) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"},"TYPE":"DHT22","PIN":"2"}` | `DHT dht(2, DHT22); dht.begin();` |
| `dht_read_temperature` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `dht.readTemperature()` |
| `dht_read_humidity` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `dht.readHumidity()` |
| `dht_read_success` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"dht_id","name":"dht","type":"DHT"}}` | `!isnan(dht.readTemperature()) && !isnan(dht.readHumidity())` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_variable | DHT变量对象 | `"VAR": {"id": "dht_id", "name": "dht", "type": "DHT"}` |
| field_dropdown | 字符串 | `"TYPE": "DHT22"` |
| field_number | 数值字符串 | `"PIN": "2"` |

## 连接规则

- **语句块**: dht_init有previousStatement/nextStatement，通过`next`字段连接
- **值块**: dht_read_temperature、dht_read_humidity、dht_read_success有output，连接到`inputs`中
- **特殊规则**: 
  - DHT变量类型为"DHT"，每个实例独立管理
  - dht_init生成库包含、变量定义和setup初始化
  - 读取块直接调用DHT实例方法

## 使用示例

### DHT传感器初始化
```json
{
  "type": "dht_init",
  "id": "dht_setup",
  "fields": {
    "VAR": {"id": "dht_var", "name": "dht", "type": "DHT"},
    "TYPE": "DHT22",
    "PIN": "2"
  }
}
```

### 温湿度读取
```json
{
  "type": "variables_set",
  "id": "set_temp",
  "fields": {"VAR": {"id": "temp_var", "name": "temperature", "type": "Number"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "dht_read_temperature",
        "fields": {"VAR": {"id": "dht_var", "name": "dht", "type": "DHT"}}
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
        "fields": {"VAR": {"id": "dht_var", "name": "dht", "type": "DHT"}}
      }
    },
    "DO0": {
      "block": {
        "type": "serial_print",
        "inputs": {
          "CONTENT": {
            "block": {
              "type": "dht_read_temperature",
              "fields": {"VAR": {"id": "dht_var", "name": "dht", "type": "DHT"}}
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: DHT传感器需要在setup()中初始化，读取间隔DHT11≥1秒，DHT22/DHT21≥2秒
2. **连接限制**: dht_init是语句块必须在setup区域，读取块是值块可用于表达式
3. **变量管理**: 每个DHT实例使用独立的DHT类型变量，支持多传感器同时使用
4. **常见错误**: ❌ 未初始化直接读取，❌ 读取频率过高，❌ 变量类型不匹配

## 支持的字段选项
- **TYPE(传感器类型)**: "DHT11", "DHT22", "DHT21"
- **PIN(引脚范围)**: 0-255（数字I/O引脚）
- **变量类型**: "DHT"（专用类型，用于DHT传感器实例）

## 技术规格
- **DHT11**: 温度0-50°C(±2°C), 湿度20-80%RH(±5%RH), 读取间隔≥1秒
- **DHT22**: 温度-40-80°C(±0.5°C), 湿度0-100%RH(±2-5%RH), 读取间隔≥2秒  
- **DHT21**: 温度-40-80°C(±0.3°C), 湿度0-100%RH(±3%RH), 读取间隔≥2秒
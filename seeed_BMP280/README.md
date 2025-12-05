# seeed_BMP280

BMP280气压温度传感器驱动库，支持I2C接口读取气压、温度及计算海拔高度。

## 库信息
- **库名**: @aily-project/lib-seeed-bmp280
- **版本**: 1.0.0
- **兼容**: Arduino AVR/SAMD, ESP32, ESP8266, RP2040, Renesas UNO R4

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `bmp280_create` | 语句块 | VAR(field_input) | `"VAR":"bmp280"` | `BMP280 bmp280;` |
| `bmp280_init` | 语句块 | VAR(field_input) | `"VAR":"bmp280"` | `bmp280.init();` |
| `bmp280_get_temperature` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `bmp280.getTemperature()` |
| `bmp280_get_pressure` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `bmp280.getPressure()` |
| `bmp280_calc_altitude` | 值块 | VAR(field_variable), PRESSURE(input) | `"VAR":{"id":"var_id"}` | `bmp280.calcAltitude(101325)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "bmp280"` |
| field_variable | 对象 | `"VAR": {"id": "variable_id"}` |
| input_value | 块连接 | `"inputs": {"PRESSURE": {"block": {...}}}` |

## 连接规则

- **语句块**: `bmp280_create`和`bmp280_init`有previousStatement/nextStatement，通过`next`字段连接
- **值块**: `bmp280_get_*`和`bmp280_calc_altitude`有output，连接到`inputs`中，无`next`字段
- **变量规则**: 
  - `bmp280_create`和`bmp280_init`使用`field_input`，在.abi中为字符串格式
  - `bmp280_get_*`等方法块使用`field_variable`，在.abi中为对象格式`{"id":"变量ID"}`

## 使用示例

### 基础使用
```json
{
  "type": "arduino_setup",
  "inputs": {
    "ARDUINO_SETUP": {
      "block": {
        "type": "bmp280_create",
        "id": "create_id",
        "fields": {"VAR": "bmp280"},
        "next": {
          "block": {
            "type": "bmp280_init",
            "id": "init_id",
            "fields": {"VAR": "bmp280"}
          }
        }
      }
    }
  }
}
```

### 读取数据
```json
{
  "type": "serial_println",
  "inputs": {
    "VAR": {
      "block": {
        "type": "bmp280_get_temperature",
        "id": "temp_id",
        "fields": {
          "VAR": {"id": "bmp280_var_id"}
        }
      }
    }
  }
}
```

## 重要规则

1. **变量一致性**: `bmp280_create`中定义的变量名必须在其他块中对应使用
2. **初始化顺序**: 必须先调用`bmp280_create`创建对象，再调用`bmp280_init`初始化
3. **I2C初始化**: 自动添加`Wire.begin()`，可被`aily_iic`库覆盖
4. **Serial依赖**: `bmp280_init`自动初始化Serial用于调试输出

## 支持的功能

- **温度测量**: 返回摄氏度（°C）
- **气压测量**: 返回帕斯卡（Pa）
- **海拔计算**: 根据气压和海平面气压计算海拔高度（米）
- **默认海平面气压**: 101325 Pa

# adafruit_SHT3x

Adafruit SHT31高精度数字温湿度传感器操作库

## 库信息
- **库名**: @aily-project/lib-adafruit-sht3x
- **版本**: 1.0.0
- **兼容**: Arduino全系列平台(AVR/MegaAVR/SAMD/ESP32/ESP8266/RP2040/UNO R4等)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sht31_init` | 语句块 | VAR(field_input), ADDRESS(field_dropdown), WIRE(field_dropdown) | `"fields":{"VAR":"sht31","ADDRESS":"0x44","WIRE":"Wire"}` | `Adafruit_SHT31 sht31; Wire.begin(); sht31.begin(0x44);` |
| `sht31_heater_control` | 语句块 | VAR(field_variable), STATE(field_dropdown) | `"fields":{"VAR":{"id":"sht31_id","name":"sht31","type":"Adafruit_SHT31"},"STATE":"true"}` | `sht31.heater(true);` |
| `sht31_is_heater_enabled` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"sht31_id","name":"sht31","type":"Adafruit_SHT31"}}` | `sht31.isHeaterEnabled()` 返回Boolean |
| `sht31_reset` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"sht31_id","name":"sht31","type":"Adafruit_SHT31"}}` | `sht31.reset();` |
| `sht31_simple_read` | 值块 | VAR(field_variable), TYPE(field_dropdown) | `"fields":{"VAR":{"id":"sht31_id","name":"sht31","type":"Adafruit_SHT31"},"TYPE":"temperature"}` | `sht31.readTemperature()` 返回Number |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "sht31"` |
| field_variable | Adafruit_SHT31变量对象 | `"VAR": {"id": "sht31_id", "name": "sht31", "type": "Adafruit_SHT31"}` |
| field_dropdown | 字符串 | `"ADDRESS": "0x44"`, `"STATE": "true"`, `"TYPE": "temperature"` |
| field_dropdown(动态) | 字符串 | `"WIRE": "Wire"` (从board.json的i2c获取) |

## 连接规则

- **语句块**: 初始化块(sht31_init)、控制块(sht31_heater_control/sht31_reset)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 读取块(sht31_simple_read)、状态块(sht31_is_heater_enabled)有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - Adafruit_SHT31变量类型为"Adafruit_SHT31"，支持多实例(sht31、sht31_2等)
  - 初始化块使用field_input创建变量，其他块使用field_variable引用变量
  - 初始化块在setup()中生成Wire.begin()和传感器初始化代码

## 使用示例

### 基础温湿度读取
```json
{
  "type": "sht31_init",
  "fields": {
    "VAR": "sht31",
    "ADDRESS": "0x44",
    "WIRE": "Wire"
  },
  "next": {
    "block": {
      "type": "sht31_simple_read",
      "fields": {
        "VAR": {
          "id": "sht31_id",
          "name": "sht31",
          "type": "Adafruit_SHT31"
        },
        "TYPE": "temperature"
      }
    }
  }
}
```

### 加热器控制
```json
{
  "type": "sht31_heater_control",
  "fields": {
    "VAR": {
      "id": "sht31_id",
      "name": "sht31",
      "type": "Adafruit_SHT31"
    },
    "STATE": "true"
  },
  "next": {
    "block": {
      "type": "sht31_is_heater_enabled",
      "fields": {
        "VAR": {
          "id": "sht31_id",
          "name": "sht31",
          "type": "Adafruit_SHT31"
        }
      }
    }
  }
}
```

### 传感器复位
```json
{
  "type": "sht31_reset",
  "fields": {
    "VAR": {
      "id": "sht31_id",
      "name": "sht31",
      "type": "Adafruit_SHT31"
    }
  }
}
```

## 重要规则

1. **I2C地址**: 默认0x44，备用0x45（通过ADDR引脚选择）
2. **I2C接口**: 支持Wire/Wire1等，根据板卡动态获取可用I2C总线
3. **测量范围**: 温度-40~125°C，湿度0~100%RH
4. **测量精度**: ±0.3°C (温度), ±2%RH (湿度)
5. **内置加热器**: 用于去除传感器表面冷凝水，开启时温度约+3°C
6. **电源电压**: 2.4-5.5V，兼容3.3V和5V系统
7. **通讯协议**: I2C (最高1MHz)
8. **响应时间**: 温度8秒，湿度8秒（达到63%最终值）

## 硬件连接

| 传感器引脚 | Arduino UNO | Arduino Mega | ESP32 | 说明 |
|-----------|-------------|--------------|-------|------|
| VCC | 5V/3.3V | 5V/3.3V | 3.3V | 电源 |
| GND | GND | GND | GND | 地 |
| SDA | A4 | 20 | GPIO21(可配置) | I2C数据 |
| SCL | A5 | 21 | GPIO22(可配置) | I2C时钟 |
| ADDR | GND/VCC | GND/VCC | GND/VCC | 地址选择 |

## 技术参数

- **工作温度**: -40~125°C
- **工作湿度**: 0~100%RH
- **温度精度**: ±0.3°C (典型值)
- **湿度精度**: ±2%RH (典型值)
- **重复性**: ±0.1°C, ±0.1%RH
- **响应时间**: 8秒 (tau 63%)
- **长期漂移**: <0.25%RH/年

**原始库**: [Adafruit_SHT31](https://github.com/adafruit/Adafruit_SHT31)

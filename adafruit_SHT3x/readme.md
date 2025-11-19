# Adafruit SHT31 温湿度传感器

SHT31高精度数字温湿度传感器的Aily Blockly图形化库。

## 库信息
**包名**: `@aily-project/lib-adafruit_SHT3x` | **版本**: 1.0.0 | **兼容**: UNO/Mega/ESP32/ESP8266

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sht31_init` | 语句块 | ADDRESS(dropdown) | `"ADDRESS":"0x44"` | `Wire.begin(); sht31.begin(0x44);` |
| `sht31_simple_read` | 值块 | TYPE(dropdown) | `"TYPE":"temperature"` | `sht31.readTemperature()` |
| `sht31_heater_control` | 语句块 | STATE(dropdown) | `"STATE":"true"` | `sht31.heater(true);` |
| `sht31_is_heater_enabled` | 值块 | 无 | 无 | `sht31.isHeaterEnabled()` |
| `sht31_reset` | 语句块 | 无 | 无 | `sht31.reset();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"ADDRESS":"0x44"` |
| field_dropdown | 字符串 | `"TYPE":"temperature"` |
| field_dropdown | 字符串 | `"STATE":"true"` |

## 连接规则

- **初始化块**: `sht31_init` 必须在setup中调用
- **读取块**: `sht31_simple_read` 为值块，返回Number类型
- **控制块**: `sht31_heater_control`/`sht31_reset` 为语句块
- **状态块**: `sht31_is_heater_enabled` 为值块，返回Boolean类型
- **板卡适配**: ESP32可选SDA/SCL引脚，UNO/Mega固定(UNO: A4/A5, Mega: 20/21)

## 使用示例

### 基础读取
```json
{
  "type": "sht31_init",
  "fields": {"ADDRESS": "0x44"},
  "next": {
    "block": {
      "type": "sht31_simple_read",
      "fields": {"TYPE": "temperature"}
    }
  }
}
```

## 重要规则

1. **I2C地址**: 默认0x44，备用0x45
2. **测量范围**: 温度-40~125°C，湿度0~100%RH
3. **精度**: ±0.3°C (温度), ±2%RH (湿度)
4. **加热器**: 用于去除冷凝水，开启时温度+3°C

**原始库**: [Adafruit_SHT31](https://github.com/adafruit/Adafruit_SHT31)

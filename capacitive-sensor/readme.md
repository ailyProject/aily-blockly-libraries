# CapacitiveSensor

电容触摸感应库，将CapacitiveSensor核心功能转换为Blockly块以便快速检测触摸与自动校准

## 库信息
- **库名**: @aily-project/lib-capacitivesensor
- **版本**: 0.0.1
- **兼容**: arduino:avr, arduino:megaavr, arduino:samd, esp32:esp32, esp8266:esp8266, renesas_uno:unor4wifi, rp2040:rp2040

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `capacitivesensor_create` | 语句块 | VAR(field_input), SEND(field_dropdown), RECV(field_dropdown) | `"fields":{"VAR":"sensor","SEND":"4","RECV":"2"}` | 全局声明`CapacitiveSensor sensor(4, 2);` |
| `capacitivesensor_read` | 值块 | VAR(field_variable), SAMPLES(input_value) | `"fields":{"VAR":{"type":"CapacitiveSensor"}},"inputs":{"SAMPLES":{"block":{...}}}` | `sensor.capacitiveSensor(samples)` |
| `capacitivesensor_read_raw` | 值块 | VAR(field_variable), SAMPLES(input_value) | `"fields":{"VAR":{"type":"CapacitiveSensor"}},"inputs":{"SAMPLES":{"block":{...}}}` | `sensor.capacitiveSensorRaw(samples)` |
| `capacitivesensor_set_timeout` | 语句块 | VAR(field_variable), TIMEOUT(input_value) | `"inputs":{"TIMEOUT":{"block":{...}}}` | `sensor.set_CS_Timeout_Millis(timeout);` |
| `capacitivesensor_set_autocal` | 语句块 | VAR(field_variable), INTERVAL(input_value) | `"inputs":{"INTERVAL":{"block":{...}}}` | `sensor.set_CS_AutocaL_Millis(interval);` |
| `capacitivesensor_reset_autocal` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"type":"CapacitiveSensor"}}` | `sensor.reset_CS_AutoCal();` |
| `capacitivesensor_wiring_hint` | 语句块 | IMAGE(field_image) | `"fields":{"IMAGE":{"src":"capacitivesensor/tu1.JPG"}}` | 无代码，仅展示接线图 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "sensor"` |
| field_dropdown | 字符串 | `"SEND": "4"` |
| field_variable | 对象 | `"VAR": {"id": "cs", "type": "CapacitiveSensor"}` |
| input_value | 块连接 | `"inputs": {"SAMPLES": {"block": {...}}}` |

## 连接规则

- **语句块**: 具有previousStatement/nextStatement，按顺序执行配置操作
- **值块**: 仅提供output，嵌入表达式或条件中使用
- **Hat块**: 无（本库没有Hat块）
- **变量规则**: 初始化块使用field_input创建CapacitiveSensor类型变量，其他块通过field_variable引用

## 使用示例

### 读取触摸值并阈值判断
```json
{
  "type": "capacitivesensor_create",
  "fields": {"VAR": "touch", "SEND": "4", "RECV": "2"},
  "next": {
    "type": "controls_if",
    "inputs": {
      "IF0": {
        "block": {
          "type": "logic_compare",
          "fields": {"OP": "GT"},
          "inputs": {
            "A": {
              "block": {
                "type": "capacitivesensor_read",
                "fields": {"VAR": {"name": "touch", "type": "CapacitiveSensor"}},
                "inputs": {"SAMPLES": {"block": {"type": "math_number", "fields": {"NUM": 30}}}}
              }
            },
            "B": {"block": {"type": "math_number", "fields": {"NUM": 1000}}}
          }
        }
      },
      "DO0": {
        "block": {
          "type": "arduino_digitalWrite",
          "fields": {"PIN": "LED_BUILTIN", "STATE": "HIGH"}
        }
      }
    }
  }
}
```

### 关闭自动校准并手动复位
```json
{
  "type": "capacitivesensor_set_autocal",
  "fields": {"VAR": {"name": "touch", "type": "CapacitiveSensor"}},
  "inputs": {
    "INTERVAL": {
      "block": {"type": "math_number", "fields": {"NUM": 0}}
    }
  },
  "next": {
    "type": "capacitivesensor_reset_autocal",
    "fields": {"VAR": {"name": "touch", "type": "CapacitiveSensor"}}
  }
}
```

## 重要规则

1. **对象唯一**: 每个CapacitiveSensor变量对应一组发送/接收引脚，不要在不同块中复用同名但不同引脚
2. **采样设置**: 样本数建议保持在10~100之间，过大将显著拖慢loop循环
3. **自动校准**: 将间隔设置为0可关闭自动校准，若触摸板长期保持被按压状态须手动调用重置块
4. **接线提示**: 使用 `接线参考` 块查看接线示意图，确保发送引脚通过 1MΩ 电阻连接到接收引脚；发布到Blockly运行环境时，请将 `tu1.JPG` 放入 `pathToMedia/capacitivesensor/` 目录
5. **常见错误**: ❌ 未插入初始化块直接读取；❌ send/recv引脚短接导致始终饱和；❌ 样本数为0返回0值

## 支持的选项
- **发送/接收引脚**: 动态列出当前板卡全部数字引脚（含A0等可用数字引脚）
- **样本数默认值**: 工具箱影子块提供30；推荐根据噪声调整
- **超时时间**: 默认2000毫秒，若传感器电路距离较远可适当增大
- **自动校准间隔**: 默认20000毫秒，设置为0可完全禁用自动校准

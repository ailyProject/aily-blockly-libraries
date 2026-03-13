# core-time

时间控制与延时操作核心库

## 库信息
- **库名**: @aily-project/lib-core-time
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `time_delay` | 语句块 | DELAY_TIME(input_value) | `"inputs":{"DELAY_TIME":{"block":{...}}}` | `delay(time);` |
| `time_delay_microseconds` | 语句块 | DELAY_TIME(input_value) | `"inputs":{"DELAY_TIME":{"block":{...}}}` | `delayMicroseconds(time);` |
| `time_millis` | 值块 | 无 | `{}` | `millis()` |
| `time_micros` | 值块 | 无 | `{}` | `micros()` |
| `system_time` | 值块 | 无 | `{}` | `__TIME__` |
| `system_date` | 值块 | 无 | `{}` | `__DATE__` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| input_value | 块连接 | `"inputs": {"DELAY_TIME": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - time_millis和time_micros输出Number类型，表示时间计数
  - system_time和system_date输出Any类型，编译时常量
  - 延时函数要求输入Number类型的时间值

## 使用示例

### 基础延时控制
```json
{
  "type": "time_delay",
  "id": "delay_block",
  "inputs": {
    "DELAY_TIME": {"block": {"type": "math_number", "fields": {"NUM": "1000"}}}
  },
  "next": {
    "block": {
      "type": "arduino_digitalWrite",
      "fields": {"PIN": "13", "STATE": "HIGH"}
    }
  }
}
```

### 时间计算与比较
```json
{
  "type": "controls_if",
  "id": "timing_check",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"},
        "inputs": {
          "A": {"block": {"type": "time_millis"}},
          "B": {"block": {"type": "math_arithmetic", "fields": {"OP": "ADD"}, "inputs": {
            "A": {"block": {"type": "variables_get", "fields": {"VAR": {"id": "start_time"}}}},
            "B": {"block": {"type": "math_number", "fields": {"NUM": "5000"}}}
          }}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "5秒时间到！"}}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 延时时间必须是Number类型，不能是负数
2. **连接限制**: 延时函数为语句块，时间获取函数为值块
3. **常见错误**: ❌ 在中断函数中使用delay，❌ 延时时间过长导致程序无响应

## 支持的时间单位
- **毫秒(ms)**: time_delay, time_millis - 适用于一般时序控制
- **微秒(μs)**: time_delay_microseconds, time_micros - 适用于精确时序控制
- **编译时间**: system_time返回编译时刻，system_date返回编译日期
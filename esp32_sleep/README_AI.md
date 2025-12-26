# ESP32睡眠库

ESP32深度和浅度睡眠库，支持定时唤醒、外部引脚唤醒，包含RTC存储功能。

## 库信息
- **库名**: @aily-project/lib-esp32-sleep
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_deep_sleep_timer` | 语句块 | SECONDS(input) | `"inputs": {"SECONDS": {"block": {...}}}` | `esp_sleep_enable_timer_wakeup(seconds * 1000000ULL);` |
| `esp32_deep_sleep_ext0` | 语句块 | PIN(field_dropdown), LEVEL(field_dropdown) | `"fields": {"PIN": "33", "LEVEL": "1"}` | `esp_sleep_enable_ext0_wakeup(GPIO_NUM_33, 1);` |
| `esp32_deep_sleep_start` | 语句块 | 无 | `{}` | `esp_deep_sleep_start();` |
| `esp32_light_sleep_start` | 语句块 | 无 | `{}` | `esp_light_sleep_start();` |
| `esp32_set_cpu_frequency` | 语句块 | FREQUENCY(field_dropdown) | `"fields": {"FREQUENCY": "80"}` | `setCpuFrequencyMhz(80);` |
| `esp32_deep_sleep_quick` | 语句块 | SECONDS(input) | `"inputs": {"SECONDS": {"block": {...}}}` | `deepSleepTimer(seconds);` |
| `esp32_rtc_variable_int` | 语句块 | VAR(field_input), VALUE(input) | `"fields": {"VAR": "rtcCounter"}, "inputs": {"VALUE": {...}}` | `RTC_DATA_ATTR int rtcCounter = 0;` |
| `esp32_rtc_set_variable` | 语句块 | VAR(field_input), VALUE(input) | `"fields": {"VAR": "rtcCounter"}, "inputs": {"VALUE": {...}}` | `rtcCounter = 0;` |
| `esp32_rtc_get_variable` | 值块 | VAR(field_input) | `"fields": {"VAR": "rtcCounter"}` | `rtcCounter` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"FIELD": "value"` |
| field_dropdown | 字符串 | `"TYPE": "option"` |
| input_value | 块连接 | `"inputs": {"INPUT": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: RTC变量块使用field_input，支持自定义变量名

## 使用示例

### 定时唤醒设置
```json
{
  "type": "esp32_deep_sleep_timer",
  "id": "block_id",
  "fields": {},
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 60}}}
  }
}
```

### 外部引脚唤醒设置
```json
{
  "type": "esp32_deep_sleep_ext0",
  "id": "block_id", 
  "fields": {"PIN": "33", "LEVEL": "1"},
  "inputs": {}
}
```

### 浅度睡眠设置
```json
{
  "type": "esp32_light_sleep_start",
  "id": "block_id",
  "fields": {},
  "inputs": {}
}
```

### RTC变量声明
```json
{
  "type": "esp32_rtc_variable_int",
  "id": "block_id",
  "fields": {"VAR": "recordCounter"},
  "inputs": {
    "VALUE": {"block": {"type": "math_number", "fields": {"NUM": 0}}}
  }
}
```

### 快速深度睡眠
```json
{
  "type": "esp32_deep_sleep_quick",
  "id": "block_id",
  "fields": {},
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 120}}}
  }
}
```

## 重要规则

1. **必须遵守**: 深度睡眠后代码从setup()重新开始执行
2. **浅度睡眠**: 浅度睡眠唤醒后继续执行当前代码，不会重启
3. **连接限制**: 语句块必须顺序连接，值块连接到输入中
4. **常见错误**: ❌ 在深度睡眠后调用loop()中的代码

## 支持的RTC GPIO引脚
0, 2, 4, 12, 13, 14, 15, 25, 26, 27, 32, 33, 34, 35, 36, 39

## 支持的CPU频率
240, 160, 80, 40, 20, 10 (MHz)
  "type": "esp32_deep_sleep_ext0",
  "id": "block_id", 
  "fields": {"PIN": "33", "LEVEL": "1"},
  "inputs": {}
}
```

### 快速深度睡眠
```json
{
  "type": "esp32_deep_sleep_quick",
  "id": "block_id",
  "fields": {},
  "inputs": {
    "SECONDS": {"block": {"type": "math_number", "fields": {"NUM": 120}}}
  }
}
```

## 重要规则

1. **必须遵守**: 深度睡眠后代码从setup()重新开始执行
2. **连接限制**: 所有块都是语句块，必须顺序连接
3. **常见错误**: ❌ 在深度睡眠后调用loop()中的代码

## 支持的RTC GPIO引脚
0, 2, 4, 12, 13, 14, 15, 25, 26, 27, 32, 33, 34, 35, 36, 39

## 支持的CPU频率
240, 160, 80, 40, 20, 10 (MHz)
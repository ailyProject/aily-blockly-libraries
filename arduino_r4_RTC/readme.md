# RTC实时时钟库

Arduino UNO R4 WiFi RTC实时时钟库，提供时间设置、读取和闹钟功能

## 库信息
- **库名**: @aily-project/lib-rtc
- **版本**: 1.0.1
- **兼容**: Arduino UNO R4 WiFi

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `rtc_begin` | 语句块 | 无 | 无 | `RTC.begin();` |
| `rtc_is_running` | 值块 | 无 | 无 | `RTC.isRunning()` |
| `rtc_set_time` | 语句块 | DAY(input), MONTH(field), YEAR(input), HOUR(input), MINUTE(input), SECOND(input), DAYOFWEEK(field) | `"MONTH":"JANUARY"` | `RTCTime time(...); RTC.setTime(time);` |
| `rtc_get_time` | 值块 | 无 | 无 | `RTC.getTime(rtc_current_time), rtc_current_time` |
| `rtc_time_get_day` | 值块 | VAR(field_variable) | 无 | `time.getDayOfMonth()` |
| `rtc_time_get_month` | 值块 | VAR(field_variable) | 无 | `Month2int(time.getMonth())` |
| `rtc_time_get_year` | 值块 | VAR(field_variable) | 无 | `time.getYear()` |
| `rtc_time_get_hour` | 值块 | VAR(field_variable) | 无 | `time.getHour()` |
| `rtc_time_get_minute` | 值块 | VAR(field_variable) | 无 | `time.getMinutes()` |
| `rtc_time_get_second` | 值块 | VAR(field_variable) | 无 | `time.getSeconds()` |
| `rtc_time_get_day_of_week` | 值块 | VAR(field_variable) | 无 | `DayOfWeek2int(time.getDayOfWeek(), false)` |
| `rtc_set_periodic_callback` | Hat块 | PERIOD(field), HANDLER(input_statement) | `"PERIOD":"ONCE_EVERY_1_SEC"` | `RTC.setPeriodicCallback(callback, Period::...);` |
| `rtc_set_alarm_callback` | Hat块 | SECOND(input), HANDLER(input_statement) | 无 | `RTC.setAlarmCallback(callback, alarmtime, am);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"FIELD": "value"` |
| field_dropdown | 字符串 | `"MONTH": "JANUARY"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"INPUT": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"DO": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性，通过`inputs`连接内部语句
- **时间对象**: RTCTime类型块可以连接到时间获取块的输入

## 使用示例

### 基础RTC初始化和时间设置
```json
{
  "type": "rtc_begin",
}
```

### 时间读取和显示
```json
{
  "type": "serial_println",
  "id": "block_3",
  "fields": {"SERIAL": "Serial"},
  "inputs": {
    "VAR": {
      "block": {
        "type": "text_join",
        "inputs": {
          "ADD0": {"block": {"type": "rtc_time_get_year", "inputs": {"TIME": {"block": {"type": "rtc_get_time"}}}}},
          "ADD1": {"block": {"type": "text", "fields": {"TEXT": "-"}}},
          "ADD2": {"block": {"type": "rtc_time_get_month", "inputs": {"TIME": {"block": {"type": "rtc_get_time"}}}}},
          "ADD3": {"block": {"type": "text", "fields": {"TEXT": "-"}}},
          "ADD4": {"block": {"type": "rtc_time_get_day", "inputs": {"TIME": {"block": {"type": "rtc_get_time"}}}}}
        }
      }
    }
  }
}
```

### 周期性回调
```json
{
  "type": "rtc_set_periodic_callback",
  "id": "block_4",
  "fields": {"PERIOD": "ONCE_EVERY_1_SEC"},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_println",
        "fields": {"SERIAL": "Serial"},
        "inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "Periodic callback"}}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 使用RTC前必须先调用`rtc_begin`初始化
2. **连接限制**: 时间获取块必须连接到时间读取块的输入
3. **常见错误**: ❌ 忘记初始化RTC就设置时间
4. **回调函数**: 周期性和闹钟回调会自动添加到setup中

## 支持的周期选项
- 每2秒 (ONCE_EVERY_2_SEC)
- 每1秒 (ONCE_EVERY_1_SEC)  
- 每秒2次 (N2_TIMES_EVERY_SEC)
- 每秒4次 (N4_TIMES_EVERY_SEC)
- 每秒8次 (N8_TIMES_EVERY_SEC)
- 每秒16次 (N16_TIMES_EVERY_SEC)
- 每秒32次 (N32_TIMES_EVERY_SEC)
- 每秒64次 (N64_TIMES_EVERY_SEC)
- 每秒128次 (N128_TIMES_EVERY_SEC)
- 每秒256次 (N256_TIMES_EVERY_SEC)
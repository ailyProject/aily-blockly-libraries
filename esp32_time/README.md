# ESP32Time

ESP32内部RTC时间管理库，提供时间设置和获取功能

## 库信息
- **库名**: @aily-project/lib-esp32time
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32time_set_time` | 语句块 | YEAR/MONTH/DAY/HOUR/MINUTE/SECOND(input) | - | `rtc.setTime(sec, min, hr, day, mon, yr);` |
| `esp32time_set_time_epoch` | 语句块 | EPOCH(input) | - | `rtc.setTime(epoch);` |
| `esp32time_get_time` | 值块 | - | - | `rtc.getTime()` |
| `esp32time_get_date` | 值块 | FORMAT(field_dropdown) | - | `rtc.getDate(format)` |
| `esp32time_get_datetime` | 值块 | FORMAT(field_dropdown) | - | `rtc.getDateTime(format)` |
| `esp32time_get_formatted_time` | 值块 | FORMAT(input) | - | `rtc.getTime(format)` |
| `esp32time_get_epoch` | 值块 | - | - | `rtc.getEpoch()` |
| `esp32time_get_second` | 值块 | - | - | `rtc.getSecond()` |
| `esp32time_get_minute` | 值块 | - | - | `rtc.getMinute()` |
| `esp32time_get_hour` | 值块 | MODE(field_dropdown) | - | `rtc.getHour(mode)` |
| `esp32time_get_day` | 值块 | - | - | `rtc.getDay()` |
| `esp32time_get_month` | 值块 | - | - | `rtc.getMonth()` |
| `esp32time_get_year` | 值块 | - | - | `rtc.getYear()` |
| `esp32time_get_yday` | 值块 | - | - | `rtc.getYDay()` |
| `esp32time_get_ampm` | 值块 | CASE(field_dropdown) | - | `rtc.getAmPm(case)` |
| `esp32time_set_offset` | 语句块 | OFFSET(input) | - | `rtc.offset = offset;` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "value"` |
| field_dropdown | 字符串 | `"TYPE": "option"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"INPUT": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量字段**: 使用field_variable类型，配置variableTypes为["ESP32Time"]

## 使用示例

### 基本时间设置和获取
```json
{
  "type": "esp32time_create",
  "id": "create_rtc",
  "next": {"block": {
    "type": "esp32time_set_time",
    "id": "set_time",
    "inputs": {
      "YEAR": {"block": {"type": "math_number", "fields": {"NUM": "2024"}}},
      "MONTH": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
      "DAY": {"block": {"type": "math_number", "fields": {"NUM": "1"}}},
      "HOUR": {"block": {"type": "math_number", "fields": {"NUM": "12"}}},
      "MINUTE": {"block": {"type": "math_number", "fields": {"NUM": "30"}}},
      "SECOND": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
    },
    "next": {"block": {
      "type": "serial_println",
      "inputs": {
        "VAR": {"block": {
          "type": "esp32time_get_datetime",
          "fields": {"VAR": "rtc", "FORMAT": "false"}
        }}
      }
    }}
  }}
}
```

### 使用Unix时间戳和自定义格式
```json
{
  "type": "esp32time_create_with_offset",
  "id": "create_rtc_offset",
  "inputs": {
    "OFFSET": {"block": {"type": "math_number", "fields": {"NUM": "28800"}}}
  },
  "next": {"block": {
    "type": "esp32time_set_time_epoch",
    "id": "set_epoch",
    "inputs": {
      "EPOCH": {"block": {"type": "math_number", "fields": {"NUM": "1609459200"}}}
    },
    "next": {"block": {
      "type": "serial_println",
      "inputs": {
        "VAR": {"block": {
          "type": "esp32time_get_formatted_time",
          "inputs": {
            "FORMAT": {"block": {"type": "text", "fields": {"TEXT": "%Y年%m月%d日 %H:%M:%S"}}}
          }
        }}
      }
    }}
  }}
}
```

## 重要规则

1. **必须遵守**: 所有块必须遵守连接规则
2. **连接限制**: 时间获取块只能连接到需要字符串或数值的输入
3. **变量管理**: 使用field_variable确保变量类型正确
4. **时区偏移**: 正数表示东时区，负数表示西时区

## 支持的时间格式

- `%Y`: 年份（4位）
- `%m`: 月份（01-12）
- `%d`: 日期（01-31）
- `%H`: 小时（00-23）
- `%M`: 分钟（00-59）
- `%S`: 秒（00-59）
- `%A`: 星期名称（完整）
- `%B`: 月份名称（完整）
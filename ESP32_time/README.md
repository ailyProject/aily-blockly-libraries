# ESP32Time

ESP32内置RTC时间管理库，支持时间设置、获取和格式化，无需外部RTC模块或NTP时间同步。

## 库信息
- **库名**: @aily-project/lib-ESP32Time
- **版本**: 1.0.0
- **作者**: aily Project
- **描述**: ESP32内置RTC时间管理库，支持时间设置、获取和格式化，无需外部RTC模块
- **兼容**: esp32:esp32, esp32:esp32c3, esp32:esp32c6, esp32:esp32s2, esp32:esp32s3
- **电压**: 3.3V
- **官方库**: https://github.com/fbiego/ESP32Time

## Blockly 工具箱分类

### ESP32时间
- `esp32_time_init` - 初始化ESP32时间对象
- `esp32_time_set_datetime` - 设置日期时间
- `esp32_time_set_epoch` - 设置Unix时间戳
- `esp32_time_get_time` - 获取时间字符串
- `esp32_time_get_date` - 获取日期字符串
- `esp32_time_get_datetime` - 获取日期时间字符串
- `esp32_time_get_format` - 获取自定义格式时间
- `esp32_time_get_epoch` - 获取Unix时间戳
- `esp32_time_get_second` - 获取秒数
- `esp32_time_get_minute` - 获取分钟数
- `esp32_time_get_hour` - 获取小时数
- `esp32_time_get_ampm` - 获取AM/PM标识
- `esp32_time_get_day` - 获取日期
- `esp32_time_get_month` - 获取月份
- `esp32_time_get_year` - 获取年份
- `esp32_time_get_dayofweek` - 获取星期几
- `esp32_time_get_dayofyear` - 获取年中第几天

## 详细块定义

### 初始化块

#### esp32_time_init
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 初始化ESP32时间对象，设置时区偏移
**值输入**:
- `OFFSET`: 数字输入 - 时区偏移秒数（如北京时间GMT+8为28800秒）
**生成代码**:
```cpp
ESP32Time rtc(28800);  // 时区偏移秒数
```
**自动添加**:
- 库引用: `#include <ESP32Time.h>`
- 对象定义: `ESP32Time rtc(offset);`

### 时间设置块

#### esp32_time_set_datetime
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 设置ESP32的内部时间
**值输入**:
- `YEAR`: 数字输入 - 年份
- `MONTH`: 数字输入 - 月份 (1-12)
- `DAY`: 数字输入 - 日期 (1-31)
- `HOUR`: 数字输入 - 小时 (0-23)
- `MINUTE`: 数字输入 - 分钟 (0-59)
- `SECOND`: 数字输入 - 秒数 (0-59)
**生成代码**:
```cpp
rtc.setTime(second, minute, hour, day, month, year);
```

#### esp32_time_set_epoch
**类型**: 语句块 (previousStatement/nextStatement)
**描述**: 使用Unix时间戳设置时间
**值输入**:
- `EPOCH`: 数字输入 - Unix时间戳
**生成代码**:
```cpp
rtc.setTime(epoch);
```

### 时间获取块

#### esp32_time_get_time
**类型**: 值块 (output: String)
**描述**: 获取当前时间字符串
**生成代码**:
```cpp
rtc.getTime()  // 返回 "HH:MM:SS" 格式
```

#### esp32_time_get_date
**类型**: 值块 (output: String)
**描述**: 获取当前日期字符串
**字段**:
- `FORMAT`: 下拉选择 - 日期格式（短格式/长格式）
**生成代码**:
```cpp
rtc.getDate(false)  // 短格式: "Mon, Jan 17 2021"
rtc.getDate(true)   // 长格式: "Monday, January 17 2021"
```

#### esp32_time_get_datetime
**类型**: 值块 (output: String)
**描述**: 获取当前日期时间字符串
**字段**:
- `FORMAT`: 下拉选择 - 日期时间格式（短格式/长格式）
**生成代码**:
```cpp
rtc.getDateTime(false)  // 短格式: "Mon, Jan 17 2021 15:24:38"
rtc.getDateTime(true)   // 长格式: "Monday, January 17 2021 15:24:38"
```

#### esp32_time_get_format
**类型**: 值块 (output: String)
**描述**: 使用自定义格式获取时间字符串
**值输入**:
- `FORMAT`: 字符串输入 - 时间格式字符串
**生成代码**:
```cpp
rtc.getTime("%Y-%m-%d %H:%M:%S")  // 自定义格式
```

#### esp32_time_get_epoch
**类型**: 值块 (output: Number)
**描述**: 获取当前Unix时间戳
**生成代码**:
```cpp
rtc.getEpoch()
```

### 时间组件获取块

#### esp32_time_get_second
**类型**: 值块 (output: Number)
**描述**: 获取当前秒数
**生成代码**:
```cpp
rtc.getSecond()  // 返回 0-59
```

#### esp32_time_get_minute
**类型**: 值块 (output: Number)
**描述**: 获取当前分钟数
**生成代码**:
```cpp
rtc.getMinute()  // 返回 0-59
```

#### esp32_time_get_hour
**类型**: 值块 (output: Number)
**描述**: 获取当前小时数
**字段**:
- `FORMAT`: 下拉选择 - 小时制式（12小时制/24小时制）
**生成代码**:
```cpp
rtc.getHour(false)  // 12小时制 (1-12)
rtc.getHour(true)   // 24小时制 (0-23)
```

#### esp32_time_get_ampm
**类型**: 值块 (output: String)
**描述**: 获取AM/PM标识
**字段**:
- `CASE`: 下拉选择 - 大小写（大写/小写）
**生成代码**:
```cpp
rtc.getAmPm(false)  // 大写: "AM" 或 "PM"
rtc.getAmPm(true)   // 小写: "am" 或 "pm"
```

#### esp32_time_get_day
**类型**: 值块 (output: Number)
**描述**: 获取当前日期
**生成代码**:
```cpp
rtc.getDay()  // 返回 1-31
```

#### esp32_time_get_month
**类型**: 值块 (output: Number)
**描述**: 获取当前月份
**生成代码**:
```cpp
rtc.getMonth()  // 返回 0-11 (0=一月)
```

#### esp32_time_get_year
**类型**: 值块 (output: Number)
**描述**: 获取当前年份
**生成代码**:
```cpp
rtc.getYear()  // 返回完整年份，如 2024
```

#### esp32_time_get_dayofweek
**类型**: 值块 (output: Number)
**描述**: 获取星期几
**生成代码**:
```cpp
rtc.getDayofWeek()  // 返回 0-6 (0=周日, 1=周一...6=周六)
```

#### esp32_time_get_dayofyear
**类型**: 值块 (output: Number)
**描述**: 获取一年中的第几天
**生成代码**:
```cpp
rtc.getDayofYear()  // 返回 0-365
```

## .abi 文件生成规范

### 块连接规则
- **语句块**: 有 `previousStatement/nextStatement`，通过 `next` 连接
- **值块**: 有 `output`，连接到 `inputs` 中，不含 `next` 字段

### 工具箱默认配置
部分块预设了影子块：
- `esp32_time_init.OFFSET`: 数字类型 "28800" (北京时间GMT+8)
- `esp32_time_set_datetime`: 各时间字段都有默认数字值
- `esp32_time_set_epoch.EPOCH`: 数字类型 "1609459200"
- `esp32_time_get_format.FORMAT`: 文本类型 "%Y-%m-%d %H:%M:%S"

### 变量管理
该库使用全局ESP32Time对象，无需额外变量管理。

## 使用示例

### 初始化和设置时间
```json
{
  "type": "esp32_time_init",
  "id": "time_init_1",
  "inputs": {
    "OFFSET": {
      "shadow": {
        "type": "math_number",
        "id": "offset_shadow",
        "fields": {"NUM": 28800}
      }
    }
  },
  "next": {
    "block": {
      "type": "esp32_time_set_datetime",
      "id": "time_set_1",
      "inputs": {
        "YEAR": {"shadow": {"type": "math_number", "id": "year_shadow", "fields": {"NUM": 2024}}},
        "MONTH": {"shadow": {"type": "math_number", "id": "month_shadow", "fields": {"NUM": 8}}},
        "DAY": {"shadow": {"type": "math_number", "id": "day_shadow", "fields": {"NUM": 18}}},
        "HOUR": {"shadow": {"type": "math_number", "id": "hour_shadow", "fields": {"NUM": 16}}},
        "MINUTE": {"shadow": {"type": "math_number", "id": "minute_shadow", "fields": {"NUM": 0}}},
        "SECOND": {"shadow": {"type": "math_number", "id": "second_shadow", "fields": {"NUM": 0}}}
      }
    }
  }
}
```

### 获取时间信息
```json
{
  "type": "serial_println",
  "id": "print_time",
  "fields": {"SERIAL": "Serial"},
  "inputs": {
    "VAR": {
      "block": {
        "type": "esp32_time_get_datetime",
        "id": "get_datetime_1",
        "fields": {"FORMAT": "true"}
      }
    }
  }
}
```

## 技术特性
- **无需外部硬件**: 使用ESP32内置RTC，无需外部时钟模块
- **时区支持**: 支持时区偏移设置
- **多种格式**: 支持多种时间日期格式输出
- **高精度**: 支持毫秒和微秒级时间获取
- **自定义格式**: 支持strftime格式的自定义时间格式

## 注意事项
- 仅支持ESP32系列开发板
- 断电后时间会重置，需要重新设置
- 建议配合WiFi NTP同步使用以获得准确时间
- 时区偏移以秒为单位（北京时间GMT+8 = 28800秒）
- 月份返回值为0-11（0表示一月）
- 星期返回值为0-6（0表示周日）
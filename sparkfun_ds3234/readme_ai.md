# SparkFun DS3234 实时时钟

SPI 接口实时时钟库，使用库内置的全局 `rtc` 对象，支持温度读取。

## Library Info
- **Name**: @aily-project/lib-sparkfun-ds3234
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds3234_begin` | Statement | CS_PIN(field_number) | `ds3234_begin(10)` | `rtc.begin(10);` |
| `ds3234_auto_time` | Statement | — | `ds3234_auto_time()` | `rtc.autoTime();` |
| `ds3234_set_time` | Statement | SEC, MIN, HOUR, DAY, DATE, MONTH, YEAR (all input_value) | `ds3234_set_time(math_number(0), ...)` | `rtc.setTime(0, 0, 12, 2, 1, 1, 24);` |
| `ds3234_update` | Statement | — | `ds3234_update()` | `rtc.update();` |
| `ds3234_get_time` | Value | FIELD(field_dropdown) | `ds3234_get_time(SECOND)` | `rtc.second()` |
| `ds3234_get_temperature` | Value | — | `ds3234_get_temperature()` | `rtc.temperature()` |

## Notes

1. **SPI 接口**: DS3234 使用 SPI，需指定 CS 引脚（默认 10）
2. **读取顺序**: 先 `ds3234_update()`，再读取时间值
3. **温度**: `ds3234_get_temperature()` 无需额外 update，直接读取

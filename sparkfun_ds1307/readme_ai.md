# SparkFun DS1307 实时时钟

I2C 接口实时时钟库，使用库内置的全局 `rtc` 对象，无需用户声明变量。

## Library Info
- **Name**: @aily-project/lib-sparkfun-ds1307
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds1307_begin` | Statement | — | `ds1307_begin()` | `Wire.begin(); rtc.begin();` |
| `ds1307_auto_time` | Statement | — | `ds1307_auto_time()` | `rtc.autoTime();` |
| `ds1307_set_time` | Statement | SEC, MIN, HOUR, DAY, DATE, MONTH, YEAR (all input_value) | `ds1307_set_time(math_number(0), math_number(0), math_number(12), math_number(2), math_number(1), math_number(1), math_number(24))` | `rtc.setTime(0, 0, 12, 2, 1, 1, 24);` |
| `ds1307_update` | Statement | — | `ds1307_update()` | `rtc.update();` |
| `ds1307_get_time` | Value | FIELD(field_dropdown) | `ds1307_get_time(SECOND)` | `rtc.second()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | second, minute, hour, day, date, month, year | 读取的时间字段 |

## ABS Examples

```
arduino_setup()
    ds1307_begin()
    ds1307_auto_time()
    serial_begin(Serial, 9600)

arduino_loop()
    ds1307_update()
    serial_print(Serial, ds1307_get_time(HOUR))
    serial_print(Serial, text(":"))
    serial_println(Serial, ds1307_get_time(MINUTE))
    time_delay(math_number(1000))
```

## Notes

1. **全局对象**: 库已声明全局 `rtc` 对象，无需初始化积木创建变量
2. **读取顺序**: 先调用 `ds1307_update()`，再调用 `ds1307_get_time()`
3. **年份**: year() 返回两位年份（如 2024 年返回 24）

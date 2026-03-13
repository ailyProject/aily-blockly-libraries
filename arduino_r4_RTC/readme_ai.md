# R4实时时钟

适用于Arduino UNO R4的RTC库，提供精确的时间跟踪、定时回调和时间格式化功能

## Library Info
- **Name**: @aily-project/lib-r4-rtc
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `renesas_rtc_begin` | Statement | (none) | `renesas_rtc_begin()` | `RTC.begin();\n` |
| `renesas_rtc_is_running` | Value | (none) | `renesas_rtc_is_running()` | `RTC.isRunning()` |
| `renesas_rtc_set_time` | Statement | YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value), DAYOFWEEK(input_value) | `renesas_rtc_set_time(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `RTCTime time(` |
| `renesas_rtc_get_time` | Statement | VAR(field_input) | `renesas_rtc_get_time("rtc_current_time")` | `RTC.getTime(` |
| `renesas_rtc_time_get_day` | Value | VAR(field_variable) | `renesas_rtc_time_get_day($rtc_current_time)` | (dynamic code) |
| `renesas_rtc_time_get_month` | Value | VAR(field_variable) | `renesas_rtc_time_get_month($rtc_current_time)` | `Month2int(` |
| `renesas_rtc_time_get_year` | Value | VAR(field_variable) | `renesas_rtc_time_get_year($rtc_current_time)` | (dynamic code) |
| `renesas_rtc_time_get_hour` | Value | VAR(field_variable) | `renesas_rtc_time_get_hour($rtc_current_time)` | (dynamic code) |
| `renesas_rtc_time_get_minute` | Value | VAR(field_variable) | `renesas_rtc_time_get_minute($rtc_current_time)` | (dynamic code) |
| `renesas_rtc_time_get_second` | Value | VAR(field_variable) | `renesas_rtc_time_get_second($rtc_current_time)` | (dynamic code) |
| `renesas_rtc_time_get_day_of_week` | Value | VAR(field_variable) | `renesas_rtc_time_get_day_of_week($rtc_current_time)` | `DayOfWeek2int(` |
| `renesas_rtc_set_periodic_callback` | Statement | PERIOD(dropdown) | `renesas_rtc_set_periodic_callback(ONCE_EVERY_2_SEC)` | `` |
| `renesas_rtc_set_alarm_callback` | Statement | SECOND(input_value) | `renesas_rtc_set_alarm_callback(math_number(0))` | `` |
| `renesas_rtc_set_time_if_not_running` | Statement | DAY(input_value), MONTH(dropdown), YEAR(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value), DAYOFWEEK(dropdown) | `renesas_rtc_set_time_if_not_running(math_number(0), JANUARY, math_number(0), math_number(0), math_number(0), math_number(0), SUNDAY)` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PERIOD | ONCE_EVERY_2_SEC, ONCE_EVERY_1_SEC, N2_TIMES_EVERY_SEC, N4_TIMES_EVERY_SEC, N8_TIMES_EVERY_SEC, N16_TIMES_EVERY_SEC, N32_TIMES_EVERY_SEC, N64_TIMES_EVERY_SEC, N128_TIMES_EVERY_SEC, N256_TIMES_EVERY_SEC | 每2秒 / 每1秒 / 每秒2次 / 每秒4次 / 每秒8次 / 每秒16次 / 每秒32次 / 每秒64次 / 每秒128次 / 每秒256次 |
| MONTH | JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER | 1月 / 2月 / 3月 / 4月 / 5月 / 6月 / 7月 / 8月 / 9月 / 10月 / 11月 / 12月 |
| DAYOFWEEK | SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY | 星期日 / 星期一 / 星期二 / 星期三 / 星期四 / 星期五 / 星期六 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    renesas_rtc_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, renesas_rtc_is_running())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

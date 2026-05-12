# ESP32 RTC time library

ESP32 internal RTC time management library provides time setting and acquisition functions

## Library Info
- **Name**: @aily-project/lib-esp32-time
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32time_set_time` | Statement | YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `esp32time_set_time(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | rtc.setTime( |
| `esp32time_set_time_epoch` | Statement | EPOCH(input_value) | `esp32time_set_time_epoch(math_number(0))` | rtc.setTime( |
| `esp32time_get_time` | Value | (none) | `esp32time_get_time()` | rtc.getTime() |
| `esp32time_get_date` | Value | FORMAT(dropdown) | `esp32time_get_date(false)` | rtc.getDate( |
| `esp32time_get_datetime` | Value | FORMAT(dropdown) | `esp32time_get_datetime(false)` | rtc.getDateTime( |
| `esp32time_get_formatted_time` | Value | FORMAT(input_value) | `esp32time_get_formatted_time(text("value"))` | rtc.getTime( |
| `esp32time_get_epoch` | Value | (none) | `esp32time_get_epoch()` | rtc.getEpoch() |
| `esp32time_get_second` | Value | (none) | `esp32time_get_second()` | rtc.getSecond() |
| `esp32time_get_minute` | Value | (none) | `esp32time_get_minute()` | rtc.getMinute() |
| `esp32time_get_hour` | Value | MODE(dropdown) | `esp32time_get_hour(false)` | rtc.getHour( |
| `esp32time_get_wday` | Value | (none) | `esp32time_get_wday()` | rtc.getDayofWeek() |
| `esp32time_get_day` | Value | (none) | `esp32time_get_day()` | rtc.getDay() |
| `esp32time_get_month` | Value | (none) | `esp32time_get_month()` | rtc.getMonth() |
| `esp32time_get_year` | Value | (none) | `esp32time_get_year()` | rtc.getYear() |
| `esp32time_get_ampm` | Value | CASE(dropdown) | `esp32time_get_ampm(false)` | rtc.getAmPm( |
| `esp32time_set_offset` | Statement | OFFSET(input_value) | `esp32time_set_offset(math_number(0))` | rtc.offset = |
| `esp32time_get_yday` | Value | (none) | `esp32time_get_yday()` | rtc.getYDay() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FORMAT | false, true | esp32time_get_date, esp32time_get_datetime |
| MODE | false, true | esp32time_get_hour |
| CASE | false, true | esp32time_get_ampm |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32time_set_time(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32time_get_time())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

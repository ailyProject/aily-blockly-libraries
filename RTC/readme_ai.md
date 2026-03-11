# RTC时钟

RTC库支持DS1307、DS3231、PCF8523、PCF8563等多种实时时钟模块，用于精确计时和日期管理

## Library Info
- **Name**: @aily-project/lib-rtc
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rtc_begin` | Statement | RTC_TYPE(dropdown) | `rtc_begin(DS3231)` | `// RTC initialized\n` |
| `rtc_adjust` | Statement | YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `rtc_adjust(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `rtc.adjust(DateTime(` |
| `rtc_get_time` | Value | (none) | `rtc_get_time()` | `rtc.now()` |
| `rtc_get_year` | Value | (none) | `rtc_get_year()` | `rtc.now().year()` |
| `rtc_get_month` | Value | (none) | `rtc_get_month()` | `rtc.now().month()` |
| `rtc_get_day` | Value | (none) | `rtc_get_day()` | `rtc.now().day()` |
| `rtc_get_hour` | Value | (none) | `rtc_get_hour()` | `rtc.now().hour()` |
| `rtc_get_minute` | Value | (none) | `rtc_get_minute()` | `rtc.now().minute()` |
| `rtc_get_second` | Value | (none) | `rtc_get_second()` | `rtc.now().second()` |
| `rtc_get_weekday` | Value | (none) | `rtc_get_weekday()` | `rtc.now().dayOfTheWeek()` |
| `rtc_get_temperature` | Value | (none) | `rtc_get_temperature()` | `rtc.getTemperature()` |
| `rtc_format_time` | Value | FORMAT(dropdown) | `rtc_format_time(FULL)` | (dynamic code) |
| `rtc_check_lost_power` | Value | (none) | `rtc_check_lost_power()` | `rtc.lostPower()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| RTC_TYPE | DS3231, DS1307, PCF8523, PCF8563 | DS3231 / DS1307 / PCF8523 / PCF8563 |
| FORMAT | FULL, TIME, DATE | 年-月-日 时:分:秒 / 时:分:秒 / 年-月-日 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rtc_begin(DS3231)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rtc_get_time())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

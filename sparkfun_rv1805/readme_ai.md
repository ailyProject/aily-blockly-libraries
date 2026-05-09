# SparkFun RV1805 RTC 实时时钟

## Library Info
- **Name**: @aily-project/lib-sparkfun-rv1805
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rv1805_init` | Statement | VAR(field_input) | `rv1805_init("rtc")` | `RV1805 rtc; rtc.begin();` |
| `rv1805_set_time` | Statement | VAR(field_variable), YEAR/MONTH/DATE/HOUR/MINUTE/SECOND(value) | `rv1805_set_time(variables_get($rtc), 25, 1, 1, 0, 0, 0)` | `rtc.setTime(0, 0, 0, 0, 1, 1, 25, 0);` |
| `rv1805_update_time` | Statement | VAR(field_variable) | `rv1805_update_time(variables_get($rtc))` | `rtc.updateTime();` |
| `rv1805_get_time_field` | Value→Number | VAR(field_variable), FIELD(dropdown) | `rv1805_get_time_field(variables_get($rtc), Seconds)` | `rtc.getSeconds()` |
| `rv1805_string_time` | Value→String | VAR(field_variable) | `rv1805_string_time(variables_get($rtc))` | `rtc.stringTime()` |
| `rv1805_string_date` | Value→String | VAR(field_variable) | `rv1805_string_date(variables_get($rtc))` | `rtc.stringDate()` |

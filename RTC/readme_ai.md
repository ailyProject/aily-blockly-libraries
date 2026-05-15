# RTC real time clock

Real-time clock library that supports multiple RTC chips of DS3231/DS1307/DS1302/PCF8563, providing time reading, setting, formatting and chip-specific functions

## Library Info
- **Name**: @aily-project/lib-rtc
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rtc_init` | Statement | VAR(field_input), CHIP_TYPE(dropdown) | `rtc_init("rtc", DS3231)` | Dynamic code |
| `rtc_set_datetime` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `rtc_set_datetime(variables_get($rtc), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `rtc_set_compile_datetime` | Statement | VAR(field_variable) | `rtc_set_compile_datetime(variables_get($rtc))` | Dynamic code |
| `rtc_get_datetime` | Value | VAR(field_variable) | `rtc_get_datetime(variables_get($rtc))` | Dynamic code |
| `rtc_is_datetime_valid` | Value | VAR(field_variable) | `rtc_is_datetime_valid(variables_get($rtc))` | Dynamic code |
| `rtc_get_is_running` | Value | VAR(field_variable) | `rtc_get_is_running(variables_get($rtc))` | Dynamic code |
| `rtc_set_is_running` | Statement | VAR(field_variable), RUNNING(dropdown) | `rtc_set_is_running(variables_get($rtc), TRUE)` | Dynamic code |
| `rtc_get_year` | Value | TIME(input_value) | `rtc_get_year(math_number(1000))` | Dynamic code |
| `rtc_get_month` | Value | TIME(input_value) | `rtc_get_month(math_number(1000))` | Dynamic code |
| `rtc_get_day` | Value | TIME(input_value) | `rtc_get_day(math_number(1000))` | Dynamic code |
| `rtc_get_hour` | Value | TIME(input_value) | `rtc_get_hour(math_number(1000))` | Dynamic code |
| `rtc_get_minute` | Value | TIME(input_value) | `rtc_get_minute(math_number(1000))` | Dynamic code |
| `rtc_get_second` | Value | TIME(input_value) | `rtc_get_second(math_number(1000))` | Dynamic code |
| `rtc_get_day_of_week` | Value | TIME(input_value) | `rtc_get_day_of_week(math_number(1000))` | Dynamic code |
| `rtc_format_datetime` | Value | TIME(input_value) | `rtc_format_datetime(math_number(1000))` | rtcFormatDateTime( |
| `rtc_ds3231_get_temperature` | Value | VAR(field_variable), UNIT(dropdown) | `rtc_ds3231_get_temperature(variables_get($rtc), C)` | Dynamic code |
| `rtc_ds1302_set_write_protect` | Statement | VAR(field_variable), ENABLE(dropdown) | `rtc_ds1302_set_write_protect(variables_get($rtc), TRUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHIP_TYPE | DS3231, DS1307, DS1302, PCF8563 | rtc_init |
| RUNNING | TRUE, FALSE | rtc_set_is_running |
| UNIT | C, F | rtc_ds3231_get_temperature |
| ENABLE | TRUE, FALSE | rtc_ds1302_set_write_protect |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rtc_init("rtc", DS3231)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rtc_get_datetime(variables_get($rtc)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rtc_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `rtc_init` may add fields at runtime through Blockly extensions.

# DS1302 RTC clock

DS1302 real-time clock module library, providing time reading, setting and RAM operation functions

## Library Info
- **Name**: @aily-project/lib-ds1302
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds1302_setup` | Statement | VAR(field_input), CE_PIN(input_value), IO_PIN(input_value), SCLK_PIN(input_value) | `ds1302_setup("rtc", math_number(2), math_number(2), math_number(2))` | Dynamic code |
| `ds1302_set_write_protect` | Statement | VAR(field_variable), ENABLE(dropdown) | `ds1302_set_write_protect(variables_get($rtc), TRUE)` | Dynamic code |
| `ds1302_set_halt` | Statement | VAR(field_variable), HALT(dropdown) | `ds1302_set_halt(variables_get($rtc), TRUE)` | Dynamic code |
| `ds1302_get_time` | Value | VAR(field_variable) | `ds1302_get_time(variables_get($rtc))` | Dynamic code |
| `ds1302_set_time` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value), WEEKDAY(input_value) | `ds1302_set_time(variables_get($rtc), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Time |
| `ds1302_get_year` | Value | TIME(input_value) | `ds1302_get_year(math_number(1000))` | Dynamic code |
| `ds1302_get_month` | Value | TIME(input_value) | `ds1302_get_month(math_number(1000))` | Dynamic code |
| `ds1302_get_day` | Value | TIME(input_value) | `ds1302_get_day(math_number(1000))` | Dynamic code |
| `ds1302_get_hour` | Value | TIME(input_value) | `ds1302_get_hour(math_number(1000))` | Dynamic code |
| `ds1302_get_minute` | Value | TIME(input_value) | `ds1302_get_minute(math_number(1000))` | Dynamic code |
| `ds1302_get_second` | Value | TIME(input_value) | `ds1302_get_second(math_number(1000))` | Dynamic code |
| `ds1302_get_weekday` | Value | TIME(input_value) | `ds1302_get_weekday(math_number(1000))` | Dynamic code |
| `ds1302_write_ram` | Statement | VAR(field_variable), ADDRESS(input_value), VALUE(input_value) | `ds1302_write_ram(variables_get($rtc), math_number(0), math_number(0))` | Dynamic code |
| `ds1302_read_ram` | Value | VAR(field_variable), ADDRESS(input_value) | `ds1302_read_ram(variables_get($rtc), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ENABLE | TRUE, FALSE | ds1302_set_write_protect |
| HALT | TRUE, FALSE | ds1302_set_halt |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ds1302_setup("rtc", math_number(2), math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ds1302_get_time(variables_get($rtc)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ds1302_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

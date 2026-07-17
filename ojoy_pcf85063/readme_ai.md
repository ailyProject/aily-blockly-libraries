# OJoy RTC

OJoy PCF85063 real-time clock: set/read datetime, compile-time calibrate, formatted output, battery backup, I2C 0x51, OJoy pins fixed

## Library Info
- **Name**: @aily-project/lib-ojoy_pcf85063
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ojrtc_init` | Statement | VAR(field_input) | `ojrtc_init("rtc")` | See generator |
| `ojrtc_set_time` | Statement | VAR(field_variable), YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MIN(input_value), SEC(input_value) | `ojrtc_set_time(variables_get($rtc), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ojrtc_set_compile_time` | Statement | VAR(field_variable) | `ojrtc_set_compile_time(variables_get($rtc))` | See generator |
| `ojrtc_read` | Statement | VAR(field_variable) | `ojrtc_read(variables_get($rtc))` | See generator |
| `ojrtc_get` | Value | VAR(field_variable), FIELD(dropdown) | `ojrtc_get(variables_get($rtc), year)` | See generator |
| `ojrtc_format` | Value | VAR(field_variable), FMT(dropdown) | `ojrtc_format(variables_get($rtc), datetime)` | See generator |
| `ojrtc_lost_power` | Value | VAR(field_variable) | `ojrtc_lost_power(variables_get($rtc))` | See generator |
| `ojrtc_present` | Value | VAR(field_variable) | `ojrtc_present(variables_get($rtc))` | See generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | year, month, day, hour, minute, second, weekday | ojrtc_get |
| FMT | datetime, dateText, timeText | ojrtc_format |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ojrtc_init("rtc")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ojrtc_get(variables_get($rtc), year))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `ojrtc_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

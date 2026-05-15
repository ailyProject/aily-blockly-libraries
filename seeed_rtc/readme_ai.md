# Seeed RTC

Blockly wrapper for Seeed SAMD21/SAMD51 internal RTC with time setting, DateTime reading, alarms, and interrupt callbacks.

## Library Info
- **Name**: @aily-project/lib-seeed-rtc
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rtc_init` | Statement | VAR(field_input) | `seeed_rtc_init("rtc")` | Dynamic code |
| `seeed_rtc_datetime` | Value | YEAR(input_value), MONTH(input_value), DAY(input_value), HOUR(input_value), MINUTE(input_value), SECOND(input_value) | `seeed_rtc_datetime(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | DateTime( |
| `seeed_rtc_build_time` | Value | (none) | `seeed_rtc_build_time()` | DateTime(F(__DATE__), F(__TIME__)) |
| `seeed_rtc_set_time` | Statement | VAR(field_variable), DATETIME(input_value) | `seeed_rtc_set_time(variables_get($rtc), math_number(1000))` | Dynamic code |
| `seeed_rtc_now` | Value | VAR(field_variable) | `seeed_rtc_now(variables_get($rtc))` | Dynamic code |
| `seeed_rtc_datetime_get` | Value | TIME(input_value), PART(dropdown) | `seeed_rtc_datetime_get(math_number(1000), YEAR)` | Dynamic code |
| `seeed_rtc_timestamp` | Value | TIME(input_value), FORMAT(dropdown) | `seeed_rtc_timestamp(math_number(1000), FULL)` | Dynamic code |
| `seeed_rtc_is_valid` | Value | TIME(input_value) | `seeed_rtc_is_valid(math_number(1000))` | Dynamic code |
| `seeed_rtc_set_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown), DATETIME(input_value) | `seeed_rtc_set_alarm(variables_get($rtc), "0", math_number(1000))` | seeedRtcSetAlarm( |
| `seeed_rtc_get_alarm` | Value | VAR(field_variable), ALARM_ID(dropdown) | `seeed_rtc_get_alarm(variables_get($rtc), "0")` | seeedRtcGetAlarm( |
| `seeed_rtc_enable_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown), MATCH(dropdown) | `seeed_rtc_enable_alarm(variables_get($rtc), "0", MATCH_OFF)` | seeedRtcEnableAlarm( |
| `seeed_rtc_disable_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown) | `seeed_rtc_disable_alarm(variables_get($rtc), "0")` | seeedRtcDisableAlarm( |
| `seeed_rtc_on_alarm` | Hat | VAR(field_variable), HANDLER(input_statement) | `seeed_rtc_on_alarm(variables_get($rtc)) @HANDLER: child_block()` | Dynamic code |
| `seeed_rtc_alarm_flag` | Value | (none) | `seeed_rtc_alarm_flag()` | seeed_rtc_alarm_flag |
| `seeed_rtc_detach_alarm` | Statement | VAR(field_variable) | `seeed_rtc_detach_alarm(variables_get($rtc))` | Dynamic code |
| `seeed_rtc_standby` | Statement | VAR(field_variable) | `seeed_rtc_standby(variables_get($rtc))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PART | YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DAY_OF_WEEK, TWELVE_HOUR, IS_PM, UNIXTIME, SECONDSTIME | seeed_rtc_datetime_get |
| FORMAT | FULL, TIME, DATE | seeed_rtc_timestamp |
| ALARM_ID | 0, 1 | seeed_rtc_set_alarm, seeed_rtc_get_alarm, seeed_rtc_enable_alarm |
| MATCH | MATCH_OFF, MATCH_SS, MATCH_MMSS, MATCH_HHMMSS, MATCH_DHHMMSS, MATCH_MMDDHHMMSS, MATCH_YYMMDDHHMMSS | seeed_rtc_enable_alarm |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_rtc_init("rtc")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_rtc_datetime(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_rtc_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

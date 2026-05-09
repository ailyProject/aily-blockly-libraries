# Seeed RTC

Blockly ABS reference for Seeed SAMD21/SAMD51 internal RTC.

## Library Info
- **Name**: @aily-project/lib-seeed-rtc
- **Version**: 1.0.0
- **Includes**: `DateTime.h`, `RTC_SAMD21.h` or `RTC_SAMD51.h`
- **Variable**: `seeed_rtc_init("rtc")` creates `$rtc` with Blockly type `SeeedRTC`.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_rtc_init` | Statement | VAR(field_input) | `seeed_rtc_init("rtc")` | `SeeedRTC rtc; rtc.begin();` |
| `seeed_rtc_datetime` | Value | YEAR, MONTH, DAY, HOUR, MINUTE, SECOND(input_value) | `seeed_rtc_datetime(math_number(2026), math_number(5), math_number(9), math_number(12), math_number(0), math_number(0))` | `DateTime(y,m,d,h,m,s)` |
| `seeed_rtc_build_time` | Value | - | `seeed_rtc_build_time()` | `DateTime(F(__DATE__), F(__TIME__))` |
| `seeed_rtc_set_time` | Statement | VAR(field_variable), DATETIME(input_value) | `seeed_rtc_set_time($rtc, seeed_rtc_build_time())` | `rtc.adjust(dt);` |
| `seeed_rtc_now` | Value | VAR(field_variable) | `seeed_rtc_now($rtc)` | `rtc.now()` |
| `seeed_rtc_datetime_get` | Value | TIME(input_value), PART(dropdown) | `seeed_rtc_datetime_get(seeed_rtc_now($rtc), YEAR)` | `time.year()` etc. |
| `seeed_rtc_timestamp` | Value | TIME(input_value), FORMAT(dropdown) | `seeed_rtc_timestamp(seeed_rtc_now($rtc), FULL)` | `time.timestamp(...)` |
| `seeed_rtc_is_valid` | Value | TIME(input_value) | `seeed_rtc_is_valid(seeed_rtc_now($rtc))` | `time.isValid()` |
| `seeed_rtc_set_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown), DATETIME(input_value) | `seeed_rtc_set_alarm($rtc, 0, seeed_rtc_datetime(...))` | `setAlarm`, SAMD21 ignores id |
| `seeed_rtc_get_alarm` | Value | VAR(field_variable), ALARM_ID(dropdown) | `seeed_rtc_get_alarm($rtc, 0)` | `alarm()` / `alarm(id)` |
| `seeed_rtc_enable_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown), MATCH(dropdown) | `seeed_rtc_enable_alarm($rtc, 0, MATCH_HHMMSS)` | `enableAlarm(...)` |
| `seeed_rtc_disable_alarm` | Statement | VAR(field_variable), ALARM_ID(dropdown) | `seeed_rtc_disable_alarm($rtc, 0)` | `disableAlarm(...)` |
| `seeed_rtc_on_alarm` | Hat | VAR(field_variable), HANDLER(input_statement) | `seeed_rtc_on_alarm($rtc) @HANDLER: ...` | Registers `attachInterrupt(callback)` |
| `seeed_rtc_alarm_flag` | Value | - | `seeed_rtc_alarm_flag()` | `seeed_rtc_alarm_flag` |
| `seeed_rtc_detach_alarm` | Statement | VAR(field_variable) | `seeed_rtc_detach_alarm($rtc)` | `rtc.detachInterrupt();` |
| `seeed_rtc_standby` | Statement | VAR(field_variable) | `seeed_rtc_standby($rtc)` | `rtc.standbyMode();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PART | YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DAY_OF_WEEK, TWELVE_HOUR, IS_PM, UNIXTIME, SECONDSTIME | DateTime field to read |
| FORMAT | FULL, TIME, DATE | `timestamp()` output format |
| ALARM_ID | 0, 1 | SAMD51 alarm index; SAMD21 ignores id |
| MATCH | MATCH_OFF, MATCH_SS, MATCH_MMSS, MATCH_HHMMSS, MATCH_DHHMMSS, MATCH_MMDDHHMMSS, MATCH_YYMMDDHHMMSS | Alarm match mode |

## ABS Examples

### Read Current Time
```
arduino_setup()
    seeed_rtc_init("rtc")
    seeed_rtc_set_time($rtc, seeed_rtc_build_time())
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, seeed_rtc_timestamp(seeed_rtc_now($rtc), FULL))
    time_delay(math_number(1000))
```

### Alarm Callback
```
arduino_setup()
    seeed_rtc_init("rtc")
    seeed_rtc_set_time($rtc, seeed_rtc_build_time())
    seeed_rtc_set_alarm($rtc, 0, seeed_rtc_datetime(math_number(2026), math_number(5), math_number(9), math_number(12), math_number(0), math_number(15)))
    seeed_rtc_enable_alarm($rtc, 0, MATCH_HHMMSS)

seeed_rtc_on_alarm($rtc)
    @HANDLER:
        serial_println(Serial, text("Alarm"))
```

## Notes

1. `DateTime` supports years 2000-2099.
2. Put `seeed_rtc_init` in `arduino_setup()` before other RTC blocks.
3. SAMD21 has one alarm; SAMD51 has alarm 0 and 1.
4. `seeed_rtc_alarm_flag()` returns `1` on SAMD21 and bit flags on SAMD51.
5. `seeed_rtc_standby` enters MCU standby mode and may affect USB debugging.

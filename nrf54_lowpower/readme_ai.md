# nRF54 Low Power Management

Low power management library for nRF54L15, supporting System OFF with timed/button wake, WFI idle sleep, CPU frequency scaling, Low Power Comparator (LPCOMP) analog wake, watchdog timer, reset/wake source detection an...

## Library Info
- **Name**: @aily-project/lib-nrf54-lowpower
- **Version**: 0.6.7

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lowpower_init` | Statement | FREQ(dropdown), MODE(dropdown) | `lowpower_init("64MHZ", LOW_POWER)` | Dynamic code |
| `lowpower_enter_lowest_power` | Statement | (none) | `lowpower_enter_lowest_power()` | xiaoNrf54l15EnterLowestPowerBoardState();\n |
| `lowpower_set_cpu_freq` | Statement | FREQ(dropdown) | `lowpower_set_cpu_freq("64MHZ")` | (void)ClockControl::setCpuFrequency( |
| `lowpower_wfi` | Statement | (none) | `lowpower_wfi()` | __asm volatile( |
| `lowpower_sleep_ms` | Statement | MS(input_value) | `lowpower_sleep_ms(math_number(1000))` | lowpower_sleepUntilMs(millis() + |
| `lowpower_system_off_timed` | Statement | MS(input_value) | `lowpower_system_off_timed(math_number(1000))` | delaySystemOffNoRetention( |
| `lowpower_system_off_button` | Statement | (none) | `lowpower_system_off_button()` | Dynamic code |
| `lowpower_system_off` | Statement | RETENTION(dropdown) | `lowpower_system_off(NO_RETENTION)` | Serial.flush();\ndelay(2);\n |
| `lowpower_lpcomp_init` | Statement | PIN(dropdown), VDD(input_value), THRESHOLD(input_value), HYSTERESIS(dropdown), DETECT(dropdown) | `lowpower_lpcomp_init(kPinA0, math_number(0), math_number(0), TRUE, UP)` | lowpower_lpcomp.beginThresholdMv( |
| `lowpower_lpcomp_poll_up` | Value | (none) | `lowpower_lpcomp_poll_up()` | lowpower_lpcomp.pollUp(true) |
| `lowpower_lpcomp_sample_above` | Value | (none) | `lowpower_lpcomp_sample_above()` | lowpower_lpcompAboveThreshold() |
| `lowpower_lpcomp_clear` | Statement | (none) | `lowpower_lpcomp_clear()` | lowpower_lpcomp.clearEvents();\n |
| `lowpower_watchdog_init` | Statement | TIMEOUT(input_value), PAUSE_SLEEP(dropdown) | `lowpower_watchdog_init(math_number(1000), TRUE)` | Dynamic code |
| `lowpower_watchdog_feed` | Statement | (none) | `lowpower_watchdog_feed()` | lowpower_wdt.feed();\n |
| `lowpower_woke_from` | Value | SOURCE(dropdown) | `lowpower_woke_from(GPIO)` | ((lowpower_pm.resetReason() & |
| `lowpower_reset_reason` | Value | (none) | `lowpower_reset_reason()` | lowpower_pm.resetReason() |
| `lowpower_clear_reset_reason` | Statement | (none) | `lowpower_clear_reset_reason()` | lowpower_clearResetReason();\n |
| `lowpower_gpregret_write` | Statement | VALUE(input_value) | `lowpower_gpregret_write(math_number(0))` | lowpower_writeGpregret((uint8_t)( |
| `lowpower_gpregret_read` | Value | (none) | `lowpower_gpregret_read()` | lowpower_readGpregret() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FREQ | 64MHZ, 128MHZ | lowpower_init, lowpower_set_cpu_freq |
| MODE | LOW_POWER, CONSTANT_LATENCY | lowpower_init |
| RETENTION | NO_RETENTION, RETENTION | lowpower_system_off |
| PIN | kPinA0, kPinA1, kPinA2, kPinA3, kPinA4, kPinA5 | lowpower_lpcomp_init |
| HYSTERESIS | TRUE, FALSE | lowpower_lpcomp_init |
| DETECT | UP, DOWN, CROSS | lowpower_lpcomp_init |
| PAUSE_SLEEP | TRUE, FALSE | lowpower_watchdog_init |
| SOURCE | GPIO, GRTC, LPCOMP, WATCHDOG | lowpower_woke_from |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lowpower_init("64MHZ", LOW_POWER)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lowpower_lpcomp_poll_up())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# ESP32 sleep management

ESP32 deep and shallow sleep library supports scheduled wake-up, external pin wake-up and RTC storage

## Library Info
- **Name**: @aily-project/lib-esp32-sleep
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_deep_sleep_timer` | Statement | SECONDS(input_value) | `esp32_deep_sleep_timer(math_number(0))` | esp_sleep_enable_timer_wakeup( |
| `esp32_deep_sleep_ext0` | Statement | PIN(dropdown), LEVEL(dropdown) | `esp32_deep_sleep_ext0("0", "1")` | esp_sleep_enable_ext0_wakeup(GPIO_NUM_ |
| `esp32_deep_sleep_start` | Statement | (none) | `esp32_deep_sleep_start()` | esp_deep_sleep_start();\n |
| `esp32_set_cpu_frequency` | Statement | FREQUENCY(dropdown) | `esp32_set_cpu_frequency("240")` | setCpuFrequencyMhz( |
| `esp32_deep_sleep_quick` | Statement | SECONDS(input_value) | `esp32_deep_sleep_quick(math_number(0))` | deepSleepTimer( |
| `esp32_light_sleep_start` | Statement | (none) | `esp32_light_sleep_start()` | esp_light_sleep_start();\n |
| `esp32_rtc_variable_int` | Statement | VAR(field_input), VALUE(input_value) | `esp32_rtc_variable_int("rtcCounter", math_number(0))` | RTC_DATA_ATTR int |
| `esp32_rtc_set_variable` | Statement | VAR(field_input), VALUE(input_value) | `esp32_rtc_set_variable("rtcCounter", math_number(0))` | Dynamic code |
| `esp32_rtc_get_variable` | Value | VAR(field_input) | `esp32_rtc_get_variable("rtcCounter")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | 0, 2, 4, 12, 13, 14, 15, 25, 26, 27, 32, 33, 34, 35, 36, 39 | esp32_deep_sleep_ext0 |
| LEVEL | 1, 0 | esp32_deep_sleep_ext0 |
| FREQUENCY | 240, 160, 80, 40, 20, 10 | esp32_set_cpu_frequency |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_deep_sleep_timer(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_rtc_get_variable("rtcCounter"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `esp32_rtc_variable_int("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# time control

Core libraries, usually already integrated into the initial template. Contains delay, millis, micros and other functions

## Library Info
- **Name**: @aily-project/lib-core-time
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `time_delay` | Statement | DELAY_TIME(input_value) | `time_delay(math_number(1000))` | delay( |
| `time_millis` | Value | (none) | `time_millis()` | millis() |
| `system_time` | Value | (none) | `system_time()` | __TIME__ |
| `system_date` | Value | (none) | `system_date()` | __DATE__ |
| `time_delay_microseconds` | Statement | DELAY_TIME(input_value) | `time_delay_microseconds(math_number(1000))` | delayMicroseconds( |
| `time_micros` | Value | (none) | `time_micros()` | micros() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    time_delay(math_number(1000))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, time_millis())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun DS3234 Real-Time Clock

Blockly wrapper for the SparkFun DS3234 SPI real-time clock module.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ds3234
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds3234_begin` | Statement | CS_PIN(field_number) | `ds3234_begin(10)` | rtc.begin( |
| `ds3234_auto_time` | Statement | (none) | `ds3234_auto_time()` | rtc.autoTime();\n |
| `ds3234_set_time` | Statement | SEC(input_value), MIN(input_value), HOUR(input_value), DAY(input_value), DATE(input_value), MONTH(input_value), YEAR(input_value) | `ds3234_set_time(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | rtc.setTime( |
| `ds3234_update` | Statement | (none) | `ds3234_update()` | rtc.update();\n |
| `ds3234_get_time` | Value | FIELD(dropdown) | `ds3234_get_time(second)` | rtc. |
| `ds3234_get_temperature` | Value | (none) | `ds3234_get_temperature()` | rtc.temperature() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | second, minute, hour, day, date, month, year | ds3234_get_time |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ds3234_begin(10)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ds3234_get_time(second))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun DS1307 Real-Time Clock

Blockly wrapper for the SparkFun DS1307 I2C real-time clock module.

## Library Info
- **Name**: @aily-project/lib-sparkfun-ds1307
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ds1307_begin` | Statement | (none) | `ds1307_begin()` | Wire.begin();\nrtc.begin();\n |
| `ds1307_auto_time` | Statement | (none) | `ds1307_auto_time()` | rtc.autoTime();\n |
| `ds1307_set_time` | Statement | SEC(input_value), MIN(input_value), HOUR(input_value), DAY(input_value), DATE(input_value), MONTH(input_value), YEAR(input_value) | `ds1307_set_time(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | rtc.setTime( |
| `ds1307_update` | Statement | (none) | `ds1307_update()` | rtc.update();\n |
| `ds1307_get_time` | Value | FIELD(dropdown) | `ds1307_get_time(second)` | rtc. |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | second, minute, hour, day, date, month, year | ds1307_get_time |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ds1307_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ds1307_get_time(second))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

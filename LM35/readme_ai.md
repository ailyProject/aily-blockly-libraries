# LM35 Temperature Sensor Library

The LM35 temperature sensor library achieves accurate measurement of ambient temperature through analog signal output. It supports continuous temperature acquisition, low-power operation, linear output, no calibration...

## Library Info
- **Name**: @aily-project/lib-lm35
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lm35_read` | Value | PIN(dropdown) | `lm35_read(PIN)` | analogRead(...) * 0.488 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lm35_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# ultrasonic sensor

Ultrasonic sensor, the driver library supports SR04, achieves non-contact distance measurement by transmitting and receiving ultrasonic signals, and is suitable for a variety of development boards.

## Library Info
- **Name**: @aily-project/lib-ultrasonic
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ultrasonic_ranging` | Value | PIN1(input_value), PIN2(input_value) | `ultrasonic_ranging(math_number(2), math_number(2))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ultrasonic_ranging(math_number(2), math_number(2)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

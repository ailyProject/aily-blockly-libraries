# 360 servo drive

360 servo control support library, which realizes speed and direction control of 360-degree continuous rotating servo through PWM signal. It supports forward and reverse rotation, speed adjustment, and stop control. I...

## Library Info
- **Name**: @aily-project/lib-servo360
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servo360_write` | Statement | PIN(dropdown), SPEED(input_value), DIRECTION(dropdown) | `servo360_write(PIN, math_number(9600), true)` | Dynamic code |
| `servo360_speed` | Value | SPEED(field_slider) | `servo360_speed()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | true, false | servo360_write |

## ABS Examples

### Basic Usage
```
arduino_setup()
    servo360_write(PIN, math_number(9600), true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servo360_speed())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

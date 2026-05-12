# Servo drive

The servo control support library accurately controls the rotation angle of the servo through PWM signals. It supports multi-channel servo control, angle setting, and speed adjustment. It is suitable for Arduino UNO,...

## Library Info
- **Name**: @aily-project/lib-servo
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servo_write` | Statement | PIN(dropdown), ANGLE(input_value) | `servo_write(PIN, math_number(90))` | Dynamic code |
| `servo_read` | Value | PIN(dropdown) | `servo_read(PIN)` | Dynamic code |
| `servo_angle` | Value | ANGLE(field_angle180) | `servo_angle()` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    servo_write(PIN, math_number(90))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servo_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

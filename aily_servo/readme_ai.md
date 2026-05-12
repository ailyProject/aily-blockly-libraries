# Aily steering gear control library

Servo control support library based on Servo library package, suitable for Arduino UNO, MEGA, UNO R4, ESP32 and other development boards, supporting functions such as angle control and pulse width control

## Library Info
- **Name**: @aily-project/lib-aily-servo
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servo_attach` | Statement | PIN(dropdown) | `servo_attach(PIN)` | Dynamic code |
| `servo_attach_advanced` | Statement | PIN(dropdown), MIN_PULSE_WIDTH(input_value), MAX_PULSE_WIDTH(input_value) | `servo_attach_advanced(PIN, math_number(0), math_number(0))` | Dynamic code |
| `servo_attach_full` | Statement | PIN(dropdown), MIN_ANGLE(input_value), MAX_ANGLE(input_value), MIN_PULSE_WIDTH(input_value), MAX_PULSE_WIDTH(input_value) | `servo_attach_full(PIN, math_number(90), math_number(90), math_number(0), math_number(0))` | Dynamic code |
| `servo_write` | Statement | PIN(dropdown), ANGLE(input_value) | `servo_write(PIN, math_number(90))` | Dynamic code |
| `servo_write_float` | Statement | PIN(dropdown), ANGLE(input_value) | `servo_write_float(PIN, math_number(90))` | Dynamic code |
| `servo_write_microseconds` | Statement | PIN(dropdown), MICROSECONDS(input_value) | `servo_write_microseconds(PIN, math_number(0))` | Dynamic code |
| `servo_read` | Value | PIN(dropdown) | `servo_read(PIN)` | Dynamic code |
| `servo_read_microseconds` | Value | PIN(dropdown) | `servo_read_microseconds(PIN)` | Dynamic code |
| `servo_attached` | Value | PIN(dropdown) | `servo_attached(PIN)` | Dynamic code |
| `servo_detach` | Statement | PIN(dropdown) | `servo_detach(PIN)` | Dynamic code |
| `servo_get_pin` | Value | PIN(dropdown) | `servo_get_pin(PIN)` | Dynamic code |
| `servo_map_angle` | Value | VALUE(input_value), FROM_MIN(input_value), FROM_MAX(input_value), TO_MIN(input_value), TO_MAX(input_value) | `servo_map_angle(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | map( |
| `servo_sweep` | Statement | PIN(dropdown), START_ANGLE(input_value), END_ANGLE(input_value), DELAY_MS(input_value) | `servo_sweep(PIN, math_number(90), math_number(90), math_number(1000))` | Dynamic code |
| `servo_angle` | Value | ANGLE(field_angle) | `servo_angle(90)` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    servo_attach(PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servo_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# Stepper Motor Driver Library

Driver library for four-phase five-wire stepper motor 28BYJ-48, often used with driver boards such as ULN2003, and supports Arduino UNO, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-stepper
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stepper_init` | Statement | STEPPER(field_variable), STEPS(field_number), PIN1(dropdown), PIN2(dropdown), PIN3(dropdown), PIN4(dropdown) | `stepper_init(variables_get($stepper), 4096, PIN1, PIN2, PIN3, PIN4)` | Dynamic code |
| `stepper_set_speed` | Statement | STEPPER(field_variable), SPEED(field_number) | `stepper_set_speed(variables_get($stepper), 5)` | Dynamic code |
| `stepper_step` | Statement | STEPPER(field_variable), STEPS(input_value) | `stepper_step(variables_get($stepper), math_number(0))` | Dynamic code |
| `stepper_rotate_degrees` | Statement | STEPPER(field_variable), DEGREES(input_value) | `stepper_rotate_degrees(variables_get($stepper), math_number(90))` | // 旋转指定角度\n |

## ABS Examples

### Basic Usage
```
arduino_setup()
    stepper_init(variables_get($stepper), 4096, PIN1, PIN2, PIN3, PIN4)
    serial_begin(Serial, 9600)

arduino_loop()
    stepper_set_speed(variables_get($stepper), 5)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

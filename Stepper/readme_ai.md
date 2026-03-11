# 步进电机驱动库

针对四相五线步进电机28BYJ-48的驱动库，常配合ULN2003等驱动板使用，,支持Arduino UNO,ESP32等开发板

## Library Info
- **Name**: @aily-project/lib-stepper
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stepper_init` | Statement | STEPPER(field_variable), STEPS(field_number), PIN1(dropdown), PIN2(dropdown), PIN3(dropdown), PIN4(dropdown) | `stepper_init(variables_get($stepper), 4096, PIN1, PIN2, PIN3, PIN4)` | `` |
| `stepper_set_speed` | Statement | STEPPER(field_variable), SPEED(field_number) | `stepper_set_speed(variables_get($stepper), 5)` | (dynamic code) |
| `stepper_step` | Statement | STEPPER(field_variable), STEPS(input_value) | `stepper_step(variables_get($stepper), math_number(0))` | (dynamic code) |
| `stepper_rotate_degrees` | Statement | STEPPER(field_variable), DEGREES(input_value) | `stepper_rotate_degrees(variables_get($stepper), math_number(0))` | `// 旋转指定角度\n` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    stepper_init(variables_get($stepper), 4096, PIN1, PIN2, PIN3, PIN4)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

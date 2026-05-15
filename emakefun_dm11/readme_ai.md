# DM11 motor driver

Emakefun DM11 motor driver module supports dual motor PWM control

## Library Info
- **Name**: @aily-project/lib-emakefun-dm11
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dm11_init` | Statement | VAR(field_input), I2C_ADDR(field_input), FREQUENCY(input_value) | `dm11_init("dm11", "0x15", math_number(0))` | if ( |
| `dm11_pwm_duty` | Statement | VAR(field_variable), CHANNEL(dropdown), DUTY(input_value) | `dm11_pwm_duty(variables_get($dm11), "0", math_number(0))` | Dynamic code |
| `dm11_motor_control` | Statement | VAR(field_variable), MOTOR(dropdown), SPEED(input_value) | `dm11_motor_control(variables_get($dm11), A, math_number(9600))` | Dynamic code |
| `dm11_motor_stop` | Statement | VAR(field_variable), MOTOR(dropdown) | `dm11_motor_stop(variables_get($dm11), A)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHANNEL | 0, 1, 2, 3 | dm11_pwm_duty |
| MOTOR | A, B | dm11_motor_control |
| MOTOR | A, B, ALL | dm11_motor_stop |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dm11_init("dm11", "0x15", math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    dm11_pwm_duty(variables_get($dm11), "0", math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `dm11_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

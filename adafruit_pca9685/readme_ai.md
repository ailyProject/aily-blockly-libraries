# PCA9685 servo driver

PCA9685 I2C 16-channel PWM servo driver library supports servo angle control, PWM output, microsecond pulse width control and other functions

## Library Info
- **Name**: @aily-project/lib-adafruit-pca9685
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pca9685_create` | Statement | VAR(field_input) | `pca9685_create("pwm")` | Dynamic code |
| `pca9685_begin` | Statement | VAR(field_variable), ADDRESS(input_value) | `pca9685_begin(variables_get($pwm), math_number(0))` | Dynamic code |
| `pca9685_set_freq` | Statement | VAR(field_variable), FREQ(input_value) | `pca9685_set_freq(variables_get($pwm), math_number(0))` | Dynamic code |
| `pca9685_set_servo_angle` | Statement | VAR(field_variable), CHANNEL(input_value), ANGLE(input_value) | `pca9685_set_servo_angle(variables_get($pwm), math_number(0), math_number(90))` | Dynamic code |
| `pca9685_set_pwm` | Statement | VAR(field_variable), CHANNEL(input_value), ON(input_value), OFF(input_value) | `pca9685_set_pwm(variables_get($pwm), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `pca9685_set_microseconds` | Statement | VAR(field_variable), CHANNEL(input_value), MICROSECONDS(input_value) | `pca9685_set_microseconds(variables_get($pwm), math_number(0), math_number(0))` | Dynamic code |
| `pca9685_config_servo` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `pca9685_config_servo(variables_get($pwm), math_number(0), math_number(0))` | Dynamic code |
| `pca9685_set_all_servos` | Statement | VAR(field_variable), ANGLE(input_value) | `pca9685_set_all_servos(variables_get($pwm), math_number(90))` | for (int i = 0; i < 16; i++) {\n |
| `pca9685_sleep` | Statement | VAR(field_variable) | `pca9685_sleep(variables_get($pwm))` | Dynamic code |
| `pca9685_wakeup` | Statement | VAR(field_variable) | `pca9685_wakeup(variables_get($pwm))` | Dynamic code |
| `pca9685_set_servo_range` | Statement | VAR(field_variable), CHANNEL(input_value), MIN_ANGLE(input_value), MIN_PWM(input_value), MAX_ANGLE(input_value), MAX_PWM(input_value) | `pca9685_set_servo_range(variables_get($pwm), math_number(0), math_number(90), math_number(0), math_number(90), math_number(0))` | Dynamic code |
| `pca9685_angle_to_pwm` | Value | VAR(field_variable), ANGLE(input_value) | `pca9685_angle_to_pwm(variables_get($pwm), math_number(90))` | map( |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pca9685_create("pwm")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pca9685_angle_to_pwm(variables_get($pwm), math_number(90)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `pca9685_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

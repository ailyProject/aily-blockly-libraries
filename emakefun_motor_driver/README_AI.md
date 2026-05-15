# Emakefun motor driver board

Emakefun motor driver board supports 4-channel DC motors, 8-channel servos, 2-channel stepper motors, and I2C communication

## Library Info
- **Name**: @aily-project/lib-emakefun-motor-driver
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_md_init` | Statement | VAR(field_input), ADDR(dropdown), FREQ(dropdown) | `emakefun_md_init("mMotor", "0x60", "50")` | Dynamic code |
| `emakefun_md_dc_run` | Statement | VAR(field_variable), MOTOR(dropdown), SPEED(input_value), DIR(dropdown) | `emakefun_md_dc_run(variables_get($mMotor), "1", math_number(9600), FORWARD)` | Dynamic code |
| `emakefun_md_dc_stop` | Statement | VAR(field_variable), MOTOR(dropdown), ACTION(dropdown) | `emakefun_md_dc_stop(variables_get($mMotor), "1", BRAKE)` | Dynamic code |
| `emakefun_md_servo_write` | Statement | VAR(field_variable), SERVO(dropdown), ANGLE(input_value) | `emakefun_md_servo_write(variables_get($mMotor), "1", math_number(90))` | Dynamic code |
| `emakefun_md_servo_write_speed` | Statement | VAR(field_variable), SERVO(dropdown), ANGLE(input_value), SPEED(input_value) | `emakefun_md_servo_write_speed(variables_get($mMotor), "1", math_number(90), math_number(9600))` | Dynamic code |
| `emakefun_md_servo_read` | Value | VAR(field_variable), SERVO(dropdown) | `emakefun_md_servo_read(variables_get($mMotor), "1")` | Dynamic code |
| `emakefun_md_stepper_speed` | Statement | VAR(field_variable), STEPPER(dropdown), RPM(input_value) | `emakefun_md_stepper_speed(variables_get($mMotor), "1", math_number(0))` | Dynamic code |
| `emakefun_md_stepper_step` | Statement | VAR(field_variable), STEPPER(dropdown), STEPS(input_value), DIR(dropdown), STYLE(dropdown) | `emakefun_md_stepper_step(variables_get($mMotor), "1", math_number(0), FORWARD, SINGLE)` | Dynamic code |
| `emakefun_md_stepper_release` | Statement | VAR(field_variable), STEPPER(dropdown) | `emakefun_md_stepper_release(variables_get($mMotor), "1")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x60, 0x61, 0x62, 0x63 | emakefun_md_init |
| FREQ | 50, 1600 | emakefun_md_init |
| MOTOR | 1, 2, 3, 4 | emakefun_md_dc_run, emakefun_md_dc_stop |
| DIR | FORWARD, BACKWARD | emakefun_md_dc_run, emakefun_md_stepper_step |
| ACTION | BRAKE, RELEASE | emakefun_md_dc_stop |
| SERVO | 1, 2, 3, 4, 5, 6, 7, 8 | emakefun_md_servo_write, emakefun_md_servo_write_speed, emakefun_md_servo_read |
| STEPPER | 1, 2 | emakefun_md_stepper_speed, emakefun_md_stepper_step, emakefun_md_stepper_release |
| STYLE | SINGLE, DOUBLE, INTERLEAVE, MICROSTEP | emakefun_md_stepper_step |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emakefun_md_init("mMotor", "0x60", "50")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emakefun_md_servo_read(variables_get($mMotor), "1"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emakefun_md_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

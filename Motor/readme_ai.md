# Adafruit Motor Driver Library

Adafruit motor driver board library supports controlling DC motors and stepper motors, suitable for Arduino control boards

## Library Info
- **Name**: @aily-project/lib-afmotor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `afmotor_dc_init` | Statement | MOTOR(dropdown), FREQ(dropdown) | `afmotor_dc_init("1", DC_MOTOR_PWM_RATE)` | Dynamic code |
| `afmotor_dc_run` | Statement | MOTOR(dropdown), DIRECTION(dropdown), SPEED(input_value) | `afmotor_dc_run("1", FORWARD, math_number(9600))` | Dynamic code |
| `afmotor_stepper_init` | Statement | STEPPER(dropdown), STEPS(input_value) | `afmotor_stepper_init("1", math_number(0))` | Dynamic code |
| `afmotor_stepper_setspeed` | Statement | STEPPER(dropdown), RPM(input_value) | `afmotor_stepper_setspeed("1", math_number(0))` | Dynamic code |
| `afmotor_stepper_step` | Statement | STEPPER(dropdown), STEPS(input_value), DIRECTION(dropdown), STYLE(dropdown) | `afmotor_stepper_step("1", math_number(0), FORWARD, SINGLE)` | Dynamic code |
| `afmotor_stepper_onestep` | Statement | STEPPER(dropdown), DIRECTION(dropdown), STYLE(dropdown) | `afmotor_stepper_onestep("1", FORWARD, SINGLE)` | Dynamic code |
| `afmotor_stepper_release` | Statement | STEPPER(dropdown) | `afmotor_stepper_release("1")` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR | 1, 2, 3, 4 | afmotor_dc_init, afmotor_dc_run |
| FREQ | DC_MOTOR_PWM_RATE, MOTOR12_64KHZ, MOTOR12_8KHZ, MOTOR12_2KHZ, MOTOR12_1KHZ | afmotor_dc_init |
| DIRECTION | FORWARD, BACKWARD, BRAKE, RELEASE | afmotor_dc_run |
| STEPPER | 1, 2 | afmotor_stepper_init, afmotor_stepper_setspeed, afmotor_stepper_step |
| DIRECTION | FORWARD, BACKWARD | afmotor_stepper_step, afmotor_stepper_onestep |
| STYLE | SINGLE, DOUBLE, INTERLEAVE, MICROSTEP | afmotor_stepper_step, afmotor_stepper_onestep |

## ABS Examples

### Basic Usage
```
arduino_setup()
    afmotor_dc_init("1", DC_MOTOR_PWM_RATE)
    serial_begin(Serial, 9600)

arduino_loop()
    afmotor_dc_run("1", FORWARD, math_number(9600))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

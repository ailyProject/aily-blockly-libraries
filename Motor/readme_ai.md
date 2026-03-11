# Adafruit电机驱动库

Adafruit电机驱动板库，支持控制直流电机和步进电机，适用于Arduino控制板

## Library Info
- **Name**: @aily-project/lib-afmotor
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `afmotor_dc_init` | Statement | MOTOR(dropdown), FREQ(dropdown) | `afmotor_dc_init(1, DC_MOTOR_PWM_RATE)` | `` |
| `afmotor_dc_run` | Statement | MOTOR(dropdown), DIRECTION(dropdown), SPEED(input_value) | `afmotor_dc_run(1, FORWARD, math_number(9600))` | (dynamic code) |
| `afmotor_stepper_init` | Statement | STEPPER(dropdown), STEPS(input_value) | `afmotor_stepper_init(1, math_number(0))` | `` |
| `afmotor_stepper_setspeed` | Statement | STEPPER(dropdown), RPM(input_value) | `afmotor_stepper_setspeed(1, math_number(0))` | (dynamic code) |
| `afmotor_stepper_step` | Statement | STEPPER(dropdown), STEPS(input_value), DIRECTION(dropdown), STYLE(dropdown) | `afmotor_stepper_step(1, math_number(0), FORWARD, SINGLE)` | (dynamic code) |
| `afmotor_stepper_onestep` | Statement | STEPPER(dropdown), DIRECTION(dropdown), STYLE(dropdown) | `afmotor_stepper_onestep(1, FORWARD, SINGLE)` | (dynamic code) |
| `afmotor_stepper_release` | Statement | STEPPER(dropdown) | `afmotor_stepper_release(1)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR | 1, 2, 3, 4 | M1 / M2 / M3 / M4 |
| FREQ | DC_MOTOR_PWM_RATE, MOTOR12_64KHZ, MOTOR12_8KHZ, MOTOR12_2KHZ, MOTOR12_1KHZ | 默认 / 64KHz / 8KHz / 2KHz / 1KHz |
| DIRECTION | FORWARD, BACKWARD, BRAKE, RELEASE | 前进 / 后退 / 刹车 / 释放 |
| STEPPER | 1, 2 | 1(M1+M2) / 2(M3+M4) |
| STYLE | SINGLE, DOUBLE, INTERLEAVE, MICROSTEP | 单相 / 双相 / 交错 / 微步进 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    afmotor_dc_init(1, DC_MOTOR_PWM_RATE)
    afmotor_stepper_init(1, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

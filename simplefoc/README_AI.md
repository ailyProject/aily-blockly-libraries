# SimpleFOC

BLDC and Stepper motor FOC control library

## Library Info
- **Name**: @aily-project/lib-simplefoc
- **Version**: 2.4.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_bldc_create` | Statement | VAR(field_input), POLE_PAIRS(input_value), R(input_value), KV(input_value) | `simplefoc_bldc_create("motor", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `simplefoc_stepper_create` | Statement | VAR(field_input), POLE_PAIRS(input_value), R(input_value) | `simplefoc_stepper_create("stepper", math_number(0), math_number(0))` | Dynamic code |
| `simplefoc_driver_3pwm_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), PIN_C(input_value), ENABLE(input_value) | `simplefoc_driver_3pwm_create("driver", math_number(2), math_number(2), math_number(2), math_number(0))` | Dynamic code |
| `simplefoc_driver_6pwm_create` | Statement | VAR(field_input), PIN_AH(input_value), PIN_AL(input_value), PIN_BH(input_value), PIN_BL(input_value), PIN_CH(input_value), PIN_CL(input_value) | `simplefoc_driver_6pwm_create("driver", math_number(2), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))` | BLDCDriver6PWM ... = BLDCDriver6PWM(..., ..., ..., ..., ..., ...);\n |
| `simplefoc_encoder_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), CPR(input_value) | `simplefoc_encoder_create("encoder", math_number(2), math_number(2), math_number(0))` | Encoder ... = Encoder(..., ..., ...);\n |
| `simplefoc_magnetic_spi_create` | Statement | VAR(field_input), CS(input_value) | `simplefoc_magnetic_spi_create("sensor", math_number(0))` | MagneticSensorSPI ... = MagneticSensorSPI(...);\n |
| `simplefoc_magnetic_i2c_create` | Statement | VAR(field_input), ADDRESS(input_value) | `simplefoc_magnetic_i2c_create("sensor", math_number(0))` | MagneticSensorI2C ... = MagneticSensorI2C(...);\n |
| `simplefoc_motor_link_driver` | Statement | MOTOR(field_variable), DRIVER(field_variable) | `simplefoc_motor_link_driver(variables_get($motor), variables_get($driver))` | ....linkDriver(&...);\n |
| `simplefoc_motor_link_sensor` | Statement | MOTOR(field_variable), SENSOR(field_variable) | `simplefoc_motor_link_sensor(variables_get($motor), variables_get($encoder))` | ....linkSensor(&...);\n |
| `simplefoc_driver_init` | Statement | DRIVER(field_variable), VOLTAGE(input_value) | `simplefoc_driver_init(variables_get($driver), math_number(0))` | ....voltage_power_supply = ...;\n |
| `simplefoc_sensor_init` | Statement | SENSOR(field_variable) | `simplefoc_sensor_init(variables_get($encoder))` | ....init();\n |
| `simplefoc_encoder_enable_interrupts` | Statement | SENSOR(field_variable) | `simplefoc_encoder_enable_interrupts(variables_get($encoder))` | ....enableInterrupts(doA_..., doB_...);\n |
| `simplefoc_motor_init` | Statement | MOTOR(field_variable) | `simplefoc_motor_init(variables_get($motor))` | ....init();\n |
| `simplefoc_motor_initfoc` | Statement | MOTOR(field_variable) | `simplefoc_motor_initfoc(variables_get($motor))` | ....initFOC();\n |
| `simplefoc_motor_set_controller` | Statement | MOTOR(field_variable), MODE(dropdown) | `simplefoc_motor_set_controller(variables_get($motor), torque)` | ....controller = ...;\n |
| `simplefoc_motor_set_torque` | Statement | MOTOR(field_variable), MODE(dropdown) | `simplefoc_motor_set_torque(variables_get($motor), voltage)` | ....torque_controller = ...;\n |
| `simplefoc_motor_move` | Statement | MOTOR(field_variable), TARGET(input_value) | `simplefoc_motor_move(variables_get($motor), math_number(0))` | ....move(...);\n |
| `simplefoc_motor_loopfoc` | Statement | MOTOR(field_variable) | `simplefoc_motor_loopfoc(variables_get($motor))` | Dynamic code |
| `simplefoc_motor_pid_velocity` | Statement | MOTOR(field_variable), P(input_value), I(input_value), D(input_value), RAMP(input_value), LIMIT(input_value) | `simplefoc_motor_pid_velocity(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | ....PID_velocity.P = ...;\n |
| `simplefoc_motor_pid_angle` | Statement | MOTOR(field_variable), P(input_value), VEL_LIMIT(input_value) | `simplefoc_motor_pid_angle(variables_get($motor), math_number(0), math_number(0))` | ....P_angle.P = ...;\n |
| `simplefoc_motor_pid_current` | Statement | MOTOR(field_variable), P(input_value), I(input_value), D(input_value), LIMIT(input_value) | `simplefoc_motor_pid_current(variables_get($motor), math_number(0), math_number(0), math_number(0), math_number(0))` | ....PID_current_q.P = ...;\n |
| `simplefoc_motor_set_limits` | Statement | MOTOR(field_variable), VOLTAGE_LIMIT(input_value), CURRENT_LIMIT(input_value) | `simplefoc_motor_set_limits(variables_get($motor), math_number(0), math_number(0))` | ....voltage_limit = ...;\n |
| `simplefoc_motor_get_angle` | Value | MOTOR(field_variable) | `simplefoc_motor_get_angle(variables_get($motor))` | ....shaftAngle() |
| `simplefoc_motor_get_velocity` | Value | MOTOR(field_variable) | `simplefoc_motor_get_velocity(variables_get($motor))` | ....shaftVelocity() |
| `simplefoc_motor_enable` | Statement | MOTOR(field_variable) | `simplefoc_motor_enable(variables_get($motor))` | ....enable();\n |
| `simplefoc_motor_disable` | Statement | MOTOR(field_variable) | `simplefoc_motor_disable(variables_get($motor))` | ....disable();\n |
| `simplefoc_lowside_current_sense_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), PIN_C(input_value), SHUNT_R(input_value), GAIN(input_value) | `simplefoc_lowside_current_sense_create("current_sense", math_number(2), math_number(2), math_number(2), math_number(0), math_number(0))` | LowsideCurrentSense ... = LowsideCurrentSense(..., ..., ..., ..., ...);\n |
| `simplefoc_current_sense_link_driver` | Statement | CURRENT_SENSE(field_variable), DRIVER(field_variable) | `simplefoc_current_sense_link_driver(variables_get($current_sense), variables_get($driver))` | ....linkDriver(&...);\n |
| `simplefoc_motor_link_current_sense` | Statement | MOTOR(field_variable), CURRENT_SENSE(field_variable) | `simplefoc_motor_link_current_sense(variables_get($motor), variables_get($current_sense))` | ....linkCurrentSense(&...);\n |
| `simplefoc_current_sense_init` | Statement | CURRENT_SENSE(field_variable) | `simplefoc_current_sense_init(variables_get($current_sense))` | ....init();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | torque, velocity, angle, velocity_openloop, angle_openloop | simplefoc_motor_set_controller |
| MODE | voltage, dc_current, foc_current, estimated_current | simplefoc_motor_set_torque |

## ABS Examples

### Basic Usage
```
arduino_setup()
    simplefoc_bldc_create("motor", math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, simplefoc_motor_get_angle(variables_get($motor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `simplefoc_bldc_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

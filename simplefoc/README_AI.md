# SimpleFOC

Field Oriented Control library for BLDC and Stepper motors

## Library Info
- **Name**: @aily-project/lib-simplefoc
- **Version**: 2.4.0

## Block Definitions

### Motors

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_bldc_create` | Statement | VAR(field_input), POLE_PAIRS(input_value), R(input_value), KV(input_value) | `simplefoc_bldc_create("motor", math_number(11), math_number(0), math_number(0))` | `BLDCMotor motor = BLDCMotor(11);` |
| `simplefoc_stepper_create` | Statement | VAR(field_input), POLE_PAIRS(input_value), R(input_value) | `simplefoc_stepper_create("stepper", math_number(50), math_number(0))` | `StepperMotor stepper = StepperMotor(50);` |
| `simplefoc_motor_init` | Statement | MOTOR(field_variable) | `simplefoc_motor_init(variables_get($motor))` | `motor.init();` |
| `simplefoc_motor_initfoc` | Statement | MOTOR(field_variable) | `simplefoc_motor_initfoc(variables_get($motor))` | `motor.initFOC();` |
| `simplefoc_motor_enable` | Statement | MOTOR(field_variable) | `simplefoc_motor_enable(variables_get($motor))` | `motor.enable();` |
| `simplefoc_motor_disable` | Statement | MOTOR(field_variable) | `simplefoc_motor_disable(variables_get($motor))` | `motor.disable();` |
| `simplefoc_motor_link_driver` | Statement | MOTOR(field_variable), DRIVER(field_variable) | `simplefoc_motor_link_driver(variables_get($motor), variables_get($driver))` | `motor.linkDriver(&driver);` |
| `simplefoc_motor_link_sensor` | Statement | MOTOR(field_variable), SENSOR(field_variable) | `simplefoc_motor_link_sensor(variables_get($motor), variables_get($encoder))` | `motor.linkSensor(&encoder);` |
| `simplefoc_motor_link_current_sense` | Statement | MOTOR(field_variable), CURRENT_SENSE(field_variable) | `simplefoc_motor_link_current_sense(variables_get($motor), variables_get($current_sense))` | `motor.linkCurrentSense(&current_sense);` |
| `simplefoc_motor_get_angle` | Value | MOTOR(field_variable) | `simplefoc_motor_get_angle(variables_get($motor))` | `motor.shaftAngle()` |
| `simplefoc_motor_get_velocity` | Value | MOTOR(field_variable) | `simplefoc_motor_get_velocity(variables_get($motor))` | `motor.shaftVelocity()` |

### Control

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_motor_set_controller` | Statement | MOTOR(field_variable), MODE(field_dropdown) | `simplefoc_motor_set_controller(variables_get($motor), velocity)` | `motor.controller = MotionControlType::velocity;` |
| `simplefoc_motor_set_torque` | Statement | MOTOR(field_variable), MODE(field_dropdown) | `simplefoc_motor_set_torque(variables_get($motor), voltage)` | `motor.torque_controller = TorqueControlType::voltage;` |
| `simplefoc_motor_move` | Statement | MOTOR(field_variable), TARGET(input_value) | `simplefoc_motor_move(variables_get($motor), math_number(2))` | `motor.move(2);` |
| `simplefoc_motor_loopfoc` | Statement | MOTOR(field_variable) | `simplefoc_motor_loopfoc(variables_get($motor))` | `motor.loopFOC();` (auto-added to loop) |
| `simplefoc_motor_set_limits` | Statement | MOTOR(field_variable), VOLTAGE_LIMIT(input_value), CURRENT_LIMIT(input_value) | `simplefoc_motor_set_limits(variables_get($motor), math_number(12), math_number(2))` | `motor.voltage_limit = 12; motor.current_limit = 2;` |

### PID Tuning

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_motor_pid_velocity` | Statement | MOTOR(field_variable), P(input_value), I(input_value), D(input_value), RAMP(input_value), LIMIT(input_value) | `simplefoc_motor_pid_velocity(variables_get($motor), math_number(0.5), math_number(10), math_number(0), math_number(0), math_number(12))` | `motor.PID_velocity.P = 0.5; ...` |
| `simplefoc_motor_pid_angle` | Statement | MOTOR(field_variable), P(input_value), VEL_LIMIT(input_value) | `simplefoc_motor_pid_angle(variables_get($motor), math_number(20), math_number(20))` | `motor.P_angle.P = 20; motor.velocity_limit = 20;` |
| `simplefoc_motor_pid_current` | Statement | MOTOR(field_variable), P(input_value), I(input_value), D(input_value), LIMIT(input_value) | `simplefoc_motor_pid_current(variables_get($motor), math_number(3), math_number(300), math_number(0), math_number(12))` | `motor.PID_current_q.P = 3; ...` |

### Drivers

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_driver_3pwm_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), PIN_C(input_value), ENABLE(input_value) | `simplefoc_driver_3pwm_create("driver", math_number(9), math_number(10), math_number(11), math_number(8))` | `BLDCDriver3PWM driver = BLDCDriver3PWM(9, 10, 11, 8);` |
| `simplefoc_driver_6pwm_create` | Statement | VAR(field_input), PIN_AH(input_value), PIN_AL(input_value), PIN_BH(input_value), PIN_BL(input_value), PIN_CH(input_value), PIN_CL(input_value) | `simplefoc_driver_6pwm_create("driver", math_number(9), math_number(8), math_number(10), math_number(12), math_number(11), math_number(13))` | `BLDCDriver6PWM driver = BLDCDriver6PWM(9, 8, 10, 12, 11, 13);` |
| `simplefoc_driver_init` | Statement | DRIVER(field_variable), VOLTAGE(input_value) | `simplefoc_driver_init(variables_get($driver), math_number(12))` | `driver.voltage_power_supply = 12; driver.init();` |

### Sensors

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_encoder_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), CPR(input_value) | `simplefoc_encoder_create("encoder", math_number(2), math_number(3), math_number(2048))` | `Encoder encoder = Encoder(2, 3, 2048);` |
| `simplefoc_magnetic_spi_create` | Statement | VAR(field_input), CS(input_value) | `simplefoc_magnetic_spi_create("sensor", math_number(10))` | `MagneticSensorSPI sensor = MagneticSensorSPI(10);` |
| `simplefoc_magnetic_i2c_create` | Statement | VAR(field_input), ADDRESS(input_value) | `simplefoc_magnetic_i2c_create("sensor", math_number(54))` | `MagneticSensorI2C sensor = MagneticSensorI2C(0x36);` |
| `simplefoc_sensor_init` | Statement | SENSOR(field_variable) | `simplefoc_sensor_init(variables_get($encoder))` | `encoder.init();` |
| `simplefoc_encoder_enable_interrupts` | Statement | SENSOR(field_variable) | `simplefoc_encoder_enable_interrupts(variables_get($encoder))` | `encoder.enableInterrupts(doA_encoder, doB_encoder);` |

### Current Sense

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `simplefoc_lowside_current_sense_create` | Statement | VAR(field_input), PIN_A(input_value), PIN_B(input_value), PIN_C(input_value), SHUNT_R(input_value), GAIN(input_value) | `simplefoc_lowside_current_sense_create("current_sense", math_number(0), math_number(1), math_number(2), math_number(0.01), math_number(50))` | `LowsideCurrentSense current_sense = LowsideCurrentSense(0.01, 50, 0, 1, 2);` |
| `simplefoc_current_sense_link_driver` | Statement | CURRENT_SENSE(field_variable), DRIVER(field_variable) | `simplefoc_current_sense_link_driver(variables_get($current_sense), variables_get($driver))` | `current_sense.linkDriver(&driver);` |
| `simplefoc_current_sense_init` | Statement | CURRENT_SENSE(field_variable) | `simplefoc_current_sense_init(variables_get($current_sense))` | `current_sense.init();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE (controller) | torque, velocity, angle, velocity_openloop, angle_openloop | Motion control mode |
| MODE (torque) | voltage, dc_current, foc_current, estimated_current | Torque control type |

## ABS Examples

### Velocity Control with Encoder

```abs
arduino_setup()
    simplefoc_bldc_create("motor", math_number(11), math_number(0), math_number(0))
    simplefoc_driver_3pwm_create("driver", math_number(9), math_number(10), math_number(11), math_number(8))
    simplefoc_encoder_create("encoder", math_number(2), math_number(3), math_number(2048))
    
    simplefoc_motor_link_driver(variables_get($motor), variables_get($driver))
    simplefoc_motor_link_sensor(variables_get($motor), variables_get($encoder))
    
    simplefoc_driver_init(variables_get($driver), math_number(12))
    simplefoc_sensor_init(variables_get($encoder))
    simplefoc_encoder_enable_interrupts(variables_get($encoder))
    
    simplefoc_motor_set_controller(variables_get($motor), velocity)
    simplefoc_motor_init(variables_get($motor))
    simplefoc_motor_initfoc(variables_get($motor))
    simplefoc_motor_enable(variables_get($motor))

arduino_loop()
    simplefoc_motor_loopfoc(variables_get($motor))
    simplefoc_motor_move(variables_get($motor), math_number(2))
```

### Position Control

```abs
arduino_setup()
    simplefoc_bldc_create("motor", math_number(7), math_number(0), math_number(0))
    simplefoc_driver_3pwm_create("driver", math_number(9), math_number(10), math_number(11), math_number(8))
    simplefoc_magnetic_i2c_create("sensor", math_number(54))
    
    simplefoc_motor_link_driver(variables_get($motor), variables_get($driver))
    simplefoc_motor_link_sensor(variables_get($motor), variables_get($sensor))
    
    simplefoc_driver_init(variables_get($driver), math_number(12))
    simplefoc_sensor_init(variables_get($sensor))
    
    simplefoc_motor_set_controller(variables_get($motor), angle)
    simplefoc_motor_pid_angle(variables_get($motor), math_number(20), math_number(10))
    simplefoc_motor_init(variables_get($motor))
    simplefoc_motor_initfoc(variables_get($motor))
    simplefoc_motor_enable(variables_get($motor))

arduino_loop()
    simplefoc_motor_loopfoc(variables_get($motor))
    simplefoc_motor_move(variables_get($motor), math_number(1.57))
```

## Notes

1. **Variable creation**: Motor/driver/sensor blocks create variables; reference with `variables_get($name)`
2. **FOC loop**: `simplefoc_motor_loopfoc` auto-adds to loop begin - call it once per motor
3. **Init order**: Driver → Sensor → Motor init → FOC init → Enable
4. **Encoder interrupts**: Required for encoders, auto-generates interrupt handlers
5. **Control modes**: Set controller mode BEFORE `motor.init()`

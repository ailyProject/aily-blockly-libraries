# MD40 motor drive

Emakefun MD40 four-way motor driver module supports DC mode and encoder mode, I2C communication

## Library Info
- **Name**: @aily-project/lib-emakefun-md40
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `md40_init` | Statement | VAR(field_input), I2C_PORT(dropdown), I2C_ADDR(dropdown) | `md40_init("md40", I2C_PORT, "0x16")` | Dynamic code |
| `md40_set_dc_mode` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_set_dc_mode(variables_get($md40), "0")` | Dynamic code |
| `md40_set_encoder_mode` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), PPR(input_value), REDUCTION(input_value), PHASE(dropdown) | `md40_set_encoder_mode(variables_get($md40), "0", math_number(0), math_number(0), em::Md40::Motor::PhaseRelation::kAPhaseLeads)` | Dynamic code |
| `md40_set_speed_pid` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), P(input_value), I(input_value), D(input_value) | `md40_set_speed_pid(variables_get($md40), "0", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `md40_set_position_pid` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), P(input_value), I(input_value), D(input_value) | `md40_set_position_pid(variables_get($md40), "0", math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `md40_run_pwm_duty` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), PWM_DUTY(input_value) | `md40_run_pwm_duty(variables_get($md40), "0", math_number(0))` | Dynamic code |
| `md40_run_speed` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), RPM(input_value) | `md40_run_speed(variables_get($md40), "0", math_number(0))` | Dynamic code |
| `md40_move_to` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), POSITION(input_value), SPEED(input_value) | `md40_move_to(variables_get($md40), "0", math_number(0), math_number(9600))` | Dynamic code |
| `md40_move` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), OFFSET(input_value), SPEED(input_value) | `md40_move(variables_get($md40), "0", math_number(0), math_number(9600))` | Dynamic code |
| `md40_stop` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_stop(variables_get($md40), "0")` | Dynamic code |
| `md40_reset` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_reset(variables_get($md40), "0")` | Dynamic code |
| `md40_set_position` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), POSITION(input_value) | `md40_set_position(variables_get($md40), "0", math_number(0))` | Dynamic code |
| `md40_set_pulse_count` | Statement | VAR(field_variable), MOTOR_INDEX(dropdown), PULSE_COUNT(input_value) | `md40_set_pulse_count(variables_get($md40), "0", math_number(0))` | Dynamic code |
| `md40_get_speed` | Value | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_speed(variables_get($md40), "0")` | Dynamic code |
| `md40_get_position` | Value | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_position(variables_get($md40), "0")` | Dynamic code |
| `md40_get_pulse_count` | Value | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_pulse_count(variables_get($md40), "0")` | Dynamic code |
| `md40_get_pwm_duty` | Value | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_pwm_duty(variables_get($md40), "0")` | Dynamic code |
| `md40_get_state` | Value | VAR(field_variable), MOTOR_INDEX(dropdown) | `md40_get_state(variables_get($md40), "0")` | static_cast<uint8_t>( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDR | 0x16, 0x17, 0x18, 0x19 | md40_init |
| MOTOR_INDEX | 0, 1, 2, 3 | md40_set_dc_mode, md40_set_encoder_mode, md40_set_speed_pid |
| PHASE | em::Md40::Motor::PhaseRelation::kAPhaseLeads, em::Md40::Motor::PhaseRelation::kBPhaseLeads | md40_set_encoder_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    md40_init("md40", I2C_PORT, "0x16")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, md40_get_speed(variables_get($md40), "0"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `md40_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

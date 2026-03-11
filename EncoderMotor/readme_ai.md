# 编码电机

ESP32编码电机驱动库，支持PWM控制和速度环PID控制

## Library Info
- **Name**: @aily-project/lib-encoder-motor
- **Version**: 1.1.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `encoder_motor_create` | Statement | VAR(field_input), POS_PIN(input_value), NEG_PIN(input_value), A_PIN(input_value), B_PIN(input_value), PPR(input_value), REDUCTION(input_value), PHASE(dropdown) | `encoder_motor_create("motor1", math_number(2), math_number(2), math_number(2), math_number(2), math_number(0), math_number(0), em::EncoderMotor::kAPhaseLeads)` | `` |
| `encoder_motor_set_pid` | Statement | VAR(field_variable), P(input_value), I(input_value), D(input_value) | `encoder_motor_set_pid(variables_get($motor1), math_number(0), math_number(0), math_number(0))` | `....SetSpeedPid(..., ..., ...);\n` |
| `encoder_motor_run_pwm` | Statement | VAR(field_variable), PWM(input_value) | `encoder_motor_run_pwm(variables_get($motor1), math_number(0))` | `....RunPwmDuty(constrain(..., -1023, 1023));\n` |
| `encoder_motor_run_speed` | Statement | VAR(field_variable), SPEED(input_value) | `encoder_motor_run_speed(variables_get($motor1), math_number(9600))` | `....RunSpeed(constrain(..., -300, 300));\n` |
| `encoder_motor_stop` | Statement | VAR(field_variable) | `encoder_motor_stop(variables_get($motor1))` | `....Stop();\n` |
| `encoder_motor_get_speed` | Value | VAR(field_variable) | `encoder_motor_get_speed(variables_get($motor1))` | `....SpeedRpm()` |
| `encoder_motor_get_pwm` | Value | VAR(field_variable) | `encoder_motor_get_pwm(variables_get($motor1))` | `....PwmDuty()` |
| `encoder_motor_get_pulse` | Value | VAR(field_variable) | `encoder_motor_get_pulse(variables_get($motor1))` | `....EncoderPulseCount()` |
| `encoder_motor_get_revolutions` | Value | VAR(field_variable) | `encoder_motor_get_revolutions(variables_get($motor1))` | `....GetRevolutions()` |
| `encoder_motor_reset_pulse` | Statement | VAR(field_variable) | `encoder_motor_reset_pulse(variables_get($motor1))` | `....ResetPulseCount();\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PHASE | em::EncoderMotor::kAPhaseLeads, em::EncoderMotor::kBPhaseLeads | A相领先 / B相领先 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    encoder_motor_create("motor1", math_number(2), math_number(2), math_number(2), math_number(2), math_number(0), math_number(0), em::EncoderMotor::kAPhaseLeads)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, encoder_motor_get_speed(variables_get($motor1)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `encoder_motor_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

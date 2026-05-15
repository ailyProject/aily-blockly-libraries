# PID controller library

The optimized PID controller library provides functions such as quick setup, parameter preset, temperature control, motor speed regulation, etc., and supports various Arduino development boards.

## Library Info
- **Name**: @aily-project/lib-pid
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pid_init` | Statement | PID_NAME(field_variable), INPUT(field_variable), OUTPUT(field_variable), SETPOINT(field_variable), PRESET(dropdown), KP(field_number), KI(field_number), KD(f... | `pid_init(variables_get($myPID), variables_get($input), variables_get($output), variables_get($setpoint), custom, 2, 5, 1, DIRECT)` | Dynamic code |
| `pid_quick_setup` | Statement | INPUT_PIN(dropdown), OUTPUT_PIN(dropdown), SETPOINT(input_value), APPLICATION(dropdown) | `pid_quick_setup(INPUT_PIN, OUTPUT_PIN, math_number(0), temperature)` | quickPidInput = analogRead(...);\nquickPID.Compute();\nanalogWrite(..., quickPidOutput);\n |
| `pid_compute` | Statement | PID_NAME(field_variable) | `pid_compute(variables_get($myPID))` | See generator |
| `pid_control_loop` | Statement | PID_NAME(field_variable), READ_INPUT(input_statement), WRITE_OUTPUT(input_statement) | `pid_control_loop(variables_get($myPID)) @READ_INPUT: child_block() @WRITE_OUTPUT: child_block()` | .......Compute();\n... |
| `pid_temperature_control` | Statement | TEMP_PIN(dropdown), HEATER_PIN(dropdown), TARGET_TEMP(input_value) | `pid_temperature_control(TEMP_PIN, HEATER_PIN, math_number(0))` | tempInput = readTemperature(...);\ntempPID.Compute();\nanalogWrite(..., tempOutput);\n |
| `pid_motor_speed_control` | Statement | ENCODER_PIN(dropdown), MOTOR_PIN(dropdown), TARGET_RPM(input_value) | `pid_motor_speed_control(ENCODER_PIN, MOTOR_PIN, math_number(0))` | motorInput = calculateRPM();\nmotorPID.Compute();\nanalogWrite(..., motorOutput);\n |
| `pid_set_mode` | Statement | PID_NAME(field_variable), MODE(dropdown) | `pid_set_mode(variables_get($myPID), AUTOMATIC)` | See generator |
| `pid_set_tunings` | Statement | PID_NAME(field_variable), KP(input_value), KI(input_value), KD(input_value) | `pid_set_tunings(variables_get($myPID), math_number(0), math_number(0), math_number(0))` | See generator |
| `pid_set_output_limits` | Statement | PID_NAME(field_variable), MIN(input_value), MAX(input_value) | `pid_set_output_limits(variables_get($myPID), math_number(0), math_number(0))` | See generator |
| `pid_get_input` | Value | INPUT(field_variable) | `pid_get_input(variables_get($input))` | Dynamic code |
| `pid_get_output` | Value | OUTPUT(field_variable) | `pid_get_output(variables_get($output))` | Dynamic code |
| `pid_set_setpoint` | Statement | SETPOINT(field_variable), VALUE(input_value) | `pid_set_setpoint(variables_get($setpoint), math_number(0))` | ... = ...;\n |
| `pid_set_input` | Statement | INPUT(field_variable), VALUE(input_value) | `pid_set_input(variables_get($input), math_number(0))` | ... = ...;\n |
| `pid_adaptive_control` | Statement | PID_NAME(field_variable), INPUT(field_variable), SETPOINT(field_variable), THRESHOLD(field_number), AGG_KP(field_number), AGG_KI(field_number), AGG_KD(field_... | `pid_adaptive_control(variables_get($myPID), variables_get($input), variables_get($setpoint), 10, 4, 0.2, 1, 1, 0.05, 0.25)` | double gap_... = abs(... - ...); if (gap_... < ...) { ....SetTunings(consKp_..., consKi_.. |
| `pid_is_at_setpoint` | Value | INPUT(field_variable), SETPOINT(field_variable), TOLERANCE(field_number) | `pid_is_at_setpoint(variables_get($input), variables_get($setpoint), 5)` | abs(... - ...) <= ... |
| `pid_get_error` | Value | INPUT(field_variable), SETPOINT(field_variable) | `pid_get_error(variables_get($input), variables_get($setpoint))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PRESET | custom, temperature, motor_speed, position, level | pid_init |
| DIRECTION | DIRECT, REVERSE | pid_init |
| APPLICATION | temperature, motor_speed, position, level, custom | pid_quick_setup |
| MODE | AUTOMATIC, MANUAL | pid_set_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pid_init(variables_get($myPID), variables_get($input), variables_get($output), variables_get($setpoint), custom, 2, 5, 1, DIRECT)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pid_get_input(variables_get($input)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `pid_init` may add fields at runtime through Blockly extensions.

# 步进电机驱动

AccelStepper库的Blockly封装，支持带加速度控制的步进电机，以及多电机同步控制。

## Library Info
- **Name**: @aily-project/lib-accelstepper
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `accelstepper_setup` | Statement | VAR(field_input), INTERFACE(dropdown), PIN1(input_value), PIN2(input_value), PIN3(input_value), PIN4(input_value) | `accelstepper_setup("stepper", 4, math_number(2), math_number(2), math_number(2), math_number(2))` | (dynamic code) |
| `accelstepper_setup_driver` | Statement | VAR(field_input), PIN_STEP(input_value), PIN_DIR(input_value) | `accelstepper_setup_driver("stepper", math_number(2), math_number(2))` | (dynamic code) |
| `accelstepper_move_to` | Statement | VAR(field_variable), POSITION(input_value) | `accelstepper_move_to(variables_get($stepper), math_number(0))` | (dynamic code) |
| `accelstepper_move` | Statement | VAR(field_variable), STEPS(input_value) | `accelstepper_move(variables_get($stepper), math_number(0))` | (dynamic code) |
| `accelstepper_run` | Statement | VAR(field_variable) | `accelstepper_run(variables_get($stepper))` | (dynamic code) |
| `accelstepper_run_speed` | Statement | VAR(field_variable) | `accelstepper_run_speed(variables_get($stepper))` | (dynamic code) |
| `accelstepper_stop` | Statement | VAR(field_variable) | `accelstepper_stop(variables_get($stepper))` | (dynamic code) |
| `accelstepper_set_max_speed` | Statement | VAR(field_variable), SPEED(input_value) | `accelstepper_set_max_speed(variables_get($stepper), math_number(9600))` | (dynamic code) |
| `accelstepper_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `accelstepper_set_speed(variables_get($stepper), math_number(9600))` | (dynamic code) |
| `accelstepper_get_speed` | Value | VAR(field_variable) | `accelstepper_get_speed(variables_get($stepper))` | (dynamic code) |
| `accelstepper_set_acceleration` | Statement | VAR(field_variable), ACCEL(input_value) | `accelstepper_set_acceleration(variables_get($stepper), math_number(0))` | (dynamic code) |
| `accelstepper_get_current_position` | Value | VAR(field_variable) | `accelstepper_get_current_position(variables_get($stepper))` | (dynamic code) |
| `accelstepper_set_current_position` | Statement | VAR(field_variable), POSITION(input_value) | `accelstepper_set_current_position(variables_get($stepper), math_number(0))` | (dynamic code) |
| `accelstepper_distance_to_go` | Value | VAR(field_variable) | `accelstepper_distance_to_go(variables_get($stepper))` | (dynamic code) |
| `accelstepper_is_running` | Value | VAR(field_variable) | `accelstepper_is_running(variables_get($stepper))` | (dynamic code) |
| `accelstepper_enable_outputs` | Statement | VAR(field_variable) | `accelstepper_enable_outputs(variables_get($stepper))` | (dynamic code) |
| `accelstepper_disable_outputs` | Statement | VAR(field_variable) | `accelstepper_disable_outputs(variables_get($stepper))` | (dynamic code) |
| `accelstepper_run_to_position` | Statement | VAR(field_variable) | `accelstepper_run_to_position(variables_get($stepper))` | (dynamic code) |
| `accelstepper_run_to_new_position` | Statement | VAR(field_variable), POSITION(input_value) | `accelstepper_run_to_new_position(variables_get($stepper), math_number(0))` | (dynamic code) |
| `accelstepper_run_speed_to_position` | Statement | VAR(field_variable) | `accelstepper_run_speed_to_position(variables_get($stepper))` | (dynamic code) |
| `accelstepper_set_enable_pin` | Statement | VAR(field_variable), PIN(input_value) | `accelstepper_set_enable_pin(variables_get($stepper), math_number(2))` | (dynamic code) |
| `multistepper_create` | Statement | VAR(field_input) | `multistepper_create("steppers")` | (dynamic code) |
| `multistepper_add_stepper` | Statement | STEPPER(field_variable), VAR(field_variable) | `multistepper_add_stepper(variables_get($stepper), variables_get($steppers))` | (dynamic code) |
| `multistepper_move_to` | Statement | VAR(field_variable), POSITIONS(input_value) | `multistepper_move_to(variables_get($steppers), math_number(0))` | (dynamic code) |
| `multistepper_move_to_2` | Statement | VAR(field_variable), POS1(input_value), POS2(input_value) | `multistepper_move_to_2(variables_get($steppers), math_number(0), math_number(0))` | `long positions_2[] = {` |
| `multistepper_move_to_3` | Statement | VAR(field_variable), POS1(input_value), POS2(input_value), POS3(input_value) | `multistepper_move_to_3(variables_get($steppers), math_number(0), math_number(0), math_number(0))` | `long positions_3[] = {` |
| `multistepper_move_to_4` | Statement | VAR(field_variable), POS1(input_value), POS2(input_value), POS3(input_value), POS4(input_value) | `multistepper_move_to_4(variables_get($steppers), math_number(0), math_number(0), math_number(0), math_number(0))` | `long positions_4[] = {` |
| `multistepper_run` | Statement | VAR(field_variable) | `multistepper_run(variables_get($steppers))` | (dynamic code) |
| `multistepper_run_speed_to_position` | Statement | VAR(field_variable) | `multistepper_run_speed_to_position(variables_get($steppers))` | (dynamic code) |
| `multistepper_positions_array` | Value | INPUT0(input_value) | `multistepper_positions_array(math_number(0))` | `{` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INTERFACE | 4, 2, 3, 6, 8 | 4线全步 / 2线全步 / 3线全步 / 3线半步 / 4线半步 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    accelstepper_setup("stepper", 4, math_number(2), math_number(2), math_number(2), math_number(2))
    accelstepper_setup_driver("stepper", math_number(2), math_number(2))
    multistepper_create("steppers")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, accelstepper_get_speed(variables_get($stepper)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `accelstepper_setup("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

# ServoEasing

Smooth servo movement with easing, speed control, callbacks, and synchronized multi-servo moves.

## Library Info
- **Name**: @aily-project/lib-servoeasing
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `servoeasing_create` | Statement | VAR(field_input), PIN(dropdown), INITIAL(input_value) | `servoeasing_create("servoEase", PIN, math_number(0))` | Dynamic code |
| `servoeasing_create_custom` | Statement | VAR(field_input), PIN(dropdown), INITIAL(input_value), LOW_US(input_value), HIGH_US(input_value), LOW_DEGREE(input_value), HIGH_DEGREE(input_value) | `servoeasing_create_custom("servoEase", PIN, math_number(0), math_number(0), math_number(0), math_number(90), math_number(90))` | Dynamic code |
| `servoeasing_set_easing` | Statement | VAR(field_variable), EASING(dropdown) | `servoeasing_set_easing(variables_get($servoEase), EASE_LINEAR)` | Dynamic code |
| `servoeasing_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `servoeasing_set_speed(variables_get($servoEase), math_number(9600))` | Dynamic code |
| `servoeasing_write` | Statement | VAR(field_variable), TARGET(input_value) | `servoeasing_write(variables_get($servoEase), math_number(0))` | Dynamic code |
| `servoeasing_ease_to` | Statement | VAR(field_variable), TARGET(input_value), SPEED(input_value) | `servoeasing_ease_to(variables_get($servoEase), math_number(0), math_number(9600))` | Dynamic code |
| `servoeasing_ease_to_duration` | Statement | VAR(field_variable), TARGET(input_value), DURATION(input_value) | `servoeasing_ease_to_duration(variables_get($servoEase), math_number(0), math_number(1000))` | Dynamic code |
| `servoeasing_start_ease_to` | Statement | VAR(field_variable), TARGET(input_value), SPEED(input_value), UPDATE(dropdown) | `servoeasing_start_ease_to(variables_get($servoEase), math_number(0), math_number(9600), START_UPDATE_BY_INTERRUPT)` | Dynamic code |
| `servoeasing_start_ease_to_duration` | Statement | VAR(field_variable), TARGET(input_value), DURATION(input_value), UPDATE(dropdown) | `servoeasing_start_ease_to_duration(variables_get($servoEase), math_number(0), math_number(1000), START_UPDATE_BY_INTERRUPT)` | Dynamic code |
| `servoeasing_update` | Value | VAR(field_variable) | `servoeasing_update(variables_get($servoEase))` | Dynamic code |
| `servoeasing_is_moving` | Value | VAR(field_variable) | `servoeasing_is_moving(variables_get($servoEase))` | Dynamic code |
| `servoeasing_read` | Value | VAR(field_variable) | `servoeasing_read(variables_get($servoEase))` | Dynamic code |
| `servoeasing_current_microseconds` | Value | VAR(field_variable) | `servoeasing_current_microseconds(variables_get($servoEase))` | Dynamic code |
| `servoeasing_get_speed` | Value | VAR(field_variable) | `servoeasing_get_speed(variables_get($servoEase))` | Dynamic code |
| `servoeasing_get_move_duration` | Value | VAR(field_variable) | `servoeasing_get_move_duration(variables_get($servoEase))` | Dynamic code |
| `servoeasing_stop` | Statement | VAR(field_variable) | `servoeasing_stop(variables_get($servoEase))` | Dynamic code |
| `servoeasing_pause` | Statement | VAR(field_variable) | `servoeasing_pause(variables_get($servoEase))` | Dynamic code |
| `servoeasing_resume` | Statement | VAR(field_variable), MODE(dropdown) | `servoeasing_resume(variables_get($servoEase), INTERRUPTS)` | Dynamic code |
| `servoeasing_detach` | Statement | VAR(field_variable) | `servoeasing_detach(variables_get($servoEase))` | Dynamic code |
| `servoeasing_reattach` | Statement | VAR(field_variable) | `servoeasing_reattach(variables_get($servoEase))` | Dynamic code |
| `servoeasing_set_trim` | Statement | VAR(field_variable), TRIM(input_value), WRITE_NOW(dropdown) | `servoeasing_set_trim(variables_get($servoEase), math_number(0), TRUE)` | Dynamic code |
| `servoeasing_set_reverse` | Statement | VAR(field_variable), ENABLE(dropdown) | `servoeasing_set_reverse(variables_get($servoEase), TRUE)` | Dynamic code |
| `servoeasing_set_min_max` | Statement | VAR(field_variable), MINIMUM(input_value), MAXIMUM(input_value) | `servoeasing_set_min_max(variables_get($servoEase), math_number(0), math_number(0))` | Dynamic code |
| `servoeasing_on_reached` | Hat | VAR(field_variable), HANDLER(input_statement) | `servoeasing_on_reached(variables_get($servoEase)) @HANDLER: child_block()` | Dynamic code |
| `servoeasing_all_set_easing` | Statement | EASING(dropdown) | `servoeasing_all_set_easing(EASE_LINEAR)` | setEasingTypeForAllServos( |
| `servoeasing_all_set_speed` | Statement | SPEED(input_value) | `servoeasing_all_set_speed(math_number(9600))` | setSpeedForAllServos( |
| `servoeasing_all_set_targets_2` | Statement | TARGET1(input_value), TARGET2(input_value) | `servoeasing_all_set_targets_2(math_number(0), math_number(0))` | setFloatDegreeForAllServos(2, |
| `servoeasing_all_set_targets_3` | Statement | TARGET1(input_value), TARGET2(input_value), TARGET3(input_value) | `servoeasing_all_set_targets_3(math_number(0), math_number(0), math_number(0))` | setFloatDegreeForAllServos(3, |
| `servoeasing_all_set_targets_4` | Statement | TARGET1(input_value), TARGET2(input_value), TARGET3(input_value), TARGET4(input_value) | `servoeasing_all_set_targets_4(math_number(0), math_number(0), math_number(0), math_number(0))` | setFloatDegreeForAllServos(4, |
| `servoeasing_all_start_synchronized` | Statement | SPEED(input_value) | `servoeasing_all_start_synchronized(math_number(9600))` | setEaseToForAllServosSynchronizeAndStartInterrupt( |
| `servoeasing_all_wait_synchronized` | Statement | SPEED(input_value) | `servoeasing_all_wait_synchronized(math_number(9600))` | setEaseToForAllServosSynchronizeAndWaitForAllServosToStop( |
| `servoeasing_all_update` | Value | (none) | `servoeasing_all_update()` | updateAllServos() |
| `servoeasing_all_is_moving` | Value | (none) | `servoeasing_all_is_moving()` | isOneServoMoving() |
| `servoeasing_all_stop` | Statement | (none) | `servoeasing_all_stop()` | stopAllServos();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| EASING | EASE_LINEAR, EASE_QUADRATIC_IN_OUT, EASE_QUADRATIC_IN, EASE_QUADRATIC_OUT, EASE_CUBIC_IN_OUT, EASE_CUBIC_IN, EASE_CUBIC_OUT, EASE_QUARTIC_IN_OUT, EASE_SINE_IN_OUT, EASE_CIRCULAR_IN_OUT, EASE_BACK_OUT, EASE_ELASTIC_OUT... | servoeasing_set_easing |
| UPDATE | START_UPDATE_BY_INTERRUPT, DO_NOT_START_UPDATE_BY_INTERRUPT | servoeasing_start_ease_to, servoeasing_start_ease_to_duration |
| MODE | INTERRUPTS, MANUAL | servoeasing_resume |
| WRITE_NOW | TRUE, FALSE | servoeasing_set_trim |
| ENABLE | TRUE, FALSE | servoeasing_set_reverse |
| EASING | EASE_LINEAR, EASE_QUADRATIC_IN_OUT, EASE_CUBIC_IN_OUT, EASE_SINE_IN_OUT, EASE_BOUNCE_OUT, EASE_PRECISION_OUT | servoeasing_all_set_easing |

## ABS Examples

### Basic Usage
```
arduino_setup()
    servoeasing_create("servoEase", PIN, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, servoeasing_update(variables_get($servoEase)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `servoeasing_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun L6470 AutoDriver

Blockly wrapper for the SparkFun L6470 AutoDriver stepper motor driver.

## Library Info
- **Name**: @aily-project/lib-sparkfun-autodriver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `autodriver_init` | Statement | VAR(field_input), POSITION(field_number), CS(field_number), RESET(field_number), BUSY(field_number) | `autodriver_init("motor", 0, 10, 6, 7)` | pinMode( |
| `autodriver_config_step_mode` | Statement | VAR(field_variable), STEP_MODE(dropdown) | `autodriver_config_step_mode(variables_get($motor), STEP_FS)` | Dynamic code |
| `autodriver_set_speed` | Statement | VAR(field_variable), TARGET(dropdown), SPEED(input_value) | `autodriver_set_speed(variables_get($motor), MAX, math_number(9600))` | Dynamic code |
| `autodriver_set_accel` | Statement | VAR(field_variable), TARGET(dropdown), VALUE(input_value) | `autodriver_set_accel(variables_get($motor), ACC, math_number(0))` | Dynamic code |
| `autodriver_set_kval` | Statement | VAR(field_variable), TYPE(dropdown), VALUE(input_value) | `autodriver_set_kval(variables_get($motor), RUN, math_number(0))` | Dynamic code |
| `autodriver_run` | Statement | VAR(field_variable), DIR(dropdown), SPEED(input_value) | `autodriver_run(variables_get($motor), FWD, math_number(9600))` | Dynamic code |
| `autodriver_move` | Statement | VAR(field_variable), DIR(dropdown), STEPS(input_value) | `autodriver_move(variables_get($motor), FWD, math_number(0))` | Dynamic code |
| `autodriver_go_to` | Statement | VAR(field_variable), POSITION(input_value) | `autodriver_go_to(variables_get($motor), math_number(0))` | Dynamic code |
| `autodriver_get_position` | Value | VAR(field_variable) | `autodriver_get_position(variables_get($motor))` | Dynamic code |
| `autodriver_get_status` | Value | VAR(field_variable) | `autodriver_get_status(variables_get($motor))` | Dynamic code |
| `autodriver_stop` | Statement | VAR(field_variable), TYPE(dropdown) | `autodriver_stop(variables_get($motor), SOFT)` | Dynamic code |
| `autodriver_hiz` | Statement | VAR(field_variable), TYPE(dropdown) | `autodriver_hiz(variables_get($motor), SOFT)` | Dynamic code |
| `autodriver_reset_position` | Statement | VAR(field_variable) | `autodriver_reset_position(variables_get($motor))` | Dynamic code |
| `autodriver_reset_device` | Statement | VAR(field_variable) | `autodriver_reset_device(variables_get($motor))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STEP_MODE | STEP_FS, STEP_FS_2, STEP_FS_4, STEP_FS_8, STEP_FS_16, STEP_FS_32, STEP_FS_64, STEP_FS_128 | autodriver_config_step_mode |
| TARGET | MAX, MIN, FULL | autodriver_set_speed |
| TARGET | ACC, DEC | autodriver_set_accel |
| TYPE | RUN, ACC, DEC, HOLD | autodriver_set_kval |
| DIR | FWD, REV | autodriver_run, autodriver_move |
| TYPE | SOFT, HARD | autodriver_stop, autodriver_hiz |

## ABS Examples

### Basic Usage
```
arduino_setup()
    autodriver_init("motor", 0, 10, 6, 7)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, autodriver_get_position(variables_get($motor)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `autodriver_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

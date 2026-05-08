# SparkFun L6470 AutoDriver

Stepper motor driver blocks for SparkFun AutoDriver based on L6470.

## Library Info
- **Name**: @aily-project/lib-sparkfun-autodriver
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `autodriver_init` | Statement | VAR(field_input), POSITION(field_number), CS(field_number), RESET(field_number), BUSY(field_number) | `autodriver_init("motor", 0, 10, 6, 7)` | `AutoDriver motor(0, 10, 6, 7); motor.SPIPortConnect(&SPI);` |
| `autodriver_config_step_mode` | Statement | VAR(field_variable), STEP_MODE(dropdown) | `autodriver_config_step_mode(variables_get($motor), STEP_FS_16)` | `motor.configStepMode(STEP_FS_16);` |
| `autodriver_set_speed` | Statement | VAR(field_variable), TARGET(dropdown), SPEED(input_value) | `autodriver_set_speed(variables_get($motor), MAX, math_number(1000))` | `motor.setMaxSpeed(1000);` |
| `autodriver_set_accel` | Statement | VAR(field_variable), TARGET(dropdown), VALUE(input_value) | `autodriver_set_accel(variables_get($motor), ACC, math_number(1000))` | `motor.setAcc(1000);` |
| `autodriver_set_kval` | Statement | VAR(field_variable), TYPE(dropdown), VALUE(input_value) | `autodriver_set_kval(variables_get($motor), RUN, math_number(64))` | `motor.setRunKVAL(64);` |
| `autodriver_run` | Statement | VAR(field_variable), DIR(dropdown), SPEED(input_value) | `autodriver_run(variables_get($motor), FWD, math_number(500))` | `motor.run(FWD, 500);` |
| `autodriver_move` | Statement | VAR(field_variable), DIR(dropdown), STEPS(input_value) | `autodriver_move(variables_get($motor), FWD, math_number(200))` | `motor.move(FWD, 200);` |
| `autodriver_go_to` | Statement | VAR(field_variable), POSITION(input_value) | `autodriver_go_to(variables_get($motor), math_number(0))` | `motor.goTo(0);` |
| `autodriver_get_position` | Value | VAR(field_variable) | `autodriver_get_position(variables_get($motor))` | `motor.getPos()` |
| `autodriver_get_status` | Value | VAR(field_variable) | `autodriver_get_status(variables_get($motor))` | `motor.getStatus()` |
| `autodriver_stop` | Statement | VAR(field_variable), TYPE(dropdown) | `autodriver_stop(variables_get($motor), SOFT)` | `motor.softStop();` |
| `autodriver_hiz` | Statement | VAR(field_variable), TYPE(dropdown) | `autodriver_hiz(variables_get($motor), HARD)` | `motor.hardHiZ();` |
| `autodriver_reset_position` | Statement | VAR(field_variable) | `autodriver_reset_position(variables_get($motor))` | `motor.resetPos();` |
| `autodriver_reset_device` | Statement | VAR(field_variable) | `autodriver_reset_device(variables_get($motor))` | `motor.resetDev();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STEP_MODE | STEP_FS, STEP_FS_2, STEP_FS_4, STEP_FS_8, STEP_FS_16, STEP_FS_32, STEP_FS_64, STEP_FS_128 | Microstep mode |
| TARGET | MAX, MIN, FULL, ACC, DEC | Speed or acceleration target |
| TYPE | RUN, ACC, DEC, HOLD, SOFT, HARD | KVAL or stop/high-Z mode |
| DIR | FWD, REV | Direction |

## ABS Examples

```text
arduino_setup()
    autodriver_init("motor", 0, 10, 6, 7)
    autodriver_config_step_mode(variables_get($motor), STEP_FS_16)
    autodriver_set_speed(variables_get($motor), MAX, math_number(1000))

arduino_loop()
    autodriver_move(variables_get($motor), FWD, math_number(200))
    time_delay(math_number(1000))
```

## Notes

`autodriver_init("name", ...)` creates variable `$name`. Set board-specific SPI pins externally if your board requires it.
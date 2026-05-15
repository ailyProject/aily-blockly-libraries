# Grove TB6612FNG Motor Driver

Grove TB6612FNG motor driver module, supports driving two DC motors or one stepper motor, controlled via I2C communication

## Library Info
- **Name**: @aily-project/lib-seeed-tb6612fng
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tb6612fng_init` | Statement | VAR(field_input), ADDR(dropdown) | `tb6612fng_init("motor", "0x14")` | Dynamic code |
| `tb6612fng_dc_run` | Statement | VAR(field_variable), CHANNEL(dropdown), SPEED(input_value) | `tb6612fng_dc_run(variables_get($motor), MOTOR_CHA, math_number(9600))` | Dynamic code |
| `tb6612fng_dc_brake` | Statement | VAR(field_variable), CHANNEL(dropdown) | `tb6612fng_dc_brake(variables_get($motor), MOTOR_CHA)` | Dynamic code |
| `tb6612fng_dc_stop` | Statement | VAR(field_variable), CHANNEL(dropdown) | `tb6612fng_dc_stop(variables_get($motor), MOTOR_CHA)` | Dynamic code |
| `tb6612fng_stepper_run` | Statement | VAR(field_variable), MODE(dropdown), STEPS(input_value), RPM(input_value) | `tb6612fng_stepper_run(variables_get($motor), FULL_STEP, math_number(0), math_number(0))` | Dynamic code |
| `tb6612fng_stepper_stop` | Statement | VAR(field_variable) | `tb6612fng_stepper_stop(variables_get($motor))` | Dynamic code |
| `tb6612fng_stepper_keep_run` | Statement | VAR(field_variable), MODE(dropdown), RPM(input_value), DIR(dropdown) | `tb6612fng_stepper_keep_run(variables_get($motor), FULL_STEP, math_number(0), true)` | Dynamic code |
| `tb6612fng_standby` | Statement | VAR(field_variable) | `tb6612fng_standby(variables_get($motor))` | Dynamic code |
| `tb6612fng_not_standby` | Statement | VAR(field_variable) | `tb6612fng_not_standby(variables_get($motor))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x14, 0x15, 0x16, 0x17 | tb6612fng_init |
| CHANNEL | MOTOR_CHA, MOTOR_CHB | tb6612fng_dc_run, tb6612fng_dc_brake, tb6612fng_dc_stop |
| MODE | FULL_STEP, WAVE_DRIVE, HALF_STEP, MICRO_STEPPING | tb6612fng_stepper_run, tb6612fng_stepper_keep_run |
| DIR | true, false | tb6612fng_stepper_keep_run |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tb6612fng_init("motor", "0x14")
    serial_begin(Serial, 9600)

arduino_loop()
    tb6612fng_dc_run(variables_get($motor), MOTOR_CHA, math_number(9600))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tb6612fng_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

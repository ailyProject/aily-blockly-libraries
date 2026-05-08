# SparkFun CAP1203

Capacitive touch, swipe, interrupt, and power-button blocks for CAP1203.

## Library Info
- **Name**: @aily-project/lib-sparkfun-cap1203
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cap1203_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `cap1203_init("cap1203", CAP1203_I2C_ADDR)` | `CAP1203 cap1203; cap1203.begin(Wire, CAP1203_I2C_ADDR);` |
| `cap1203_is_ready` | Value | VAR(field_variable) | `cap1203_is_ready(variables_get($cap1203))` | `cap1203_ready` |
| `cap1203_is_connected` | Value | VAR(field_variable) | `cap1203_is_connected(variables_get($cap1203))` | `cap1203.isConnected()` |
| `cap1203_touched` | Value | VAR(field_variable), PAD(dropdown) | `cap1203_touched(variables_get($cap1203), LEFT)` | `cap1203.isLeftTouched()` |
| `cap1203_swipe` | Value | VAR(field_variable), DIRECTION(dropdown) | `cap1203_swipe(variables_get($cap1203), RIGHT)` | `cap1203.isRightSwipePulled()` |
| `cap1203_set_sensitivity` | Statement | VAR(field_variable), SENSITIVITY(dropdown) | `cap1203_set_sensitivity(variables_get($cap1203), SENSITIVITY_32X)` | `cap1203.setSensitivity(SENSITIVITY_32X);` |
| `cap1203_get_sensitivity` | Value | VAR(field_variable) | `cap1203_get_sensitivity(variables_get($cap1203))` | `cap1203.getSensitivity()` |
| `cap1203_set_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `cap1203_set_interrupt(variables_get($cap1203), ENABLE)` | `cap1203.setInterruptEnabled();` |
| `cap1203_clear_interrupt` | Statement | VAR(field_variable) | `cap1203_clear_interrupt(variables_get($cap1203))` | `cap1203.clearInterrupt();` |
| `cap1203_set_power_button_pad` | Statement | VAR(field_variable), PAD(dropdown) | `cap1203_set_power_button_pad(variables_get($cap1203), PWR_CS1)` | `cap1203.setPowerButtonPad(PWR_CS1);` |
| `cap1203_set_power_button_time` | Statement | VAR(field_variable), TIME(dropdown) | `cap1203_set_power_button_time(variables_get($cap1203), PWR_TIME_1120_MS)` | `cap1203.setPowerButtonTime(PWR_TIME_1120_MS);` |
| `cap1203_set_power_button_enabled` | Statement | VAR(field_variable), STATE(dropdown) | `cap1203_set_power_button_enabled(variables_get($cap1203), ENABLE)` | `cap1203.setPowerButtonEnabled();` |
| `cap1203_power_button_touched` | Value | VAR(field_variable) | `cap1203_power_button_touched(variables_get($cap1203))` | `cap1203.isPowerButtonTouched()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | CAP1203_I2C_ADDR, 0x28 | I2C address |
| PAD | ANY, LEFT, MIDDLE, RIGHT, PWR_CS1, PWR_CS2, PWR_CS3 | Touch or power-button pad |
| DIRECTION | LEFT, RIGHT | Swipe direction |
| SENSITIVITY | SENSITIVITY_128X, SENSITIVITY_64X, SENSITIVITY_32X, SENSITIVITY_16X, SENSITIVITY_8X, SENSITIVITY_4X, SENSITIVITY_2X, SENSITIVITY_1X | Touch sensitivity |
| STATE | ENABLE, DISABLE | Binary setting |
| TIME | PWR_TIME_280_MS, PWR_TIME_560_MS, PWR_TIME_1120_MS, PWR_TIME_2240_MS | Power-button hold time |

## ABS Examples

```text
arduino_setup()
    cap1203_init("cap1203", CAP1203_I2C_ADDR)
    cap1203_set_sensitivity(variables_get($cap1203), SENSITIVITY_32X)

arduino_loop()
    controls_if()
        @IF0: cap1203_touched(variables_get($cap1203), LEFT)
        @DO0:
            serial_println(Serial, text("Left"))
```

## Notes

`cap1203_init("name", ...)` creates variable `$name`.
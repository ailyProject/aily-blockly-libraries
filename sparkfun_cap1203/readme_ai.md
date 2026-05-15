# SparkFun CAP1203 Touch Slider

Blockly wrapper for the SparkFun CAP1203 capacitive touch slider.

## Library Info
- **Name**: @aily-project/lib-sparkfun-cap1203
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cap1203_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `cap1203_init("cap1203", CAP1203_I2C_ADDR)` | Wire.begin();\n |
| `cap1203_is_ready` | Value | VAR(field_variable) | `cap1203_is_ready(variables_get($cap1203))` | Dynamic code |
| `cap1203_is_connected` | Value | VAR(field_variable) | `cap1203_is_connected(variables_get($cap1203))` | Dynamic code |
| `cap1203_touched` | Value | VAR(field_variable), PAD(dropdown) | `cap1203_touched(variables_get($cap1203), ANY)` | Dynamic code |
| `cap1203_swipe` | Value | VAR(field_variable), DIRECTION(dropdown) | `cap1203_swipe(variables_get($cap1203), LEFT)` | Dynamic code |
| `cap1203_set_sensitivity` | Statement | VAR(field_variable), SENSITIVITY(dropdown) | `cap1203_set_sensitivity(variables_get($cap1203), SENSITIVITY_128X)` | Dynamic code |
| `cap1203_get_sensitivity` | Value | VAR(field_variable) | `cap1203_get_sensitivity(variables_get($cap1203))` | Dynamic code |
| `cap1203_set_interrupt` | Statement | VAR(field_variable), STATE(dropdown) | `cap1203_set_interrupt(variables_get($cap1203), ENABLE)` | Dynamic code |
| `cap1203_clear_interrupt` | Statement | VAR(field_variable) | `cap1203_clear_interrupt(variables_get($cap1203))` | Dynamic code |
| `cap1203_set_power_button_pad` | Statement | VAR(field_variable), PAD(dropdown) | `cap1203_set_power_button_pad(variables_get($cap1203), PWR_CS1)` | Dynamic code |
| `cap1203_set_power_button_time` | Statement | VAR(field_variable), TIME(dropdown) | `cap1203_set_power_button_time(variables_get($cap1203), PWR_TIME_280_MS)` | Dynamic code |
| `cap1203_set_power_button_enabled` | Statement | VAR(field_variable), STATE(dropdown) | `cap1203_set_power_button_enabled(variables_get($cap1203), ENABLE)` | Dynamic code |
| `cap1203_power_button_touched` | Value | VAR(field_variable) | `cap1203_power_button_touched(variables_get($cap1203))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | CAP1203_I2C_ADDR, 0x28 | cap1203_init |
| PAD | ANY, LEFT, MIDDLE, RIGHT | cap1203_touched |
| DIRECTION | LEFT, RIGHT | cap1203_swipe |
| SENSITIVITY | SENSITIVITY_128X, SENSITIVITY_64X, SENSITIVITY_32X, SENSITIVITY_16X, SENSITIVITY_8X, SENSITIVITY_4X, SENSITIVITY_2X, SENSITIVITY_1X | cap1203_set_sensitivity |
| STATE | ENABLE, DISABLE | cap1203_set_interrupt, cap1203_set_power_button_enabled |
| PAD | PWR_CS1, PWR_CS2, PWR_CS3 | cap1203_set_power_button_pad |
| TIME | PWR_TIME_280_MS, PWR_TIME_560_MS, PWR_TIME_1120_MS, PWR_TIME_2240_MS | cap1203_set_power_button_time |

## ABS Examples

### Basic Usage
```
arduino_setup()
    cap1203_init("cap1203", CAP1203_I2C_ADDR)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, cap1203_is_ready(variables_get($cap1203)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `cap1203_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun Qwiic Joystick

Blockly wrapper for SparkFun Qwiic Joystick (X/Y axis + button via I2C).

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-joystick
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_joystick_init` | Statement | VAR(field_input) | `qwiic_joystick_init("joystick")` | Dynamic code |
| `qwiic_joystick_get_horizontal` | Value | VAR(field_variable) | `qwiic_joystick_get_horizontal(variables_get($joystick))` | Dynamic code |
| `qwiic_joystick_get_vertical` | Value | VAR(field_variable) | `qwiic_joystick_get_vertical(variables_get($joystick))` | Dynamic code |
| `qwiic_joystick_get_button` | Value | VAR(field_variable) | `qwiic_joystick_get_button(variables_get($joystick))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwiic_joystick_init("joystick")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwiic_joystick_get_horizontal(variables_get($joystick)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `qwiic_joystick_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

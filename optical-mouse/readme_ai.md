# Optical Mouse Position Tracker

Tracks accumulated X/Y position by reading optical mouse sensor displacement registers via bit-bang SPI.

## Library Info
- **Name**: @aily-project/lib-optical-mouse
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `optical_mouse_init` | Statement | VAR(field_input), SCLK(dropdown), DIO(dropdown), CS(dropdown), RESOLUTION(field_input) | `optical_mouse_init("mouse", 5, 6, 4, "0.0405")` | `OpticalMouse mouse(5, 6, 4, 0.0405f);` + `mouse.begin();` |
| `optical_mouse_update` | Statement | VAR(field_variable) | `optical_mouse_update(variables_get($mouse))` | `mouse.update();` |
| `optical_mouse_get_x` | Value | VAR(field_variable) | `optical_mouse_get_x(variables_get($mouse))` | `mouse.getX()` |
| `optical_mouse_get_y` | Value | VAR(field_variable) | `optical_mouse_get_y(variables_get($mouse))` | `mouse.getY()` |
| `optical_mouse_has_motion` | Value (Boolean) | VAR(field_variable) | `optical_mouse_has_motion(variables_get($mouse))` | `mouse.hasMotion()` |
| `optical_mouse_reset` | Statement | VAR(field_variable) | `optical_mouse_reset(variables_get($mouse))` | `mouse.reset();` |

## Notes

1. **Initialization**: Call `optical_mouse_init` inside `arduino_setup()`. It creates variable `$mouse` of type `OpticalMouse`.
2. **Variable reference**: Use `variables_get($mouse)` to reference the object in subsequent blocks.
3. **Resolution**: Default `0.0405` mm/LSB. Adjust based on sensor CPI configuration.
4. **Update cycle**: Call `optical_mouse_update` in loop; recommended interval ≥ 100ms.
5. **Motion check**: Use `optical_mouse_has_motion` before reading position to avoid redundant output.

## ABS Examples

### Basic Usage
```
arduino_global()
    variable_define(first_run, bool, logic_boolean(true))

arduino_setup()
    optical_mouse_init("mouse", 5, 6, 4, "0.0405")
    serial_begin(Serial1, 9600)

arduino_loop()
    optical_mouse_update(variables_get($mouse))
    controls_if()
        @IF0: optical_mouse_has_motion(variables_get($mouse))
        @DO0:
            serial_print(Serial1, text("Pos X="))
            serial_print(Serial1, optical_mouse_get_x(variables_get($mouse)))
            serial_print(Serial1, text("mm Y="))
            serial_println(Serial1, optical_mouse_get_y(variables_get($mouse)))
    time_delay(math_number(100))
```

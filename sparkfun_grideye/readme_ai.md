# SparkFun GridEYE AMG88 Thermal Sensor

Blockly wrapper for the SparkFun GridEYE AMG88 8x8 thermal sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-grideye
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `grideye_init` | Statement | VAR(field_input), ADDRESS(dropdown) | `grideye_init("grideye", "0x69")` | Wire.begin();\n |
| `grideye_get_pixel_temp` | Value | VAR(field_variable), PIXEL(input_value) | `grideye_get_pixel_temp(variables_get($grideye), math_number(0))` | Dynamic code |
| `grideye_get_device_temp` | Value | VAR(field_variable) | `grideye_get_device_temp(variables_get($grideye))` | Dynamic code |
| `grideye_set_framerate` | Statement | VAR(field_variable), RATE(dropdown) | `grideye_set_framerate(variables_get($grideye), "1")` | Dynamic code |
| `grideye_power` | Statement | VAR(field_variable), MODE(dropdown) | `grideye_power(variables_get($grideye), wake)` | Dynamic code |
| `grideye_set_interrupt` | Statement | VAR(field_variable), UPPER(input_value), LOWER(input_value) | `grideye_set_interrupt(variables_get($grideye), math_number(0), math_number(0))` | Dynamic code |
| `grideye_moving_avg` | Statement | VAR(field_variable), ENABLE(dropdown) | `grideye_moving_avg(variables_get($grideye), enable)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x69, 0x68 | grideye_init |
| RATE | 1, 10 | grideye_set_framerate |
| MODE | wake, sleep | grideye_power |
| ENABLE | enable, disable | grideye_moving_avg |

## ABS Examples

### Basic Usage
```
arduino_setup()
    grideye_init("grideye", "0x69")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, grideye_get_pixel_temp(variables_get($grideye), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `grideye_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

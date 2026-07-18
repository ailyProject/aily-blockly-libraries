# SparkFun KWH018ST01 TFT

Blockly wrapper for SparkFun KWH018ST01 1.8 inch TFT display.

## Library Info
- **Name**: @aily-project/lib-sparkfun-hyperdisplay-kwh018st01
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `kwh018_init` | Statement | VAR(field_input), SPI(dropdown), DC(input_value), CS(input_value), BL(input_value), FREQ(input_value) | `kwh018_init("tft", SPI, math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `kwh018_clear` | Statement | VAR(field_variable) | `kwh018_clear(variables_get($tft))` | Dynamic code |
| `kwh018_set_backlight` | Statement | VAR(field_variable), BRIGHTNESS(input_value) | `kwh018_set_backlight(variables_get($tft), math_number(0))` | Dynamic code |
| `kwh018_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), R(input_value), G(input_value), B(input_value) | `kwh018_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `kwh018_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), WIDTH(input_value), R(input_value), G(input_value), B(input_value) | `kwh018_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `kwh018_rectangle` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), FILLED(dropdown), R(input_value), G(input_value), B(input_value) | `kwh018_rectangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), true, math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `kwh018_fill` | Statement | VAR(field_variable), R(input_value), G(input_value), B(input_value) | `kwh018_fill(variables_get($tft), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `kwh018_print` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value), R(input_value), G(input_value), B(input_value) | `kwh018_print(variables_get($tft), math_number(0), math_number(0), text("value"), math_number(0), math_number(0), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FILLED | true, false | kwh018_rectangle |

## ABS Examples

### Basic Usage
```
arduino_setup()
    kwh018_init("tft", SPI, math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    kwh018_clear(variables_get($tft))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `kwh018_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

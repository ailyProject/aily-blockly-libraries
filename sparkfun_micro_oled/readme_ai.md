# SparkFun Micro OLED Display

Blockly wrapper for the SparkFun Micro OLED 64x48 I2C display.

## Library Info
- **Name**: @aily-project/lib-sparkfun-micro-oled
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `micro_oled_init` | Statement | VAR(field_input), RST_PIN(field_number), DC_PIN(field_number) | `micro_oled_init("oled", 9, 1)` | Wire.begin();\n |
| `micro_oled_clear` | Statement | VAR(field_variable), MODE(dropdown) | `micro_oled_clear(variables_get($oled), ALL)` | Dynamic code |
| `micro_oled_display` | Statement | VAR(field_variable) | `micro_oled_display(variables_get($oled))` | Dynamic code |
| `micro_oled_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `micro_oled_set_cursor(variables_get($oled), math_number(0), math_number(0))` | Dynamic code |
| `micro_oled_print` | Statement | VAR(field_variable), TEXT(input_value) | `micro_oled_print(variables_get($oled), text("value"))` | Dynamic code |
| `micro_oled_set_font` | Statement | VAR(field_variable), FONT(dropdown) | `micro_oled_set_font(variables_get($oled), "0")` | Dynamic code |
| `micro_oled_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `micro_oled_pixel(variables_get($oled), math_number(0), math_number(0))` | Dynamic code |
| `micro_oled_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value) | `micro_oled_line(variables_get($oled), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `micro_oled_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), FILL(dropdown) | `micro_oled_rect(variables_get($oled), math_number(0), math_number(0), math_number(0), math_number(0), "0")` | Dynamic code |
| `micro_oled_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), R(input_value), FILL(dropdown) | `micro_oled_circle(variables_get($oled), math_number(0), math_number(0), math_number(0), "0")` | Dynamic code |
| `micro_oled_invert` | Statement | VAR(field_variable), INV(dropdown) | `micro_oled_invert(variables_get($oled), true)` | Dynamic code |
| `micro_oled_contrast` | Statement | VAR(field_variable), CONTRAST(input_value) | `micro_oled_contrast(variables_get($oled), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | ALL, PAGE | micro_oled_clear |
| FONT | 0, 1, 2, 3 | micro_oled_set_font |
| FILL | 0, 1 | micro_oled_rect, micro_oled_circle |
| INV | true, false | micro_oled_invert |

## ABS Examples

### Basic Usage
```
arduino_setup()
    micro_oled_init("oled", 9, 1)
    serial_begin(Serial, 9600)

arduino_loop()
    micro_oled_clear(variables_get($oled), ALL)
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `micro_oled_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

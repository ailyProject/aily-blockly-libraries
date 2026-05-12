# SparkFun MicroView

Blockly wrapper for the SparkFun MicroView standalone Arduino+OLED module.

## Library Info
- **Name**: @aily-project/lib-sparkfun-microview
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `microview_begin` | Statement | (none) | `microview_begin()` | uView.begin();\n |
| `microview_clear` | Statement | MODE(dropdown) | `microview_clear(PAGE)` | uView.clear( |
| `microview_display` | Statement | (none) | `microview_display()` | uView.display();\n |
| `microview_set_cursor` | Statement | X(input_value), Y(input_value) | `microview_set_cursor(math_number(0), math_number(0))` | uView.setCursor( |
| `microview_print` | Statement | TEXT(input_value) | `microview_print(text("value"))` | uView.print( |
| `microview_set_font` | Statement | FONT(dropdown) | `microview_set_font("0")` | uView.setFontType( |
| `microview_pixel` | Statement | X(input_value), Y(input_value) | `microview_pixel(math_number(0), math_number(0))` | uView.pixel( |
| `microview_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value) | `microview_line(math_number(0), math_number(0), math_number(0), math_number(0))` | uView.line( |
| `microview_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FILL(dropdown) | `microview_rect(math_number(0), math_number(0), math_number(0), math_number(0), "0")` | uView.rectFill( |
| `microview_circle` | Statement | X(input_value), Y(input_value), R(input_value), FILL(dropdown) | `microview_circle(math_number(0), math_number(0), math_number(0), "0")` | uView.circleFill( |
| `microview_invert` | Statement | INV(dropdown) | `microview_invert(true)` | uView.invert( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | PAGE, ALL | microview_clear |
| FONT | 0, 1, 2 | microview_set_font |
| FILL | 0, 1 | microview_rect, microview_circle |
| INV | true, false | microview_invert |

## ABS Examples

### Basic Usage
```
arduino_setup()
    microview_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    microview_clear(PAGE)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# SparkFun 8x7 Charlieplex LED Array

Blockly wrapper for SparkFun 8x7 Charlieplex LED Array.

## Library Info
- **Name**: @aily-project/lib-sparkfun-led-8x7
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `led8x7_init` | Statement | P0(input_value), P1(input_value), P2(input_value), P3(input_value), P4(input_value), P5(input_value), P6(input_value), P7(input_value) | `led8x7_init(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Plex.init(led8x7_pins);\n |
| `led8x7_clear` | Statement | (none) | `led8x7_clear()` | Plex.clear();\n |
| `led8x7_display` | Statement | (none) | `led8x7_display()` | Plex.display();\n |
| `led8x7_pixel` | Statement | X(input_value), Y(input_value), ON(dropdown) | `led8x7_pixel(math_number(0), math_number(0), "1")` | Plex.pixel( |
| `led8x7_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value) | `led8x7_line(math_number(0), math_number(0), math_number(0), math_number(0))` | Plex.line( |
| `led8x7_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FILL(dropdown) | `led8x7_rect(math_number(0), math_number(0), math_number(0), math_number(0), "0")` | Plex.rectFill( |
| `led8x7_scroll_text` | Statement | TEXT(input_value) | `led8x7_scroll_text(text("value"))` | led8x7_scrollText( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ON | 1, 0 | led8x7_pixel |
| FILL | 0, 1 | led8x7_rect |

## ABS Examples

### Basic Usage
```
arduino_setup()
    led8x7_init(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    led8x7_clear()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

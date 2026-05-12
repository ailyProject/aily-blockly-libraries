# micro:bit LED Matrix

Control the 5x5 LED matrix on BBC micro:bit

## Library Info
- **Name**: @aily-project/lib-microbit-matrix
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `microbit_matrix_begin` | Statement | (none) | `microbit_matrix_begin()` | Dynamic code |
| `microbit_matrix_clear` | Statement | (none) | `microbit_matrix_clear()` | matrix.clear();\n |
| `microbit_matrix_fill` | Statement | STATE(dropdown) | `microbit_matrix_fill("1")` | matrix.fillScreen( |
| `microbit_matrix_draw_pixel` | Statement | X(input_value), Y(input_value), STATE(dropdown) | `microbit_matrix_draw_pixel(math_number(0), math_number(0), "1")` | matrix.drawPixel( |
| `microbit_matrix_draw_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), STATE(dropdown) | `microbit_matrix_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), "1")` | matrix.drawLine( |
| `microbit_matrix_draw_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), STATE(dropdown) | `microbit_matrix_draw_rect(math_number(0), math_number(0), math_number(0), math_number(0), "1")` | matrix.drawRect( |
| `microbit_matrix_fill_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), STATE(dropdown) | `microbit_matrix_fill_rect(math_number(0), math_number(0), math_number(0), math_number(0), "1")` | matrix.fillRect( |
| `microbit_matrix_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), STATE(dropdown) | `microbit_matrix_draw_circle(math_number(0), math_number(0), math_number(0), "1")` | matrix.drawCircle( |
| `microbit_matrix_fill_circle` | Statement | X(input_value), Y(input_value), R(input_value), STATE(dropdown) | `microbit_matrix_fill_circle(math_number(0), math_number(0), math_number(0), "1")` | matrix.fillCircle( |
| `microbit_matrix_draw_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), STATE(dropdown) | `microbit_matrix_draw_triangle(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), "1")` | matrix.drawTriangle( |
| `microbit_matrix_fill_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), STATE(dropdown) | `microbit_matrix_fill_triangle(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), "1")` | matrix.fillTriangle( |
| `microbit_matrix_show_icon` | Statement | ICON(dropdown) | `microbit_matrix_show_icon(HEART)` | matrix.show( |
| `microbit_matrix_show_bitmap` | Statement | BITMAP(input_value) | `microbit_matrix_show_bitmap(text("value"))` | matrix.show( |
| `microbit_matrix_print_text` | Statement | TEXT(input_value) | `microbit_matrix_print_text(text("value"))` | matrix.print( |
| `microbit_matrix_print_number` | Statement | NUMBER(input_value) | `microbit_matrix_print_number(math_number(0))` | matrix.print( |
| `microbit_matrix_scroll_text` | Statement | TEXT(input_value), SPEED(input_value) | `microbit_matrix_scroll_text(text("value"), math_number(9600))` | matrix.scrollText( |
| `microbit_matrix_bitmap_create` | Value | ROW1(input_value), ROW2(input_value), ROW3(input_value), ROW4(input_value), ROW5(input_value) | `microbit_matrix_bitmap_create(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `microbit_matrix_bitmap_heart` | Value | (none) | `microbit_matrix_bitmap_heart()` | matrix.HEART |
| `microbit_matrix_bitmap_empty_heart` | Value | (none) | `microbit_matrix_bitmap_empty_heart()` | matrix.EMPTYHEART |
| `microbit_matrix_bitmap_yes` | Value | (none) | `microbit_matrix_bitmap_yes()` | matrix.YES |
| `microbit_matrix_bitmap_no` | Value | (none) | `microbit_matrix_bitmap_no()` | matrix.NO |
| `microbit_matrix_bitmap_smile` | Value | (none) | `microbit_matrix_bitmap_smile()` | matrix.MICROBIT_SMILE |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | 1, 0 | microbit_matrix_fill, microbit_matrix_draw_pixel, microbit_matrix_draw_line |
| ICON | HEART, EMPTYHEART, YES, NO, SMILE | microbit_matrix_show_icon |

## ABS Examples

### Basic Usage
```
arduino_setup()
    microbit_matrix_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, microbit_matrix_bitmap_create(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

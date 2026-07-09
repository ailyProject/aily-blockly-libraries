# K10 Screen Display

UNIHIKER K10 screen display library, supports drawing points, lines, circles, rectangles, text, images and QR codes

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-display
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_init_screen` | Statement | DIR(dropdown) | `k10_init_screen("2")` | Dynamic code |
| `k10_set_background` | Statement | COLOR(field_colour_hsv_sliders) | `k10_set_background()` | k10.setScreenBackground( |
| `k10_draw_point` | Statement | X(input_value), Y(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_point(math_number(0), math_number(0))` | k10.canvas->canvasPoint( |
| `k10_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_line(math_number(0), math_number(0), math_number(0), math_number(0))` | k10.canvas->canvasLine( |
| `k10_set_line_width` | Statement | WIDTH(field_number) | `k10_set_line_width(1)` | k10.canvas->canvasSetLineWidth( |
| `k10_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), BORDER_COLOR(field_colour_hsv_sliders), FILL_COLOR(field_colour_hsv_sliders), FILLED(field_checkbox) | `k10_draw_circle(math_number(0), math_number(0), math_number(0), TRUE)` | k10.canvas->canvasCircle( |
| `k10_draw_rectangle` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), BORDER_COLOR(field_colour_hsv_sliders), FILL_COLOR(field_colour_hsv_sliders), FILLED(field_ch... | `k10_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), TRUE)` | k10.canvas->canvasRectangle( |
| `k10_draw_text_simple` | Statement | LINE(field_number), TEXT(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_text_simple(1, text("value"))` | k10.canvas->canvasText( |
| `k10_draw_text` | Statement | TEXT(input_value), X(input_value), Y(input_value), COLOR(field_colour_hsv_sliders), FONT(dropdown), LINE_CHARS(field_number) | `k10_draw_text(text("value"), math_number(0), math_number(0), eCNAndENFont16, 25)` | k10.canvas->canvasText( |
| `k10_draw_bitmap` | Statement | IMAGE(field_input), X(input_value), Y(input_value), W(input_value), H(input_value) | `k10_draw_bitmap("image_data1", math_number(0), math_number(0), math_number(0), math_number(0))` | k10.canvas->canvasDrawBitmap( |
| `k10_draw_image` | Statement | PATH(input_value), X(input_value), Y(input_value) | `k10_draw_image(text("value"), math_number(0), math_number(0))` | k10.canvas->canvasDrawImage( |
| `k10_draw_qrcode` | Statement | CONTENT(input_value) | `k10_draw_qrcode(text("value"))` | k10.canvasDrawCode( |
| `k10_update_canvas` | Statement | (none) | `k10_update_canvas()` | k10.canvas->updateCanvas();\n |
| `k10_clear_canvas` | Statement | MODE(dropdown) | `k10_clear_canvas("0")` | k10.canvas->canvasClear();\n |
| `k10_screen_size` | Value | WHICH(dropdown) | `k10_screen_size(W)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | 2, 0, 1, 3 | k10_init_screen |
| FONT | eCNAndENFont16, eCNAndENFont24 | k10_draw_text |
| MODE | 0, 1 | k10_clear_canvas |
| WHICH | W, H | k10_screen_size |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_init_screen("2")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, k10_screen_size(W))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

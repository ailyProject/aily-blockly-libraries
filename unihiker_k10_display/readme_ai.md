# K10 Screen Display

UNIHIKER K10 screen display library with drawing, text, image, animation, and QR code blocks

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-display
- **Version**: 0.4.1

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
| `k10_clear_canvas_row` | Statement | LINE(input_value) | `k10_clear_canvas_row(math_number(1))` | `k10.canvas->canvasClear(1);` |
| `k10_clear_qrcode` | Statement | (none) | `k10_clear_qrcode()` | `k10.clearCode();` |
| `k10_animation` | Value (K10Animation) | CUSTOM_ANIMATION(field_tftespi_animation) | `k10_animation()` | RGB565 `PROGMEM` frame arrays |
| `k10_play_animation` | Statement | X, Y, ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `k10_play_animation(math_number(0), math_number(0), k10_animation(), BLOCKING, FALSE)` | Blocking or non-blocking playback with automatic canvas refresh |
| `k10_draw_animation_frame` | Statement | X, Y, ANIMATION, FRAME(input_value) | `k10_draw_animation_frame(math_number(0), math_number(0), k10_animation(), math_number(0))` | Draw and refresh one clamped animation frame |
| `k10_animation_frame_count` | Value (Number) | ANIMATION(input_value) | `k10_animation_frame_count(k10_animation())` | Animation frame count |
| `k10_step_animation_frame` | Statement | FRAME_VAR(field_variable), TARGET, FRAME_COUNT(input_value), DIRECTION(dropdown) | `k10_step_animation_frame(variables_get($k10AnimationFrame), math_number(0), math_number(1), AUTO)` | Move a frame variable one step |
| `k10_screen_size` | Value | WHICH(dropdown) | `k10_screen_size(W)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | 2, 0, 1, 3 | k10_init_screen |
| FONT | eCNAndENFont16, eCNAndENFont24 | k10_draw_text |
| MODE | 0, 1 | Clear all rows or clear row 1; saved value `1` remains compatible |
| PLAY_MODE | BLOCKING, NON_BLOCKING | Play the whole animation at once or advance it from repeated loop execution |
| DIRECTION | AUTO, FORWARD, BACKWARD | Direction used when stepping a frame variable |
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
3. Both text blocks accept `String` and `Number` values because the K10 SDK provides overloads for both types.
4. `k10_clear_canvas_row` accepts rows 1 through 7. Refresh the canvas after clearing when the updated display is not immediately visible.
5. `k10_clear_qrcode` removes the QR-code object created by `k10_draw_qrcode`; clearing the canvas alone does not replace this action.
6. Connect `ANIMATION` inputs directly to `k10_animation`; indirect variables or other value blocks are not supported because the generator resolves the frame symbols at compile time.
7. New `k10_animation` blocks may remain empty until media is uploaded. RGB565 input has its red and blue fields exchanged for the K10 display path; RGB332 input is expanded and converted in the same way.
8. Blocking playback waits for all frames. Non-blocking playback should run repeatedly in `arduino_loop()` and can optionally loop after the last frame.

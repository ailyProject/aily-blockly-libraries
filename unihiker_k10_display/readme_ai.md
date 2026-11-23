# K10 Screen Display

UNIHIKER K10 screen display library with drawing, text, image, animation, and QR code blocks

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-display
- **Version**: 0.4.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_init_screen` | Statement | DIR(dropdown) | `k10_init_screen("2")` | `UNIHIKER_K10 k10; ↵ k10.begin(); ↵ uint8_t screen_dir = 2; ↵ k10.initScreen(screen_dir); ↵ k10.creatCanvas();` |
| `k10_set_background` | Statement | COLOR(field_colour_hsv_sliders) | `k10_set_background("#ffffff")` | `k10.setScreenBackground(0xFFFFFF);` |
| `k10_draw_point` | Statement | X(input_value), Y(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_point(math_number(0), math_number(0), "#0000ff")` | `k10.canvas->canvasPoint(1, 1, 0x0000FF);` |
| `k10_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), "#ff0000")` | `k10.canvas->canvasLine(1, 1, 1, 1, 0xFF0000);` |
| `k10_set_line_width` | Statement | WIDTH(field_number) | `k10_set_line_width(1)` | `k10.canvas->canvasSetLineWidth(1);` |
| `k10_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), BORDER_COLOR(field_colour_hsv_sliders), FILL_COLOR(field_colour_hsv_sliders), FILLED(field_checkbox) | `k10_draw_circle(math_number(0), math_number(0), math_number(0), "#ffcc33", "#ffcc33", TRUE)` | `k10.canvas->canvasCircle(1, 1, 1, 0xFFCC33, 0xFFCC33, true);` |
| `k10_draw_rectangle` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), BORDER_COLOR(field_colour_hsv_sliders), FILL_COLOR(field_colour_hsv_sliders), FILLED(field_checkbox) | `k10_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), "#ff0000", "#ffffff", TRUE)` | `k10.canvas->canvasRectangle(1, 1, 1, 1, 0xFF0000, 0xFFFFFF, true);` |
| `k10_draw_text_simple` | Statement | LINE(field_number), TEXT(input_value), COLOR(field_colour_hsv_sliders) | `k10_draw_text_simple(1, text("value"), "#0000ff")` | `k10.canvas->canvasText("value", 1, 0x0000FF);` |
| `k10_draw_text` | Statement | TEXT(input_value), X(input_value), Y(input_value), COLOR(field_colour_hsv_sliders), FONT(dropdown), LINE_CHARS(field_number) | `k10_draw_text(text("value"), math_number(0), math_number(0), "#0000ff", eCNAndENFont16, 25)` | `k10.canvas->canvasText("value", 1, 1, 0x0000FF, k10.canvas->eCNAndENFont16, 25, true);` |
| `k10_draw_bitmap` | Statement | IMAGE(field_input), X(input_value), Y(input_value), W(input_value), H(input_value) | `k10_draw_bitmap("image_data1", math_number(0), math_number(0), math_number(0), math_number(0))` | `k10.canvas->canvasDrawBitmap(1, 1, 1, 1, image_data1);` |
| `k10_draw_image` | Statement | PATH(input_value), X(input_value), Y(input_value) | `k10_draw_image(text("value"), math_number(0), math_number(0))` | `k10.canvas->canvasDrawImage(1, 1, "value");` |
| `k10_draw_qrcode` | Statement | CONTENT(input_value) | `k10_draw_qrcode(text("value"))` | `k10.canvasDrawCode("value");` |
| `k10_update_canvas` | Statement | (none) | `k10_update_canvas()` | `k10.canvas->updateCanvas();` |
| `k10_clear_canvas` | Statement | MODE(dropdown) | `k10_clear_canvas("0")` | `k10.canvas->canvasClear();` |
| `k10_clear_canvas_row` | Statement | LINE(input_value) | `k10_clear_canvas_row(math_number(1))` | `k10.canvas->canvasClear(1);` |
| `k10_clear_qrcode` | Statement | (none) | `k10_clear_qrcode()` | `k10.clearCode();` |
| `k10_animation` | Value (K10Animation) | CUSTOM_ANIMATION(field_tftespi_animation) | `k10_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":240,"height":320,"fps":10,"maxFrames":10,"frameCount":0,"frames":null})` | `No direct code emitted while the custom animation field has no frame data.` |
| `k10_play_animation` | Statement | X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `k10_play_animation(math_number(0), math_number(0), k10_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":240,"height":320,"fps":10,"maxFrames":10,"frameCount":0,"frames":null}), BLOCKING, FALSE)` | `// No K10 animation data` |
| `k10_draw_animation_frame` | Statement | X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `k10_draw_animation_frame(math_number(0), math_number(0), k10_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":240,"height":320,"fps":10,"maxFrames":10,"frameCount":0,"frames":null}), math_number(0))` | `// No K10 animation data` |
| `k10_animation_frame_count` | Value (Number) | ANIMATION(input_value) | `k10_animation_frame_count(k10_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":240,"height":320,"fps":10,"maxFrames":10,"frameCount":0,"frames":null}))` | `0` |
| `k10_screen_size` | Value | WHICH(dropdown) | `k10_screen_size(W)` | `240` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | 2, 0, 1, 3 | k10_init_screen |
| FONT | eCNAndENFont16, eCNAndENFont24 | k10_draw_text |
| MODE | 0, 1 | Clear all rows or clear row 1; saved value `1` remains compatible |
| PLAY_MODE | BLOCKING, NON_BLOCKING | Play the whole animation at once or advance it from repeated loop execution |
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

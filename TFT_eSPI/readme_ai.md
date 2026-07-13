# TFT_eSPI

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.43

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(input_value), MISO(input_value), MOSI(input_value), SCLK(input_value), CS(... | `tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)` | Dynamic code |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation(variables_get($tft), "0")` | Dynamic code |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display(variables_get($tft), true)` | Dynamic code |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_round_rect(variables_get($tft), math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_WHITE))` | Dynamic code |
| `tftespi_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_round_rect(variables_get($tft), math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_BLUE))` | Dynamic code |
| `tftespi_fill_rect_v_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_v_gradient(variables_get($tft), math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_RED), tftespi_color(TFT_YELLOW))` | Dynamic code |
| `tftespi_fill_rect_h_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_h_gradient(variables_get($tft), math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_GREEN), tftespi_color(TFT_CYAN))` | Dynamic code |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_draw_ellipse(variables_get($tft), math_number(160), math_number(120), math_number(60), math_number(40), tftespi_color(TFT_WHITE))` | Dynamic code |
| `tftespi_fill_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_fill_ellipse(variables_get($tft), math_number(160), math_number(120), math_number(50), math_number(30), tftespi_color(TFT_ORANGE))` | Dynamic code |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string(variables_get($tft), math_number(0), math_number(0), text("value"))` | Dynamic code |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color(variables_get($tft), math_number(0))` | Dynamic code |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size(variables_get($tft), "1")` | Dynamic code |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font(variables_get($tft), "1")` | Dynamic code |
| `tftespi_animation` | Value | CUSTOM_ANIMATION(field_tftespi_animation) | `tftespi_animation()` | RGB565 or RGB332 `PROGMEM` frame arrays |
| `tftespi_play_animation` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `tftespi_play_animation(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), NON_BLOCKING, TRUE)` | Dynamic code |
| `tftespi_draw_animation_frame` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `tftespi_draw_animation_frame(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), variables_get(frame))` | Dynamic code |
| `tftespi_animation_frame_count` | Value | ANIMATION(input_value) | `tftespi_animation_frame_count(tftespi_animation())` | Generated frame-count constant |
| `tftespi_step_animation_frame` | Statement | FRAME_VAR(field_variable), TARGET(input_value), FRAME_COUNT(input_value), DIRECTION(dropdown) | `tftespi_step_animation_frame(frame, math_number(10), tftespi_animation_frame_count(tftespi_animation()), AUTO)` | Dynamic code |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565(variables_get($tft))` | Dynamic code |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM681... | tftespi_setup |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | tftespi_setup |
| BL_LEVEL | HIGH, LOW | tftespi_setup |
| COLOR_MODE | TFT_RGB, TFT_BGR | tftespi_setup |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | tftespi_set_rotation |
| INVERT | true, false | tftespi_invert_display |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | tftespi_set_text_size |
| FONT | 1, 2, 4, 6, 7, 8 | tftespi_set_text_font |
| PLAY_MODE | BLOCKING, NON_BLOCKING | tftespi_play_animation |
| LOOP | TRUE, FALSE | tftespi_play_animation |
| DIRECTION | AUTO, FORWARD, BACKWARD | tftespi_step_animation_frame |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | tftespi_color |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "10000000", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tftespi_color_rgb565(variables_get($tft)))
    time_delay(math_number(1000))
```

### Non-blocking GIF or MP4 Animation
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "40000000", math_number(240), math_number(320), math_number(-1), math_number(23), math_number(18), math_number(5), math_number(2), math_number(4), math_number(15), HIGH, TFT_RGB)

arduino_loop()
    tftespi_play_animation(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), NON_BLOCKING, TRUE)
```

### Controlled Animation Frame
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "40000000", math_number(240), math_number(320), math_number(-1), math_number(23), math_number(18), math_number(5), math_number(2), math_number(4), math_number(15), HIGH, TFT_RGB)
    variable_define(frame, int, math_number(0))

arduino_loop()
    tftespi_draw_animation_frame(variables_get($tft), math_number(0), math_number(0), tftespi_animation(), variables_get(frame))
    tftespi_step_animation_frame(frame, math_number(10), tftespi_animation_frame_count(tftespi_animation()), AUTO)
```

## Notes

1. **Variable**: `tftespi_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Animation conversion**: GIF and MP4 are decoded in the Blockly editor as selectable RGB565 or RGB332 Base64 frames; generated firmware uses matching `uint16_t` or `uint8_t` `PROGMEM` arrays and automatically calls the matching `pushImage()` overload.
5. **Resource budget**: the editor defaults to 160x120 and 10 frames and caps the serialized animation payload at 8 MiB. RGB332 uses one byte per pixel and therefore fits roughly twice as many frames as RGB565 at the same dimensions. The selected board may have much less application flash, so reduce width, height, FPS, or total frames if compilation reports that the program is too large. Identical converted frames and identical animation data blocks share generated `PROGMEM` arrays.
6. **MP4 codec and audio**: MP4 decoding depends on the Electron/Chromium WebCodecs codec support. Audio tracks are ignored.
7. **Long video**: this block is for short self-contained animations. Long videos should use a separate SD/MJPEG streaming workflow rather than embedding raw frames.
8. **One-shot playback**: non-blocking playback with `LOOP=FALSE` runs once after startup; use controlled-frame blocks when application logic must restart or seek an animation.
9. **Display throughput**: requested FPS is a target. Large frames may play more slowly when conversion and display transfer time exceed the selected frame interval.

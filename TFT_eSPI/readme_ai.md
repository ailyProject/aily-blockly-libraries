# TFT_eSPI

TFT_eSPI - Arduino library, graphics and font library supporting multiple TFT displays

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.53

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), WIDTH(field_input), HEIGHT(field_input), MISO(field_input), MOSI(field_input), SCLK(field_input), CS(field_input), DC(field_input), RST(field_input), BL(field_input), BL_LEVEL(dropdown), COLOR_MODE(dropdown), FREQUENCY(dropdown), QSPI_CS(field_input), QSPI_SCLK(field_input), D0(field_input), D1(field_input), D2(field_input), D3(field_input), QSPI_RST(field_input), TE(field_input) | `tftespi_setup("tft", ILI9341_DRIVER, "240", "320", "-1", "-1", "-1", "-1", "-1", "-1", "-1", HIGH, TFT_RGB, 10000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")` | `tft.init();` |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation($tft, "0")` | `tft.setRotation(0);` |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display($tft, true)` | `tft.invertDisplay(true);` |
| `tftespi_get_dimension` | Value (Number) | VAR(field_variable), DIMENSION(dropdown) | `tftespi_get_dimension($tft, WIDTH)` | `tft.width()` |
| `tftespi_sprite_create` | Statement | VAR(field_input), TFT(field_variable), WIDTH(input_value), HEIGHT(input_value), COLOR_DEPTH(dropdown) | `tftespi_sprite_create("sprite", $tft, math_number(160), math_number(120), 16)` | `sprite.setColorDepth(16); ↵ sprite.createSprite(1, 1);` |
| `tftespi_sprite_push` | Statement | SPRITE(field_variable), X(input_value), Y(input_value) | `tftespi_sprite_push($sprite, math_number(0), math_number(0))` | `sprite.pushSprite(1, 1);` |
| `tftespi_sprite_push_transparent` | Statement | SPRITE(field_variable), X(input_value), Y(input_value), TRANSPARENT_COLOR(input_value) | `tftespi_sprite_push_transparent($sprite, math_number(0), math_number(0), tftespi_color(TFT_BLACK))` | `sprite.pushSprite(1, 1, 1);` |
| `tftespi_sprite_delete` | Statement | SPRITE(field_variable) | `tftespi_sprite_delete($sprite)` | `sprite.deleteSprite();` |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen($tft, math_number(0))` | `tft.fillScreen(1);` |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel($tft, math_number(0), math_number(0), math_number(0))` | `tft.drawPixel(1, 1, 1);` |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.drawLine(1, 1, 1, 1, 1);` |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.drawRect(1, 1, 1, 1, 1);` |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.fillRect(1, 1, 1, 1, 1);` |
| `tftespi_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_round_rect($tft, math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_WHITE))` | `tft.drawRoundRect(1, 1, 1, 1, 1, 1);` |
| `tftespi_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_round_rect($tft, math_number(10), math_number(10), math_number(100), math_number(60), math_number(8), tftespi_color(TFT_BLUE))` | `tft.fillRoundRect(1, 1, 1, 1, 1, 1);` |
| `tftespi_fill_rect_v_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_v_gradient($tft, math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_RED), tftespi_color(TFT_YELLOW))` | `tft.fillRectVGradient(1, 1, 1, 1, 1, 1);` |
| `tftespi_fill_rect_h_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `tftespi_fill_rect_h_gradient($tft, math_number(20), math_number(20), math_number(100), math_number(60), tftespi_color(TFT_GREEN), tftespi_color(TFT_CYAN))` | `tft.fillRectHGradient(1, 1, 1, 1, 1, 1);` |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle($tft, math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.drawCircle(1, 1, 1, 1);` |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle($tft, math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.fillCircle(1, 1, 1, 1);` |
| `tftespi_draw_arc` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), INNER_RADIUS(input_value), START_ANGLE(input_value), END_ANGLE(input_value), COLOR(input_value), BG_COLOR(input_value), ROUND_ENDS(dropdown) | `tftespi_draw_arc($tft, math_number(120), math_number(120), math_number(80), math_number(60), math_number(0), math_number(270), tftespi_color(TFT_CYAN), tftespi_color(TFT_BLACK), true)` | `tft.drawSmoothArc(1, 1, 1, 1, 1, 1, 1, 1, true);` |
| `tftespi_draw_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_draw_ellipse($tft, math_number(160), math_number(120), math_number(60), math_number(40), tftespi_color(TFT_WHITE))` | `tft.drawEllipse(1, 1, 1, 1, 1);` |
| `tftespi_fill_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `tftespi_fill_ellipse($tft, math_number(160), math_number(120), math_number(50), math_number(30), tftespi_color(TFT_ORANGE))` | `tft.fillEllipse(1, 1, 1, 1, 1);` |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.drawTriangle(1, 1, 1, 1, 1, 1, 1);` |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `tft.fillTriangle(1, 1, 1, 1, 1, 1, 1);` |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string($tft, math_number(0), math_number(0), text("value"))` | `tft.drawString(String(1), 1, 1);` |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color($tft, math_number(0))` | `tft.setTextColor(1);` |
| `tftespi_set_text_colors` | Statement | VAR(field_variable), COLOR(input_value), BG_COLOR(input_value) | `tftespi_set_text_colors($tft, tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))` | `tft.setTextColor(1, 1);` |
| `tftespi_set_text_datum` | Statement | VAR(field_variable), DATUM(dropdown) | `tftespi_set_text_datum($tft, MC_DATUM)` | `tft.setTextDatum(TL_DATUM);` |
| `tftespi_set_text_padding` | Statement | VAR(field_variable), WIDTH(input_value) | `tftespi_set_text_padding($tft, math_number(100))` | `tft.setTextPadding(1);` |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size($tft, "1")` | `tft.setTextSize(1);` |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font($tft, "1")` | `tft.setTextFont(1);` |
| `tftespi_image` | Value (TFTImage) | CUSTOM_IMAGE(field_tftespi_image) | `tftespi_image({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":160,"height":120,"fps":10,"maxFrames":1,"frameCount":0,"frames":null})` | `#include <TFT_eSPI.h>` |
| `tftespi_draw_image` | Statement | VAR(field_variable), X(input_value), Y(input_value), IMAGE(input_value) | `tftespi_draw_image($tft, math_number(0), math_number(0), tftespi_image())` | `// No TFT_eSPI image data` |
| `tftespi_animation` | Value | CUSTOM_ANIMATION(field_tftespi_animation) | `tftespi_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":160,"height":120,"fps":10,"maxFrames":10,"frameCount":0,"frames":null})` | `#include <TFT_eSPI.h>` |
| `tftespi_play_animation` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `tftespi_play_animation($tft, math_number(0), math_number(0), tftespi_animation(), NON_BLOCKING, TRUE)` | `// No TFT_eSPI animation data` |
| `tftespi_draw_animation_frame` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `tftespi_draw_animation_frame($tft, math_number(0), math_number(0), tftespi_animation(), variables_get(frame))` | `// No TFT_eSPI animation data` |
| `tftespi_animation_frame_count` | Value | ANIMATION(input_value) | `tftespi_animation_frame_count(tftespi_animation())` | `0` |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565($tft, "#ffffff")` | `tft.color565(255, 255, 255)` |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | `TFT_BLACK` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ILI9342_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357B_DRIVER, HX8357C_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM68120_DRIVER, RM681... | tftespi_setup |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | tftespi_setup |
| BL_LEVEL | HIGH, LOW | tftespi_setup |
| COLOR_MODE | TFT_RGB, TFT_BGR | tftespi_setup |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | tftespi_set_rotation |
| INVERT | true, false | tftespi_invert_display |
| DIMENSION | WIDTH, HEIGHT | tftespi_get_dimension |
| COLOR_DEPTH | 16, 8, 4, 1 | tftespi_sprite_create |
| ROUND_ENDS | true, false | tftespi_draw_arc |
| DATUM | TL_DATUM, TC_DATUM, TR_DATUM, ML_DATUM, MC_DATUM, MR_DATUM, BL_DATUM, BC_DATUM, BR_DATUM, L_BASELINE, C_BASELINE, R_BASELINE | tftespi_set_text_datum |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | tftespi_set_text_size |
| FONT | 1, 2, 4, 6, 7, 8 | tftespi_set_text_font |
| PLAY_MODE | BLOCKING, NON_BLOCKING | tftespi_play_animation |
| LOOP | TRUE, FALSE | tftespi_play_animation |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | tftespi_color |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "240", "320", "-1", "-1", "-1", "-1", "-1", "-1", "-1", HIGH, TFT_RGB, 10000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tftespi_color_rgb565($tft, "#ffffff"))
    time_delay(math_number(1000))
```

### Non-blocking GIF or MP4 Animation
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "240", "320", "-1", "23", "18", "5", "2", "4", "15", HIGH, TFT_RGB, 40000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")

arduino_loop()
    tftespi_play_animation($tft, math_number(0), math_number(0), tftespi_animation({"schemaVersion":1,"format":"rgb565","encoding":"rgb565-be","width":160,"height":120,"fps":10,"maxFrames":10,"frameCount":0,"frames":null}), NON_BLOCKING, TRUE)
```

### CH13613 QSPI
```
arduino_setup()
    tftespi_setup("tft", CH13613_DRIVER, "480", "480", "-1", "-1", "-1", "-1", "-1", "-1", "-1", HIGH, TFT_RGB, 40000000, "45", "17", "8", "16", "15", "18", "7", "38")

arduino_loop()
    tftespi_fill_screen($tft, tftespi_color(TFT_BLACK))
```

### Sprite Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, "240", "320", "-1", "23", "18", "5", "2", "4", "15", HIGH, TFT_RGB, 40000000, "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    tftespi_sprite_create("sprite", $tft, math_number(160), math_number(120), 16)
    tftespi_fill_screen($sprite, tftespi_color(TFT_BLACK))
    tftespi_draw_string($sprite, math_number(10), math_number(10), text("Hello"))
    tftespi_sprite_push($sprite, math_number(40), math_number(60))
```

## Notes

1. **Variable**: `tftespi_setup("varName", ...)` creates a `TFT_eSPI` variable and `tftespi_sprite_create("sprite", ...)` creates a `TFT_eSprite` variable. Pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Image conversion**: PNG, JPEG, WebP, and BMP files are converted by `field_tftespi_image` to selectable RGB565 or RGB332 Base64 data. Changing W, H, or format reconverts from the saved original file instead of resampling the previous pixel data. The image field renders at 50 px high in Blockly.
5. **Colour consistency**: Static images and animation frames keep the standard RGB565/RGB332 channel layout used by TFT_eSPI drawing primitives. Select `TFT_RGB` or `TFT_BGR` in `tftespi_setup` to match the panel; the generated `TFT_RGB_ORDER` setting then applies consistently to fills, text, images, and animations. RGB565 render helpers still enable byte swapping for 16-bit transport, which does not exchange the red and blue channels.
6. **Resource budget**: image and animation data are embedded in firmware. The editor defaults to 160x120 and animation defaults to 10 frames with an 8 MiB serialized payload cap. RGB332 uses one byte per pixel and therefore needs roughly half the storage of RGB565. Reduce width, height, FPS, or frame count if compilation reports that the program is too large. Identical converted resources share generated `PROGMEM` arrays.
7. **MP4 codec and audio**: MP4 decoding depends on the Electron/Chromium WebCodecs codec support. Audio tracks are ignored.
8. **Automatic value text**: `tftespi_draw_string` wraps its input in Arduino `String(...)`, so text, integer, and decimal expressions can use the same display block.
9. **Sprite drawing**: screen dimensions, fill, primitive graphics, and text blocks accept either `TFT_eSPI` or `TFT_eSprite` variables. Image and animation render helpers remain display-only.
10. **Sprite memory**: approximate buffer use is width × height × bytes per pixel. Delete temporary Sprites when they are no longer needed.
11. **Long video**: this block is for short self-contained animations. Long videos should use a separate SD/MJPEG streaming workflow rather than embedding raw frames.
12. **One-shot playback**: non-blocking playback with `LOOP=FALSE` runs once after startup; use controlled-frame blocks when application logic must restart or seek an animation.
13. **Display throughput**: requested FPS is a target. Large frames may play more slowly when conversion and display transfer time exceed the selected frame interval.
14. **CH13613 QSPI**: selecting `CH13613_DRIVER` hides the standard SPI pin row and shows only QSPI CS, SCLK, D0, D1, D2, D3, RST, and TE. Every QSPI pin defaults to `-1`. CH13613 QSPI is supported on ESP32-S3 and uses its default SPI2 host.
15. **Built-in board display defaults**: when `board.json.displayConfig` exists, initialization fills fields from it, including hidden fields. The current generator maps `pins.sclk/cs/rst` to both `SCLK/CS/RST` and `QSPI_SCLK/QSPI_CS/QSPI_RST`. ABS must agree with these board defaults; do not put `-1` in those hidden SPI positions just because QSPI is selected. For OJoy CH13613, the standard `SCLK/CS/RST` positions are `"17"/"45"/"7"`, matching their QSPI counterparts; other unconfigured SPI pins remain `"-1"`. This does not change the active QSPI wiring.
16. **Generated TFT_eSPI configuration**: the setup block defines `USER_SETUP_LOADED` so the bundled default ILI9341 setup cannot override the selected driver. Its frequency field generates TFT_eSPI's `SPI_FREQUENCY` macro.
17. **Red/blue diagnosis**: If drawing primitives and images both exchange red and blue, select the other `COLOR_MODE` value. Display inversion changes all channel intensities and RGB565 byte swapping changes transport byte order; neither should be used to correct RGB/BGR panel order.

# Wio Terminal Display

Screen driver library designed for Wio Terminal's built-in 2.4-inch 320×240 TFT LCD, with graphics, text, animation, and SD-card video support.

## Library Info
- **Name**: @aily-project/lib-seeed-wio-gfx
- **Version**: 1.0.11

## Wio Terminal Scope

- This package is intended only for the Wio Terminal and its built-in 2.4-inch 320×240 TFT LCD.
- Initialize the screen with `seeed_gfx_init("tft", "50000000")`; the generator fixes the Wio Terminal model to `500`. The block offers 10 to 50 MHz plus a `MAX (CPU/2)` test option.
- The generated display object is `TFT_eSPI`, so LVGL integrations must continue to select the `TFT_eSPI` driver.
- Use the drawing and text blocks for static content, the animation blocks for short converted GIF/MP4 clips, and `seeed_gfx_play_sd_video` for AILY videos stored on the Wio Terminal SD card.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_gfx_create_tft` | Statement | VAR(field_input) | `seeed_gfx_create_tft("tft")` | Dynamic code |
| `seeed_gfx_init` | Statement | VAR(field_input), FREQUENCY(dropdown) | `seeed_gfx_init("tft", "50000000")` | `BOARD_SCREEN_COMBO=500`; selected `TFT_FREQUENCY`; `tft.init();` |
| `seeed_gfx_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `seeed_gfx_fill_screen(variables_get($tft), math_number(0))` | Dynamic code |
| `seeed_gfx_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `seeed_gfx_set_rotation(variables_get($tft), "0")` | Dynamic code |
| `seeed_gfx_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `seeed_gfx_draw_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `seeed_gfx_draw_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_draw_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_fill_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_rect_v_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR1(input_value), COLOR2(input_value) | `seeed_gfx_fill_rect_v_gradient(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_rect_h_gradient` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR1(input_value), COLOR2(input_value) | `seeed_gfx_fill_rect_h_gradient(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_round_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_round_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `seeed_gfx_draw_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `seeed_gfx_fill_triangle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_draw_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `seeed_gfx_draw_ellipse(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_fill_ellipse` | Statement | VAR(field_variable), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `seeed_gfx_fill_ellipse(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_set_text_color` | Statement | VAR(field_variable), COLOR(input_value), BGCOLOR(input_value) | `seeed_gfx_set_text_color(variables_get($tft), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `seeed_gfx_set_text_size(variables_get($tft), "1")` | Dynamic code |
| `seeed_gfx_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_gfx_set_cursor(variables_get($tft), math_number(0), math_number(0))` | Dynamic code |
| `seeed_gfx_print` | Statement | VAR(field_variable), TEXT(input_value) | `seeed_gfx_print(variables_get($tft), text("value"))` | Dynamic code |
| `seeed_gfx_draw_string` | Statement | VAR(field_variable), TEXT(input_value), X(input_value), Y(input_value), FONT(dropdown) | `seeed_gfx_draw_string(variables_get($tft), text("value"), math_number(0), math_number(0), "1")` | Dynamic code |
| `seeed_gfx_animation` | Value | CUSTOM_ANIMATION(field_tftespi_animation) | `seeed_gfx_animation()` | ..._frames |
| `seeed_gfx_play_animation` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `seeed_gfx_play_animation(variables_get($tft), math_number(0), math_number(0), math_number(0), BLOCKING, FALSE)` | // No Seeed GFX animation data\n |
| `seeed_gfx_play_sd_video` | Statement | VAR(field_variable), FILENAME(input_value), BUFFER_KB(input_value) | `seeed_gfx_play_sd_video(variables_get($tft), text("value"), math_number(0))` | RGB565 uses two payload buffers and LCD DMA when available; other formats use the synchronous path |

## SD Video DMA Contract

- `BUFFER_KB` is the size of each payload buffer. RGB565 playback normally allocates two buffers, capped at 65,534 bytes per DMA chunk; RGB332 and MONO1_XBM allocate one.
- The RGB565 DMA path is used only when the video rectangle fits the active display viewport. Allocation or DMA initialization failure falls back to the existing synchronous renderer.
- LCD DMA and onboard-SD reads can overlap because Wio Terminal routes them through separate SPI peripherals. The final DMA transfer is completed before the TFT transaction and buffers are released.
- `seeedGfxWaitVideoFrame` still enforces the FPS stored in the AILY header and only waits when DMA playback finishes early.
| `seeed_gfx_draw_animation_frame` | Statement | VAR(field_variable), X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `seeed_gfx_draw_animation_frame(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | seeedGfxDrawAnimationFrameByIndex(..., ..., ..., ..._width, ..._height, ..._frames, ..._fr |
| `seeed_gfx_animation_frame_count` | Value | ANIMATION(input_value) | `seeed_gfx_animation_frame_count(math_number(0))` | ..._frame_count |
| `seeed_gfx_step_animation_frame` | Statement | FRAME_VAR(field_variable), TARGET(input_value), FRAME_COUNT(input_value), DIRECTION(dropdown) | `seeed_gfx_step_animation_frame(variables_get($seeedGfxAnimationFrame), math_number(0), math_number(0), AUTO)` | int32_t ... = (int32_t)(...);\n |
| `seeed_gfx_create_sprite` | Statement | WIDTH(input_value), HEIGHT(input_value), VAR(field_input) | `seeed_gfx_create_sprite(math_number(0), math_number(0), "sprite")` | Dynamic code |
| `seeed_gfx_color` | Value | COLOR(dropdown) | `seeed_gfx_color(TFT_WHITE)` | Dynamic code |
| `seeed_gfx_get_width` | Value | VAR(field_variable) | `seeed_gfx_get_width(variables_get($tft))` | Dynamic code |
| `seeed_gfx_get_height` | Value | VAR(field_variable) | `seeed_gfx_get_height(variables_get($tft))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FREQUENCY | 50000000, (F_CPU / 2), 40000000, 27000000, 20000000, 10000000 | `seeed_gfx_init`; default 50 MHz, MAX is CPU/2 and is for testing only |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | seeed_gfx_set_rotation |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | seeed_gfx_set_text_size |
| FONT | 1, 2, 4, 6, 7 | seeed_gfx_draw_string |
| PLAY_MODE | BLOCKING, NON_BLOCKING | seeed_gfx_play_animation |
| DIRECTION | AUTO, FORWARD, BACKWARD | seeed_gfx_step_animation_frame |
| COLOR | TFT_WHITE, TFT_BLACK, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_MAGENTA, TFT_CYAN, TFT_ORANGE, TFT_PINK, TFT_PURPLE, TFT_BROWN, TFT_DARKGREY, TFT_LIGHTGREY, TFT_GOLD, TFT_SILVER, TFT_SKYBLUE, TFT_VIOLET, TFT_OLIVE... | seeed_gfx_color |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_gfx_init("tft", "50000000")
    seeed_gfx_set_rotation($tft, 3)
    seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))
    seeed_gfx_set_text_color($tft, seeed_gfx_color(TFT_WHITE), seeed_gfx_color(TFT_BLACK))
    seeed_gfx_draw_string($tft, text("Wio Terminal"), math_number(40), math_number(40), 2)

arduino_loop()
```

## Notes

1. **Initialization**: `seeed_gfx_init("tft", frequency)` creates and initializes `$tft` with Wio Terminal model `500`. Available SPI frequencies are `50`, `MAX (CPU/2)`, `40`, `27`, `20`, and `10 MHz`; `50 MHz` is the default. MAX is 100 MHz at a 200 MHz CPU clock or 60 MHz at the standard 120 MHz clock and may corrupt the display.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `seeed_gfx_play_animation` may add fields at runtime through Blockly extensions.

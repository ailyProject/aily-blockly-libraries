# Seeed LVGL

Blockly ABS reference for Seeed_GFX plus Seeed_Arduino_LvGL. The bundled LVGL source is LVGL 7.0.2, so generated LVGL code uses v7 APIs such as `lv_disp_drv_t`, `lv_disp_buf_t`, `lv_scr_act()`, and `lv_obj_set_style_local_*`.

## Library Info
- **Name**: @aily-project/lib-seeed-lvgl
- **Version**: 1.0.0
- **Source**: Seeed_GFX 2.0.3, Seeed_Arduino_LvGL 6.1.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `seeed_gfx_setup` | Statement | VAR, MODEL, FREQUENCY, WIDTH, HEIGHT, MISO, MOSI, SCLK, CS, DC, RST, BL, BL_LEVEL, COLOR_MODE, ROTATION | `seeed_gfx_setup("tft", ST7789_DRIVER, 27000000, 240, 240, -1, -1, -1, -1, -1, -1, -1, HIGH, TFT_RGB, 0)` | `TFT_eSPI tft; tft.init();` |
| `seeed_gfx_set_rotation` | Statement | VAR, ROTATION | `seeed_gfx_set_rotation($tft, 1)` | `tft.setRotation(1);` |
| `seeed_gfx_invert_display` | Statement | VAR, INVERT | `seeed_gfx_invert_display($tft, true)` | `tft.invertDisplay(true);` |
| `seeed_gfx_fill_screen` | Statement | VAR, COLOR | `seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))` | `tft.fillScreen(color);` |
| `seeed_gfx_draw_pixel` | Statement | VAR, X, Y, COLOR | `seeed_gfx_draw_pixel($tft, 0, 0, color)` | `drawPixel` |
| `seeed_gfx_draw_line` | Statement | VAR, X1, Y1, X2, Y2, COLOR | `seeed_gfx_draw_line($tft, 0, 0, 100, 100, color)` | `drawLine` |
| `seeed_gfx_draw_rect` | Statement | VAR, X, Y, W, H, COLOR | `seeed_gfx_draw_rect($tft, 0, 0, 80, 40, color)` | `drawRect` |
| `seeed_gfx_fill_rect` | Statement | VAR, X, Y, W, H, COLOR | `seeed_gfx_fill_rect($tft, 0, 0, 80, 40, color)` | `fillRect` |
| `seeed_gfx_draw_circle` | Statement | VAR, X, Y, RADIUS, COLOR | `seeed_gfx_draw_circle($tft, 60, 60, 20, color)` | `drawCircle` |
| `seeed_gfx_fill_circle` | Statement | VAR, X, Y, RADIUS, COLOR | `seeed_gfx_fill_circle($tft, 60, 60, 20, color)` | `fillCircle` |
| `seeed_gfx_draw_triangle` | Statement | VAR, X1, Y1, X2, Y2, X3, Y3, COLOR | `seeed_gfx_draw_triangle($tft, 60, 10, 20, 80, 100, 80, color)` | `drawTriangle` |
| `seeed_gfx_fill_triangle` | Statement | VAR, X1, Y1, X2, Y2, X3, Y3, COLOR | `seeed_gfx_fill_triangle($tft, 60, 10, 20, 80, 100, 80, color)` | `fillTriangle` |
| `seeed_gfx_draw_round_rect` | Statement | VAR, X, Y, W, H, RADIUS, COLOR | `seeed_gfx_draw_round_rect($tft, 0, 0, 80, 40, 8, color)` | `drawRoundRect` |
| `seeed_gfx_fill_round_rect` | Statement | VAR, X, Y, W, H, RADIUS, COLOR | `seeed_gfx_fill_round_rect($tft, 0, 0, 80, 40, 8, color)` | `fillRoundRect` |
| `seeed_gfx_set_text_style` | Statement | VAR, TEXT_COLOR, BG_COLOR, SIZE, FONT | `seeed_gfx_set_text_style($tft, fg, bg, 2, 2)` | `setTextColor/setTextSize/setTextFont` |
| `seeed_gfx_draw_string` | Statement | VAR, X, Y, TEXT | `seeed_gfx_draw_string($tft, 0, 0, text("Hello"))` | `drawString` |
| `seeed_gfx_set_cursor` | Statement | VAR, X, Y | `seeed_gfx_set_cursor($tft, 0, 0)` | `setCursor` |
| `seeed_gfx_print` | Statement | VAR, TEXT, NEWLINE | `seeed_gfx_print($tft, text("Hi"), true)` | `print/println` |
| `seeed_gfx_color` | Value | COLOR | `seeed_gfx_color(TFT_WHITE)` | `TFT_WHITE` |
| `seeed_gfx_color_rgb` | Value | COLOR | `seeed_gfx_color_rgb(#ff0000)` | `0xF800` |
| `seeed_gfx_width` | Value | VAR | `seeed_gfx_width($tft)` | `tft.width()` |
| `seeed_gfx_height` | Value | VAR | `seeed_gfx_height($tft)` | `tft.height()` |
| `seeed_gfx_read_touch` | Statement | VAR, XVAR, YVAR, TOUCHVAR, THRESHOLD | `seeed_gfx_read_touch($tft, "x", "y", "pressed", 600)` | `getTouch(&x,&y,600)` |
| `seeed_gfx_touch_pressed` | Value | VAR, THRESHOLD | `seeed_gfx_touch_pressed($tft, 600)` | `getTouch(...)` |
| `seeed_gfx_sprite_create` | Statement | VAR, TFT, WIDTH, HEIGHT, DEPTH | `seeed_gfx_sprite_create("sprite", $tft, 80, 80, 16)` | `TFT_eSprite` |
| `seeed_gfx_sprite_set_depth` | Statement | VAR, DEPTH | `seeed_gfx_sprite_set_depth($sprite, 16)` | `setColorDepth` |
| `seeed_gfx_sprite_fill` | Statement | VAR, COLOR | `seeed_gfx_sprite_fill($sprite, color)` | `fillSprite` |
| `seeed_gfx_sprite_push` | Statement | VAR, X, Y | `seeed_gfx_sprite_push($sprite, 0, 0)` | `pushSprite` |
| `seeed_gfx_sprite_delete` | Statement | VAR | `seeed_gfx_sprite_delete($sprite)` | `deleteSprite` |
| `seeed_gfx_epaper_setup` | Statement | VAR, WAKE | `seeed_gfx_epaper_setup("epaper", 0)` | `EPaper epaper; epaper.begin();` |
| `seeed_gfx_epaper_update` | Statement | VAR | `seeed_gfx_epaper_update($epaper)` | `update` |
| `seeed_gfx_epaper_sleep` | Statement | VAR | `seeed_gfx_epaper_sleep($epaper)` | `sleep` |
| `seeed_gfx_epaper_wake` | Statement | VAR | `seeed_gfx_epaper_wake($epaper)` | `wake` |
| `seeed_gfx_epaper_partial_update` | Statement | VAR, X, Y, W, H | `seeed_gfx_epaper_partial_update($epaper, 0, 0, 120, 60)` | `updataPartial` |
| `seeed_lvgl_init` | Statement | TFT, WIDTH, HEIGHT, ROTATION, BUFFER_LINES, TICK_MS | `seeed_lvgl_init($tft, 320, 240, 3, 10, 5)` | `lv_init` + display flush |
| `seeed_lvgl_touch_input_create` | Statement | VAR, TFT, THRESHOLD | `seeed_lvgl_touch_input_create("indev", $tft, 600)` | `lv_indev_drv_register` |
| `seeed_lvgl_screen_create` | Statement | VAR | `seeed_lvgl_screen_create("screen")` | `lv_obj_create(NULL,NULL)` |
| `seeed_lvgl_screen_load` | Statement | VAR | `seeed_lvgl_screen_load($screen)` | `lv_scr_load` |
| `seeed_lvgl_active_screen` | Value | none | `seeed_lvgl_active_screen()` | `lv_scr_act()` |
| `seeed_lvgl_obj_set_pos` | Statement | VAR, X, Y | `seeed_lvgl_obj_set_pos($obj, 0, 0)` | `lv_obj_set_pos` |
| `seeed_lvgl_obj_set_size` | Statement | VAR, W, H | `seeed_lvgl_obj_set_size($obj, 100, 40)` | `lv_obj_set_size` |
| `seeed_lvgl_obj_align` | Statement | VAR, ALIGN, X, Y | `seeed_lvgl_obj_align($obj, LV_ALIGN_CENTER, 0, 0)` | `lv_obj_align(obj,NULL,...)` |
| `seeed_lvgl_obj_set_hidden` | Statement | VAR, HIDDEN | `seeed_lvgl_obj_set_hidden($obj, false)` | `lv_obj_set_hidden` |
| `seeed_lvgl_obj_delete` | Statement | VAR | `seeed_lvgl_obj_delete($obj)` | `lv_obj_del` |
| `seeed_lvgl_obj_set_event` | Statement | VAR, EVENT, @HANDLER | `seeed_lvgl_obj_set_event($btn, LV_EVENT_CLICKED) @HANDLER: ...` | `lv_obj_set_event_cb` |
| `seeed_lvgl_label_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_label_create(global, "label", $screen)` | `lv_label_create` |
| `seeed_lvgl_label_set_text` | Statement | VAR, TEXT | `seeed_lvgl_label_set_text($label, text("Hello"))` | `lv_label_set_text` |
| `seeed_lvgl_label_set_long_mode` | Statement | VAR, MODE | `seeed_lvgl_label_set_long_mode($label, LV_LABEL_LONG_BREAK)` | `lv_label_set_long_mode` |
| `seeed_lvgl_button_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_button_create(global, "btn", $screen)` | `lv_btn_create` |
| `seeed_lvgl_slider_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_slider_create(global, "slider", $screen)` | `lv_slider_create` |
| `seeed_lvgl_slider_set_range` | Statement | VAR, MIN, MAX | `seeed_lvgl_slider_set_range($slider, 0, 100)` | `lv_slider_set_range` |
| `seeed_lvgl_slider_set_value` | Statement | VAR, VALUE, ANIM | `seeed_lvgl_slider_set_value($slider, 50, LV_ANIM_OFF)` | `lv_slider_set_value` |
| `seeed_lvgl_slider_get_value` | Value | VAR | `seeed_lvgl_slider_get_value($slider)` | `lv_slider_get_value` |
| `seeed_lvgl_bar_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_bar_create(global, "bar", $screen)` | `lv_bar_create` |
| `seeed_lvgl_bar_set_range` | Statement | VAR, MIN, MAX | `seeed_lvgl_bar_set_range($bar, 0, 100)` | `lv_bar_set_range` |
| `seeed_lvgl_bar_set_value` | Statement | VAR, VALUE, ANIM | `seeed_lvgl_bar_set_value($bar, 50, LV_ANIM_OFF)` | `lv_bar_set_value` |
| `seeed_lvgl_switch_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_switch_create(global, "sw", $screen)` | `lv_switch_create` |
| `seeed_lvgl_switch_set` | Statement | VAR, STATE, ANIM | `seeed_lvgl_switch_set($sw, ON, LV_ANIM_OFF)` | `lv_switch_on/off/toggle` |
| `seeed_lvgl_switch_get_state` | Value | VAR | `seeed_lvgl_switch_get_state($sw)` | `lv_switch_get_state` |
| `seeed_lvgl_checkbox_create` | Statement | SCOPE, VAR, PARENT, TEXT | `seeed_lvgl_checkbox_create(global, "checkbox", $screen, text("Check"))` | `lv_checkbox_create` |
| `seeed_lvgl_image_create` | Statement | SCOPE, VAR, PARENT | `seeed_lvgl_image_create(global, "img", $screen)` | `lv_img_create` |
| `seeed_lvgl_image_set_src` | Statement | VAR, SRC | `seeed_lvgl_image_set_src($img, text("A:/image.bin"))` | `lv_img_set_src` |
| `seeed_lvgl_image_set_transform` | Statement | VAR, ZOOM, ANGLE | `seeed_lvgl_image_set_transform($img, 256, 0)` | `lv_img_set_zoom/angle` |
| `seeed_lvgl_style_color` | Statement | VAR, PART, STATE, PROPERTY, COLOR | `seeed_lvgl_style_color($obj, LV_OBJ_PART_MAIN, LV_STATE_DEFAULT, bg_color, color)` | `lv_obj_set_style_local_*` |
| `seeed_lvgl_style_number` | Statement | VAR, PART, STATE, PROPERTY, VALUE | `seeed_lvgl_style_number($obj, LV_OBJ_PART_MAIN, LV_STATE_DEFAULT, radius, 4)` | `lv_obj_set_style_local_*` |
| `seeed_lvgl_color` | Value | COLOR | `seeed_lvgl_color(LV_COLOR_WHITE)` | `LV_COLOR_WHITE` |
| `seeed_lvgl_color_rgb` | Value | COLOR | `seeed_lvgl_color_rgb(#0080ff)` | `lv_color_make(...)` |

## Parameter Options

| Parameter | Values |
|---|---|
| MODEL | ST7789_DRIVER, ILI9341_DRIVER, ILI9488_DRIVER, GC9A01_DRIVER, GC9D01_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, RM68140_DRIVER, ST7796_DRIVER, SSD1351_DRIVER |
| ROTATION | 0, 1, 2, 3 |
| GFX colors | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY |
| LVGL align | LV_ALIGN_CENTER, LV_ALIGN_IN_TOP_MID, LV_ALIGN_IN_BOTTOM_MID, LV_ALIGN_IN_LEFT_MID, LV_ALIGN_IN_RIGHT_MID, LV_ALIGN_IN_TOP_LEFT, LV_ALIGN_IN_TOP_RIGHT, LV_ALIGN_IN_BOTTOM_LEFT, LV_ALIGN_IN_BOTTOM_RIGHT |
| LVGL event | LV_EVENT_CLICKED, LV_EVENT_VALUE_CHANGED, LV_EVENT_PRESSED, LV_EVENT_RELEASED, LV_EVENT_LONG_PRESSED |
| LVGL style property | bg_color, border_color, text_color, line_color, radius, border_width, bg_opa, text_opa, pad_inner, line_width |

## ABS Examples

### LVGL label
```text
arduino_setup()
    seeed_gfx_setup("tft", ST7789_DRIVER, 27000000, math_number(240), math_number(240), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), HIGH, TFT_RGB, 0)
    seeed_lvgl_init($tft, math_number(240), math_number(240), 0, math_number(10), math_number(5))
    seeed_lvgl_screen_create("screen")
    seeed_lvgl_label_create(global, "label", $screen)
    seeed_lvgl_label_set_text($label, text("Hello LVGL"))
    seeed_lvgl_obj_align($label, LV_ALIGN_CENTER, math_number(0), math_number(0))
```

### GFX drawing
```text
arduino_setup()
    seeed_gfx_setup("tft", ST7789_DRIVER, 27000000, math_number(240), math_number(240), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), math_number(-1), HIGH, TFT_RGB, 0)
    seeed_gfx_fill_screen($tft, seeed_gfx_color(TFT_BLACK))
    seeed_gfx_draw_string($tft, math_number(10), math_number(10), text("Seeed"))
```

## Notes
1. Use `seeed_gfx_setup` before `seeed_lvgl_init`.
2. This library targets LVGL 7 source APIs; do not generate LVGL 8/9 calls for it.
3. `seeed_lvgl_init` installs `lv_tick_inc`, `lv_task_handler`, and `delay` into loop begin code.
4. E-Paper blocks require compatible Seeed_GFX e-paper driver macros and explicit refresh with update blocks.

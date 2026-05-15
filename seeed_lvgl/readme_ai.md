# Seeed LVGL graphics UI

Seeed_GFX and Seeed_Arduino_LvGL graphics UI library for TFT drawing, touch, sprites, e-paper, and LVGL widgets.

## Library Info
- **Name**: @aily-project/lib-seeed-lvgl
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_gfx_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(inpu... | `seeed_gfx_setup("tft", ST7789_DRIVER, "10000000", math_number(0), ...)` | generator |
| `seeed_gfx_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `seeed_gfx_set_rotation($tft, "0")` | generator |
| `seeed_gfx_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `seeed_gfx_invert_display($tft, true)` | generator |
| `seeed_gfx_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `seeed_gfx_fill_screen($tft, math_number(0))` | generator |
| `seeed_gfx_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `seeed_gfx_draw_pixel($tft, math_number(0), math_number(0), math_number(0))` | generator |
| `seeed_gfx_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value)... | `seeed_gfx_draw_line($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), CO... | `seeed_gfx_draw_rect($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), CO... | `seeed_gfx_fill_rect($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_v... | `seeed_gfx_draw_circle($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_v... | `seeed_gfx_fill_circle($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value)... | `seeed_gfx_draw_triangle($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value)... | `seeed_gfx_fill_triangle($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RA... | `seeed_gfx_draw_round_rect($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), RA... | `seeed_gfx_fill_round_rect($tft, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_set_text_style` | Statement | VAR(field_variable), TEXT_COLOR(input_value), BG_COLOR(input_value), SIZE(dropdown), FO... | `seeed_gfx_set_text_style($tft, text("value"), math_number(0), "1", ...)` | generator |
| `seeed_gfx_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `seeed_gfx_draw_string($tft, math_number(0), math_number(0), text("value"))` | generator |
| `seeed_gfx_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_gfx_set_cursor($tft, math_number(0), math_number(0))` | generator |
| `seeed_gfx_print` | Statement | VAR(field_variable), TEXT(input_value), NEWLINE(dropdown) | `seeed_gfx_print($tft, text("value"), true)` | generator |
| `seeed_gfx_color` | Value | COLOR(dropdown) | `seeed_gfx_color(TFT_BLACK)` | generator |
| `seeed_gfx_color_rgb` | Value | COLOR(field_colour_hsv_sliders) | `seeed_gfx_color_rgb()` | generator |
| `seeed_gfx_width` | Value | VAR(field_variable) | `seeed_gfx_width($tft)` | generator |
| `seeed_gfx_height` | Value | VAR(field_variable) | `seeed_gfx_height($tft)` | generator |
| `seeed_gfx_read_touch` | Statement | VAR(field_variable), XVAR(field_input), YVAR(field_input), TOUCHVAR(field_input), THRES... | `seeed_gfx_read_touch($tft, "touchX", "touchY", "touched", ...)` | generator |
| `seeed_gfx_touch_pressed` | Value | VAR(field_variable), THRESHOLD(input_value) | `seeed_gfx_touch_pressed($tft, math_number(0))` | generator |
| `seeed_gfx_sprite_create` | Statement | VAR(field_input), TFT(field_variable), WIDTH(input_value), HEIGHT(input_value), DEPTH(d... | `seeed_gfx_sprite_create("sprite", $tft, math_number(0), math_number(0), ...)` | generator |
| `seeed_gfx_sprite_set_depth` | Statement | VAR(field_variable), DEPTH(dropdown) | `seeed_gfx_sprite_set_depth($sprite, "1")` | generator |
| `seeed_gfx_sprite_fill` | Statement | VAR(field_variable), COLOR(input_value) | `seeed_gfx_sprite_fill($sprite, math_number(0))` | generator |
| `seeed_gfx_sprite_push` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_gfx_sprite_push($sprite, math_number(0), math_number(0))` | generator |
| `seeed_gfx_sprite_delete` | Statement | VAR(field_variable) | `seeed_gfx_sprite_delete($sprite)` | generator |
| `seeed_gfx_epaper_setup` | Statement | VAR(field_input), WAKE(dropdown) | `seeed_gfx_epaper_setup("epaper", "0")` | generator |
| `seeed_gfx_epaper_update` | Statement | VAR(field_variable) | `seeed_gfx_epaper_update($epaper)` | generator |
| `seeed_gfx_epaper_sleep` | Statement | VAR(field_variable) | `seeed_gfx_epaper_sleep($epaper)` | generator |
| `seeed_gfx_epaper_wake` | Statement | VAR(field_variable) | `seeed_gfx_epaper_wake($epaper)` | generator |
| `seeed_gfx_epaper_partial_update` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value) | `seeed_gfx_epaper_partial_update($epaper, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `seeed_lvgl_init` | Statement | TFT(field_variable), WIDTH(input_value), HEIGHT(input_value), ROTATION(dropdown), BUFFE... | `seeed_lvgl_init($tft, math_number(0), math_number(0), "0", ...)` | generator |
| `seeed_lvgl_touch_input_create` | Statement | VAR(field_input), TFT(field_variable), THRESHOLD(input_value) | `seeed_lvgl_touch_input_create("indev", $tft, math_number(0))` | generator |
| `seeed_lvgl_screen_create` | Statement | VAR(field_input) | `seeed_lvgl_screen_create("screen")` | generator |
| `seeed_lvgl_screen_load` | Statement | VAR(field_variable) | `seeed_lvgl_screen_load($screen)` | generator |
| `seeed_lvgl_active_screen` | Value | (none) | `seeed_lvgl_active_screen()` | generator |
| `seeed_lvgl_obj_set_pos` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_lvgl_obj_set_pos($obj, math_number(0), math_number(0))` | generator |
| `seeed_lvgl_obj_set_size` | Statement | VAR(field_variable), W(input_value), H(input_value) | `seeed_lvgl_obj_set_size($obj, math_number(0), math_number(0))` | generator |
| `seeed_lvgl_obj_align` | Statement | VAR(field_variable), ALIGN(dropdown), X(input_value), Y(input_value) | `seeed_lvgl_obj_align($obj, LV_ALIGN_CENTER, math_number(0), math_number(0))` | generator |
| `seeed_lvgl_obj_set_hidden` | Statement | VAR(field_variable), HIDDEN(dropdown) | `seeed_lvgl_obj_set_hidden($obj, true)` | generator |
| `seeed_lvgl_obj_delete` | Statement | VAR(field_variable) | `seeed_lvgl_obj_delete($obj)` | generator |
| `seeed_lvgl_obj_set_event` | Statement | VAR(field_variable), EVENT(dropdown), HANDLER(input_statement) | `seeed_lvgl_obj_set_event($obj, LV_EVENT_CLICKED) @HANDLER: child_block()` | generator |
| `seeed_lvgl_label_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_label_create(global, "label", $screen)` | generator |
| `seeed_lvgl_label_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `seeed_lvgl_label_set_text($label, text("value"))` | generator |
| `seeed_lvgl_label_set_long_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_lvgl_label_set_long_mode($label, LV_LABEL_LONG_EXPAND)` | generator |
| `seeed_lvgl_button_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_button_create(global, "btn", $screen)` | generator |
| `seeed_lvgl_slider_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_slider_create(global, "slider", $screen)` | generator |
| `seeed_lvgl_slider_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `seeed_lvgl_slider_set_range($slider, math_number(0), math_number(0))` | generator |
| `seeed_lvgl_slider_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `seeed_lvgl_slider_set_value($slider, math_number(0), LV_ANIM_ON)` | generator |
| `seeed_lvgl_slider_get_value` | Value | VAR(field_variable) | `seeed_lvgl_slider_get_value($slider)` | generator |
| `seeed_lvgl_bar_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_bar_create(global, "bar", $screen)` | generator |
| `seeed_lvgl_bar_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `seeed_lvgl_bar_set_range($bar, math_number(0), math_number(0))` | generator |
| `seeed_lvgl_bar_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `seeed_lvgl_bar_set_value($bar, math_number(0), LV_ANIM_ON)` | generator |
| `seeed_lvgl_switch_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_switch_create(global, "sw", $screen)` | generator |
| `seeed_lvgl_switch_set` | Statement | VAR(field_variable), STATE(dropdown), ANIM(dropdown) | `seeed_lvgl_switch_set($sw, ON, LV_ANIM_ON)` | generator |
| `seeed_lvgl_switch_get_state` | Value | VAR(field_variable) | `seeed_lvgl_switch_get_state($sw)` | generator |
| `seeed_lvgl_checkbox_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable), TEXT(input_value) | `seeed_lvgl_checkbox_create(global, "checkbox", $screen, text("value"))` | generator |
| `seeed_lvgl_image_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `seeed_lvgl_image_create(global, "img", $screen)` | generator |
| `seeed_lvgl_image_set_src` | Statement | VAR(field_variable), SRC(input_value) | `seeed_lvgl_image_set_src($img, math_number(0))` | generator |
| `seeed_lvgl_image_set_transform` | Statement | VAR(field_variable), ZOOM(input_value), ANGLE(input_value) | `seeed_lvgl_image_set_transform($img, math_number(0), math_number(90))` | generator |
| `seeed_lvgl_style_color` | Statement | VAR(field_variable), PART(dropdown), STATE(dropdown), PROPERTY(dropdown), COLOR(input_v... | `seeed_lvgl_style_color($obj, LV_OBJ_PART_MAIN, LV_STATE_DEFAULT, bg_color, ...)` | generator |
| `seeed_lvgl_style_number` | Statement | VAR(field_variable), PART(dropdown), STATE(dropdown), PROPERTY(dropdown), VALUE(input_v... | `seeed_lvgl_style_number($obj, LV_OBJ_PART_MAIN, LV_STATE_DEFAULT, radius, ...)` | generator |
| `seeed_lvgl_color` | Value | COLOR(dropdown) | `seeed_lvgl_color(LV_COLOR_WHITE)` | generator |
| `seeed_lvgl_color_rgb` | Value | COLOR(field_colour_hsv_sliders) | `seeed_lvgl_color_rgb()` | generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ST7789_DRIVER, ILI9341_DRIVER, ILI9488_DRIVER, GC9A01_DRIVER, GC9D01_DRIVER,... | seeed_gfx_setup |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | seeed_gfx_setup |
| BL_LEVEL | HIGH, LOW | seeed_gfx_setup |
| COLOR_MODE | TFT_RGB, TFT_BGR | seeed_gfx_setup |
| ROTATION | 0, 1, 2, 3 | seeed_gfx_setup, seeed_gfx_set_rotation, seeed_lvgl_init |
| INVERT | true, false | seeed_gfx_invert_display |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | seeed_gfx_set_text_style |
| FONT | 1, 2, 4, 6, 7, 8 | seeed_gfx_set_text_style |
| NEWLINE | true, false | seeed_gfx_print |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT... | seeed_gfx_color |
| DEPTH | 1, 4, 8, 16 | seeed_gfx_sprite_create, seeed_gfx_sprite_set_depth |
| WAKE | 0, 1 | seeed_gfx_epaper_setup |
| ALIGN | LV_ALIGN_CENTER, LV_ALIGN_IN_TOP_MID, LV_ALIGN_IN_BOTTOM_MID, LV_ALIGN_IN_LEF... | seeed_lvgl_obj_align |
| HIDDEN | true, false | seeed_lvgl_obj_set_hidden |
| EVENT | LV_EVENT_CLICKED, LV_EVENT_VALUE_CHANGED, LV_EVENT_PRESSED, LV_EVENT_RELEASED... | seeed_lvgl_obj_set_event |
| SCOPE | global, local | seeed_lvgl_label_create, seeed_lvgl_button_create, seeed_lvgl_slide... |
| MODE | LV_LABEL_LONG_EXPAND, LV_LABEL_LONG_BREAK, LV_LABEL_LONG_DOT, LV_LABEL_LONG_S... | seeed_lvgl_label_set_long_mode |
| ANIM | LV_ANIM_ON, LV_ANIM_OFF | seeed_lvgl_slider_set_value, seeed_lvgl_bar_set_value, seeed_lvgl_s... |
| STATE | ON, OFF, TOGGLE | seeed_lvgl_switch_set |
| PART | LV_OBJ_PART_MAIN, LV_BTN_PART_MAIN, LV_SLIDER_PART_BG, LV_SLIDER_PART_INDIC,... | seeed_lvgl_style_color, seeed_lvgl_style_number |
| STATE | LV_STATE_DEFAULT, LV_STATE_PRESSED, LV_STATE_CHECKED, LV_STATE_DISABLED | seeed_lvgl_style_color, seeed_lvgl_style_number |
| PROPERTY | bg_color, border_color, text_color, line_color | seeed_lvgl_style_color |
| PROPERTY | radius, border_width, bg_opa, text_opa, pad_inner, line_width | seeed_lvgl_style_number |
| COLOR | LV_COLOR_WHITE, LV_COLOR_BLACK, LV_COLOR_RED, LV_COLOR_GREEN, LV_COLOR_BLUE,... | seeed_lvgl_color |

## Notes

1. **Variable**: `seeed_gfx_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

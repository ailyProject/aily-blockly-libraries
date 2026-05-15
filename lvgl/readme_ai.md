# LVGL graphics library

Embedded graphics library, providing rich UI controls and beautiful visual effects

## Library Info
- **Name**: @aily-project/lib-lvgl
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lvgl_init` | Statement | DRIVER(dropdown), WIDTH(input_value), HEIGHT(input_value), ROTATION(dropdown) | `lvgl_init(TFT_eSPI, math_number(0), math_number(0), LV_DISPLAY_ROTATION_0)` | generator |
| `lvgl_indev_create` | Statement | SCOPE(dropdown), VAR(field_input), TYPE(dropdown), HANDLER(input_statement) | `lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER) @HANDLER: child_block()` | generator |
| `lvgl_indev_data_param_set` | Statement | PARAM(dropdown), VALUE(input_value) | `lvgl_indev_data_param_set(state, math_number(0))` | generator |
| `lvgl_indev_state_param` | Value | STATE(dropdown) | `lvgl_indev_state_param(LV_INDEV_STATE_REL)` | generator |
| `lvgl_label_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_label_create(global, "label", $screen)` | generator |
| `lvgl_label_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text($label, text("value"))` | generator |
| `lv_label_set_text_fmt` | Statement | VAR(field_variable), FMT(input_value), ARGS(input_value) | `lv_label_set_text_fmt($label, text("value"), math_number(0))` | generator |
| `lvgl_label_set_long_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_label_set_long_mode($label, LV_LABEL_LONG_MODE_WRAP)` | generator |
| `lvgl_button_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_button_create(global, "btn", $screen)` | generator |
| `lvgl_slider_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_slider_create(global, "slider", $screen)` | generator |
| `lvgl_slider_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_slider_set_value($slider, math_number(0), LV_ANIM_ON)` | generator |
| `lvgl_slider_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_slider_set_range($slider, math_number(0), math_number(0))` | generator |
| `lvgl_slider_get_value` | Value | VAR(field_variable) | `lvgl_slider_get_value($slider)` | generator |
| `lvgl_switch_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_switch_create(global, "sw1", $screen)` | generator |
| `lvgl_checkbox_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable), TEXT(input_value) | `lvgl_checkbox_create(global, "cb", $screen, text("value"))` | generator |
| `lvgl_bar_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_bar_create(global, "bar", $screen)` | generator |
| `lvgl_bar_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_bar_set_value($bar, math_number(0), LV_ANIM_ON)` | generator |
| `lvgl_bar_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_bar_set_range($bar, math_number(0), math_number(0))` | generator |
| `lvgl_arc_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_arc_create(global, "arc", $screen)` | generator |
| `lvgl_arc_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `lvgl_arc_set_value($arc, math_number(0))` | generator |
| `lvgl_arc_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_arc_set_range($arc, math_number(0), math_number(0))` | generator |
| `lvgl_spinner_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_spinner_create(global, "spinner", $screen)` | generator |
| `lvgl_spinner_set_anim_params` | Statement | VAR(field_variable), TIME(input_value), ANGLE(input_value) | `lvgl_spinner_set_anim_params($spinner, math_number(1000), math_number(90))` | generator |
| `lvgl_dropdown_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_dropdown_create(global, "dropdown", $screen)` | generator |
| `lvgl_dropdown_set_options` | Statement | VAR(field_variable), OPTIONS(input_value) | `lvgl_dropdown_set_options($dropdown, text("value"))` | generator |
| `lvgl_dropdown_get_selected` | Value | VAR(field_variable) | `lvgl_dropdown_get_selected($dropdown)` | generator |
| `lvgl_textarea_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_textarea_create(global, "textarea1", $screen)` | generator |
| `lvgl_textarea_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_text($textarea, text("value"))` | generator |
| `lvgl_textarea_get_text` | Value | VAR(field_variable) | `lvgl_textarea_get_text($textarea)` | generator |
| `lvgl_textarea_set_placeholder` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_placeholder($textarea, text("value"))` | generator |
| `lvgl_obj_set_pos` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_obj_set_pos($obj, math_number(0), math_number(0))` | generator |
| `lvgl_obj_set_size` | Statement | VAR(field_variable), WIDTH(input_value), HEIGHT(input_value) | `lvgl_obj_set_size($obj, math_number(0), math_number(0))` | generator |
| `lvgl_obj_align` | Statement | VAR(field_variable), ALIGN(dropdown), X_OFS(input_value), Y_OFS(input_value) | `lvgl_obj_align($obj, LV_ALIGN_CENTER, math_number(0), math_number(0))` | generator |
| `lvgl_obj_center` | Statement | VAR(field_variable) | `lvgl_obj_center($obj)` | generator |
| `lvgl_obj_add_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_add_flag($obj, LV_OBJ_FLAG_HIDDEN)` | generator |
| `lvgl_obj_remove_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_remove_flag($obj, LV_OBJ_FLAG_HIDDEN)` | generator |
| `lvgl_obj_add_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_add_state($obj, LV_STATE_CHECKED)` | generator |
| `lvgl_obj_remove_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_remove_state($obj, LV_STATE_CHECKED)` | generator |
| `lvgl_obj_has_state` | Value | VAR(field_variable), STATE(dropdown) | `lvgl_obj_has_state($obj, LV_STATE_CHECKED)` | generator |
| `lvgl_obj_delete` | Statement | VAR(field_variable) | `lvgl_obj_delete($obj)` | generator |
| `lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `lvgl_obj_set_style_text_font($obj, LV_FONT_MONTSERRAT_14)` | generator |
| `lvgl_obj_set_style_bg_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_bg_color($obj)` | generator |
| `lvgl_obj_set_style_text_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_text_color($obj)` | generator |
| `lvgl_obj_set_style_border_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_border_color($obj)` | generator |
| `lvgl_obj_set_style_border_width` | Statement | VAR(field_variable), WIDTH(input_value) | `lvgl_obj_set_style_border_width($obj, math_number(0))` | generator |
| `lvgl_obj_set_style_radius` | Statement | VAR(field_variable), RADIUS(input_value) | `lvgl_obj_set_style_radius($obj, math_number(0))` | generator |
| `lvgl_obj_set_style_pad_all` | Statement | VAR(field_variable), PAD(input_value) | `lvgl_obj_set_style_pad_all($obj, math_number(0))` | generator |
| `lvgl_obj_set_style_bg_opa` | Statement | VAR(field_variable), OPA(dropdown) | `lvgl_obj_set_style_bg_opa($obj, LV_OPA_TRANSP)` | generator |
| `lvgl_event_add_cb` | Statement | VAR(field_variable), EVENT(dropdown), HANDLER(input_statement) | `lvgl_event_add_cb($obj, LV_EVENT_ALL) @HANDLER: child_block()` | generator |
| `lvgl_event_code` | Value | EVENT(dropdown) | `lvgl_event_code(LV_EVENT_ALL)` | generator |
| `lvgl_obj_get_child` | Statement | VAR(field_input), VAR_PARENT(field_variable), INDEX(input_value) | `lvgl_obj_get_child("child_obj", $obj, math_number(0))` | generator |
| `lvgl_screen_active` | Value | (none) | `lvgl_screen_active()` | generator |
| `lvgl_screen_load` | Statement | VAR(field_variable) | `lvgl_screen_load($screen)` | generator |
| `lvgl_obj_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_obj_create(global, "obj", $screen)` | generator |
| `lvgl_screen_create` | Statement | SCOPE(dropdown), VAR(field_input) | `lvgl_screen_create(global, "screen")` | generator |
| `lvgl_image_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_image_create(global, "img", $screen)` | generator |
| `lvgl_image_set_src` | Statement | VAR(field_variable), SRC(input_value) | `lvgl_image_set_src($img, text("value"))` | generator |
| `lvgl_image_set_zoom` | Statement | VAR(field_variable), ZOOM(input_value) | `lvgl_image_set_zoom($img, math_number(0))` | generator |
| `lvgl_image_set_angle` | Statement | VAR(field_variable), ANGLE(input_value) | `lvgl_image_set_angle($img, math_number(90))` | generator |
| `lvgl_image_set_offset` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_image_set_offset($img, math_number(0), math_number(0))` | generator |
| `lvgl_chart_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_chart_create(global, "chart", $screen)` | generator |
| `lvgl_chart_set_type` | Statement | VAR(field_variable), TYPE(dropdown) | `lvgl_chart_set_type($chart, LV_CHART_TYPE_BAR)` | generator |
| `lvgl_chart_set_point_count` | Statement | VAR(field_variable), COUNT(input_value) | `lvgl_chart_set_point_count($chart, math_number(0))` | generator |
| `lvgl_chart_add_series` | Statement | VAR(field_variable), SERIES(field_input), COLOR(dropdown) | `lvgl_chart_add_series($chart, "series1", "lv_palette_main(LV_PALETTE_RED)")` | generator |
| `lvgl_chart_set_next_value` | Statement | VAR(field_variable), SERIES(field_input), VALUE(input_value) | `lvgl_chart_set_next_value($chart, "series1", math_number(0))` | generator |
| `lvgl_chart_set_range` | Statement | VAR(field_variable), SERIES(field_input), MIN(input_value), MAX(input_value) | `lvgl_chart_set_range($chart, "series1", math_number(0), math_number(0))` | generator |
| `lvgl_chart_set_update_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_chart_set_update_mode($chart, LV_CHART_UPDATE_MODE_SHIFT)` | generator |
| `lvgl_chart_refresh` | Statement | VAR(field_variable) | `lvgl_chart_refresh($chart)` | generator |
| `lvgl_keyboard_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_keyboard_create(global, "keyboard", $screen)` | generator |
| `lvgl_keyboard_set_textarea` | Statement | VAR(field_variable), TEXTAREA(field_variable) | `lvgl_keyboard_set_textarea($keyboard, $textarea)` | generator |
| `lvgl_keyboard_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_keyboard_set_mode($keyboard, LV_KEYBOARD_MODE_TEXT_LOWER)` | generator |
| `lvgl_keyboard_set_popovers` | Statement | VAR(field_variable), ENABLE(dropdown) | `lvgl_keyboard_set_popovers($keyboard, true)` | generator |
| `lvgl_list_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_list_create(global, "list", $screen)` | generator |
| `lvgl_list_add_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_list_add_text($list, text("value"))` | generator |
| `lvgl_list_add_btn` | Statement | VAR(field_variable), TEXT(input_value), ICON(dropdown) | `lvgl_list_add_btn($list, text("value"), NULL)` | generator |
| `lvgl_tabview_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_tabview_create(global, "tabview", $screen)` | generator |
| `lvgl_tabview_add_tab` | Value | VAR(field_variable), TEXT(input_value) | `lvgl_tabview_add_tab($tabview, text("value"))` | generator |
| `lvgl_set_img_font` | Statement | ENABLE(dropdown) | `lvgl_set_img_font(true)` | generator |
| `lvgl_set_stdlib_malloc` | Statement | LIB(dropdown) | `lvgl_set_stdlib_malloc(LV_STDLIB_BUILTIN)` | generator |
| `lvgl_set_stdlib_string` | Statement | LIB(dropdown) | `lvgl_set_stdlib_string(LV_STDLIB_BUILTIN)` | generator |
| `lvgl_set_stdlib_sprintf` | Statement | LIB(dropdown) | `lvgl_set_stdlib_sprintf(LV_STDLIB_BUILTIN)` | generator |
| `lvgl_set_theme` | Statement | THEME(dropdown) | `lvgl_set_theme(light)` | generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DRIVER | TFT_eSPI, LovyanGFX | lvgl_init |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DI... | lvgl_init |
| SCOPE | global, local | lvgl_indev_create, lvgl_label_create, lvgl_button_create |
| TYPE | LV_INDEV_TYPE_POINTER, LV_INDEV_TYPE_KEYPAD, LV_INDEV_TYPE_BUTTON, LV_INDEV_T... | lvgl_indev_create |
| PARAM | state, point.x, point.y, key, btn_id, enc_diff | lvgl_indev_data_param_set |
| STATE | LV_INDEV_STATE_REL, LV_INDEV_STATE_PR | lvgl_indev_state_param |
| MODE | LV_LABEL_LONG_MODE_WRAP, LV_LABEL_LONG_MODE_DOTS, LV_LABEL_LONG_MODE_SCROLL,... | lvgl_label_set_long_mode |
| ANIM | LV_ANIM_ON, LV_ANIM_OFF | lvgl_slider_set_value, lvgl_bar_set_value |
| ALIGN | LV_ALIGN_CENTER, LV_ALIGN_TOP_LEFT, LV_ALIGN_TOP_MID, LV_ALIGN_TOP_RIGHT, LV_... | lvgl_obj_align |
| FLAG | LV_OBJ_FLAG_HIDDEN, LV_OBJ_FLAG_CLICKABLE, LV_OBJ_FLAG_CHECKABLE, LV_OBJ_FLAG... | lvgl_obj_add_flag, lvgl_obj_remove_flag |
| STATE | LV_STATE_CHECKED, LV_STATE_FOCUSED, LV_STATE_PRESSED, LV_STATE_DISABLED | lvgl_obj_add_state, lvgl_obj_remove_state, lvgl_obj_has_state |
| FONT | LV_FONT_MONTSERRAT_14, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK, LV_FONT_SOURCE_HAN_... | lvgl_obj_set_style_text_font |
| OPA | LV_OPA_TRANSP, LV_OPA_25, LV_OPA_50, LV_OPA_75, LV_OPA_COVER | lvgl_obj_set_style_bg_opa |
| EVENT | LV_EVENT_ALL, LV_EVENT_PRESSED, LV_EVENT_PRESSING, LV_EVENT_PRESS_LOST, LV_EV... | lvgl_event_add_cb, lvgl_event_code |
| TYPE | LV_CHART_TYPE_BAR, LV_CHART_TYPE_LINE, LV_CHART_TYPE_SCATTER | lvgl_chart_set_type |
| COLOR | lv_palette_main(LV_PALETTE_RED), lv_palette_main(LV_PALETTE_BLUE), lv_palette... | lvgl_chart_add_series |
| MODE | LV_CHART_UPDATE_MODE_SHIFT, LV_CHART_UPDATE_MODE_CIRCULAR | lvgl_chart_set_update_mode |
| MODE | LV_KEYBOARD_MODE_TEXT_LOWER, LV_KEYBOARD_MODE_NUMBER, LV_KEYBOARD_MODE_SPECIAL | lvgl_keyboard_set_mode |
| ENABLE | true, false | lvgl_keyboard_set_popovers, lvgl_set_img_font |
| ICON | NULL, LV_SYMBOL_PLAY, LV_SYMBOL_PAUSE, LV_SYMBOL_STOP, LV_SYMBOL_SETTINGS, LV... | lvgl_list_add_btn |
| LIB | LV_STDLIB_BUILTIN, LV_STDLIB_CLIB | lvgl_set_stdlib_malloc, lvgl_set_stdlib_string, lvgl_set_stdlib_spr... |
| THEME | light, dark | lvgl_set_theme |

## Notes

1. **Variable**: `lvgl_indev_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

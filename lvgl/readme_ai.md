# LVGL图形库

LVGL 图形界面库。该库负责生成 LVGL 控件和事件代码，但显示硬件必须先由底层显示库完成初始化。
**IMPORTANT**:
- 务必明确屏幕旋转方向，确保 LVGL 逻辑坐标与实际显示一致。
- 务必使用基于坐标的对齐和布局方式，如 `lvgl_obj_align(..., LV_ALIGN_CENTER, x_ofs, y_ofs)`，而不是基于父对象边界的对齐方式，如 `LV_ALIGN_TOP_LEFT`，以避免旋转后布局错乱。

## Library Info
- **Name**: @aily-project/lib-lvgl
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lvgl_init` | Statement | DRIVER(dropdown), WIDTH(input_value), HEIGHT(input_value), ROTATION(dropdown) | `lvgl_init(TFT_eSPI, math_number(240), math_number(240), LV_DISPLAY_ROTATION_0)` | `lv_init(); lv_tick_set_cb(millis); lv_tft_espi_create(...); lv_display_set_rotation(...);` |
| `lvgl_indev_create` | Statement | SCOPE(dropdown), VAR(field_input), TYPE(dropdown), HANDLER(input_statement) | `lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER)` | `lv_indev_t *` |
| `lvgl_indev_data_param_set` | Statement | PARAM(dropdown), VALUE(input_value) | `lvgl_indev_data_param_set(state, lvgl_indev_state_param(LV_INDEV_STATE_PR))` | `data->... = ...;` |
| `lvgl_indev_state_param` | Value | STATE(dropdown) | `lvgl_indev_state_param(LV_INDEV_STATE_REL)` | `LV_INDEV_STATE_REL` |
| `lvgl_label_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_label_create(global, "label", $screen)` | `lv_obj_t *` |
| `lvgl_label_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text($label, text("hello"))` | `lv_label_set_text(...);` |
| `lv_label_set_text_fmt` | Statement | VAR(field_variable), FMT(input_value), ARGS(input_value) | `lv_label_set_text_fmt($label, text("Button: %d"), variables_get($count))` | `lv_label_set_text_fmt(...);` |
| `lvgl_label_set_long_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_label_set_long_mode($label, LV_LABEL_LONG_MODE_WRAP)` | `lv_label_set_long_mode(...);` |
| `lvgl_button_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_button_create(global, "btn", $screen)` | `lv_obj_t *` |
| `lvgl_slider_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_slider_create(global, "slider", $screen)` | `lv_obj_t *` |
| `lvgl_slider_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_slider_set_value($slider, math_number(50), LV_ANIM_ON)` | `lv_slider_set_value(...);` |
| `lvgl_slider_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_slider_set_range($slider, math_number(0), math_number(100))` | `lv_slider_set_range(...);` |
| `lvgl_slider_get_value` | Value | VAR(field_variable) | `lvgl_slider_get_value($slider)` | `lv_slider_get_value(...)` |
| `lvgl_switch_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_switch_create(global, "sw1", $screen)` | `lv_obj_t *` |
| `lvgl_checkbox_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable), TEXT(input_value) | `lvgl_checkbox_create(global, "cb", $screen, text("hello"))` | `lv_obj_t *` |
| `lvgl_bar_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_bar_create(global, "bar", $screen)` | `lv_obj_t *` |
| `lvgl_bar_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_bar_set_value($bar, math_number(75), LV_ANIM_ON)` | `lv_bar_set_value(...);` |
| `lvgl_bar_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_bar_set_range($bar, math_number(0), math_number(100))` | `lv_bar_set_range(...);` |
| `lvgl_arc_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_arc_create(global, "arc", $screen)` | `lv_obj_t *` |
| `lvgl_arc_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `lvgl_arc_set_value($arc, math_number(30))` | `lv_arc_set_value(...);` |
| `lvgl_arc_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_arc_set_range($arc, math_number(0), math_number(100))` | `lv_arc_set_range(...);` |
| `lvgl_spinner_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_spinner_create(global, "spinner", $screen)` | `lv_obj_t *` |
| `lvgl_spinner_set_anim_params` | Statement | VAR(field_variable), TIME(input_value), ANGLE(input_value) | `lvgl_spinner_set_anim_params($spinner, math_number(1000), math_number(60))` | `lv_spinner_set_anim_params(...);` |
| `lvgl_dropdown_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_dropdown_create(global, "dropdown", $screen)` | `lv_obj_t *` |
| `lvgl_dropdown_set_options` | Statement | VAR(field_variable), OPTIONS(input_value) | `lvgl_dropdown_set_options($dropdown, text("A\nB\nC"))` | `lv_dropdown_set_options(...);` |
| `lvgl_dropdown_get_selected` | Value | VAR(field_variable) | `lvgl_dropdown_get_selected($dropdown)` | `lv_dropdown_get_selected(...)` |
| `lvgl_textarea_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_textarea_create(global, "textarea1", $screen)` | `lv_obj_t *` |
| `lvgl_textarea_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_text($textarea1, text("hello"))` | `lv_textarea_set_text(...);` |
| `lvgl_textarea_get_text` | Value | VAR(field_variable) | `lvgl_textarea_get_text($textarea1)` | `lv_textarea_get_text(...)` |
| `lvgl_textarea_set_placeholder` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_placeholder($textarea1, text("input here"))` | `lv_textarea_set_placeholder_text(...);` |
| `lvgl_obj_set_pos` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_obj_set_pos($obj, math_number(10), math_number(20))` | `lv_obj_set_pos(...);` |
| `lvgl_obj_set_size` | Statement | VAR(field_variable), WIDTH(input_value), HEIGHT(input_value) | `lvgl_obj_set_size($obj, math_number(120), math_number(60))` | `lv_obj_set_size(...);` |
| `lvgl_obj_align` | Statement | VAR(field_variable), ALIGN(dropdown), X_OFS(input_value), Y_OFS(input_value) | `lvgl_obj_align($obj, LV_ALIGN_CENTER, math_number(0), math_number(0))` | `lv_obj_align(...);` |
| `lvgl_obj_center` | Statement | VAR(field_variable) | `lvgl_obj_center($obj)` | `lv_obj_center(...);` |
| `lvgl_obj_add_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_add_flag($obj, LV_OBJ_FLAG_HIDDEN)` | `lv_obj_add_flag(...);` |
| `lvgl_obj_remove_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_remove_flag($obj, LV_OBJ_FLAG_HIDDEN)` | `lv_obj_remove_flag(...);` |
| `lvgl_obj_add_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_add_state($obj, LV_STATE_CHECKED)` | `lv_obj_add_state(...);` |
| `lvgl_obj_remove_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_remove_state($obj, LV_STATE_CHECKED)` | `lv_obj_remove_state(...);` |
| `lvgl_obj_has_state` | Value | VAR(field_variable), STATE(dropdown) | `lvgl_obj_has_state($obj, LV_STATE_CHECKED)` | `lv_obj_has_state(...)` |
| `lvgl_obj_delete` | Statement | VAR(field_variable) | `lvgl_obj_delete($obj)` | `lv_obj_delete(...);` |
| `lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `lvgl_obj_set_style_text_font($label, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK)` | `lv_obj_set_style_text_font(..., ..., 0);` |
| `lvgl_obj_set_style_bg_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_bg_color($obj)` | `lv_obj_set_style_bg_color(..., lv_color_make(...), 0);` |
| `lvgl_obj_set_style_text_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_text_color($obj)` | `lv_obj_set_style_text_color(..., lv_color_make(...), 0);` |
| `lvgl_obj_set_style_border_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_border_color($obj)` | `lv_obj_set_style_border_color(..., lv_color_make(...), 0);` |
| `lvgl_obj_set_style_border_width` | Statement | VAR(field_variable), WIDTH(input_value) | `lvgl_obj_set_style_border_width($obj, math_number(2))` | `lv_obj_set_style_border_width(...);` |
| `lvgl_obj_set_style_radius` | Statement | VAR(field_variable), RADIUS(input_value) | `lvgl_obj_set_style_radius($obj, math_number(8))` | `lv_obj_set_style_radius(...);` |
| `lvgl_obj_set_style_pad_all` | Statement | VAR(field_variable), PAD(input_value) | `lvgl_obj_set_style_pad_all($obj, math_number(10))` | `lv_obj_set_style_pad_all(...);` |
| `lvgl_obj_set_style_bg_opa` | Statement | VAR(field_variable), OPA(dropdown) | `lvgl_obj_set_style_bg_opa($obj, LV_OPA_COVER)` | `lv_obj_set_style_bg_opa(...);` |
| `lvgl_event_add_cb` | Statement | VAR(field_variable), EVENT(dropdown), HANDLER(input_statement) | `lvgl_event_add_cb($btn, LV_EVENT_CLICKED)` | `lv_obj_add_event_cb(...);` |
| `lvgl_event_code` | Value | EVENT(dropdown) | `lvgl_event_code(LV_EVENT_CLICKED)` | `LV_EVENT_CLICKED` |
| `lvgl_obj_get_child` | Statement | VAR(field_input), VAR_PARENT(field_variable), INDEX(input_value) | `lvgl_obj_get_child("label", $btn, math_number(0))` | `lv_obj_t *` |
| `lvgl_screen_active` | Value | (none) | `lvgl_screen_active()` | `lv_screen_active()` |
| `lvgl_screen_load` | Statement | VAR(field_variable) | `lvgl_screen_load($screen)` | `lv_screen_load(...);` |
| `lvgl_obj_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_obj_create(global, "obj", $screen)` | `lv_obj_t *` |
| `lvgl_screen_create` | Statement | SCOPE(dropdown), VAR(field_input) | `lvgl_screen_create(global, "screen")` | `lv_obj_t *` |
| `lvgl_image_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_image_create(global, "img", $screen)` | `lv_obj_t *` |
| `lvgl_image_set_src` | Statement | VAR(field_variable), SRC(input_value) | `lvgl_image_set_src($img, text("A:/image.bin"))` | `lv_image_set_src(...);` |
| `lvgl_image_set_zoom` | Statement | VAR(field_variable), ZOOM(input_value) | `lvgl_image_set_zoom($img, math_number(256))` | `lv_img_set_zoom(...);` |
| `lvgl_image_set_angle` | Statement | VAR(field_variable), ANGLE(input_value) | `lvgl_image_set_angle($img, math_number(900))` | `lv_image_set_angle(...);` |
| `lvgl_image_set_offset` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_image_set_offset($img, math_number(0), math_number(0))` | `lv_image_set_offset_x/y(...);` |
| `lvgl_chart_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_chart_create(global, "chart", $screen)` | `lv_obj_t *` |
| `lvgl_chart_set_type` | Statement | VAR(field_variable), TYPE(dropdown) | `lvgl_chart_set_type($chart, LV_CHART_TYPE_BAR)` | `lv_chart_set_type(...);` |
| `lvgl_chart_set_point_count` | Statement | VAR(field_variable), COUNT(input_value) | `lvgl_chart_set_point_count($chart, math_number(10))` | `lv_chart_set_point_count(...);` |
| `lvgl_chart_add_series` | Statement | VAR(field_variable), SERIES(field_input), COLOR(dropdown) | `lvgl_chart_add_series($chart, "series1", lv_palette_main(LV_PALETTE_RED))` | `lv_chart_series_t *` |
| `lvgl_chart_set_next_value` | Statement | VAR(field_variable), SERIES(field_input), VALUE(input_value) | `lvgl_chart_set_next_value($chart, "series1", math_number(42))` | `lv_chart_set_next_value(...);` |
| `lvgl_chart_set_range` | Statement | VAR(field_variable), SERIES(field_input), MIN(input_value), MAX(input_value) | `lvgl_chart_set_range($chart, "series1", math_number(0), math_number(100))` | `lv_chart_set_range(...);` |
| `lvgl_chart_set_update_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_chart_set_update_mode($chart, LV_CHART_UPDATE_MODE_SHIFT)` | `lv_chart_set_update_mode(...);` |
| `lvgl_chart_refresh` | Statement | VAR(field_variable) | `lvgl_chart_refresh($chart)` | `lv_chart_refresh(...);` |
| `lvgl_keyboard_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_keyboard_create(global, "keyboard", $screen)` | `lv_obj_t *` |
| `lvgl_keyboard_set_textarea` | Statement | VAR(field_variable), TEXTAREA(field_variable) | `lvgl_keyboard_set_textarea($keyboard, $textarea1)` | `lv_keyboard_set_textarea(...);` |
| `lvgl_keyboard_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_keyboard_set_mode($keyboard, LV_KEYBOARD_MODE_TEXT_LOWER)` | `lv_keyboard_set_mode(...);` |
| `lvgl_keyboard_set_popovers` | Statement | VAR(field_variable), ENABLE(dropdown) | `lvgl_keyboard_set_popovers($keyboard, true)` | `lv_keyboard_set_popovers(...);` |
| `lvgl_list_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_list_create(global, "list", $screen)` | `lv_obj_t *` |
| `lvgl_list_add_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_list_add_text($list, text("hello"))` | `lv_list_add_text(...);` |
| `lvgl_list_add_btn` | Statement | VAR(field_variable), TEXT(input_value), ICON(dropdown) | `lvgl_list_add_btn($list, text("Play"), LV_SYMBOL_PLAY)` | `lv_list_add_btn(...);` |
| `lvgl_tabview_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_tabview_create(global, "tabview", $screen)` | `lv_obj_t *` |
| `lvgl_tabview_add_tab` | Value | VAR(field_variable), TEXT(input_value) | `lvgl_tabview_add_tab($tabview, text("Tab1"))` | `lv_tabview_add_tab(...)` |
| `lvgl_set_img_font` | Statement | ENABLE(dropdown) | `lvgl_set_img_font(true)` | `#define LV_USE_IMGFONT 1` |
| `lvgl_set_stdlib_malloc` | Statement | LIB(dropdown) | `lvgl_set_stdlib_malloc(LV_STDLIB_BUILTIN)` | `#define LV_USE_STDLIB_MALLOC ...` |
| `lvgl_set_stdlib_string` | Statement | LIB(dropdown) | `lvgl_set_stdlib_string(LV_STDLIB_BUILTIN)` | `#define LV_USE_STDLIB_STRING ...` |
| `lvgl_set_stdlib_sprintf` | Statement | LIB(dropdown) | `lvgl_set_stdlib_sprintf(LV_STDLIB_BUILTIN)` | `#define LV_USE_STDLIB_SPRINTF ...` |
| `lvgl_set_theme` | Statement | THEME(dropdown) | `lvgl_set_theme(light)` | `#define LV_THEME_DEFAULT_DARK 0/1` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DRIVER | TFT_eSPI, LovyanGFX | TFT_eSPI / LovyanGFX(待支持) |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DISPLAY_ROTATION_270 | 0° / 90° / 180° / 270° |
| SCOPE | global, local | 全局 / 局部 |
| TYPE | LV_INDEV_TYPE_POINTER, LV_INDEV_TYPE_KEYPAD, LV_INDEV_TYPE_BUTTON, LV_INDEV_TYPE_ENCODER | 指针设备 / 按键设备 / 按钮设备 / 编码器设备 |
| PARAM | state, point.x, point.y, key, btn_id, enc_diff | 输入设备数据字段 |
| STATE | LV_INDEV_STATE_REL, LV_INDEV_STATE_PR | 释放 / 按下 |
| MODE | LV_LABEL_LONG_MODE_WRAP, LV_LABEL_LONG_MODE_DOTS, LV_LABEL_LONG_MODE_SCROLL, LV_LABEL_LONG_MODE_SCROLL_CIRCULAR, LV_LABEL_LONG_MODE_CLIP | 标签长文本模式 |
| ANIM | LV_ANIM_ON, LV_ANIM_OFF | 开启 / 关闭 |
| ALIGN | LV_ALIGN_CENTER, LV_ALIGN_TOP_LEFT, LV_ALIGN_TOP_MID, LV_ALIGN_TOP_RIGHT, LV_ALIGN_LEFT_MID, LV_ALIGN_RIGHT_MID, LV_ALIGN_BOTTOM_LEFT, LV_ALIGN_BOTTOM_MID, LV_ALIGN_BOTTOM_RIGHT | 对齐方式 |
| FLAG | LV_OBJ_FLAG_HIDDEN, LV_OBJ_FLAG_CLICKABLE, LV_OBJ_FLAG_CHECKABLE, LV_OBJ_FLAG_SCROLLABLE, LV_OBJ_FLAG_DISABLED | 对象标志 |
| FONT | LV_FONT_MONTSERRAT_14, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK, LV_FONT_SOURCE_HAN_SANS_SC_16_CJK | 默认字体 / 中文字体 14 / 中文字体 16 |
| OPA | LV_OPA_TRANSP, LV_OPA_25, LV_OPA_50, LV_OPA_75, LV_OPA_COVER | 背景透明度 |
| EVENT | LV_EVENT_ALL, LV_EVENT_PRESSED, LV_EVENT_PRESSING, LV_EVENT_PRESS_LOST, LV_EVENT_SHORT_CLICKED, LV_EVENT_SINGLE_CLICKED, LV_EVENT_DOUBLE_CLICKED, LV_EVENT_TRIPLE_CLICKED, LV_EVENT_LONG_PRESSED, LV_EVENT_LONG_PRESSED_REPEAT, LV_EVENT_CLICKED, LV_EVENT_RELEASED, LV_EVENT_SCROLL_BEGIN, LV_EVENT_SCROLL_THROW_BEGIN, LV_EVENT_SCROLL_END, LV_EVENT_SCROLL, LV_EVENT_GESTURE, LV_EVENT_KEY, LV_EVENT_ROTARY, LV_EVENT_FOCUSED, LV_EVENT_DEFOCUSED, LV_EVENT_LEAVE, LV_EVENT_HIT_TEST, LV_EVENT_INDEV_RESET, LV_EVENT_HOVER_OVER, LV_EVENT_HOVER_LEAVE, LV_EVENT_COVER_CHECK, LV_EVENT_REFR_EXT_DRAW_SIZE, LV_EVENT_DRAW_MAIN_BEGIN, LV_EVENT_DRAW_MAIN, LV_EVENT_DRAW_MAIN_END, LV_EVENT_DRAW_POST_BEGIN, LV_EVENT_DRAW_POST, LV_EVENT_DRAW_POST_END, LV_EVENT_DRAW_TASK_ADDED, LV_EVENT_VALUE_CHANGED, LV_EVENT_INSERT, LV_EVENT_REFRESH, LV_EVENT_READY, LV_EVENT_CANCEL, LV_EVENT_STATE_CHANGED, LV_EVENT_CREATE, LV_EVENT_DELETE, LV_EVENT_CHILD_CHANGED, LV_EVENT_CHILD_CREATED, LV_EVENT_CHILD_DELETED, LV_EVENT_SCREEN_UNLOAD_START, LV_EVENT_SCREEN_LOAD_START, LV_EVENT_SCREEN_LOADED, LV_EVENT_SCREEN_UNLOADED, LV_EVENT_SIZE_CHANGED, LV_EVENT_STYLE_CHANGED, LV_EVENT_LAYOUT_CHANGED, LV_EVENT_GET_SELF_SIZE, LV_EVENT_INVALIDATE_AREA, LV_EVENT_RESOLUTION_CHANGED, LV_EVENT_COLOR_FORMAT_CHANGED, LV_EVENT_REFR_REQUEST, LV_EVENT_REFR_START, LV_EVENT_REFR_READY, LV_EVENT_RENDER_START, LV_EVENT_RENDER_READY, LV_EVENT_FLUSH_START, LV_EVENT_FLUSH_FINISH, LV_EVENT_FLUSH_WAIT_START, LV_EVENT_FLUSH_WAIT_FINISH, LV_EVENT_UPDATE_LAYOUT_COMPLETED, LV_EVENT_VSYNC, LV_EVENT_VSYNC_REQUEST | LVGL 事件枚举 |
| COLOR | lv_palette_main(LV_PALETTE_RED), lv_palette_main(LV_PALETTE_BLUE), lv_palette_main(LV_PALETTE_GREEN), lv_palette_main(LV_PALETTE_ORANGE), lv_palette_main(LV_PALETTE_PURPLE), lv_palette_main(LV_PALETTE_CYAN) | 图表系列颜色 |
| ENABLE | true, false | 开启 / 关闭 |
| ICON | NULL, LV_SYMBOL_PLAY, LV_SYMBOL_PAUSE, LV_SYMBOL_STOP, LV_SYMBOL_SETTINGS, LV_SYMBOL_VOLUME_MAX, LV_SYMBOL_WIFI, LV_SYMBOL_BLUETOOTH | 列表按钮图标 |
| LIB | LV_STDLIB_BUILTIN, LV_STDLIB_CLIB | 内置 / C 标准库 |
| THEME | light, dark | 浅色 / 深色 |

## Initialization Contract

`lvgl_init(...)` 不是独立屏幕驱动块，它依赖一个已经完成底层初始化的显示对象。

### Required order

1. 先初始化底层显示驱动
2. 再调用 `lvgl_init(...)`
3. 再创建 `screen`
4. 再创建控件
5. 最后 `lvgl_screen_load($screen)`

### Supported driver recipes

1. **TFT_eSPI**：先 `tftespi_setup("tft", ...)`，再 `lvgl_init(TFT_eSPI, ...)`
2. **Seeed GFX**：先 `seeed_gfx_init("tft", MODEL)`，再 `lvgl_init(TFT_eSPI, ...)`

当前 `DRIVER=TFT_eSPI` 表示使用 LVGL 的 TFT_eSPI 适配层。它接受的是驱动类型，不是变量名。

### What `lvgl_init` actually generates

1. `lv_init();`
2. `lv_tick_set_cb(millis);`
3. 一块依赖 `WIDTH`、`HEIGHT` 的静态绘图缓冲区
4. `lv_tft_espi_create(width, height, draw_buf, sizeof(draw_buf));`
5. `lv_display_set_rotation(...)`
6. 自动在 `arduino_loop()` 开头插入 `lv_task_handler();`

### Width, height and rotation

1. `WIDTH`、`HEIGHT` 是显示初始化尺寸，不是拿来补业务布局的参数
2. `LV_DISPLAY_ROTATION_0/180` 时，LVGL 逻辑坐标是 `WIDTH x HEIGHT`
3. `LV_DISPLAY_ROTATION_90/270` 时，LVGL 逻辑坐标会变成 `HEIGHT x WIDTH`
4. 判断用户视角是否正确，只看最终效果：文字正向、居中正常、输入方向一致；这三项都对，就保留当前 `lvgl_init(...)`
5. 若只是对象越界、随机范围错误或游戏边界不对，修业务坐标；只有整屏朝向错误时才改 `WIDTH`、`HEIGHT`、`ROTATION`

## ABS Examples

### Recipe 1: TFT_eSPI + LVGL 文本标签
```
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, 40000000, math_number(172), math_number(320), math_number(-1), math_number(10), math_number(12), math_number(13), math_number(11), math_number(14), math_number(3), HIGH, TFT_RGB)
    lvgl_init(TFT_eSPI, math_number(172), math_number(320), LV_DISPLAY_ROTATION_90)
    lvgl_screen_create(global, "screen")
    lvgl_label_create(global, "label", $screen)
    lvgl_obj_set_style_text_font($label, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK)
    lvgl_label_set_text($label, text("你好 LVGL"))
    lvgl_obj_center($label)
    lvgl_screen_load($screen)

arduino_loop()
    time_delay(math_number(5))
```

### Recipe 2: Seeed GFX + LVGL 触摸按钮
```
arduino_setup()
    seeed_gfx_init("tft", 501)
    chsc6x_setup("touch", Wire, math_number(46), io_pin_digi(D7), math_number(240), math_number(240), 3)
    lvgl_init(TFT_eSPI, math_number(240), math_number(240), LV_DISPLAY_ROTATION_270)
    lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER)
        controls_if()
            @IF0: chsc6x_run($touch)
            @DO0:
                controls_ifelse(chsc6x_is_pressed($touch))
                    @do:
                        lvgl_indev_data_param_set(state, lvgl_indev_state_param(LV_INDEV_STATE_PR))
                        lvgl_indev_data_param_set(point.x, chsc6x_get_x($touch))
                        lvgl_indev_data_param_set(point.y, chsc6x_get_y($touch))
                    @else:
                        lvgl_indev_data_param_set(state, lvgl_indev_state_param(LV_INDEV_STATE_REL))
    lvgl_screen_create(global, "screen")
    lvgl_button_create(global, "btn", $screen)
    lvgl_obj_align($btn, LV_ALIGN_CENTER, math_number(0), math_number(15))
    lvgl_event_add_cb($btn, LV_EVENT_CLICKED)
        variable_define_advanced(static, , "count", uint8_t)
        variables_set($count, math_arithmetic(variables_get($count), ADD, math_number(1)))
        lvgl_obj_get_child("label", $btn, math_number(0))
        lvgl_label_set_text($label, text_join(text("Button: "), variables_get($count)))
    lvgl_label_create(global, "label", $btn)
    lvgl_label_set_text($label, text("Button"))
    lvgl_obj_center($label)
    lvgl_label_create(global, "label1", $screen)
    lvgl_label_set_text($label1, text("Hello LVGL"))
    lvgl_obj_align($label1, LV_ALIGN_CENTER, math_number(0), math_number(-15))
    lvgl_screen_load($screen)

arduino_loop()
    time_delay(math_number(5))
```

### Minimal object creation pattern
```
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, 40000000, math_number(240), math_number(240), math_number(-1), math_number(10), math_number(12), math_number(13), math_number(11), math_number(14), math_number(3), HIGH, TFT_RGB)
    lvgl_init(TFT_eSPI, math_number(240), math_number(240), LV_DISPLAY_ROTATION_0)
    lvgl_screen_create(global, "screen")
    lvgl_obj_create(global, "panel", $screen)
    lvgl_obj_set_size($panel, math_number(180), math_number(80))
    lvgl_obj_center($panel)
    lvgl_screen_load($screen)

arduino_loop()
```

## Common Generation Rules

1. **先底层后 LVGL**：`tftespi_setup(...)` 或 `seeed_gfx_init(...)` 必须出现在 `lvgl_init(...)` 之前
2. **先建 screen 再建子控件**：`lvgl_label_create(..., $screen)`、`lvgl_button_create(..., $screen)` 等之前必须已经创建 `$screen`
3. **推荐统一使用 `global`**：screen、button、label、indev 等会跨多个块复用的对象应使用 `global`
4. **`lvgl_indev_create` 的缩进体就是 read callback**：在里面给 `state`、`point.x`、`point.y` 等字段赋值
5. **`lvgl_event_add_cb` 的缩进体就是 event callback**：其中事件目标对象会绑定到对应变量名
6. **`lvgl_tabview_add_tab` 是值块**：它返回标签页对象，可继续作为父对象创建其它控件
7. **中文文本通常要显式设置字体**：例如 `lvgl_obj_set_style_text_font($label, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK)`
8. **配置块只需设置一次**：`lvgl_set_theme`、`lvgl_set_img_font`、`lvgl_set_stdlib_*` 属于工程级配置

## Notes

1. **Driver dependency**: `lvgl_init(TFT_eSPI, ...)` 不会替你生成 `tft.init()`，必须先用 `tftespi_setup` 或 `seeed_gfx_init` 初始化底层屏幕
2. **Auto loop handler**: `lvgl_init(...)` 已自动插入 `lv_task_handler();`，循环里通常只需保留少量延时或自己的业务逻辑
3. **Variable creation**: `lvgl_screen_create("screen")` 创建 `$screen`；`lvgl_indev_create("indev", ...)` 创建 `$indev`；控件创建块会创建对应 `$label`、`$btn`、`$slider` 等变量
4. **Wrong order to avoid**: 不要先 `lvgl_label_create(..., $screen)` 再 `lvgl_screen_create(...)`，否则会引用未创建变量
5. **Scope**: `SCOPE=local` 只适用于临时对象；需要跨语句复用时使用 `global`
6. **Resolution must match hardware**: `WIDTH`、`HEIGHT` 会直接参与缓冲区大小和 display 创建，必须与真实屏幕分辨率或当前驱动配方要求的原生尺寸一致
7. **Logical size depends on rotation**: `ROTATION_90/270` 会交换 LVGL 的逻辑宽高，业务边界应按旋转后的逻辑尺寸写
8. **Fix layout at the right layer**: 若画面方向已经正确，就保留现有 `lvgl_init(...)`，只修业务层坐标和范围
9. **Parameter order**: ABS 参数顺序严格遵循 `block.json` 的 `args0` 顺序

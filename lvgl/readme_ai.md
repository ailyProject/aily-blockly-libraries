# LVGL图形库

嵌入式图形库，提供丰富的UI控件和美观的视觉效果

## Library Info
- **Name**: @aily-project/lib-lvgl
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lvgl_init` | Statement | DRIVER(dropdown), WIDTH(input_value), HEIGHT(input_value), ROTATION(dropdown) | `lvgl_init(TFT_eSPI, math_number(0), math_number(0), LV_DISPLAY_ROTATION_0)` | (dynamic code) |
| `lvgl_indev_create` | Statement | SCOPE(dropdown), VAR(field_input), TYPE(dropdown) | `lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER)` | (dynamic code) |
| `lvgl_indev_data_param_set` | Statement | PARAM(dropdown), VALUE(input_value) | `lvgl_indev_data_param_set(state, math_number(0))` | (dynamic code) |
| `lvgl_indev_state_param` | Value | STATE(dropdown) | `lvgl_indev_state_param(LV_INDEV_STATE_REL)` | (dynamic code) |
| `lvgl_label_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_label_create(global, "label", $screen)` | `lv_obj_t *` |
| `lvgl_label_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text($label, text("hello"))` | `lv_label_set_text(` |
| `lv_label_set_text_fmt` | Statement | VAR(field_variable), FMT(input_value), ARGS(input_value) | `lv_label_set_text_fmt($label, math_number(0), math_number(0))` | `lv_label_set_text_fmt(` |
| `lvgl_label_set_long_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_label_set_long_mode($label, LV_LABEL_LONG_MODE_WRAP)` | `lv_label_set_long_mode(` |
| `lvgl_button_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_button_create(global, "btn", $screen)` | `lv_obj_t *` |
| `lvgl_slider_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_slider_create(global, "slider", $screen)` | `lv_obj_t *` |
| `lvgl_slider_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_slider_set_value($slider, math_number(0), LV_ANIM_ON)` | `lv_slider_set_value(` |
| `lvgl_slider_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_slider_set_range($slider, math_number(0), math_number(0))` | `lv_slider_set_range(` |
| `lvgl_slider_get_value` | Value | VAR(field_variable) | `lvgl_slider_get_value($slider)` | `lv_slider_get_value(` |
| `lvgl_switch_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_switch_create(global, "sw1", $screen)` | `lv_obj_t *` |
| `lvgl_checkbox_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable), TEXT(input_value) | `lvgl_checkbox_create(global, "cb", $screen, text("hello"))` | (dynamic code) |
| `lvgl_bar_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_bar_create(global, "bar", $screen)` | `lv_obj_t *` |
| `lvgl_bar_set_value` | Statement | VAR(field_variable), VALUE(input_value), ANIM(dropdown) | `lvgl_bar_set_value($bar, math_number(0), LV_ANIM_ON)` | `lv_bar_set_value(` |
| `lvgl_bar_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_bar_set_range($bar, math_number(0), math_number(0))` | `lv_bar_set_range(` |
| `lvgl_arc_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_arc_create(global, "arc", $screen)` | `lv_obj_t *` |
| `lvgl_arc_set_value` | Statement | VAR(field_variable), VALUE(input_value) | `lvgl_arc_set_value($arc, math_number(0))` | `lv_arc_set_value(` |
| `lvgl_arc_set_range` | Statement | VAR(field_variable), MIN(input_value), MAX(input_value) | `lvgl_arc_set_range($arc, math_number(0), math_number(0))` | `lv_arc_set_range(` |
| `lvgl_spinner_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_spinner_create(global, "spinner", $screen)` | `lv_obj_t *` |
| `lvgl_spinner_set_anim_params` | Statement | VAR(field_variable), TIME(input_value), ANGLE(input_value) | `lvgl_spinner_set_anim_params($spinner, math_number(1000), math_number(0))` | `lv_spinner_set_anim_params(` |
| `lvgl_dropdown_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_dropdown_create(global, "dropdown", $screen)` | `lv_obj_t *` |
| `lvgl_dropdown_set_options` | Statement | VAR(field_variable), OPTIONS(input_value) | `lvgl_dropdown_set_options($dropdown, math_number(0))` | `lv_dropdown_set_options(` |
| `lvgl_dropdown_get_selected` | Value | VAR(field_variable) | `lvgl_dropdown_get_selected($dropdown)` | `lv_dropdown_get_selected(` |
| `lvgl_textarea_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_textarea_create(global, "textarea1", $screen)` | `lv_obj_t *` |
| `lvgl_textarea_set_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_text($textarea, text("hello"))` | `lv_textarea_set_text(` |
| `lvgl_textarea_get_text` | Value | VAR(field_variable) | `lvgl_textarea_get_text($textarea)` | `lv_textarea_get_text(` |
| `lvgl_textarea_set_placeholder` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_textarea_set_placeholder($textarea, text("hello"))` | `lv_textarea_set_placeholder_text(` |
| `lvgl_obj_set_pos` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_obj_set_pos($obj, math_number(0), math_number(0))` | `lv_obj_set_pos(` |
| `lvgl_obj_set_size` | Statement | VAR(field_variable), WIDTH(input_value), HEIGHT(input_value) | `lvgl_obj_set_size($obj, math_number(0), math_number(0))` | `lv_obj_set_size(` |
| `lvgl_obj_align` | Statement | VAR(field_variable), ALIGN(dropdown), X_OFS(input_value), Y_OFS(input_value) | `lvgl_obj_align($obj, LV_ALIGN_CENTER, math_number(0), math_number(0))` | `lv_obj_align(` |
| `lvgl_obj_center` | Statement | VAR(field_variable) | `lvgl_obj_center($obj)` | `lv_obj_center(` |
| `lvgl_obj_add_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_add_flag($obj, LV_OBJ_FLAG_HIDDEN)` | `lv_obj_add_flag(` |
| `lvgl_obj_remove_flag` | Statement | VAR(field_variable), FLAG(dropdown) | `lvgl_obj_remove_flag($obj, LV_OBJ_FLAG_HIDDEN)` | `lv_obj_remove_flag(` |
| `lvgl_obj_add_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_add_state($obj, LV_STATE_CHECKED)` | `lv_obj_add_state(` |
| `lvgl_obj_remove_state` | Statement | VAR(field_variable), STATE(dropdown) | `lvgl_obj_remove_state($obj, LV_STATE_CHECKED)` | `lv_obj_remove_state(` |
| `lvgl_obj_has_state` | Value | VAR(field_variable), STATE(dropdown) | `lvgl_obj_has_state($obj, LV_STATE_CHECKED)` | `lv_obj_has_state(` |
| `lvgl_obj_delete` | Statement | VAR(field_variable) | `lvgl_obj_delete($obj)` | `lv_obj_delete(` |
| `lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `lvgl_obj_set_style_text_font($obj, LV_FONT_MONTSERRAT_14)` | `` |
| `lvgl_obj_set_style_bg_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_bg_color($obj)` | `lv_obj_set_style_bg_color(` |
| `lvgl_obj_set_style_text_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_text_color($obj)` | `lv_obj_set_style_text_color(` |
| `lvgl_obj_set_style_border_color` | Statement | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `lvgl_obj_set_style_border_color($obj)` | `lv_obj_set_style_border_color(` |
| `lvgl_obj_set_style_border_width` | Statement | VAR(field_variable), WIDTH(input_value) | `lvgl_obj_set_style_border_width($obj, math_number(0))` | `lv_obj_set_style_border_width(` |
| `lvgl_obj_set_style_radius` | Statement | VAR(field_variable), RADIUS(input_value) | `lvgl_obj_set_style_radius($obj, math_number(0))` | `lv_obj_set_style_radius(` |
| `lvgl_obj_set_style_pad_all` | Statement | VAR(field_variable), PAD(input_value) | `lvgl_obj_set_style_pad_all($obj, math_number(0))` | `lv_obj_set_style_pad_all(` |
| `lvgl_obj_set_style_bg_opa` | Statement | VAR(field_variable), OPA(dropdown) | `lvgl_obj_set_style_bg_opa($obj, LV_OPA_TRANSP)` | `lv_obj_set_style_bg_opa(` |
| `lvgl_event_add_cb` | Statement | VAR(field_variable), EVENT(dropdown) | `lvgl_event_add_cb($obj, LV_EVENT_ALL)` | (dynamic code) |
| `lvgl_event_code` | Value | EVENT(dropdown) | `lvgl_event_code(LV_EVENT_ALL)` | (dynamic code) |
| `lvgl_obj_get_child` | Statement | VAR(field_input), VAR_PARENT(field_variable), INDEX(input_value) | `lvgl_obj_get_child("child_obj", $obj, math_number(0))` | `lv_obj_t *` |
| `lvgl_screen_active` | Value | (none) | `lvgl_screen_active()` | `lv_screen_active()` |
| `lvgl_screen_load` | Statement | VAR(field_variable) | `lvgl_screen_load($screen)` | `lv_screen_load(` |
| `lvgl_obj_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_obj_create(global, "obj", $screen)` | `lv_obj_t *` |
| `lvgl_screen_create` | Statement | SCOPE(dropdown), VAR(field_input) | `lvgl_screen_create(global, "screen")` | `lv_obj_t *` |
| `lvgl_image_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_image_create(global, "img", $screen)` | `lv_obj_t *` |
| `lvgl_image_set_src` | Statement | VAR(field_variable), SRC(input_value) | `lvgl_image_set_src($img, math_number(0))` | `lv_image_set_src(` |
| `lvgl_image_set_zoom` | Statement | VAR(field_variable), ZOOM(input_value) | `lvgl_image_set_zoom($img, math_number(0))` | `lv_img_set_zoom(` |
| `lvgl_image_set_angle` | Statement | VAR(field_variable), ANGLE(input_value) | `lvgl_image_set_angle($img, math_number(0))` | `lv_image_set_angle(` |
| `lvgl_image_set_offset` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `lvgl_image_set_offset($img, math_number(0), math_number(0))` | `lv_image_set_offset_x(` |
| `lvgl_chart_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_chart_create(global, "chart", $screen)` | `lv_obj_t *` |
| `lvgl_chart_set_type` | Statement | VAR(field_variable), TYPE(dropdown) | `lvgl_chart_set_type($chart, LV_CHART_TYPE_BAR)` | `lv_chart_set_type(` |
| `lvgl_chart_set_point_count` | Statement | VAR(field_variable), COUNT(input_value) | `lvgl_chart_set_point_count($chart, math_number(0))` | `lv_chart_set_point_count(` |
| `lvgl_chart_add_series` | Statement | VAR(field_variable), SERIES(field_input), COLOR(dropdown) | `lvgl_chart_add_series($chart, "series1", lv_palette_main(LV_PALETTE_RED))` | `lv_chart_series_t *` |
| `lvgl_chart_set_next_value` | Statement | VAR(field_variable), SERIES(field_input), VALUE(input_value) | `lvgl_chart_set_next_value($chart, "series1", math_number(0))` | `lv_chart_set_next_value(` |
| `lvgl_chart_set_range` | Statement | VAR(field_variable), SERIES(field_input), MIN(input_value), MAX(input_value) | `lvgl_chart_set_range($chart, "series1", math_number(0), math_number(0))` | `lv_chart_set_range(` |
| `lvgl_chart_set_update_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_chart_set_update_mode($chart, LV_CHART_UPDATE_MODE_SHIFT)` | `lv_chart_set_update_mode(` |
| `lvgl_chart_refresh` | Statement | VAR(field_variable) | `lvgl_chart_refresh($chart)` | `lv_chart_refresh(` |
| `lvgl_keyboard_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_keyboard_create(global, "keyboard", $screen)` | `lv_obj_t *` |
| `lvgl_keyboard_set_textarea` | Statement | VAR(field_variable), TEXTAREA(field_variable) | `lvgl_keyboard_set_textarea($keyboard, $textarea)` | `lv_keyboard_set_textarea(` |
| `lvgl_keyboard_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `lvgl_keyboard_set_mode($keyboard, LV_KEYBOARD_MODE_TEXT_LOWER)` | `lv_keyboard_set_mode(` |
| `lvgl_keyboard_set_popovers` | Statement | VAR(field_variable), ENABLE(dropdown) | `lvgl_keyboard_set_popovers($keyboard, true)` | `lv_keyboard_set_popovers(` |
| `lvgl_list_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_list_create(global, "list", $screen)` | `lv_obj_t *` |
| `lvgl_list_add_text` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_list_add_text($list, text("hello"))` | `lv_list_add_text(` |
| `lvgl_list_add_btn` | Statement | VAR(field_variable), TEXT(input_value), ICON(dropdown) | `lvgl_list_add_btn($list, text("hello"), NULL)` | `lv_list_add_btn(` |
| `lvgl_tabview_create` | Statement | SCOPE(dropdown), VAR(field_input), PARENT(field_variable) | `lvgl_tabview_create(global, "tabview", $screen)` | `lv_obj_t *` |
| `lvgl_tabview_add_tab` | Value | VAR(field_variable), TEXT(input_value) | `lvgl_tabview_add_tab($tabview, text("hello"))` | `lv_tabview_add_tab(` |
| `lvgl_set_img_font` | Statement | ENABLE(dropdown) | `lvgl_set_img_font(true)` | `` |
| `lvgl_set_stdlib_malloc` | Statement | LIB(dropdown) | `lvgl_set_stdlib_malloc(LV_STDLIB_BUILTIN)` | `` |
| `lvgl_set_stdlib_string` | Statement | LIB(dropdown) | `lvgl_set_stdlib_string(LV_STDLIB_BUILTIN)` | `` |
| `lvgl_set_stdlib_sprintf` | Statement | LIB(dropdown) | `lvgl_set_stdlib_sprintf(LV_STDLIB_BUILTIN)` | `` |
| `lvgl_set_theme` | Statement | THEME(dropdown) | `lvgl_set_theme(light)` | `` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DRIVER | TFT_eSPI, LovyanGFX | TFT_eSPI / LovyanGFX(待支持) |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DISPLAY_ROTATION_270 | 0° / 90° / 180° / 270° |
| SCOPE | global, local | 全局 / 局部 |
| TYPE | LV_INDEV_TYPE_POINTER, LV_INDEV_TYPE_KEYPAD, LV_INDEV_TYPE_BUTTON, LV_INDEV_TYPE_ENCODER | 指针设备(触摸屏/鼠标) / 按键设备 / 按钮设备 / 编码器设备 |
| PARAM | state, point.x, point.y, key, btn_id, enc_diff | 状态 / 坐标 X / 坐标 Y / 按键值 / 按钮 ID / 编码器增量 |
| STATE | LV_INDEV_STATE_REL, LV_INDEV_STATE_PR | 释放 / 按下 |
| MODE | LV_LABEL_LONG_MODE_WRAP, LV_LABEL_LONG_MODE_DOTS, LV_LABEL_LONG_MODE_SCROLL, LV_LABEL_LONG_MODE_SCROLL_CIRCULAR, LV_LABEL_LONG_MODE_CLIP | 自动换行 / 显示省略号 / 来回滚动 / 循环滚动 / 裁剪 |
| ANIM | LV_ANIM_ON, LV_ANIM_OFF | 开启 / 关闭 |
| ALIGN | LV_ALIGN_CENTER, LV_ALIGN_TOP_LEFT, LV_ALIGN_TOP_MID, LV_ALIGN_TOP_RIGHT, LV_ALIGN_LEFT_MID, LV_ALIGN_RIGHT_MID, LV_ALIGN_BOTTOM_LEFT, LV_ALIGN_BOTTOM_MID, LV_ALIGN_BOTTOM_RIGHT | 居中 / 左上 / 中上 / 右上 / 左中 / 右中 / 左下 / 中下 / 右下 |
| FLAG | LV_OBJ_FLAG_HIDDEN, LV_OBJ_FLAG_CLICKABLE, LV_OBJ_FLAG_CHECKABLE, LV_OBJ_FLAG_SCROLLABLE, LV_OBJ_FLAG_DISABLED | 隐藏 / 可点击 / 可选中 / 可滚动 / 禁用 |
| FONT | LV_FONT_MONTSERRAT_14, LV_FONT_SOURCE_HAN_SANS_SC_14_CJK, LV_FONT_SOURCE_HAN_SANS_SC_16_CJK | 默认字体 / 中文字体 14 / 中文字体 16 |
| OPA | LV_OPA_TRANSP, LV_OPA_25, LV_OPA_50, LV_OPA_75, LV_OPA_COVER | 完全透明 / 25% / 50% / 75% / 不透明 |
| EVENT | LV_EVENT_ALL, LV_EVENT_PRESSED, LV_EVENT_PRESSING, LV_EVENT_PRESS_LOST, LV_EVENT_SHORT_CLICKED, LV_EVENT_SINGLE_CLICKED, LV_EVENT_DOUBLE_CLICKED, LV_EVENT_TRIPLE_CLICKED, LV_EVENT_LONG_PRESSED, LV_EVENT_LONG_PRESSED_REPEAT, LV_EVENT_CLICKED, LV_EVENT_RELEASED, LV_EVENT_SCROLL_BEGIN, LV_EVENT_SCROLL_THROW_BEGIN, LV_EVENT_SCROLL_END, LV_EVENT_SCROLL, LV_EVENT_GESTURE, LV_EVENT_KEY, LV_EVENT_ROTARY, LV_EVENT_FOCUSED, LV_EVENT_DEFOCUSED, LV_EVENT_LEAVE, LV_EVENT_HIT_TEST, LV_EVENT_INDEV_RESET, LV_EVENT_HOVER_OVER, LV_EVENT_HOVER_LEAVE, LV_EVENT_COVER_CHECK, LV_EVENT_REFR_EXT_DRAW_SIZE, LV_EVENT_DRAW_MAIN_BEGIN, LV_EVENT_DRAW_MAIN, LV_EVENT_DRAW_MAIN_END, LV_EVENT_DRAW_POST_BEGIN, LV_EVENT_DRAW_POST, LV_EVENT_DRAW_POST_END, LV_EVENT_DRAW_TASK_ADDED, LV_EVENT_VALUE_CHANGED, LV_EVENT_INSERT, LV_EVENT_REFRESH, LV_EVENT_READY, LV_EVENT_CANCEL, LV_EVENT_STATE_CHANGED, LV_EVENT_CREATE, LV_EVENT_DELETE, LV_EVENT_CHILD_CHANGED, LV_EVENT_CHILD_CREATED, LV_EVENT_CHILD_DELETED, LV_EVENT_SCREEN_UNLOAD_START, LV_EVENT_SCREEN_LOAD_START, LV_EVENT_SCREEN_LOADED, LV_EVENT_SCREEN_UNLOADED, LV_EVENT_SIZE_CHANGED, LV_EVENT_STYLE_CHANGED, LV_EVENT_LAYOUT_CHANGED, LV_EVENT_GET_SELF_SIZE, LV_EVENT_INVALIDATE_AREA, LV_EVENT_RESOLUTION_CHANGED, LV_EVENT_COLOR_FORMAT_CHANGED, LV_EVENT_REFR_REQUEST, LV_EVENT_REFR_START, LV_EVENT_REFR_READY, LV_EVENT_RENDER_START, LV_EVENT_RENDER_READY, LV_EVENT_FLUSH_START, LV_EVENT_FLUSH_FINISH, LV_EVENT_FLUSH_WAIT_START, LV_EVENT_FLUSH_WAIT_FINISH, LV_EVENT_UPDATE_LAYOUT_COMPLETED, LV_EVENT_VSYNC, LV_EVENT_VSYNC_REQUEST | 全部事件 / 按下 / 持续按下 / 按下后移出 / 短按 / 单击 / 双击 / 三击 / 长按 / 长按重复 / 点击 / 释放 / 滚动开始 / 滚动投掷开始 / 滚动结束 / 滚动 / 手势 / 按键 / 旋转 / 聚焦 / 失焦 / 离开 / 碰撞测试 / 输入设备重置 / 悬停进入 / 悬停离开 / 覆盖检查 / 刷新扩展绘制尺寸 / 主绘制开始 / 主绘制 / 主绘制结束 / 后绘制开始 / 后绘制 / 后绘制结束 / 绘制任务添加 / 值改变 / 插入 / 刷新 / 就绪 / 取消 / 状态改变 / 创建 / 删除 / 子对象改变 / 子对象创建 / 子对象删除 / 屏幕卸载开始 / 屏幕加载开始 / 屏幕已加载 / 屏幕已卸载 / 尺寸改变 / 样式改变 / 布局改变 / 获取自身尺寸 / 区域失效 / 分辨率改变 / 颜色格式改变 / 刷新请求 / 刷新开始 / 刷新就绪 / 渲染开始 / 渲染就绪 / 刷新开始(flush) / 刷新完成(flush) / 刷新等待开始 / 刷新等待完成 / 布局更新完成 / 垂直同步 / 垂直同步请求 |
| COLOR | lv_palette_main(LV_PALETTE_RED), lv_palette_main(LV_PALETTE_BLUE), lv_palette_main(LV_PALETTE_GREEN), lv_palette_main(LV_PALETTE_ORANGE), lv_palette_main(LV_PALETTE_PURPLE), lv_palette_main(LV_PALETTE_CYAN) | 红色 / 蓝色 / 绿色 / 橙色 / 紫色 / 青色 |
| ENABLE | true, false | 开启 / 关闭 |
| ICON | NULL, LV_SYMBOL_PLAY, LV_SYMBOL_PAUSE, LV_SYMBOL_STOP, LV_SYMBOL_SETTINGS, LV_SYMBOL_VOLUME_MAX, LV_SYMBOL_WIFI, LV_SYMBOL_BLUETOOTH | 无 / 播放 / 暂停 / 停止 / 设置 / 音量 / WiFi / 蓝牙 |
| LIB | LV_STDLIB_BUILTIN, LV_STDLIB_CLIB | 内置 / C标准库 |
| THEME | light, dark | 浅色 / 深色 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lvgl_init(TFT_eSPI, math_number(0), math_number(0), LV_DISPLAY_ROTATION_0)
    lvgl_indev_create(global, "indev", LV_INDEV_TYPE_POINTER)
    lvgl_label_create(global, "label", variables_get($screen))
    lvgl_button_create(global, "btn", variables_get($screen))
    lvgl_slider_create(global, "slider", variables_get($screen))
    lvgl_switch_create(global, "sw1", variables_get($screen))
    lvgl_checkbox_create(global, "cb", variables_get($screen), text("hello"))
    lvgl_bar_create(global, "bar", variables_get($screen))
    lvgl_arc_create(global, "arc", variables_get($screen))
    lvgl_spinner_create(global, "spinner", variables_get($screen))
    lvgl_dropdown_create(global, "dropdown", variables_get($screen))
    lvgl_textarea_create(global, "textarea1", variables_get($screen))
    lvgl_obj_create(global, "obj", variables_get($screen))
    lvgl_screen_create(global, "screen")
    lvgl_image_create(global, "img", variables_get($screen))
    lvgl_chart_create(global, "chart", variables_get($screen))
    lvgl_keyboard_create(global, "keyboard", variables_get($screen))
    lvgl_list_create(global, "list", variables_get($screen))
    lvgl_tabview_create(global, "tabview", variables_get($screen))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lvgl_slider_get_value($slider))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `lvgl_indev_create("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

# OJoy AMOLED + Touch

CH13613 480x480 QSPI AMOLED 显示 + CHSC6417 电容触摸一体库 (ESP32-S3 + PSRAM): 图形绘制/文本/图标/控件/仪表盘 + 触摸坐标读取/手势识别

## Library Info
- **Name**: @aily-project/lib-ojoy_amoled
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `chamoled_setup` | Statement | VAR(field_input), FREQ(dropdown), ROTATION(dropdown), BRIGHT(field_number) | `chamoled_setup("gfx", "40000000UL", "0", 255)` | generator |
| `chamoled_panel` | Statement | VAR(field_variable), ACTION(dropdown), VALUE(input_value) | `chamoled_panel($gfx, setBrightness, math_number(0))` | generator |
| `chamoled_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `chamoled_set_rotation($gfx, "0")` | generator |
| `chamoled_refresh` | Statement | VAR(field_variable), MODE(dropdown) | `chamoled_refresh($gfx, update)` | generator |
| `chamoled_dimension` | Value | VAR(field_variable), WHICH(dropdown) | `chamoled_dimension($gfx, width)` | generator |
| `chamoled_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `chamoled_fill_screen($gfx, math_number(0))` | generator |
| `chamoled_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `chamoled_draw_pixel($gfx, math_number(0), math_number(0), math_number(0))` | generator |
| `chamoled_draw_line` | Statement | VAR(field_variable), STYLE(dropdown), X0(input_value), Y0(input_value), X1(input_value)... | `chamoled_draw_line($gfx, drawLine, math_number(0), math_number(0), ...)` | generator |
| `chamoled_rect` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(... | `chamoled_rect($gfx, drawRect, math_number(0), math_number(0), ...)` | generator |
| `chamoled_round_rect` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(... | `chamoled_round_rect($gfx, drawRoundRect, math_number(0), math_number(0), ...)` | generator |
| `chamoled_circle` | Statement | VAR(field_variable), MODE(dropdown), CX(input_value), CY(input_value), R(input_value),... | `chamoled_circle($gfx, drawCircle, math_number(0), math_number(0), ...)` | generator |
| `chamoled_ellipse` | Statement | VAR(field_variable), MODE(dropdown), CX(input_value), CY(input_value), RX(input_value),... | `chamoled_ellipse($gfx, drawEllipse, math_number(0), math_number(0), ...)` | generator |
| `chamoled_triangle` | Statement | VAR(field_variable), MODE(dropdown), X0(input_value), Y0(input_value), X1(input_value),... | `chamoled_triangle($gfx, drawTriangle, math_number(0), math_number(0), ...)` | generator |
| `chamoled_arc` | Statement | VAR(field_variable), MODE(dropdown), CX(input_value), CY(input_value), RIN(input_value)... | `chamoled_arc($gfx, drawArc, math_number(0), math_number(0), ...)` | generator |
| `chamoled_sector` | Statement | VAR(field_variable), MODE(dropdown), CX(input_value), CY(input_value), R(input_value),... | `chamoled_sector($gfx, drawSector, math_number(0), math_number(0), ...)` | generator |
| `chamoled_star` | Statement | VAR(field_variable), CX(input_value), CY(input_value), ROUT(input_value), RIN(input_val... | `chamoled_star($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_rect_gradient` | Statement | VAR(field_variable), DIR(dropdown), X(input_value), Y(input_value), W(input_value), H(i... | `chamoled_rect_gradient($gfx, true, math_number(0), math_number(0), ...)` | generator |
| `chamoled_radial_gradient` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), CIN(input_value)... | `chamoled_radial_gradient($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `chamoled_set_text_color($gfx, math_number(0))` | generator |
| `chamoled_set_text_size` | Statement | VAR(field_variable), SIZE(field_number) | `chamoled_set_text_size($gfx, 2)` | generator |
| `chamoled_set_text_align` | Statement | VAR(field_variable), H(dropdown), V(dropdown) | `chamoled_set_text_align($gfx, CH_ALIGN_LEFT, CH_ALIGN_TOP)` | generator |
| `chamoled_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `chamoled_set_cursor($gfx, math_number(0), math_number(0))` | generator |
| `chamoled_draw_text` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `chamoled_draw_text($gfx, math_number(0), math_number(0), text("value"))` | generator |
| `chamoled_text_effect` | Statement | VAR(field_variable), STYLE(dropdown), X(input_value), Y(input_value), TEXT(input_value)... | `chamoled_text_effect($gfx, drawTextShadow, math_number(0), math_number(0), ...)` | generator |
| `chamoled_seg_text` | Statement | VAR(field_variable), X(input_value), Y(input_value), H(input_value), TEXT(input_value),... | `chamoled_seg_text($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_print` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `chamoled_print($gfx, math_number(0), math_number(0), text("value"))` | generator |
| `chamoled_set_cn_font` | Statement | VAR(field_variable), FONT(dropdown) | `chamoled_set_cn_font($gfx, "0")` | generator |
| `chamoled_color` | Value | COLOR(dropdown) | `chamoled_color(CH_BLACK)` | generator |
| `chamoled_color_rgb` | Value | R(field_number), G(field_number), B(field_number) | `chamoled_color_rgb(255, 128, 0)` | generator |
| `chamoled_palette` | Value | PAL(dropdown), T(field_number) | `chamoled_palette(rainbow, 128)` | generator |
| `chamoled_set_blend` | Statement | VAR(field_variable), MODE(dropdown) | `chamoled_set_blend($gfx, CH_BLEND_NORMAL)` | generator |
| `chamoled_set_alpha` | Statement | VAR(field_variable), ALPHA(field_number) | `chamoled_set_alpha($gfx, 128)` | generator |
| `chamoled_clip` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value) | `chamoled_clip($gfx, rect, math_number(0), math_number(0), ...)` | generator |
| `chamoled_color_filter` | Statement | VAR(field_variable), FILTER(dropdown), X(input_value), Y(input_value), W(input_value),... | `chamoled_color_filter($gfx, CH_FILTER_GRAY, math_number(0), math_number(0), ...)` | generator |
| `chamoled_effect_rect` | Statement | VAR(field_variable), TYPE(dropdown), X(input_value), Y(input_value), W(input_value), H(... | `chamoled_effect_rect($gfx, dimRect, math_number(0), math_number(0), ...)` | generator |
| `chamoled_vignette` | Statement | VAR(field_variable), STRENGTH(field_number) | `chamoled_vignette($gfx, 160)` | generator |
| `chamoled_spotlight` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), DIM(field_number) | `chamoled_spotlight($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_glow_circle` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), COLOR(input_valu... | `chamoled_glow_circle($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_draw_bitmap` | Statement | VAR(field_variable), TYPE(dropdown), X(input_value), Y(input_value), BMP(field_input),... | `chamoled_draw_bitmap($gfx, rgb, math_number(0), math_number(0), ...)` | generator |
| `chamoled_draw_icon` | Statement | VAR(field_variable), ICON(dropdown), X(input_value), Y(input_value), SIZE(field_number)... | `chamoled_draw_icon($gfx, CH_ICON_BATTERY, math_number(0), math_number(0), ...)` | generator |
| `chamoled_progress_bar` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), PC... | `chamoled_progress_bar($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_button` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), LA... | `chamoled_button($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_toggle` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), ON... | `chamoled_toggle($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_checkbox` | Statement | VAR(field_variable), X(input_value), Y(input_value), SIZE(input_value), CHECKED(field_c... | `chamoled_checkbox($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_slider` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), PCT(input_value),... | `chamoled_slider($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_battery` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), PC... | `chamoled_battery($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_signal` | Statement | VAR(field_variable), X(input_value), Y(input_value), BARS(field_number), LEVEL(field_nu... | `chamoled_signal($gfx, math_number(0), math_number(0), 4, ...)` | generator |
| `chamoled_spinner` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), PHASE(input_valu... | `chamoled_spinner($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_gauge` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), THICK(input_valu... | `chamoled_gauge($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_ring_progress` | Statement | VAR(field_variable), CX(input_value), CY(input_value), ROUT(input_value), THICK(input_v... | `chamoled_ring_progress($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_clock_face` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), HH(input_value),... | `chamoled_clock_face($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_needle` | Statement | VAR(field_variable), CX(input_value), CY(input_value), LEN(input_value), DEG(input_valu... | `chamoled_needle($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_ticks` | Statement | VAR(field_variable), CX(input_value), CY(input_value), ROUT(input_value), COUNT(field_n... | `chamoled_ticks($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_speedometer` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), VALUE(input_valu... | `chamoled_speedometer($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chamoled_compass` | Statement | VAR(field_variable), CX(input_value), CY(input_value), R(input_value), HEADING(input_va... | `chamoled_compass($gfx, math_number(0), math_number(0), math_number(0), ...)` | generator |
| `chtouch_setup` | Statement | VAR(field_input), ROTATION(dropdown) | `chtouch_setup("tp", "0")` | generator |
| `chtouch_read` | Value | VAR(field_variable) | `chtouch_read($tp)` | generator |
| `chtouch_touched` | Value | VAR(field_variable) | `chtouch_touched($tp)` | generator |
| `chtouch_x` | Value | VAR(field_variable) | `chtouch_x($tp)` | generator |
| `chtouch_y` | Value | VAR(field_variable) | `chtouch_y($tp)` | generator |
| `chtouch_points` | Value | VAR(field_variable) | `chtouch_points($tp)` | generator |
| `chtouch_gesture_is` | Value | VAR(field_variable), GESTURE(dropdown) | `chtouch_gesture_is($tp, "1")` | generator |
| `chtouch_present` | Value | VAR(field_variable) | `chtouch_present($tp)` | generator |
| `chtouch_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `chtouch_set_rotation($tp, "0")` | generator |
| `chtouch_calibrate` | Statement | VAR(field_variable), MX(field_checkbox), MY(field_checkbox), SWAP(field_checkbox) | `chtouch_calibrate($tp, FALSE, FALSE, FALSE)` | generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FREQ | 40000000UL, 60000000UL, 80000000UL | chamoled_setup |
| ROTATION | 0, 1, 2, 3 | chamoled_setup, chamoled_set_rotation, chtouch_setup |
| ACTION | setBrightness, sleep, displayOn, invertDisplay | chamoled_panel |
| MODE | update, display | chamoled_refresh |
| WHICH | width, height, getRotation | chamoled_dimension |
| STYLE | drawLine, drawDashedLine, drawDottedLine, drawLineAA, drawArrow | chamoled_draw_line |
| MODE | drawRect, fillRect | chamoled_rect |
| MODE | drawRoundRect, fillRoundRect | chamoled_round_rect |
| MODE | drawCircle, fillCircle, drawCircleAA, fillCircleAA | chamoled_circle |
| MODE | drawEllipse, fillEllipse | chamoled_ellipse |
| MODE | drawTriangle, fillTriangle | chamoled_triangle |
| MODE | drawArc, fillArc | chamoled_arc |
| MODE | drawSector, fillSector | chamoled_sector |
| DIR | true, false | chamoled_rect_gradient |
| H | CH_ALIGN_LEFT, CH_ALIGN_CENTER, CH_ALIGN_RIGHT | chamoled_set_text_align |
| V | CH_ALIGN_TOP, CH_ALIGN_MIDDLE, CH_ALIGN_BOTTOM | chamoled_set_text_align |
| STYLE | drawTextShadow, drawTextOutline | chamoled_text_effect |
| FONT | 0, 16, 24, 32 | chamoled_set_cn_font |
| COLOR | CH_BLACK, CH_WHITE, CH_RED, CH_GREEN, CH_BLUE, CH_YELLOW, CH_CYAN, CH_MAGENTA... | chamoled_color |
| PAL | rainbow, heat, jet, turbo, viridis, grayscale | chamoled_palette |
| MODE | CH_BLEND_NORMAL, CH_BLEND_ADD, CH_BLEND_MULTIPLY, CH_BLEND_SCREEN, CH_BLEND_D... | chamoled_set_blend |
| MODE | rect, circle, clear | chamoled_clip |
| FILTER | CH_FILTER_GRAY, CH_FILTER_SEPIA, CH_FILTER_INVERT, CH_FILTER_BRIGHTNESS, CH_F... | chamoled_color_filter |
| TYPE | dimRect, blurRect, innerShadowRect | chamoled_effect_rect |
| TYPE | rgb, mono | chamoled_draw_bitmap |
| ICON | CH_ICON_BATTERY, CH_ICON_BATTERY_CHARGE, CH_ICON_WIFI, CH_ICON_WIFI_OFF, CH_I... | chamoled_draw_icon |
| GESTURE | 1, 2, 3, 4, 5 | chtouch_gesture_is |

## Notes

1. **Variable**: `chamoled_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

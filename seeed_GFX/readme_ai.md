# Seeed GFX

Seeed图形显示库，支持Seeed XIAO Round Display/reTerminal E series等多种TFT和电子纸显示屏的绘图功能。

## Library Info
- **Name**: @aily-project/lib-seeed-gfx
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_gfx_create_tft` | Statement | VAR(field_input) | `seeed_gfx_create_tft("tft")` | `` |
| `seeed_gfx_init` | Statement | VAR(field_input), MODEL(dropdown) | `seeed_gfx_init("tft", 500)` | (dynamic code) |
| `seeed_gfx_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `seeed_gfx_fill_screen(variables_get($tft), math_number(0))` | (dynamic code) |
| `seeed_gfx_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `seeed_gfx_set_rotation(variables_get($tft), 0)` | (dynamic code) |
| `seeed_gfx_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `seeed_gfx_draw_pixel(variables_get($tft), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `seeed_gfx_draw_line(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_draw_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), COLOR(input_value) | `seeed_gfx_fill_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_draw_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_round_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_fill_round_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_round_rect(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_draw_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `seeed_gfx_fill_circle(variables_get($tft), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_set_text_color` | Statement | VAR(field_variable), COLOR(input_value), BGCOLOR(input_value) | `seeed_gfx_set_text_color(variables_get($tft), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `seeed_gfx_set_text_size(variables_get($tft), 1)` | (dynamic code) |
| `seeed_gfx_set_cursor` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `seeed_gfx_set_cursor(variables_get($tft), math_number(0), math_number(0))` | (dynamic code) |
| `seeed_gfx_print` | Statement | VAR(field_variable), TEXT(input_value) | `seeed_gfx_print(variables_get($tft), text("hello"))` | (dynamic code) |
| `seeed_gfx_draw_string` | Statement | VAR(field_variable), TEXT(input_value), X(input_value), Y(input_value), FONT(dropdown) | `seeed_gfx_draw_string(variables_get($tft), text("hello"), math_number(0), math_number(0), 1)` | (dynamic code) |
| `seeed_gfx_create_sprite` | Statement | WIDTH(input_value), HEIGHT(input_value), VAR(field_input) | `seeed_gfx_create_sprite(math_number(0), math_number(0), "sprite")` | (dynamic code) |
| `seeed_gfx_epaper_begin` | Statement | VAR(field_input), MODEL(dropdown) | `seeed_gfx_epaper_begin("epaper", 502)` | (dynamic code) |
| `seeed_gfx_epaper_update` | Statement | VAR(field_variable) | `seeed_gfx_epaper_update(variables_get($epaper))` | (dynamic code) |
| `seeed_gfx_epaper_sleep` | Statement | VAR(field_variable) | `seeed_gfx_epaper_sleep(variables_get($epaper))` | (dynamic code) |
| `seeed_gfx_color` | Value | COLOR(dropdown) | `seeed_gfx_color(TFT_WHITE)` | (dynamic code) |
| `seeed_gfx_epaper_wake` | Statement | VAR(field_variable) | `seeed_gfx_epaper_wake(variables_get($epaper))` | (dynamic code) |
| `seeed_gfx_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `seeed_gfx_rgb565(variables_get($tft))` | (dynamic code) |
| `seeed_gfx_get_width` | Value | VAR(field_variable) | `seeed_gfx_get_width(variables_get($tft))` | (dynamic code) |
| `seeed_gfx_get_height` | Value | VAR(field_variable) | `seeed_gfx_get_height(variables_get($tft))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | 500, 501, 666 | Seeed_Wio_Terminal / Seeed_XIAO_Round_Display / Seeed_XIAO_ILI9341 |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | 0度 / 90度 / 180度 / 270度 / 镜像水平 / 镜像垂直 / 交换XY轴 / 交换XY轴并镜像水平 |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 1 / 2 / 3 / 4 / 5 / 6 / 7 |
| FONT | 1, 2, 4, 6, 7 | 字体1 / 字体2 / 字体4 / 字体6 / 字体7 |
| COLOR | TFT_WHITE, TFT_BLACK, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_MAGENTA, TFT_CYAN, TFT_ORANGE, TFT_PINK, TFT_PURPLE, TFT_BROWN, TFT_DARKGREY, TFT_LIGHTGREY, TFT_GOLD, TFT_SILVER, TFT_SKYBLUE, TFT_VIOLET, TFT_OLIVE, TFT_NAVY, TFT_DARKGREEN, TFT_DARKCYAN, TFT_MAROON, TFT_GREENYELLOW | 白色 / 黑色 / 红色 / 绿色 / 蓝色 / 黄色 / 品红 / 青色 / 橙色 / 粉色 / 紫色 / 棕色 / 灰色 / 浅灰色 / 金色 / 银色 / 天蓝色 / 紫罗兰 / 橄榄绿 / 藏青色 / 深绿色 / 深青色 / 棕红色 / 黄绿色 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_gfx_create_tft("tft")
    seeed_gfx_init("tft", 500)
    seeed_gfx_create_sprite(math_number(0), math_number(0), "sprite")
    seeed_gfx_epaper_begin("epaper", 502)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_gfx_color(TFT_WHITE))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `seeed_gfx_create_tft("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

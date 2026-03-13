# TFT_eSPI

TFT_eSPI - Arduino库，支持多种TFT显示屏的图形和字体库

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.43

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(input_value), MISO(input_value), MOSI(input_value), SCLK(input_value), CS(input_value), DC(input_value), RST(input_value), BL(input_value), BL_LEVEL(dropdown), COLOR_MODE(dropdown) | `tftespi_setup("tft", ILI9341_DRIVER, 10000000, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)` | (dynamic code) |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation($tft, 0)` | (dynamic code) |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display($tft, true)` | (dynamic code) |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen($tft, math_number(0))` | (dynamic code) |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel($tft, math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle($tft, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle($tft, math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle($tft, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | (dynamic code) |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string($tft, math_number(0), math_number(0), text("hello"))` | (dynamic code) |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color($tft, math_number(0))` | (dynamic code) |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size($tft, 1)` | (dynamic code) |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font($tft, 1)` | (dynamic code) |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565($tft)` | (dynamic code) |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM68140_DRIVER, ST7796_DRIVER, SSD1351_DRIVER, SSD1963_480_DRIVER, SSD1963_800_DRIVER, SSD1963_800ALT_DRIVER, ILI9225_DRIVER, GC9A01_DRIVER, GC9D01_DRIVER | ILI9341 / ILI9341_2 / ST7735 / ILI9163 / S6D02A1 / RPI_ILI9486 / HX8357D / ILI9481 / ILI9486 / ILI9488 / ST7789 / ST7789_2 / R61581 / RM68140 / ST7796 / SSD1351 / SSD1963 480 / SSD1963 800 / SSD1963 800ALT / ILI9225 / GC9A01 / GC9D01 |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | 10MHz / 20MHz / 27MHz / 40MHz / 55MHz / 80MHz |
| BL_LEVEL | HIGH, LOW | 高电平点亮 / 低电平点亮 |
| COLOR_MODE | TFT_RGB, TFT_BGR | RGB颜色模式 / BGR颜色模式 |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | 0度 / 90度 / 180度 / 270度 / 水平镜像 / 横屏镜像 / 反向水平镜像 / 反向横屏镜像 |
| INVERT | true, false | 开启 / 关闭 |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 1 / 2 / 3 / 4 / 5 / 6 / 7 |
| FONT | 1, 2, 4, 6, 7, 8 | GLCD / Font2 / Font4 / Font6 / Font7 / Font8 |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | 黑色 / 白色 / 红色 / 绿色 / 蓝色 / 黄色 / 青色 / 洋红色 / 橙色 / 灰色 / 深灰色 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tftespi_setup("tft", ILI9341_DRIVER, 10000000, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), HIGH, TFT_RGB)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tftespi_color_rgb565($tft))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `tftespi_setup("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

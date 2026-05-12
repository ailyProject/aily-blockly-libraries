# TFT_eSPI

TFT_eSPI 显示驱动库。该块库除了生成绘图语句，还会通过宏定义配置屏幕型号、分辨率、SPI 引脚和背光极性。

## Library Info
- **Name**: @aily-project/lib-tft-espi
- **Version**: 2.5.43

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftespi_setup` | Statement | VAR(field_input), MODEL(dropdown), FREQUENCY(dropdown), WIDTH(input_value), HEIGHT(input_value), MISO(input_value), MOSI(input_value), SCLK(input_value), CS(input_value), DC(input_value), RST(input_value), BL(input_value), BL_LEVEL(dropdown), COLOR_MODE(dropdown) | `tftespi_setup("tft", ST7789_DRIVER, 40000000, math_number(172), math_number(320), math_number(-1), math_number(10), math_number(12), math_number(13), math_number(11), math_number(14), math_number(3), HIGH, TFT_RGB)` | `#define ...; TFT_eSPI tft = TFT_eSPI(); tft.init();` |
| `tftespi_set_rotation` | Statement | VAR(field_variable), ROTATION(dropdown) | `tftespi_set_rotation($tft, 1)` | `tft.setRotation(...);` |
| `tftespi_invert_display` | Statement | VAR(field_variable), INVERT(dropdown) | `tftespi_invert_display($tft, true)` | `tft.invertDisplay(...);` |
| `tftespi_fill_screen` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_fill_screen($tft, tftespi_color(TFT_BLACK))` | `tft.fillScreen(...);` |
| `tftespi_draw_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `tftespi_draw_pixel($tft, math_number(10), math_number(10), tftespi_color(TFT_WHITE))` | `tft.drawPixel(...);` |
| `tftespi_draw_line` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `tftespi_draw_line($tft, math_number(0), math_number(0), math_number(100), math_number(100), tftespi_color(TFT_RED))` | `tft.drawLine(...);` |
| `tftespi_draw_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_draw_rect($tft, math_number(20), math_number(20), math_number(60), math_number(40), tftespi_color(TFT_GREEN))` | `tft.drawRect(...);` |
| `tftespi_fill_rect` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `tftespi_fill_rect($tft, math_number(20), math_number(20), math_number(60), math_number(40), tftespi_color(TFT_BLUE))` | `tft.fillRect(...);` |
| `tftespi_draw_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_draw_circle($tft, math_number(80), math_number(80), math_number(20), tftespi_color(TFT_YELLOW))` | `tft.drawCircle(...);` |
| `tftespi_fill_circle` | Statement | VAR(field_variable), X(input_value), Y(input_value), RADIUS(input_value), COLOR(input_value) | `tftespi_fill_circle($tft, math_number(80), math_number(80), math_number(20), tftespi_color(TFT_CYAN))` | `tft.fillCircle(...);` |
| `tftespi_draw_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_draw_triangle($tft, math_number(10), math_number(100), math_number(50), math_number(40), math_number(90), math_number(100), tftespi_color(TFT_MAGENTA))` | `tft.drawTriangle(...);` |
| `tftespi_fill_triangle` | Statement | VAR(field_variable), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), X3(input_value), Y3(input_value), COLOR(input_value) | `tftespi_fill_triangle($tft, math_number(10), math_number(100), math_number(50), math_number(40), math_number(90), math_number(100), tftespi_color(TFT_ORANGE))` | `tft.fillTriangle(...);` |
| `tftespi_draw_string` | Statement | VAR(field_variable), X(input_value), Y(input_value), TEXT(input_value) | `tftespi_draw_string($tft, math_number(20), math_number(20), text("hello"))` | `tft.drawString(...);` |
| `tftespi_set_text_color` | Statement | VAR(field_variable), COLOR(input_value) | `tftespi_set_text_color($tft, tftespi_color(TFT_WHITE))` | `tft.setTextColor(...);` |
| `tftespi_set_text_size` | Statement | VAR(field_variable), SIZE(dropdown) | `tftespi_set_text_size($tft, 2)` | `tft.setTextSize(...);` |
| `tftespi_set_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `tftespi_set_text_font($tft, 2)` | `tft.setTextFont(...);` |
| `tftespi_color_rgb565` | Value | VAR(field_variable), COLOR(field_colour_hsv_sliders) | `tftespi_color_rgb565($tft, #FFAA00)` | `tft.color565(r, g, b)` |
| `tftespi_color` | Value | COLOR(dropdown) | `tftespi_color(TFT_BLACK)` | `TFT_BLACK` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | ILI9341_DRIVER, ILI9341_2_DRIVER, ST7735_DRIVER, ILI9163_DRIVER, S6D02A1_DRIVER, RPI_ILI9486_DRIVER, HX8357D_DRIVER, ILI9481_DRIVER, ILI9486_DRIVER, ILI9488_DRIVER, ST7789_DRIVER, ST7789_2_DRIVER, R61581_DRIVER, RM68140_DRIVER, ST7796_DRIVER, SSD1351_DRIVER, SSD1963_480_DRIVER, SSD1963_800_DRIVER, SSD1963_800ALT_DRIVER, ILI9225_DRIVER, GC9A01_DRIVER, GC9D01_DRIVER | 屏幕驱动型号 |
| FREQUENCY | 10000000, 20000000, 27000000, 40000000, 55000000, 80000000 | SPI 频率 |
| BL_LEVEL | HIGH, LOW | 背光高电平点亮 / 低电平点亮 |
| COLOR_MODE | TFT_RGB, TFT_BGR | RGB 顺序 / BGR 顺序 |
| ROTATION | 0, 1, 2, 3, 4, 5, 6, 7 | TFT_eSPI 旋转参数 |
| INVERT | true, false | 开启 / 关闭颜色反转 |
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 文本大小 |
| FONT | 1, 2, 4, 6, 7, 8 | GLCD / Font2 / Font4 / Font6 / Font7 / Font8 |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY | 常用颜色宏 |

## Initialization Contract

`tftespi_setup(...)` 是这个库的核心初始化块。它不只是“创建变量”，还会同时完成以下事情：

1. 注册 Blockly 变量，例如 `$tft`
2. 生成 `TFT_eSPI tft = TFT_eSPI();`
3. 生成 `tft.init();`
4. 写入编译期宏，例如 `TFT_WIDTH`、`TFT_HEIGHT`、`TFT_MOSI`、`TFT_SCLK`、`TFT_DC`、`TFT_BL`、`TFT_RGB_ORDER`
5. 在 ESP32 内核下自动加入 `USE_HSPI_PORT`

因此，使用 TFT_eSPI 时通常只需要一个 `tftespi_setup(...)`，后续直接引用 `$tft` 即可。

### LVGL integration

如果要配合 LVGL，顺序必须是：

1. `tftespi_setup("tft", ...)`
2. `lvgl_init(TFT_eSPI, WIDTH, HEIGHT, ROTATION)`
3. `lvgl_screen_create(...)`
4. 创建 LVGL 控件
5. `lvgl_screen_load(...)`

## ABS Examples

### Recipe 1: 纯 TFT_eSPI 绘图
```
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, 40000000, math_number(172), math_number(320), math_number(-1), math_number(10), math_number(12), math_number(13), math_number(11), math_number(14), math_number(3), HIGH, TFT_RGB)
    tftespi_set_rotation($tft, 1)
    tftespi_fill_screen($tft, tftespi_color(TFT_BLACK))
    tftespi_set_text_color($tft, tftespi_color(TFT_WHITE))
    tftespi_set_text_size($tft, 2)
    tftespi_draw_string($tft, math_number(16), math_number(16), text("Hello TFT_eSPI"))
    tftespi_fill_circle($tft, math_number(120), math_number(80), math_number(20), tftespi_color_rgb565($tft, #00D1FF))

arduino_loop()
```

### Recipe 2: TFT_eSPI + LVGL
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

## Common Generation Rules

1. `tftespi_setup(...)` 必须放在 `arduino_setup()` 中
2. `WIDTH`、`HEIGHT`、引脚参数都是 `input_value`，数字请写成 `math_number(...)`
3. `MISO` 未使用时可以写 `math_number(-1)`
4. 颜色参数优先用 `tftespi_color(...)` 或 `tftespi_color_rgb565(...)`
5. `tftespi_color_rgb565` 需要两个参数：显示对象和颜色选择器值
6. `tftespi_set_rotation` 是运行时旋转；`COLOR_MODE` 和引脚/分辨率是编译期配置

## Notes

1. **Variable creation**: `tftespi_setup("varName", ...)` 会创建 `$varName`，后续所有绘图块都引用这个变量
2. **Compile-time side effects**: 型号、尺寸、引脚、背光、颜色顺序都通过宏定义生效，不是普通运行时变量
3. **Single source of truth**: 一个工程通常只应保留一个 `tftespi_setup(...)`；多个初始化块会相互覆盖宏配置
4. **Backlight pin**: `BL` 和 `BL_LEVEL` 只负责生成背光相关宏，是否实际接线必须与硬件一致
5. **LVGL dependency**: `lvgl_init(TFT_eSPI, ...)` 依赖 `tftespi_setup(...)` 已经完成底层显示初始化
6. **Parameter order**: 所有 ABS 参数顺序严格遵循 `block.json` 的 `args0` 顺序

# TFT屏幕库 (TFT Screen)

ST7735 TFT屏幕简化库：一键初始化(引脚预设)，绘图/文字/颜色/屏幕信息

## Library Info
- **Name**: @aily-project/lib-tft-screen
- **Version**: 1.0.0

## Pin Configuration (预设，不可更改)

| 引脚 | GPIO | 说明 |
|------|------|------|
| MOSI | 23 | SPI数据输出 |
| SCLK | 18 | SPI时钟 |
| CS   | 5   | 片选 |
| DC   | 4   | 数据/命令 |
| RST  | 19  | 复位 |
| MISO | 19  | SPI数据输入(本屏未用) |

- 驱动: ST7735_DRIVER | 分辨率: 128x160 | SPI: 27MHz | 旋转: 3(横屏) | 颜色: RGB

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tftscr_init` | Statement | (无) | `tftscr_init()` | `tft.init(); tft.setRotation(3);` |
| `tftscr_fill_screen` | Statement | COLOR(input_value) | `tftscr_fill_screen(tftscr_color(TFT_BLACK))` | `tft.fillScreen(TFT_BLACK);` |
| `tftscr_draw_pixel` | Statement | X, Y, COLOR (input_value) | `tftscr_draw_pixel(math_number(0), math_number(0), tftscr_color(TFT_WHITE))` | `tft.drawPixel(0, 0, TFT_WHITE);` |
| `tftscr_draw_line` | Statement | X1, Y1, X2, Y2, COLOR (input_value) | `tftscr_draw_line(...)` | `tft.drawLine(...);` |
| `tftscr_draw_rect` | Statement | X, Y, W, H, COLOR (input_value) | `tftscr_draw_rect(...)` | `tft.drawRect(...);` |
| `tftscr_fill_rect` | Statement | X, Y, W, H, COLOR (input_value) | `tftscr_fill_rect(...)` | `tft.fillRect(...);` |
| `tftscr_draw_circle` | Statement | X, Y, R, COLOR (input_value) | `tftscr_draw_circle(...)` | `tft.drawCircle(...);` |
| `tftscr_fill_circle` | Statement | X, Y, R, COLOR (input_value) | `tftscr_fill_circle(...)` | `tft.fillCircle(...);` |
| `tftscr_draw_string` | Statement | X, Y, TEXT (input_value) | `tftscr_draw_string(math_number(0), math_number(0), text("Hello"))` | `tft.setCursor(0, 0); tft.print("Hello");` |
| `tftscr_set_text_color` | Statement | COLOR(input_value) | `tftscr_set_text_color(tftscr_color(TFT_WHITE))` | `tft.setTextColor(TFT_WHITE);` |
| `tftscr_set_text_size` | Statement | SIZE(field_dropdown) | `tftscr_set_text_size(2)` | `tft.setTextSize(2);` |
| `tftscr_color` | Value (Number) | COLOR(field_dropdown) | `tftscr_color(TFT_RED)` | `TFT_RED` |
| `tftscr_color_rgb` | Value (Number) | R, G, B (input_value) | `tftscr_color_rgb(math_number(255), math_number(0), math_number(0))` | `tft.color565(255, 0, 0)` |
| `tftscr_width` | Value (Number) | (无) | `tftscr_width()` | `tft.width()` |
| `tftscr_height` | Value (Number) | (无) | `tftscr_height()` | `tft.height()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 文字大小 |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY, TFT_NAVY, TFT_DARKGREEN, TFT_DARKCYAN, TFT_MAROON, TFT_PINK | 预设颜色 |

## Notes

1. **全局对象**: 库自动声明全局对象 `tft` (TFT_eSPI类型)
2. **引脚预设**: 初始化块无需任何参数，引脚配置已固化在编译宏中
3. **编译宏**: `tftscr_init` 自动设置 TFT_eSPI 所需的所有编译宏（TFT_MODEL/TFT_MOSI/TFT_SCLK等）
4. **与原tftespi_setup的区别**: 去掉了所有输入参数，驱动/频率/引脚/旋转全部预设，使用更简洁
5. **颜色块**: `tftscr_color` 提供常用预设色，`tftscr_color_rgb` 支持自定义RGB(0-255)
6. **ESP32专用**: 使用HSPI端口

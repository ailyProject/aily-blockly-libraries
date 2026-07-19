# 金逸晨2寸ST7789 TFT屏幕库 (Jinyichen 2inch ST7789)

ST7789 TFT屏幕简化库：一键初始化(引脚预设)，绘图/文字/颜色/动画/屏幕信息

## Library Info
- **Name**: @aily-project/lib-jinyichen-st7789
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

- 驱动: ST7789_DRIVER | 分辨率: 240x320 | SPI: 40MHz | 旋转: 3(横屏) | 颜色: BGR | 端口: HSPI

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
| `tftscr_animation` | Value (TftScreenAnimation) | CUSTOM_ANIMATION(field_tftespi_animation) | `tftscr_animation()` | `tftscr_animation_..._frames` |
| `tftscr_play_animation` | Statement | X, Y, ANIMATION (input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `tftscr_play_animation(math_number(0), math_number(0), tftscr_animation(), BLOCKING, FALSE)` | 阻塞或非阻塞播放 RGB565/RGB332 动画 |
| `tftscr_draw_animation_frame` | Statement | X, Y, ANIMATION, FRAME (input_value) | `tftscr_draw_animation_frame(math_number(0), math_number(0), tftscr_animation(), math_number(0))` | 显示指定动画帧 |
| `tftscr_animation_frame_count` | Value (Number) | ANIMATION(input_value) | `tftscr_animation_frame_count(tftscr_animation())` | 动画总帧数 |
| `tftscr_step_animation_frame` | Statement | FRAME_VAR(field_variable), TARGET, FRAME_COUNT (input_value), DIRECTION(dropdown) | `tftscr_step_animation_frame(variables_get($tftScreenAnimationFrame), math_number(0), math_number(1), AUTO)` | 让帧变量向目标帧移动一步 |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SIZE | 1, 2, 3, 4, 5, 6, 7 | 文字大小 |
| COLOR | TFT_BLACK, TFT_WHITE, TFT_RED, TFT_GREEN, TFT_BLUE, TFT_YELLOW, TFT_CYAN, TFT_MAGENTA, TFT_ORANGE, TFT_LIGHTGREY, TFT_DARKGREY, TFT_NAVY, TFT_DARKGREEN, TFT_DARKCYAN, TFT_MAROON, TFT_PINK | 预设颜色 |
| PLAY_MODE | BLOCKING, NON_BLOCKING | 阻塞播放或在主循环中非阻塞播放 |
| DIRECTION | AUTO, FORWARD, BACKWARD | 帧变量移动方向 |

## Notes

1. **全局对象**: 库自动声明全局对象 `tft` (TFT_eSPI类型)
2. **引脚预设**: 初始化块无需任何参数，引脚配置已固化在编译宏中
3. **编译宏**: `tftscr_init` 自动设置 TFT_eSPI 所需的所有编译宏（ST7789_DRIVER/TFT_MOSI/TFT_SCLK/TFT_BGR等）
4. **色序BGR**: ST7789屏幕使用BGR色序，与原ST7735的RGB不同
5. **偏移修复**: 已修复 ST7789_Rotation.h 中 240×320 在横屏(rotation 2/3/7)下的 CGRAM 偏移问题
6. **颜色块**: `tftscr_color` 提供常用预设色，`tftscr_color_rgb` 支持自定义RGB(0-255)
7. **动画数据**: `tftscr_animation` 使用 `field_tftespi_animation` 上传 GIF/MP4，默认转换区域为320x240，支持RGB565和RGB332
8. **动画连接**: 播放、单帧显示和总帧数块的 `ANIMATION` 输入需直接连接 `tftscr_animation` 数据块
9. **播放方式**: 阻塞模式一次播放完整动画；非阻塞模式应放在主循环中反复执行，并可选择循环播放
10. **ESP32专用**: 使用HSPI端口

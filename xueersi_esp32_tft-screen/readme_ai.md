# TFT屏幕库 (TFT Screen)

ST7735 TFT屏幕简化库：一键初始化(引脚预设)，绘图/文字/颜色/动画/TF卡流式动画/屏幕信息

## Library Info
- **Name**: @aily-project/lib-tft-screen
- **Version**: 1.0.1

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
| `tftscr_animation` | Value (TftScreenAnimation) | CUSTOM_ANIMATION(field_tftespi_animation) | `tftscr_animation()` | `tftscr_animation_..._frames` |
| `tftscr_play_animation` | Statement | X, Y, ANIMATION (input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `tftscr_play_animation(math_number(0), math_number(0), tftscr_animation(), BLOCKING, FALSE)` | 阻塞或非阻塞播放 RGB565/RGB332 动画 |
| `tftscr_play_tf_animation` | Statement | FILENAME(String), BUFFER_KB(Number) | `tftscr_play_tf_animation(text("/animation.rgb565v"), math_number(48))` | 从板载 TF 卡流式播放 AILY 动画，RGB565 优先使用 LCD DMA |
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
3. **编译宏**: `tftscr_init` 自动设置 TFT_eSPI 所需的所有编译宏（TFT_MODEL/TFT_MOSI/TFT_SCLK等）
4. **与原tftespi_setup的区别**: 去掉了所有输入参数，驱动/频率/引脚/旋转全部预设，使用更简洁
5. **颜色块**: `tftscr_color` 提供常用预设色，`tftscr_color_rgb` 支持自定义RGB(0-255)
6. **动画数据**: `tftscr_animation` 使用 `field_tftespi_animation` 上传 GIF/MP4，默认转换区域为160x120，支持RGB565和RGB332
7. **动画连接**: 播放、单帧显示和总帧数块的 `ANIMATION` 输入需直接连接 `tftscr_animation` 数据块
8. **播放方式**: 阻塞模式一次播放完整动画；非阻塞模式应放在主循环中反复执行，并可选择循环播放
9. **TF-card animation**: `tftscr_play_tf_animation` mounts CS 22 through `TFT_eSPI::getSPIinstance()`. GPIO19 is physically shared by panel RESET and TF MISO, so the generator sets `TFT_RST=-1` and relies on the ST7735 software-reset command; it must never drive GPIO19 as an output. Before every mount attempt it ends SD and restarts the shared SPI instance. The `esp32_SD` Blockly package is not required.
10. **High-FPS path**: Mounting tries 25 MHz first, then fully resets SD/SPI and retries at 16 MHz and 4 MHz for signal-integrity/card compatibility. ESP32 core 3.3.10 uses CMD18 multi-sector reads. Row-aligned large reads are used, and the default 48 KB buffer can hold a full native RGB565 frame.
11. **DMA and shared bus**: RGB565 prefers DMA-capable memory and LCD DMA. TFT and TF share GPIO18/23/19, so every LCD DMA transfer finishes before the next card read.
12. **Scaling**: Oversized RGB565/RGB332 video is proportionally downscaled and centered. Native-size RGB565 remains preferable for FPS; scaling and MONO1_XBM use synchronous display transfers.
13. **ESP32-only wiring**: TFT and TF time-share the same HSPI instance. TFT CS is 5 and TF CS is 22.
14. **Visible failures**: Mount, open, AILY validation, frame-read, and allocation failures display a corresponding `TF ERR` instead of returning silently.

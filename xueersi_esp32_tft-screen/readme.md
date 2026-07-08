# TFT屏幕库 (TFT Screen)

ST7735 TFT屏幕简化库：一键初始化(引脚预设)，绘图/文字/颜色/屏幕信息

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tft-screen |
| Version | 1.0.0 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

ESP32 系列（依赖TFT_eSPI库）

## Pin Configuration (预设)

| 引脚 | GPIO |
|------|------|
| MOSI | 23 |
| SCLK | 18 |
| CS   | 5  |
| DC   | 4  |
| RST  | 19 |
| MISO | 19 |
| BL   | 未使用(-1) |

- 驱动: ST7735_DRIVER
- 分辨率: 128x160
- SPI频率: 27MHz
- 旋转: 3 (横屏)
- 颜色模式: RGB

## Quick Start

1. `tftscr_init` 一键初始化（无参数）
2. 用绘图块绘制图形/文字
3. 用颜色块选择预设色或自定义RGB

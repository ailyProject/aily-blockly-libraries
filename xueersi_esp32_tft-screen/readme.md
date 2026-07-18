# TFT Screen

## Description

ST7735 TFT drawing and animation blocks for the Xueersi ESP32 handheld.

## Library Info

| Package | Version | License |
|---|---|---|
| @aily-project/lib-tft-screen | 1.0.1 | MIT |

## Supported Boards

Xueersi ESP32 handheld.

## Quick Start

1. Add `tftscr_init`.
2. Use drawing blocks or `tftscr_animation` for embedded animations.
3. For long animations, copy an AILY video to TF and use `tftscr_play_tf_animation` with the recommended 48 KB buffer.

The TF block uses ESP32 `SD`/`FS`. TFT and TF share HSPI (SCLK 18, MOSI 23, MISO 19; CS 5/22). GPIO19 is also wired to panel RESET, so TFT hardware reset is disabled and ST7735 software reset is used. Mounting tries 25, 16, then 4 MHz after full SD/SPI resets. Large reads and optional RGB565 DMA maximize throughput; shared-bus transfers remain serialized.

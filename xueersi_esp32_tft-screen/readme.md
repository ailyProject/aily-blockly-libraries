# TFT Screen

## Description

ST7735 TFT drawing and animation blocks for the Xueersi ESP32 handheld.

## Library Info

| Package | Version | License |
|---|---|---|
| @aily-project/lib-tft-screen | 1.0.4 | MIT |

## Supported Boards

Xueersi ESP32 handheld.

## Quick Start

1. Add `tftscr_init`.
2. Use drawing blocks or `tftscr_animation` for embedded animations.
3. Initialize the TF card with the parameter-free `xueersi_esp32_sd` block.
4. For long animations, copy an AILY video to TF and use `tftscr_play_tf_animation` with the recommended 48 KB buffer.

The TF playback block uses the global ESP32 `SD`/`FS` instance after it has been initialized by `xueersi_esp32_sd`; it never calls `SD.begin()`, `SD.end()`, or restarts SPI. TFT and TF share SCLK 18, MOSI 23, and MISO 19, with CS 5/22. GPIO19 is also wired to panel RESET, so TFT hardware reset is disabled and ST7735 software reset is used. Large row-aligned reads and synchronous batched LCD writes maximize throughput while keeping the shared bus under one SPI owner. TFT_eSPI DMA is intentionally disabled during TF playback because its ESP32 DMA setup reinitializes and later frees the same HSPI host used by `SD`.

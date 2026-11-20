# rlcd42-display

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-rlcd42-display |
| Version | 0.0.1 |
| Author | Bryan |
| Source | On-board ST7305 panel driver, ESP32-S3-RLCD-4.2 |
| License | UNLICENSED |

## Supported Boards

- Waveshare ESP32-S3-RLCD-4.2 (4.2-inch ST7305 reflective panel, SPI3 MOSI=12 SCK=11 DC=5 CS=40 RST=41).

## Description

Drives the on-board 4.2-inch reflective panel in 400x300 landscape or 300x400 portrait orientation. Provides initialisation, clearing, pixels, lines, rectangles, circles, ASCII and Chinese text, wrapped multi-line text, emotion faces and a full-frame refresh, plus the current logical width and height.

## Quick Start

1. Enable `@aily-project/lib-rlcd42-display` in aily Blockly.
2. In `arduino_setup()`, add `rlcd42_display_init` and choose the orientation.
3. In `arduino_loop()`, draw with the shape and text blocks, then call `rlcd42_display` to push the frame to the panel.

Chinese description: [readme_zh.md](readme_zh.md).

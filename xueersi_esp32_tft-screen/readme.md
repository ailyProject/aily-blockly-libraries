# TFT Screen

Simplified ST7735 TFT library for the Xueersi ESP32 handheld, with preset pins, drawing, text, colour, animation, and screen information blocks.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tft-screen |
| Version | 1.0.1 |
| Author | ailyProject |
| License | MIT |

## Supported Boards

Xueersi ESP32 handheld and compatible ESP32 boards using the bundled TFT_eSPI source.

## Description

The library initializes the 128x160 ST7735 display with preset pins and rotation 3. Animation blocks convert GIF or MP4 input to RGB565/RGB332 frames for full playback or frame-by-frame control.

## Quick Start

1. Add `tftscr_init` to setup.
2. Use drawing, text, and colour blocks for static content.
3. Use `tftscr_animation` with a playback or frame-control block for animated content.

Default pins: MOSI 23, SCLK 18, CS 5, DC 4, RST 19, MISO 19. SPI frequency is 27 MHz and HSPI is used on ESP32.

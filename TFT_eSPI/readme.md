# TFT_eSPI

Graphics, text, images and animation for TFT displays.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tft-espi |
| Version | 2.5.55 |
| Author | ailyProject |
| Source | https://github.com/Bodmer/TFT_eSPI |
| License | Original license |

## Supported Boards

ESP32, RP2040, STM32, SAMD, nRF52 and ChipIntelli CI13XX.

## Quick Start

Enable the package, configure the screen in `arduino_setup()`, then draw in `arduino_loop()`.
Version 2.5.55 also restores older setup connections for size and pins.

## Description

Upload PNG/JPEG/WebP/BMP images or short GIF/MP4 clips. Choose RGB565 for colour fidelity or RGB332 for smaller frames; MP4 audio is ignored. The editor retains original images for reconversion. Select TFT_RGB or TFT_BGR to match the panel. Playback supports blocking, non-blocking, looping and individual frames.

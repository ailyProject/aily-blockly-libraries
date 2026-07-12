# Seeed GFX

Seeed graphics display library supports the drawing functions of various TFT and e-paper displays such as Seeed XIAO Round Display/reTerminal E series.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-gfx |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_GFX |
| License | Original license |

## Supported Boards

ESP32

## Description

Seeed graphics display library supports the drawing functions of various TFT and e-paper displays such as Seeed XIAO Round Display/reTerminal E series.

## Quick Start

1. Enable `@aily-project/lib-seeed-gfx` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## GIF and MP4 Animation

Upload GIF/MP4 to generate RGB565 `PROGMEM` frames for `pushImage()`. TFT supports blocking, non-blocking, looping, and selected-frame playback. Keep clips short; audio is ignored.

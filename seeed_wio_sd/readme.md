# Wio Terminal SD Card Storage Library

SD card storage library dedicated to the Wio Terminal onboard SD slot. It supports file read/write, append, delete, rename, and directory management operations.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-wio-sd |
| Version | 1.0.5 |
| Author | Hongtai.liu |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_FS |
| License | Original license |

## Supported Boards

Wio Terminal

## Description

Uses `SDCARD_SS_PIN` and `SDCARD_SPI` for the onboard SD slot.

## Quick Start

1. Enable `@aily-project/lib-seeed-wio-sd` in Aily Blockly.
2. Add `seeed_fs_sd_begin(math_number(25))` in `arduino_setup()` to initialize the onboard SD slot. The frequency input is in MHz; the toolbox default and current HAL maximum are both 25 MHz.
3. Use the file or directory operation blocks after initialization succeeds.
4. Seeed Wio GFX SD-video blocks can reuse the same initialized SD card.

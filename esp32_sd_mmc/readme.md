# ESP32 SD_MMC

ESP32 SD_MMC (SDIO mode) reads and writes SD cards, supports 1-bit and 4-bit modes

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32-sd-mmc |
| Version | 0.0.2 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32, ESP32-S3 and ESP32-S31 boards with SDMMC. Pins come from the board's `sdCardPins` unless a set-pins block is used.

IBox S31: the card power is XL9555 P10 (low = on). Make it an output with the XL9555 library, drive it high for 200 ms, then low for 250 ms before init.

## Description

ESP32 SD_MMC (SDIO mode) reads and writes SD cards, supports 1-bit and 4-bit modes

## Quick Start

1. Enable `@aily-project/lib-esp32-sd-mmc` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

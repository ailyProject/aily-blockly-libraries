# M5Stack Onboard SD Card

Onboard M5Stack SD card blocks that use the official M5Unified pin table and automatically select SPI or SDMMC. M5Tough uses its documented fixed pins (SCK 18, MISO 38, MOSI 23, CS 4).

The wrapper verifies the card type, retries mounting after removal, exposes Boolean write/delete results, and supports directories, rename, listing and capacity queries.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-m5stack-sd |
| Version | 0.1.0 |
| Author | M5Stack / ailyProject |
| Source | https://github.com/m5stack/M5Unified |
| License | Original license |

## Supported Boards

ESP32

## Description

Onboard M5Stack SD card blocks that use the official M5Unified pin table and automatically select SPI or SDMMC.

## Quick Start

1. Enable `@aily-project/lib-m5stack-sd` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

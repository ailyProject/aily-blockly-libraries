# Seeed Arduino FS

A Blockly library for SD card file system operations on Seeed development boards.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-fs |
| Version | 1.0.0 |
| Author | Hongtai.liu |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_FS |
| License | GNU GPL v3 |

## Supported Boards

Seeed Wio Terminal, SAMD21-based Seeed boards, ESP32, ESP8266, RP2040

## Description

Wraps the Seeed_Arduino_FS library for visual programming. Provides blocks for initializing an SPI-connected SD card and performing file/directory operations (read, write, append, delete, rename, list). Uses the FatFs-based `SD` global object via `#include <Seeed_Arduino_FS.h>`.

## Quick Start

1. Connect SD card to SPI pins (default: SDCARD_SS_PIN / SDCARD_SPI).
2. Add "初始化SD卡 (默认SPI引脚)" block in `setup`.
3. Use quick file operation blocks to read/write files.

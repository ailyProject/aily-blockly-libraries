# Xueersi ESP32 TF card library

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-xueersi-esp32-sd |
| Version | 1.0.3 |
| Protocol | Shared HSPI |

## Supported Boards

Xueersi ESP32 handheld with the onboard ST7735 TFT and TF slot.

## Description

Mount the onboard TF card on HSPI. It reuses TFT_eSPI's SPI instance when the Xueersi TFT initialization block exists, or creates its own otherwise. Fixed wiring: SCK18, MISO19, MOSI23, TF CS22, TFT CS5. It probes 25/20/16/10/4 MHz and verifies real-file reads before accepting a clock.

## Quick Start

1. Add the parameter-free Xueersi TF initialization block.
2. Xueersi TFT initialization may be before or after it, and is optional.
3. Use bounded reads for large files; close files and unmount before removal.

Paths start with `/`. Initialization never formats the card. GPIO19 stays input because it is TF MISO and panel RESET; TFT must use `TFT_RST=-1`.

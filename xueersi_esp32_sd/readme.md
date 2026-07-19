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

Mount the onboard TF card on the HSPI instance used by `xueersi_esp32_tft-screen`. Fixed wiring: SCK18, MISO19, MOSI23, TF CS22, TFT CS5. It probes the board-safe 25/20/16/10/4 MHz range and samples a real file at five positions before accepting the highest stable clock.

## Quick Start

1. Initialize the TFT first with `xueersi_esp32_tft-screen`.
2. Add the parameter-free Xueersi TF initialization block immediately afterward.
3. For large files, use bounded reads or the TFT streaming-animation block.
4. Close open files and call the unmount block before removing the card.

Paths start with `/`. Initialization never formats the card. GPIO19 stays input because it is TF MISO and panel RESET; TFT must use `TFT_RST=-1`.

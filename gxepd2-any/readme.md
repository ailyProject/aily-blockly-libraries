# GxEPD2 E-Paper

## Library Info
- Name: `@aily-project/lib-gxepd2-any`
- Version: `1.2.0`
- License: GPL-3.0

## Supported Boards
ESP32 boards with SPI and sufficient RAM; panels use 3.3 V supply and logic.

## Description
Includes drawing blocks, 99 single-IC panel drivers, and the dual-IC HINK-E042A03-A1 driver. Adafruit GFX, GxEPD2 and U8g2 sources are bundled.

## Quick Start
Choose the setup block for your panel and set SCK, MOSI, CS, DC, RST and BUSY pins. For dual-IC panels also set CS2 and optional active-low PWR. Use the registered display variable with drawing blocks inside page update. Panel selection must match the hardware marking.

See `readme_ai.md` for block signatures and ABS examples.

# FluxGarage RoboEyes

Smooth animated robot eyes for Adafruit GFX compatible OLED displays.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-fluxgarage-roboeyes |
| Version | 1.2.0 |
| Author | Dennis Hoelscher |
| Source | https://github.com/FluxGarage/RoboEyes |
| License | GPL-3.0-or-later |

## Supported Boards

Boards supported by Adafruit GFX, SSD1306, or SH110X.

## Description

Smooth animated robot eyes for Adafruit GFX compatible OLED displays.

## Quick Start

1. Add the I2C or SPI init block and select SSD1306/SH1106G. GFX, BusIO, and the OLED drivers are bundled.
2. For another buffered GFX display, use the “existing display object” init block.
3. Add mood/animation blocks; `update()` is inserted into the main loop automatically.

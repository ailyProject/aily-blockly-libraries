# LTR303 Ambient Light

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ltr303 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32). I2C pins follow the selected board; on the IBox S31 the onboard LTR-303 uses SDA=IO0, SCL=IO1.

## Description

LTR-303 ambient light sensor: lux plus raw visible and infrared counts, I2C pins from the board.

## Quick Start

1. Select an ESP32 board; the I2C pins come from the board (IBox S31: SDA=IO0, SCL=IO1).
2. Put `ltr303_init` in `arduino_setup()`, then use `ltr303_read` in `arduino_loop()`.

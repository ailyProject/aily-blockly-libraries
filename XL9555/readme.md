# XL9555 IO Expander

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-xl9555 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32). I2C pins follow the selected board; on the IBox S31 the XL9555 is at 0x27 on SDA=IO0, SCL=IO1.

## Description

XL9555/PCA9555 IO expander: named pins, keys and high/low outputs; I2C pins from the board.

## Quick Start

1. Select an ESP32 board; the I2C pins come from the board (IBox S31: XL9555 at 0x27 on SDA=IO0, SCL=IO1).
2. Put `xl9555_init` and one `xl9555_name_pin` per pin in `arduino_setup()`, then test keys with `xl9555_key` or drive outputs with `xl9555_write`.

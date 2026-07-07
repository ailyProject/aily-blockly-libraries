# VEML6040 Color Sensor

Vishay VEML6040 RGBW color sensor over I2C: read R/G/B/W, CCT and ambient light.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-veml6040 |
| Version | 1.0.0 |
| Author | thewknd |
| Source | https://github.com/thewknd/VEML6040 |
| License | MIT |

## Supported Boards

Arduino AVR / megaAVR / SAMD, ESP32, ESP8266, RP2040, UNO R4 — any I2C board.

## Description

Library for the Vishay VEML6040 RGBW color sensor (I2C address 0x10). Reads red/green/blue/white raw channels, correlated color temperature (CCT, in K) and ambient light (in lux). Integration time is selectable from 40ms to 1280ms (longer = more sensitive but slower).

## Quick Start

1. Enable `@aily-project/lib-veml6040` in Aily Blockly.
2. Wire the sensor to I2C (SDA/SCL, 0x10). Put **init color sensor** in `arduino_setup()`, then use **read** blocks in `arduino_loop()`.

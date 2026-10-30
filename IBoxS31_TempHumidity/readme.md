# IBox S31 Temp & Humidity

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_temphumidity |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

Onboard AHT20 temperature and humidity sensor of the IBox S31, with CRC check.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_aht20_init` in `arduino_setup()`, then use `iboxs31_aht20_read` in `arduino_loop()`.

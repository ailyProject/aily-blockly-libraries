# IBox S31 Ambient Light

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_ambientlight |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

Onboard LTR-303 ambient light sensor of the IBox S31: lux plus raw visible and infrared counts.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_ltr303_init` in `arduino_setup()`, then use `iboxs31_ltr303_read` in `arduino_loop()`.

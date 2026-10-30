# IBox S31 Joystick & Buttons

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_buttons |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 onboard keys: five-way joystick (up, down, left, right, center OK) plus A and B.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_keys_init` in `arduino_setup()`, then test keys with `iboxs31_keys_key` in `arduino_loop()`.

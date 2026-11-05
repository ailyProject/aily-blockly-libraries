# QMC6309 Compass

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-qmc6309 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32). I2C pins come from the board’s `magnetometerConfig` when it has a QMC6309 (IBox S31), otherwise from its I2C pins.

## Description

QMC6309 magnetometer compass: heading, three-axis field and hard-iron calibration; I2C pins from the board.

## Quick Start

1. Select an ESP32 board; the I2C pins come from the board (IBox S31: SDA=IO0, SCL=IO1).
2. Put `qmc6309_init` in `arduino_setup()`, then read the heading with `qmc6309_read` in `arduino_loop()`.

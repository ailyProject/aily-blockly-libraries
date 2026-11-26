# QMC6309 Compass

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-qmc6309 |
| Version | 1.0.2 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 (Arduino-ESP32) and STM32F1 (Arduino_Core_STM32). I2C pins come from the board’s `magnetometerConfig` when it has a QMC6309 (IBox S31), otherwise from its I2C pins.

## Description

QMC6309 magnetometer compass: heading, three-axis field and hard-iron calibration; I2C pins from the board.

## Quick Start

1. Select an ESP32 board; the I2C pins come from the board (IBox S31: SDA=IO0, SCL=IO1).
2. Put `qmc6309_init` in `arduino_setup()`, then read the heading with `qmc6309_read` in `arduino_loop()`.

The QST factory address is `0x7C`. The Aily driver also checks `0x2C` for compatibility. It requires chip ID `0x90` before writing either address. Each successful Blockly update publishes X, Y, Z and the corrected heading from one six-byte frame. On failure the valid flag is false and the numeric outputs retain their last complete frame (zero before the first sample).

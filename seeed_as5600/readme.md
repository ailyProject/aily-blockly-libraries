# Seeed AS5600 Magnetic Encoder

Grove AS5600 12-bit magnetic absolute encoder blocks for angle reading, magnet checks, position configuration, and burn status.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-as5600 |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_AS5600 |
| License | MIT |

## Supported Boards

Arduino-compatible boards with I2C support.

## Description

This library wraps Seeed's Grove AS5600 Arduino library. It reads raw or scaled angle data, checks magnet presence and strength, configures start/end/max positions, and exposes advanced configuration and burn status APIs.

## Quick Start

1. Enable `@aily-project/lib-seeed-as5600` in Aily Blockly.
2. Initialize the encoder in `arduino_setup()`, then read angle or magnet status in `arduino_loop()`.
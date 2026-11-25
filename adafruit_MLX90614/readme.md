# MLX90614 infrared temperature measurement library

MLX90614 infrared non-contact temperature sensor driver library, which can measure object and ambient temperature

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-mlx90614 |
| Version | 1.0.0 |
| Author | Adafruit |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

MLX90614 infrared non-contact temperature sensor driver library, which can measure object and ambient temperature

## Quick Start

1. Enable `@aily-project/lib-mlx90614` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

1.0.1 checks the SMBus read PEC and temperature error bit. Invalid temperature and emissivity reads return NaN. Use the last-operation result after a write, and retry initialization after reconnecting. The supported emissivity range is 0.1–1.0.

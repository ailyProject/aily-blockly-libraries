# SparkFun LIS3DH Accelerometer

Blockly wrapper for SparkFun LIS3DH 3-axis accelerometer.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lis3dh |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun LIS3DH 3-axis accelerometer.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-lis3dh` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The initialization block uses I²C. C++ sketches can also select four-wire SPI with the SPI_MODE constructor. On STM32 and ESP32-S3, the driver uses a 1 MHz, MSB-first mode 3 transaction for each SPI transfer.

# SparkFun ADXL345 accelerometer

Blockly wrapper for the SparkFun ADXL345 triple-axis accelerometer.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-adxl345 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun ADXL345 triple-axis accelerometer.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-adxl345` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Bus settings

The I²C constructor uses address `0x53`. On SparkFun SEN-09836 v14, connect CS to 3.3 V and SDO to GND, and provide pull-ups for SDA and SCL. See the [board schematic](https://github.com/sparkfun/ADXL345_Breakout/blob/8e83a624bcaea0a3071885c58634b56fbefa346d/Hardware/ADXL345_Breakout.sch).

The SPI constructor takes a chip-select pin. The driver selects 4 MHz, MSB first and mode 3 for each transfer. It releases chip select before ending the transaction so other devices can use their own bus settings.

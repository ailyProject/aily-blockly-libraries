# SparkFun NAU7802 Qwiic Scale

Blockly wrapper for SparkFun Qwiic Scale NAU7802 (24-bit ADC load cell interface).

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-nau7802 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun Qwiic Scale NAU7802 (24-bit ADC load cell interface).

## Quick Start

1. Enable `@aily-project/lib-sparkfun-nau7802` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Call Wire.begin() before initializing the scale. available() returns false if the register read fails. A failed or incomplete ADC read returns zero.

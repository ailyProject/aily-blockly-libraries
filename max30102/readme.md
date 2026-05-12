# MAX30102 pulse oximeter

Blockly wrapper for the MAX30102 pulse oximeter library. It wraps MAX30102_by_RF sampling and calculation flow for SpO2, heart rate, temperature, raw red/IR values, and signal quality.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-max30102 |
| Version | 0.0.2 |
| Author | k7212519 |
| Source | https://github.com/aromring/MAX30102_by_RF |
| License | Original license |

## Supported Boards

ESP32, Arduino SAMD

## Description

Blockly wrapper for the MAX30102 pulse oximeter library. It wraps MAX30102_by_RF sampling and calculation flow for SpO2, heart rate, temperature, raw red/IR values, and signal quality.

## Quick Start

1. Enable `@aily-project/lib-max30102` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

# MAX30102 pulse oximeter

Blockly wrapper for the MAX30102 pulse oximeter library. It wraps MAX30102_by_RF sampling and calculation flow for SpO2, heart rate, temperature, raw red/IR values, and signal quality.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-max30102 |
| Version | 0.0.3 |
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

Initialization checks the shared MAX3010x part ID (0x15) before configuration. Check initialization and measurement validity after power loss or a failed transfer. The reset block clears the initialization state; initialize again before measuring. FIFO reads publish the red and IR outputs together only after all six bytes arrive. Temperature is read after the conversion completes.

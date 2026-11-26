# SparkFun AS726X spectral sensor

Blockly wrapper for the SparkFun AS726X six-channel spectral sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-as726x |
| Version | 0.0.2 |
| Author | Andrew England / SparkFun Electronics |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun AS726X six-channel spectral sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-as726x` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

A failed initialization or transfer reports no data ready. Raw channels and the temperature block return -1 on error. Calibrated channels return NaN. Raw zero and 65535 are valid. Coder can use lastOperationSucceeded() after a byte-valued getter. Call begin() again after restoring a disconnected device.

# SparkFun LIDAR-Lite v4 Distance Sensor

Blockly wrapper for SparkFun LIDAR-Lite v4 LED distance sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lidar-v4 |
| Version | 0.0.2 |
| Author | SparkFun Electronics / Garmin |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun LIDAR-Lite v4 LED distance sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-lidar-v4` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Distance and errors

The distance block and `getDistanceCm(timeoutMs)` return centimetres, −1 on an I²C failure and −2 on a measurement timeout. The default polling timeout is 1000 ms. Coder can set a different timeout for slower acquisition settings. The existing unsigned `getDistance()` returns zero on failure. Acknowledge-only connection checks use `isConnected()`. Use `tryConfigure(mode)` in Coder to check both preset writes. The preset numbers stored in existing projects are preserved.

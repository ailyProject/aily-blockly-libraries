# SparkFun LSM6DSO 6DoF IMU

Blockly wrapper for SparkFun LSM6DSO 6DoF IMU (accel, gyro, temperature) via I2C.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm6dso |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun LSM6DSO 6DoF IMU (accel, gyro, temperature) via I2C.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-lsm6dso` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The initialization block opens Wire, checks the device identity and applies BASIC_SETTINGS. Check `isConfigured()` in Coder. Acceleration (g), angular rate (degrees per second) and temperature (°C) return `NaN` on failed reads. A raw integer getter returns zero on failure and exposes the error through `getLastReadStatus()`.

# SparkFun LSM9DS1 9DOF IMU

Blockly wrapper for SparkFun LSM9DS1 9DOF IMU (accel, gyro, mag).

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm9ds1 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for SparkFun LSM9DS1 9DOF IMU (accel, gyro, mag).

## Quick Start

1. Enable `@aily-project/lib-sparkfun-lsm9ds1` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Begin Wire before calling `imu.begin()` in Coder. Both dies must identify and accept configuration. Axis blocks return NaN on missing or failed group reads. Raw fields keep the last complete sample. Coder can check `lastReadSucceeded()` immediately after a raw read and `isConfigured()` after initialization. The original calc methods remain raw-unit conversion helpers.

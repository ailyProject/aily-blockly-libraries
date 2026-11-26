# SparkFun LSM303C 6DOF IMU

SparkFun LSM303C accelerometer and magnetometer.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm303c |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino Wire boards.

## Description

Blockly wrapper for SparkFun LSM303C 6DOF IMU (accel + mag).

## Quick Start

1. Enable `@aily-project/lib-sparkfun-lsm303c` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### I²C measurements

The init block starts Wire and checks both devices at 0x1D and 0x1E. In Coder, start Wire on the selected pins before calling `imu.begin()`. A successful call returns `IMU_SUCCESS`. Acceleration is in mg, magnetic field in gauss and temperature in °C relative to the driver’s 25 °C reference. An unavailable measurement returns NaN. The original Pro Mini three-wire SPI wiring uses AVR port B.

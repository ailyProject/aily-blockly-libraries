# LSM303AGR Accelerometer & Magnetometer

LSM303AGR 3D accelerometer and 3D magnetometer sensor control library. Reads acceleration, magnetic field and temperature data via I2C interface, suitable for Arduino, STM32 and other development boards.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-lsm303agr |
| Version | 0.0.2 |
| Author | stm32duino |
| Source | https://github.com/stm32duino/LSM303AGR |
| License | Original license |

On a missing device or a short I²C transfer the driver returns an error. The axis blocks return `INT32_MIN` and the temperature block returns `NaN`. The angle block returns `NaN` before the first successful AHRS update and after an update with invalid acceleration or magnetic data. Call the update block again after the device reconnects. Temperature acquisition allows one full 1 Hz sample period plus 100 ms.

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

LSM303AGR 3D accelerometer and 3D magnetometer sensor control library. Reads acceleration, magnetic field and temperature data via I2C interface, suitable for Arduino, STM32 and other development boards.

## Quick Start

1. Enable `@aily-project/lib-lsm303agr` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

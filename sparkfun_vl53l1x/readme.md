# SparkFun VL53L1X ToF Laser Distance Sensor

Blockly wrapper for the SparkFun VL53L1X I2C laser ToF distance sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-vl53l1x |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun VL53L1X I2C laser ToF distance sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-vl53l1x` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Use the last-initialization-success block after init. In C++, begin() retains its original zero-on-success convention. Missing or short I²C reads yield data ready false, distance 0 and range status 255. Reinitialize after reconnecting the device.

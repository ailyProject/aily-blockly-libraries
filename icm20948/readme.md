# ICM20948 nine-axis sensor

ICM20948 nine-axis sensor support library supports accelerometer, gyroscope, magnetometer and AHRS attitude calculation

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-icm20948 |
| Version | 1.0.2 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32, Arduino UNO R4

## Description

ICM20948 nine-axis sensor support library supports accelerometer, gyroscope, magnetometer and AHRS attitude calculation

## Quick Start

1. Enable `@aily-project/lib-icm20948` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The generated sketch shares one fresh sample between motion, compass and attitude blocks in each loop. Gyroscope values and attitude updates use the configured offset in degrees/second. Calibration replaces those offsets once the requested number of successful reads is available. A missing device invalidates all displayed readings and the sketch retries initialization when the bus becomes available. Temperature uses 0 counts at 21 °C and 333.87 counts/°C.

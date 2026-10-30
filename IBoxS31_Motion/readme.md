# IBox S31 IMU & Compass

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_motion |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 QMI8658 six-axis IMU and QMC6309 compass: acceleration, angular rate, tilt and heading.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_imu_init` in `arduino_setup()`, then read tilt with `iboxs31_imu_read` and heading with `iboxs31_imu_mag_read` in `arduino_loop()`.

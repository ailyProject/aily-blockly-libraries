# QMI8658 IMU

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-qmi8658 |
| Version | 1.0.1 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32). Pins and address come from the board’s `imuConfig` when it has a QMI8658 (IBox S31, Korvo S3), otherwise from its I2C pins.

## Description

QMI8658 six-axis IMU: acceleration, angular rate, temperature and tilt; pins and address from the board.

## Quick Start

1. Select an ESP32 board; pins and address come from the board (IBox S31 and Korvo S3 have a QMI8658 at 0x6B).
2. Put `qmi8658_init` in `arduino_setup()`, then read tilt with `qmi8658_read` in `arduino_loop()`.

## 1.0.2

初始化会核对首选地址及备用地址的 WHO_AM_I，仅读到 0x05 才配置器件。开启自动递增并使用小端格式读取有符号轴数据。

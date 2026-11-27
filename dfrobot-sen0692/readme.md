# 6-DOF IMU

Gravity SEN0692 6-DOF IMU with I2C/UART, accel, gyro.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0692 |
| Version | 0.1.1 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Supported profiles include Arduino UNO, ESP32, ESP32-C3, ESP32-S3 and OJ Nano STM32F103C8. Automatic UART uses USART1 on OJ Nano (PA10 RX, PA9 TX) and D7 RX / D6 TX on XIAO ESP32-S3. Existing sketches retain their board port selection. On UNO, select the RX/TX pins for SoftwareSerial.

## Description

Gravity SEN0692 6-DOF IMU with I2C/UART, accel, gyro.

## Quick Start

Call sen0692_init_i2c in arduino_setup(), then sen0692_read before sen0692_get_data in arduino_loop(). Default I2C 0x4A.

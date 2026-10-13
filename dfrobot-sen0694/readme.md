# 9-DOF IMU

Gravity SEN0694 9-DOF IMU with I2C/UART, accel, gyro, mag.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0694 |
| Version | 0.1.0 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32, ESP32-C3 and ESP32-S3 only. Nano/Mega and other types are excluded. UNO UART uses SoftwareSerial; ESP32 uses a board hardware port (prefer Serial1; no Serial2 on ESP32-C3).

## Description

Gravity SEN0694 9-DOF IMU with I2C/UART, accel, gyro, mag.

## Quick Start

Call sen0694_init_i2c in arduino_setup(), then sen0694_read before sen0694_get_data in arduino_loop(). Default I2C 0x4A.

For interrupts, INT1/INT2 use the ordinary interrupt types. INT3 must use the options labelled INT3; other pin/type combinations are rejected by the sensor driver.

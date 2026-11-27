# 10-DOF IMU

Gravity SEN0696 10-DOF IMU with I2C/UART, accel, gyro, mag and barometer.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-sen0696 |
| Version | 0.1.1 |
| Author | vonweller |
| Source | https://gitee.com/dfrobot/DFRobot_Multi_DOF_IMU |
| License | MIT |

## Supported Boards

Supported profiles include Arduino UNO, ESP32, ESP32-C3, ESP32-S3 and OJ Nano STM32F103C8. Automatic UART uses USART1 on OJ Nano (PA10 RX, PA9 TX) and D7 RX / D6 TX on XIAO ESP32-S3. Existing sketches retain their board port selection. On UNO, select the RX/TX pins for SoftwareSerial.

## Description

Gravity SEN0696 10-DOF IMU with I2C/UART, accel, gyro, mag and barometer.

## Quick Start

Call sen0696_init_i2c in arduino_setup(), then sen0696_read before sen0696_get_data in arduino_loop(). Default I2C 0x4A.

For interrupts, INT1/INT2 use the ordinary interrupt types. INT3 and INT4 must use the options labelled with the same pin; other pin/type combinations are rejected by the sensor driver.

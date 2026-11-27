# 9-axis IMU sensor

9-axis IMU sensor library, supports QMI8658A six-axis sensor (accelerometer + gyroscope) and MMC5603NJ three-axis magnetic sensor, suitable for control board 3.0

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-imu9dof |
| Version | 0.0.1 |
| Author | VonWell |
| Source | https://github.com/deneyapkart/deneyap-9-eksen-ataletsel-olcum-birimi-arduino-library |
| License | Original license |

## Supported Boards

ESP32

## Description

9-axis IMU sensor library, supports QMI8658A six-axis sensor (accelerometer + gyroscope) and MMC5603NJ three-axis magnetic sensor, suitable for control board 3.0

## Quick Start

1. Enable `@aily-project/lib-imu9dof` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.


### 0.0.2 驱动修正

QMI8658A 读取使用连续地址和小端格式，量程与采样率写入各自的控制位，温度由芯片的有符号输出换算。MMC5603NJ 读取磁场和温度前检查对应的完成位。器件掉线或转换超时时，磁场和温度浮点 API 返回 NaN，可重新连接后再次读取。

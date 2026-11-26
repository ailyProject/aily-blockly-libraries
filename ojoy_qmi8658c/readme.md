# OJoy 6-axis IMU

OJoy QMI8658C 6-axis IMU (accel+gyro): 3-axis accel/gyro/temperature/pitch-roll, I2C 0x6B, OJoy pins fixed

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-ojoy_qmi8658c |
| Version | 0.0.1 |
| Author | ailyProject |
| Source | https://gitee.com/blsncd/1.6-amoled-480x480-qspi-ch13613 |
| License | Original license |

## Supported Boards

ESP32

## Description

OJoy QMI8658C 6-axis IMU (accel+gyro): 3-axis accel/gyro/temperature/pitch-roll, I2C 0x6B, OJoy pins fixed

## Quick Start

1. Enable `@aily-project/lib-ojoy_qmi8658c` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## 0.0.2

初始化和量程设置会检查总线应答。三轴加速度、三轴角速度和温度都读取完整后才提交新样本，短读或掉线时 read() 返回 false，保留上一帧。

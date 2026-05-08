# SparkFun LIDAR-Lite v4

通过 I2C 获取 LIDAR-Lite v4 激光测距传感器的距离数据。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lidar-v4 |
| Version | 0.0.1 |
| Author | SparkFun Electronics / Garmin |
| Source | https://github.com/sparkfun/SparkFun_LIDARLitev4_Arduino_Library |
| License | Apache-2.0 |

## Supported Boards

Arduino UNO、ESP32

## Description

LIDAR-Lite v4 是一款高性能激光测距模块，通过 I2C 接口返回厘米级距离测量值，量程可达数米，支持多种配置模式。

## Quick Start

1. 连接模块到 I2C 总线（SDA/SCL）及 5V/GND
2. 在 Setup 中调用初始化块
3. 在 Loop 中调用「读取距离」获取测量值（cm）

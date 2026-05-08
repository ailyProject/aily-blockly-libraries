# SparkFun LSM303C 六轴 IMU

读取 LSM303C 三轴加速度计和三轴磁力计数据。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm303c |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_LSM303C_6_DOF_IMU_Breakout_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO、ESP32（I2C 模式）

## Description

LSM303C 集成三轴加速度计和三轴磁力计，通过 I2C 直接读取浮点值（mg 和 Gauss）。

## Quick Start

1. 连接到 I2C 总线
2. 在 Setup 中调用初始化块
3. 直接调用各轴读取块获取数值

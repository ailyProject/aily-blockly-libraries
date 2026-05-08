# SparkFun LSM9DS1 九轴 IMU

读取 LSM9DS1 三轴加速度计、三轴陀螺仪和三轴磁力计数据。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm9ds1 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_LSM9DS1_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO、ESP32

## Description

LSM9DS1 集成加速度计、陀螺仪和磁力计于一体的九轴 IMU，通过 I2C 接口读取各传感器数据。调用读取块后，再使用轴数值块获取浮点值（自动经过校准系数转换）。

## Quick Start

1. 连接到 I2C 总线
2. 在 Setup 中调用初始化块
3. 在 Loop 中先调用「读取」块，再用轴数值块获取具体值

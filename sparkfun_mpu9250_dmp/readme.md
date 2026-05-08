# SparkFun MPU-9250 DMP IMU

SparkFun MPU-9250 九轴 IMU（加速度计+陀螺仪+磁力计）Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-mpu9250-dmp |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_MPU9250_DMP_Arduino_Library |
| License | MIT |

## Supported Boards

SparkFun 9DoF Razor IMU M0, Arduino Zero（ATSAMD21 架构）

## Description

MPU-9250 是 InvenSense 的九轴 IMU，集成三轴加速度计、三轴陀螺仪和三轴磁力计，内置 DMP 数字运动处理器。

## Quick Start

1. 通过 I2C 连接 MPU-9250
2. 使用「初始化 MPU-9250」块初始化 IMU
3. 配置传感器和采样率，在循环中检查「有新数据」后更新并读取数据

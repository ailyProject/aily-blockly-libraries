# SparkFun LSM6DSO 六轴 IMU

SparkFun Qwiic LSM6DSO 六轴惯性测量单元（加速度计 + 陀螺仪）的 Blockly 封装库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lsm6dso |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_6DoF_LSM6DSO_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, Mega, ESP32, SAMD21 等支持 I2C 的板子。

## Description

LSM6DSO 是一款集成加速度计和陀螺仪的六轴 IMU，通过 I2C 通信（默认地址 0x6B）。支持读取三轴加速度（g）、三轴角速度（dps）及板载温度（°C）。

## Quick Start

1. 通过 Qwiic 连接 LSM6DSO 模块
2. 使用「初始化 LSM6DSO IMU」块进行初始化
3. 使用加速度/陀螺仪读取块获取数据

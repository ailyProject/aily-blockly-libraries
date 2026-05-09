# SparkFun LIS3DH 加速度计

读取 LIS3DH 三轴加速度计 X/Y/Z 轴数据（g）。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lis3dh |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_LIS3DH_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO、ESP32（I2C 模式）

## Description

LIS3DH 是 ST 的三轴加速度计，支持 I2C/SPI 接口，量程可配置（±2/4/8/16g），支持多种输出数据速率。本库封装了基于 I2C 模式的初始化和读取操作。

## Quick Start

1. 连接 LIS3DH 到 I2C 总线（SDA/SCL）
2. 在 Setup 中调用初始化块
3. 在 Loop 中读取 X/Y/Z 轴加速度值

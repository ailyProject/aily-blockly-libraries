# SparkFun MMA8452Q 加速度计

SparkFun MMA8452Q 三轴 I2C 加速度计 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-mma8452q |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/MMA8452_Accelerometer |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino Mega, ESP32

## Description

MMA8452Q 是 NXP 的 12 位三轴加速度计，通过 I2C 接口通信。支持 ±2g/±4g/±8g 量程，内置方向检测功能。

## Quick Start

1. 通过 I2C 连接 MMA8452Q（默认地址 0x1D）
2. 使用「初始化 MMA8452Q」块初始化传感器
3. 在循环中检查「有新数据」后读取加速度值

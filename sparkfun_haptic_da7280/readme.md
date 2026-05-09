# SparkFun 触觉驱动 DA7280

SparkFun Qwiic Haptic Driver DA7280 的 Blockly 封装库，用于驱动 LRA 或 ERM 振动电机。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-haptic-da7280 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_Haptic_Driver_DA7280_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的板子。

## Description

DA7280 是 Dialog Semiconductor 的触觉驱动 IC，支持 LRA（线性谐振驱动）和 ERM（偏心旋转质量）两种振动电机，通过 I2C（默认地址 0x4A）控制。

## Quick Start

1. 通过 Qwiic 连接 DA7280 模块（连接振动电机）
2. 使用「初始化触觉驱动 DA7280」块选择电机类型
3. 设置运行模式（DRO 模式最简单）

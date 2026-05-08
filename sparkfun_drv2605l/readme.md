# SparkFun DRV2605L 触感电机驱动

SparkFun DRV2605L Breakout 的 Blockly 库，支持 ERM 和 LRA 触感电机的波形播放。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-drv2605l |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Haptic_Motor_Driver_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

DRV2605L 是一款 I2C 接口触感反馈驱动器，支持 ERM（偏心转子）和 LRA（线性谐振）电机。提供 123 种内置波形效果。

## Quick Start

1. 连接电机到 DRV2605L Breakout，再通过 I2C 连接到 Arduino
2. 在 setup 中初始化，设置模式、电机类型和波形库
3. 设置波形序列后调用 `开始播放`

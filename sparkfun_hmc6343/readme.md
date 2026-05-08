# SparkFun HMC6343 电子罗盘

SparkFun HMC6343 Breakout 的 Blockly 库，支持通过 I2C 读取航向、磁场和加速度数据。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hmc6343 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_HMC6343_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

HMC6343 是一款三轴电子罗盘，集成了磁力计和加速度计。支持读取航向（heading）、俯仰（pitch）、横滚（roll）、磁场三轴和加速度三轴数据。

## Quick Start

1. 连接传感器到 I2C 总线
2. 在 setup 中调用 `初始化 HMC6343`
3. 在 loop 中调用 `读取航向` 然后用 `获取` 积木读取数值

# SparkFun GridEYE AMG88 热成像传感器

GridEYE AMG88 8×8 热成像传感器的 Blockly 库，支持读取 64 个像素温度。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-grideye |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_GridEYE_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32（Qwiic）

## Description

Panasonic GridEYE 是一款 8×8 热电堆阵列传感器，可检测 64 个独立温度点。本库支持读取像素温度、设备温度、帧率控制和休眠模式。

## Quick Start

1. 连接传感器到 I2C / Qwiic 接口
2. 在 setup 中调用 `初始化 GridEYE`
3. 像素地址范围为 0-63（8×8 阵列）

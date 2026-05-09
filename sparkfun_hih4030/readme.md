# SparkFun HIH4030 湿度传感器

SparkFun HIH-4030 Breakout 的 Blockly 库，通过模拟引脚读取相对湿度。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hih4030 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_HIH4030_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

HIH4030 是一款模拟输出湿度传感器。本库提供初始化（指定模拟引脚和供电电压）、读取原始湿度、温度补偿湿度和输出电压功能。

## Quick Start

1. 将传感器 OUT 引脚连接到 Arduino 模拟引脚
2. 在全局区域使用 `初始化 HIH4030` 积木（指定引脚和电压）
3. 使用读取积木获取湿度值

# SparkFun Qwiic 摇杆

SparkFun Qwiic Joystick（SEN-15168）的 Blockly 封装库，通过 I2C 读取 X/Y 轴模拟值及按钮状态。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-joystick |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_Joystick_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的板子。

## Description

Qwiic Joystick 是 I2C 控制的模拟摇杆，X/Y 轴返回 0-1023 范围的值（中心约 512），同时提供按钮点击检测。默认 I2C 地址为 0x20。

## Quick Start

1. 通过 Qwiic 连接摇杆模块
2. 使用「初始化 Qwiic 摇杆」块初始化
3. 使用水平/垂直值块读取摇杆位置

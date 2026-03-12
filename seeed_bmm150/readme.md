# BMM150 三轴磁力计

用于读取BMM150三轴磁力数据和罗盘方向角的Blockly库

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-bmm150 |
| Version | 0.0.1 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Grove_3_Axis_Compass_V2.0_BMM150 |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32

## Description

BMM150是一款低功耗、低噪声的三轴地磁传感器，通过I2C接口通信。本库提供BMM150传感器的初始化、三轴磁力数据读取以及罗盘方向角计算功能，适用于电子罗盘、导航等应用。

## Quick Start

1. 通过I2C（SCL/SDA）连接BMM150模块
2. 在setup中放置初始化积木
3. 在loop中读取磁力数据或罗盘方向角

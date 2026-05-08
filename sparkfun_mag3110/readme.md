# SparkFun MAG3110 三轴磁力计

读取 MAG3110 三轴磁场数据和航向角。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-mag3110 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_MAG3110_Breakout_Board_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO、ESP32

## Description

MAG3110 是 NXP 的三轴磁力计，I2C 接口，支持数字罗盘应用。本库封装了初始化、开始测量、数据就绪检测及轴读取功能。

## Quick Start

1. 连接 MAG3110 到 I2C 总线
2. 在 Setup 中初始化并调用「开始测量」
3. 在 Loop 中等待「数据就绪」后读取各轴或航向角

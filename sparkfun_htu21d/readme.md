# SparkFun HTU21D 温湿度传感器

SparkFun HTU21D Breakout 的 Blockly 库，支持通过 I2C 读取温度和湿度。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-htu21d |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_HTU21D_Breakout_Arduino_Library |
| License | Beerware (Public Domain) |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

HTU21D 是一款高精度 I2C 接口温湿度传感器。本库提供初始化、读取湿度/温度和分辨率设置功能。

## Quick Start

1. 连接传感器到 I2C 总线（SDA/SCL）
2. 在 setup 中使用 `初始化 HTU21D` 积木
3. 在 loop 中使用读取积木获取数据

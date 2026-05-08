# SparkFun 5P49V60 可编程时钟发生器

SparkFun Clock Generator 5P49V60 的 Blockly 库，通过 I2C 生成 1-200MHz 时钟信号。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-5p49v60 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Clock_5P49V60_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32（Qwiic）

## Description

5P49V60 是一款可编程时钟发生器，支持 4 路独立时钟输出（1-200MHz 单端，1-350MHz 差分）。本库提供 VCO 频率设置、时钟通道频率/模式配置和相位偏移功能。

## Quick Start

1. 连接到 I2C（Qwiic）
2. 先调用 `初始化`，再设置 VCO 频率（如 1600MHz）
3. 调用 `将 PLL 连接到时钟通道`，然后设置各通道输出频率和模式

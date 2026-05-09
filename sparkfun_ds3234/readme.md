# SparkFun DS3234 实时时钟

SparkFun DeadOn RTC DS3234 的 Blockly 库，通过 SPI 接口设置和读取实时时钟。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ds3234 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_DS3234_RTC_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

DS3234 是一款带 SRAM 的高精度 SPI 接口实时时钟。库使用全局 `rtc` 对象。支持设置时间、自动编译时间、读取时间及内置温度传感器。

## Quick Start

1. 将 DS3234 CS 引脚连接到 Arduino（默认 D10）
2. 在 setup 中调用 `初始化 DS3234 RTC`，指定 CS 引脚
3. 在 loop 中先调用 `更新时间`，再读取时间值

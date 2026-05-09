# SparkFun DS1307 实时时钟

SparkFun DS1307 RTC 模块的 Blockly 库，通过 I2C 设置和读取实时时钟。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-ds1307 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_DS1307_RTC_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, SparkFun RedBoard, ESP32

## Description

DS1307 是一款 I2C 接口的实时时钟芯片。库使用全局 `rtc` 对象（无需手动声明变量）。支持自动设置编译时间、手动设置时间和读取时间日期。

## Quick Start

1. 连接 DS1307 到 I2C 总线
2. 在 setup 中调用 `初始化 DS1307 RTC` 和 `自动设置编译时间`
3. 在 loop 中先调用 `更新时间`，再用 `获取` 积木读取时间

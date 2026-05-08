# SparkFun Qwiic MP3 播放器

SparkFun Qwiic MP3 Trigger（WIG-15165）的 Blockly 封装库，通过 I2C 控制 MP3 播放。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-mp3 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_MP3_Trigger_Arduino_Library |
| License | GPL-3.0 |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的板子。

## Description

Qwiic MP3 Trigger 是 I2C 控制的 MP3 播放器，支持 microSD 卡，可按轨道顺序或文件名编号播放，音量范围 0-31，默认 I2C 地址 0x37。

## Quick Start

1. 将 MP3 文件放入 microSD 卡（命名格式 F001xxx.mp3）
2. 通过 Qwiic 连接模块
3. 使用「初始化 Qwiic MP3 播放器」块初始化

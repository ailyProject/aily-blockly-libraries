# SparkFun ESP32 DMX

用于 SparkFun ESP32 DMX Shield 的 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-dmx |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFunDMX |
| License | MIT |

## Supported Boards

ESP32 开发板，需使用 HardwareSerial 和 SparkFun DMX Shield。

## Description

该库封装 DMX512 发送与接收流程，支持设置方向、写入单通道、读取单通道、检查接收数据和 update 刷新。

## Quick Start

先初始化 UART、EN 引脚和通道数；发送模式下写入通道值后调用更新，接收模式下持续更新并检查新数据。
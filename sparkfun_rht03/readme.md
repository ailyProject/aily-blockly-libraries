# SparkFun RHT03 温湿度传感器

单总线 RHT03 温湿度传感器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-rht03 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_RHT03_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino Mega, ESP32

## Description

RHT03（DHT22）是一款高精度单总线温湿度传感器，测量范围为 -40°C~80°C 和 0~100% RH。通过单数据线与 Arduino 通信，读取间隔至少 1 秒。

## Quick Start

1. 连接传感器数据引脚到 Arduino 数字引脚
2. 使用"初始化 RHT03"积木配置引脚
3. 在循环中使用"更新数据"后读取温度和湿度

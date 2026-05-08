# SparkFun MAX30105 心率/血氧传感器

读取 MAX30105 红光、红外、绿光通道原始数据，用于心率和血氧检测。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-max30105 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_MAX3010x_Sensor_Library |
| License | BSD |

## Supported Boards

Arduino UNO、ESP32（3.3V 供电）

## Description

MAX30105 是 Maxim 的光学心率/血氧传感器，内置红光、红外和绿光三路 LED 及光敏元件，通过 I2C 输出原始计数值。需配合算法库（如 heartRate.h）计算心率/SpO2。

## Quick Start

1. 连接 MAX30105 到 I2C 总线（3.3V！）
2. 在 Setup 中初始化并配置参数
3. 在 Loop 中用「等待数据」确认后读取各通道值

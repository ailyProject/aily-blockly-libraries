# SparkFun VCNL4040 接近与环境光传感器

I2C 接近传感器和环境光传感器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-vcnl4040 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_VCNL4040_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32

## Description

VCNL4040 集成了接近传感器（IR）和环境光传感器（ALS），可定性检测约 20cm 内的物体，并测量环境光强度。

## Quick Start

1. 通过 Qwiic/I2C 连接传感器
2. 使用"初始化 VCNL4040"积木（自动开启接近和光照传感器）
3. 在循环中读取接近值或环境光值

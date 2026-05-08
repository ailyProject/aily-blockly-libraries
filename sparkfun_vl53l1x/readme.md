# SparkFun VL53L1X 激光测距传感器

高精度 I2C ToF 激光测距传感器 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-vl53l1x |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_VL53L1X_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO, ESP32（3.3V）

## Description

VL53L1X 是 STMicroelectronics 的飞行时间（ToF）激光测距传感器，I2C 接口，支持短距（最远 1.3m）和长距（最远 4m）模式。

## Quick Start

1. 通过 Qwiic/I2C 连接
2. 使用"初始化 VL53L1X"积木
3. 调用"开始测距"，循环中检查"数据就绪"后读取距离

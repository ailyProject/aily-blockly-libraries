# SparkFun Qwiic XM125 脉冲相干雷达传感器

SparkFun Qwiic XM125（SEN-24540）的 Blockly 封装库，基于 Acconeer XM125 脉冲相干雷达芯片，通过 I2C 实现存在检测和距离测量，穿透能力强，可穿过薄壁。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-xm125 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |

## Quick Start

1. 通过 Qwiic 连接 XM125 模块（需 3.3V）
2. 初始化时设置检测范围（毫米）
3. 循环中检查「是否检测到存在」，若有则读取距离

## Notes
- 推荐使用 ESP32 等 3.3V 板

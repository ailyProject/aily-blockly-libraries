# SparkFun VEML6075 UV Sensor

Blockly wrapper for the SparkFun VEML6075 UVA/UVB UV index sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-veml6075 |
| Version | 0.0.1 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun VEML6075 UVA/UVB UV index sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-veml6075` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

1.0.2 增加连接状态积木。可拔插场景读取前检查 veml6075_connected（Coder 用 isConnected()），接回器件后重新初始化。UVA、UVB 积木返回补偿后的计数，UV 指数由原生驱动计算。配置写入失败和不完整的 ID 回包会返回失败。

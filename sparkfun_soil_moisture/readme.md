# SparkFun Soil Moisture Sensor

Blockly wrapper for the SparkFun I2C soil moisture sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-soil-moisture |
| Version | 0.0.1 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun I2C soil moisture sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-soil-moisture` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

读取前可用 `soil_moisture_is_connected` 检查地址应答。原生驱动遇到读错误会返回 0，此时百分比可能显示 100%。地址应答与测量是两笔独立的 I²C 事务。

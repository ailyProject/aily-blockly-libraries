# SparkFun BQ27441 LiPo Fuel Gauge

Blockly wrapper for the SparkFun BQ27441 LiPo fuel gauge.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-bq27441 |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun BQ27441 LiPo fuel gauge.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-bq27441` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

初始化成功表示已识别 BQ27441 并写入、回读了设计容量。用整数返回的测量遇到传输错误时返回 0，请紧接着检查“BQ27441 上次操作成功”以区分有效零值。写操作在设备拒绝、配置校验失败或未能正常退出配置时报告失败。温度单位为 0.1 K。

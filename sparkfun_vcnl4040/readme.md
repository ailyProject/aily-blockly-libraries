# SparkFun VCNL4040 Proximity and Ambient Light Sensor

Blockly wrapper for the SparkFun VCNL4040 I2C proximity and ambient light sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-vcnl4040 |
| Version | 0.0.1 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun VCNL4040 I2C proximity and ambient light sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-vcnl4040` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

0.0.2 增加“上次初始化成功”和“上次 I²C 传输成功”。读数为 0 时可用后者区分合法零值与断线、短读；请在下一次总线操作前读取状态。C++ 的 begin() 仍会启动 Wire，已启动的总线可使用 beginOnActiveBus(Wire)。

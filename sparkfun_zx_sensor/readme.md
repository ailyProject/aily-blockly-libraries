# SparkFun ZX Distance and Gesture Sensor

Blockly wrapper for the SparkFun ZX distance and gesture sensor.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-zx-sensor |
| Version | 0.0.2 |
| Author | SparkFun |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for the SparkFun ZX distance and gesture sensor.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-zx-sensor` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

默认 I²C 地址为 `0x10`。设备未应答或读数不完整时，就绪积木返回 false，坐标和手势积木返回 255。原生 `init()` 在传输、版本检查或中断配置失败时返回 false，恢复连接后可再次调用。

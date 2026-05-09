# SparkFun LP55231 9通道 LED 驱动

通过 I2C 独立控制 9 路 LED 的亮度。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-lp55231 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_LP55231_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO、ESP32

## Description

LP55231 是 TI 的 9 通道 LED 驱动 IC，通过 I2C 控制每路 LED 的 PWM 亮度（8 位），支持主 Fader 统一调光，并内置执行引擎。

## Quick Start

1. 连接 LP55231 到 I2C 总线
2. 在 Setup 中调用初始化块（含 Enable）
3. 用「通道亮度」块设置 0~8 通道的亮度（0-255）

# PAJ7620 手势传感器

PAJ7620 I2C 手势识别传感器库，支持 9 种手势检测。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-paj7620 |
| Version | 1.0.0 |
| Author | Seeed Studio |
| Source | https://github.com/Seeed-Studio/Gesture_PAJ7620 |
| License | MIT |

## Supported Boards

所有支持 I2C 的 Arduino 兼容开发板（ESP32、Arduino UNO/Nano/Mega、RP2040 等）

## Description

PAJ7620 是一款基于 I2C 的手势识别传感器，可检测右滑、左滑、上滑、下滑、前推、后拉、顺时针、逆时针和挥手共 9 种手势。库内置传感器初始化寄存器配置，使用简便。

## Quick Start

1. 在 `arduino_setup()` 中使用「初始化PAJ7620手势传感器」块（自动启动 I2C 和串口）
2. 在 `arduino_loop()` 中使用「获取手势」块读取当前手势

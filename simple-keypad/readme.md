# 矩阵键盘 (SimpleKeypad)

矩阵键盘扫描库，支持 4×4、4×3、3×4、3×3、3×1、1×3 等多种布局，内置去抖和双键检测。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-simple-keypad |
| Version | 1.0.0 |
| Author | ihaque |
| Source | https://github.com/ihaque/simple-keypad |
| License | MIT |

## Supported Boards

所有 Arduino 兼容开发板（ESP32、Arduino UNO/Nano/Mega、RP2040 等）

## Description

SimpleKeypad 是一个轻量级矩阵键盘库，支持多键同时检测（最多 2 键）、硬件去抖和周期性扫描。用户只需选择键盘布局、配置行列引脚和按键字符映射即可使用。

## Quick Start

1. 在 `arduino_setup()` 中使用「初始化矩阵键盘」块，选择布局并配置行列引脚
2. 在 `arduino_loop()` 中使用「获取按键」块读取当前按下的键

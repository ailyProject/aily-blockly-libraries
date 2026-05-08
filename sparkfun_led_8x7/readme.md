# SparkFun 8x7 LED 阵列

控制 SparkFun 8x7 Charlieplex LED 阵列，支持图形绘制与滚动文字。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-led-8x7 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_LED_Array_8x7_Arduino_Library |
| License | Beerware |

## Supported Boards

Arduino UNO、Arduino Mega（需 Timer2 支持）

## Description

通过 Charlieplex 技术驱动 8×7 共 56 颗 LED，使用 8 个 I/O 引脚。支持像素、线段、矩形、圆形绘制，以及文字滚动。库使用 Timer2 自动刷新显示。

## Quick Start

1. 将 8 个引脚连接到 LED 阵列
2. 在 Setup 中调用初始化块并传入 8 个引脚号
3. 绘制图形后调用「刷新显示」，或直接调用「滚动文字」

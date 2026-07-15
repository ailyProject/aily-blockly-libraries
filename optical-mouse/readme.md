# 光学鼠标位置追踪库

通过软件 SPI (bit-bang) 读取光学鼠标传感器位移数据，累积计算 X/Y 坐标位置。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-optical-mouse |
| Version | 1.0.0 |
| Author | ailyProject |
| Source | - |
| License | MIT |

## Supported Boards

支持所有 Arduino 兼容开发板（STM32、ESP32、Arduino UNO 等）

## Description

本库通过软件 SPI 读取光学鼠标传感器（如 PAW3204）的位移寄存器，将位移数据转换为毫米单位的绝对坐标。支持自定义 SCLK/DIO/CS 引脚和分辨率系数。

## Quick Start

1. 拖入 `init` 块，设置 SCLK、DIO、CS 引脚和分辨率
2. 在 loop 中拖入 `update` 块读取传感器数据
3. 使用 `get X` / `get Y` 获取累积位置（单位：mm）

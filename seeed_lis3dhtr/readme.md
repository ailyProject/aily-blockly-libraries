# LIS3DHTR 加速度计库

Grove - 3轴数字加速度计(±2g~16g) LIS3DHTR 的 Blockly 驱动库，支持加速度读取、敲击检测、温度传感器和 ADC。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-lis3dhtr |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_LIS3DHTR |
| License | MIT |

## Supported Boards

全平台兼容（Arduino UNO、MEGA、ESP32、ESP8266、Wio Terminal 等）

## Description

LIS3DHTR 是一款超低功耗三轴加速度传感器，支持 ±2g/4g/8g/16g 量程，内置温度传感器和3通道 ADC，支持单击/双击检测中断。

## Quick Start

1. 使用「一体化初始化」块快速配置传感器
2. 在 loop 中使用「读取 X/Y/Z 轴加速度」获取数据
3. 使用「敲击检测」块可实现单击/双击事件响应

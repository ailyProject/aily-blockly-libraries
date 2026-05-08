# SparkFun KWH018ST01 TFT

用于 SparkFun 1.8 寸 KWH018ST01 TFT 彩屏的 Blockly 库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hyperdisplay-kwh018st01 |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/HyperDisplay_KWH018ST01_4WSPI_ArduinoLibrary |
| License | MIT |

## Supported Boards

支持 SPI 的 Arduino/ESP32 开发板。

## Description

该库封装 KWH018ST01 4 线 SPI TFT 显示屏的初始化、清屏、背光、像素、线条、矩形、填充和文本打印。源码已包含 HyperDisplay 与 ILI9163C 依赖。

## Quick Start

连接 CS、DC、BL 与 SPI 引脚，在 setup 中初始化；之后即可绘制图形和文本。
# SparkFun HyperDisplay 图形库

SparkFun HyperDisplay 抽象图形框架库的 Blockly 包装，提供统一的绘图 API，需配合具体显示屏驱动库（如 SSD1309、ILI9163C 等）使用。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-hyperdisplay |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_HyperDisplay |
| License | MIT |

## Supported Boards

Arduino UNO、SparkFun RedBoard、ESP32

## Description

HyperDisplay 是 SparkFun 的通用显示库框架。本库封装了基础绘图 API，包括画点、画线、矩形、圆形及文字打印。由于 `hyperdisplay` 是抽象基类，实际使用时需要一个具体的显示屏驱动对象（如 `HyperDisplay_SSD1309`、`HyperDisplay_ILI9163C` 等）。

> **注意**: 本库积木中的 "显示变量名" 字段需与具体显示屏驱动库创建的对象名一致。

## Quick Start

1. 引入具体显示屏驱动库（如 SparkFun HyperDisplay SSD1309）
2. 在具体显示屏驱动库中初始化显示对象
3. 使用本库提供的绘图积木，将变量名设置为显示对象的名称

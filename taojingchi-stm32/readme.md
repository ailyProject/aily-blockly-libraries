# 淘晶驰串口屏驱动库(STM32专用)

STM32F103C8专用淘晶驰串口屏驱动，支持硬件串口快速选择，无需SoftwareSerial。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-taojingchi-stm32 |
| Version | 1.0.0 |
| Author | ailyProject |
| Source | 基于lib-taojingchi适配 |

## Supported Boards

- STM32F103C8 (Blue Pill)

## Description

基于通用淘晶驰串口屏库适配STM32F103C8，利用硬件串口直接通信。支持Serial1(USART2: PA2/PA3)和Serial2(USART3: PB10/PB11)快速选择，无需软串口，通信更稳定。

## Quick Start

1. 在setup中调用"初始化淘晶驰串口屏"，选择串口和波特率
2. 使用其他块控制背光、页面、变量等

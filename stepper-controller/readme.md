# Stepper Controller

步进电机控制器库，支持步数控制、速度调节、方向切换及前后限位开关检测。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-stepper-controller |
| Version | 1.0.0 |
| Author | ailyProject |

## Supported Boards

所有 Arduino 兼容开发板（STM32、ESP32、AVR 等）

## Description

封装步进电机脉冲/方向驱动，集成前后限位开关检测。支持设置目标步数自动停止、微秒级调速、RPM 调速，以及限位触发和目标完成事件回调。

## Quick Start

1. 初始化：设置 STEP/DIR 引脚及两个限位引脚
2. 启动：设置目标步数和方向后调用 start
3. 循环：在 loop 中调用 tick() 驱动电机并自动检测限位

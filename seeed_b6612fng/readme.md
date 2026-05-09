# Grove Motor Driver TB6612FNG

基于 SeeedStudio Grove TB6612FNG 电机驱动模块的 Blockly 库，支持驱动两路直流电机或一个步进电机。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed_tb6612fng |
| Version | 0.0.1 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Grove_Motor_Driver_TB6612FNG |
| License | MIT |

## Supported Boards

Arduino UNO, MEGA, UNO R4, ESP32, ESP32-S3, ESP32-C3

## Description

Grove TB6612FNG 是一款 I2C 电机驱动模块，可同时驱动两路直流电机（速度 -255~255）或一个两相步进电机（支持全步进、半步进、波浪驱动、微步进四种模式）。默认 I2C 地址为 0x14。

## Quick Start

1. 将 Grove TB6612FNG 通过 I2C 连接到开发板
2. 在 setup 中使用初始化积木初始化电机驱动
3. 使用直流电机或步进电机积木控制电机

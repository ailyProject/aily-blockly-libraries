# SparkFun Qwiic 蜂鸣器

SparkFun Qwiic Buzzer（BOB-24474）的 Blockly 封装库，支持 I2C 控制频率、时长和音量。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-qwiic-buzzer |
| Version | 0.0.1 |
| Author | SparkFun Electronics |
| Source | https://github.com/sparkfun/SparkFun_Qwiic_Buzzer_Arduino_Library |
| License | MIT |

## Supported Boards

Arduino UNO、Mega、ESP32 等支持 I2C 的板子。

## Description

Qwiic Buzzer 通过 I2C（默认地址 0x34）控制蜂鸣器的频率（Hz）、持续时间（ms）和音量（0-4），并内置多种预设音效。

## Quick Start

1. 通过 Qwiic 连接蜂鸣器模块
2. 使用「初始化 Qwiic 蜂鸣器」块初始化
3. 使用「配置」块设置频率/时长，然后调用「开启」块发声

# Seeed 24GHz mmWave Radar

Seeed 24GHz毫米波雷达传感器Blockly库，支持人体存在检测、运动/静止目标识别和距离测量。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-mmwave |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/limengdu/mmwave_for_XIAO |
| License | MIT |

## Supported Boards

Arduino UNO, Arduino SAMD, ESP32, ESP8266, RP2040

## Description

基于Seeed HSP24模块的24GHz毫米波雷达库，支持通过SoftwareSerial或硬件串口（Serial1/Serial2）与传感器通信。支持人体存在检测（无目标/运动/静止/运动+静止），目标距离测量，距离门灵敏度配置，分辨率调整及工程模式。

## Quick Start

1. 将mmWave传感器连接到开发板（注意天线朝外）
2. 使用HLKRadarTool APP将传感器波特率调整为9600
3. 在Blockly中添加初始化块，选择串口类型（SoftwareSerial需指定RX/TX引脚，Serial1/Serial2直接使用硬件串口）

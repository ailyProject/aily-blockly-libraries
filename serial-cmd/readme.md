# SerialCmd 串口指令解析

非阻塞串口指令解析库，支持前缀识别和参数提取。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-serial-cmd |
| Version | 1.0.0 |
| Author | ailyProject |

## Supported Boards

所有 Arduino 兼容板（UNO, Nano, ESP32, STM32等）

## Description

提供非阻塞的串口指令解析功能，用户可在事件块中编写指令处理逻辑，支持前缀识别、整数参数解析和串口回复。

## Quick Start

1. 在 `arduino_setup()` 中添加 `初始化串口指令解析` 块
2. 使用 `当收到完整串口指令时` 事件块编写处理逻辑
3. 使用 `获取指令类型`、`从指令中解析整数参数` 获取数据

# SEN0754 超声波液位传感器库

为 DFRobot SEN0754 超声波液位监测传感器（3m 量程，IP67）提供 Blockly 积木，读取实时/算法处理后的液位与温度。

## Library Info

| Field   | Value |
| ------- | ----- |
| Package | @aily-project/lib-sen0754 |
| Version | 0.1.0 |
| Author  | Aily（协议与指令依据 DFRobot 官方 wiki 示例） |
| Source  | https://wiki.dfrobot.com.cn/SKU_SEN0754 |
| License | MIT |

## Supported Boards

ESP32 系列主板（含 UniHiker K10 / ESP32-S3），使用硬件串口 UART1 / UART2，波特率固定 115200。

## Description

通过 UART Modbus RTU 协议读取 SEN0754 的空高与温度，并自动换算液位高度（安装高度 − 空高）。支持实时值（响应约 100ms）与处理值（算法滤波，响应 ≥2s）两种读取模式。传感器量程 30~300cm 可设，盲区低至 1.5cm，IP67 防水。

## Quick Start

1. 接线：红线=5V，黑线=GND，绿线（传感器TX）→ 主控 RX（默认 16），蓝线（传感器RX）→ 主控 TX（默认 17）。
2. 放置「初始化超声波液位传感器」积木，按需修改引脚。
3. 用「设置安装高度」积木写入传感器距箱底的毫米数。
4. 在循环中「读取实时值」（或「读取处理值」），再用「液位高度（毫米）」积木取值。

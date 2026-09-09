# WS2812 灯带驱动库（引脚直控 / RMT）

驱动 WS2812/WS2812B 可寻址 RGB 灯带，时序由 ESP32 RMT 外设硬件生成（Arduino-ESP32 官方 rmtInit/rmtWrite 路径），不依赖 FastLED。所有积木直接选择数据引脚，无需创建对象变量。

## Library Info

| Field   | Value                    |
| ------- | ------------------------ |
| Package | @aily-project/lib-ws2812 |
| Version | 2.0.0                    |
| Author  | ailyProject              |
| Source  | 自研封装，参考 Arduino-ESP32 官方 RMTWriteNeoPixel 示例 |
| License | UNLICENSED               |

## Supported Boards

ESP32 系列（arduino-esp32 3.x，含 ESP32-C3）。已在 ESP32-C3 + arduino-esp32 3.3.10 工具链上验证编译。

## Description

提供按数据引脚直接控制的七个积木：初始化、填充全部灯珠、设置单个灯珠、亮度、清空缓冲区、刷新显示、就绪查询。每个积木自带数据引脚下拉框，内部按引脚路由（最多同时 4 条灯带）。颜色先写入缓冲区，调用“刷新显示”后一次性通过 RMT 硬件时序发送，不关闭中断，不受 WiFi 调度抖动影响。

## Quick Start

1. 灯带 5V 供电、GND 与开发板共地，DATA 接所选 GPIO（ESP32-C3 为 3.3V 逻辑，5V 供电灯带建议电平转换或降首灯供电）。
2. 在 setup 中放置“初始化WS2812灯带”积木，选择数据引脚与灯珠数量。
3. 用“填充/设置/亮度/清空”修改缓冲区，再调用“刷新显示”点亮。

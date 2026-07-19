# Sentry 智能视觉传感器

用于 Sentry1、Sentry2、Sentry3 的独立 AilyBlockly 积木库。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tosee-sentry |
| Version | 2.0.0 |
| Author | Tosee Intelligence |
| Source | https://gitee.com/AITosee/Sentry-Arduino |
| License | Apache-2.0 |

## Supported Boards

ESP32、Arduino AVR/MegaAVR、UNO R4 WiFi。

## Description

三个型号使用独立积木和变量类型，算法不会跨型号混用。Sentry1 提供基础视觉，Sentry2 增加学习、物体和屏幕功能，Sentry3 增加条形码、文字、手势、车牌及大模型功能。

## Quick Start

1. 进入对应型号的设置模块，选择两线通信或硬件串口初始化。
2. 启动该型号支持的识别功能。
3. 在运行模块读取目标数量、数值或文本结果。

# Seeed SSCMA AI

Seeed SSCMA AI vision sensor communication library reads the inference results of AI vision modules such as Grove Vision AI V2 and XIAO ESP32S3 Sense through the I2C/UART/SPI protocol. Supports multiple pre-training m...

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-sscma |
| Version | 1.0.1 |
| Author | SeeedStudio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_SSCMA |
| License | MIT |

## Supported Boards

ESP32, Arduino SAMD, Arduino UNO R4, RP2040

## Description

Seeed SSCMA AI vision sensor communication library reads the inference results of AI vision modules such as Grove Vision AI V2 and XIAO ESP32S3 Sense through the I2C/UART/SPI protocol. Supports multiple pre-training m...

## Quick Start

1. Enable `@aily-project/lib-seeed-sscma` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### 1.0.2 通信兼容性

XIAO ESP32-S3 可通过 Grove Vision AI V2 的 3.3 V M1 排针使用 I²C（默认地址 0x62）或 UART（921600、8N1）。先设置控制器的引脚，再执行初始化积木。驱动按 Wire 的标准缓冲区分包。推理的过滤和图像开关独立生效，重置积木支持硬件复位脚或 AT 软件复位。

[Seeed SSCMA AT 协议](https://github.com/Seeed-Studio/SSCMA-Micro/blob/e830d545200ef28406bb765483909928ec2e1baa/docs/protocol/at-protocol-en_US.md)

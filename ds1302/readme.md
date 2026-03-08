# DS1302 RTC时钟库

DS1302实时时钟模块库，用于读写DS1302芯片的时间和RAM数据

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-ds1302 |
| 版本 | 1.0.0 |
| 作者 | Matt Sparks (原始库), Aily (Blockly封装) |
| 来源 | https://github.com/msparks/arduino-ds1302 |
| 许可证 | BSD-2-Clause |

## 支持的开发板

Arduino UNO/Nano/Mega、ESP32、ESP8266、Arduino UNO R4、RP2040等主流开发板

## 功能描述

DS1302是一款低功耗实时时钟芯片，可提供年、月、日、时、分、秒和星期信息。本库支持：
- 时间的读取和设置
- 写保护和时钟停止控制
- 31字节RAM读写操作

## 快速开始

**引脚连接**：
- CE → 数字引脚（如D5）
- IO → 数字引脚（如D6）
- SCLK → 数字引脚（如D7）
- VCC → 5V或3.3V
- GND → GND

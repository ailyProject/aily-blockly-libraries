# 语音识别模块

Emakefun语音识别模块Arduino库，支持多种识别模式。

## 库信息

| 字段 | 值 |
|------|-----|
| 包名 | @aily-project/lib-emakefun_speech_recognizer |
| 版本 | 1.0.0 |
| 作者 | Emakefun |
| 来源 | https://github.com/emakefun-arduino-library/emakefun_speech_recognizer |
| 许可证 | MIT |

## 支持的开发板

Arduino系列、ESP32系列、ESP32S3系列等

## 描述

该库用于控制Emakefun语音识别模块（V2.1），通过I2C接口通信。支持自动识别、按键触发、关键词触发、按键或关键词触发四种识别模式。最多可添加50个关键词，每个关键词最大50字节。

## 快速开始

1. 将语音识别模块连接到I2C接口（SDA、SCL、VCC、GND）
2. 默认I2C地址为0x30
3. 在setup中初始化模块并添加关键词，在loop中循环调用识别函数
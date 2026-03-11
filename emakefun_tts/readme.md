# Emakefun TTS 语音合成模块

易创空间语音合成模块(V2.0)的Blockly积木库，支持通过I2C接口进行文本转语音播放。

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-emakefun_tts |
| Version | 2.0.0 |
| Author | Emakefun |
| Source | https://github.com/emakefun-arduino-library/emakefun_tts |
| License | MIT |

## Supported Boards

- Arduino 系列 (AVR, MegaAVR)
- ESP32 系列

## Description

该库封装了易创空间语音合成模块的核心功能，支持文本直接播放、缓存文本播放和播放流程控制（暂停/恢复/停止），通过I2C接口通信，默认地址0x40。

## Quick Start

1. 将语音合成模块通过I2C连接到开发板
2. 在setup中使用"初始化语音合成模块"积木
3. 使用"播放文本"积木进行语音播报

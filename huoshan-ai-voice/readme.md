# Huoshan AI Voice

Voice conversation blocks for ESP32 using WiFi, I2S microphone/speaker, Doubao ASR/TTS, and Coze chat.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-huoshan-ai-voice |
| Version | 0.1.0 |
| Author | ailyProject |
| Source | /home/eric/code/esp32-lvgl-learning/xiaozhi-ai-arduino |
| License | Project source license |

## Supported Boards

ESP32 and ESP32-S3 WiFi boards with I2S microphone and I2S speaker.

## Description

This library removes screen/LVGL code and keeps the core voice loop: WiFi, recording, ASR, Coze multi-turn chat, TTS, and playback. Audio uses a lossless FreeRTOS recording buffer, streaming ASR, sentence-level Coze/TTS overlap, WebSocket PCM playback, and bounded reconnect fallback. I2S pins are configured by blocks.

## Quick Start

Configure credentials, WiFi, microphone pins, speaker pins, then run `start listening` on press and `stop listening and chat` on release.

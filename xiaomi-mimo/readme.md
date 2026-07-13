# Xiaomi MiMo AI

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-xiaomi-mimo |
| Version | 1.2.0 |
| Author | vonweller |
| Source | https://mimo.mi.com/docs/zh-CN/ |
| License | Original license |

## Supported Boards

WiFi-enabled ESP32 boards, UNIHIKER K10

## Description

Blocks for MiMo V2.5 text and multimodal understanding, ASR, TTS, voice design, voice cloning, and I2S/ES8311 voice workflows.

## Quick Start

1. Connect the board to WiFi.
2. In setup, call `mimo_config` exactly once with the API key and base URL; it is required by every cloud block.
3. Initialize the required audio device, then use chat, understanding, ASR, or TTS blocks.
4. On K10, call `mimo_k10_audio_init` and select the same `i2s_k10` object for microphone and speaker fields.

# Tongyi Qianwen

Alibaba Cloud Tongyi Qwen large language model API library supports text dialogue, multi-round dialogue, image understanding, image generation, TTS speech synthesis, omni-modal dialogue (text+audio) and other function...

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-qwen-omni |
| Version | 0.0.10 |
| Author | vonweller |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32, UNIHIKER K10

## Description

Alibaba Cloud Tongyi Qwen large language model API library supports text dialogue, multi-round dialogue, image understanding, image generation, TTS speech synthesis, omni-modal dialogue (text+audio) and other function...

## Quick Start

1. Enable `@aily-project/lib-qwen-omni` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
3. On UNIHIKER K10, use the K10 built-in microphone + speaker init block and select the same `i2s_k10` object for both microphone and speaker in Qwen voice chat blocks.
4. For ES8311 + NS4150B boards, use the combined microphone + speaker init block, keep ES8311 on 3V3 and the amplifier on 5V, then run the prompt tone block before Qwen playback.

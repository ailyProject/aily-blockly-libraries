# rlcd42-audio

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-rlcd42-audio |
| Version | 0.0.1 |
| Author | Bryan |
| Source | On-board ES7210 driver, Waveshare ESP32-S3-RLCD-4.2 |
| License | UNLICENSED |

## Supported Boards

- Waveshare ESP32-S3-RLCD-4.2 (on-board ES7210 dual microphone array).

## Description

Initialises the on-board ES7210 microphone array in slave-mode I2S with MIC1+MIC3 and a selectable PGA gain from 0 to 30 dB, and switches the microphone between muted and unmuted at runtime. Intended for use together with the Xiaozhi ES8311 audio blocks, which provide the I2S master clocks.

## Quick Start

1. Enable `@aily-project/lib-rlcd42-audio` in aily Blockly.
2. In `arduino_setup()`, add `rlcd42_audio_init` with the wanted gain.
3. Use `rlcd42_audio_mute` to mute or unmute during operation.

Chinese description: [readme_zh.md](readme_zh.md).

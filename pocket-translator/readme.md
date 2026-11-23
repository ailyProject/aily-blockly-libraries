# Pocket Translator

ESP32-S3 pocket translator: record with an INMP441 I2S microphone, recognize and translate Chinese to English with SiliconFlow, then read the English aloud through a MAX98357A amplifier.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-pocket-translator |
| Version | 0.1.0 |
| Author | ailyProject |
| Source | N/A |
| License | MIT |

## Supported Boards

ESP32-S3 (ESP32 family with I2S and WiFi)

## Description

Press-and-hold I2S recording, SiliconFlow speech-to-text, Chinese-to-English translation, SiliconFlow TTS read-aloud with buffered playback, software volume control, and 16x16 GB2312 Chinese font rendering on ST7789.

## Quick Start

1. Enable `@aily-project/lib-pocket-translator` in Aily Blockly.
2. In `arduino_setup()`, init the TFT, call `pt_init` with the button, microphone and amplifier pins, then connect WiFi.
3. In `arduino_loop()`, use `pt_button_edge` to start `pt_record_hold`, then `pt_speech_to_text`, `pt_translate` and `pt_speak`.

# OpenCodexMicro Controller

Unofficial Codex Micro BLE HID controller for ESP32-S3 touch boards and Xueersi XiaoMiao keypads.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-open-codex-micro |
| Version | 1.0.0 |
| Author | OpenCodexMicro contributors |
| Source | https://github.com/OpenCodexMicro/OpenCodexMicro |
| License | MIT |

## Supported Boards

ESP32 / ESP32-S3 (S3-N16R8 with PSRAM recommended for touch UI; classic ESP32 for XiaoMiao)

## Description

Runs a Codex Micro compatible BLE HID session with Tasks/Commands/Navigate UI. S3 uses ST7789 + FT6336 touch; XiaoMiao uses ST7735 and six physical keys with chord gestures and buzzer cues.

## Quick Start

1. Enable `@aily-project/lib-open-codex-micro` and its TFT/JSON/FT6336 deps.
2. In `arduino_setup`, add `opencodex_begin` and pick your board profile.
3. Pair Bluetooth device `Codex Micro`, then open a Codex Micro capable desktop client.

# K10 Speech Recognition & Synthesis

UNIHIKER K10 speech recognition and synthesis library, supports command detection and TTS. Installation enables the K10 Chinese speech model by default; the speak block provides a user-set repeat interval.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-unihiker-k10-speech |
| Version | 0.3.2 |
| Author | DFRobot |
| Source | N/A |
| License | Original license |

## Supported Boards

UNIHIKER:esp32:k10

## Description

ASR initialization exposes continuous/one-shot mode, Chinese/English recognition, and the wake window. Chinese recognition uses the `Hi_eps` board model; English recognition uses `Ni_hao_xiao_zhi`. Official K10 TTS is Chinese-only. The speak block accepts text or numbers and contains an editable 1-second interval field, so no separate number block is required.

## Quick Start

1. Enable `@aily-project/lib-unihiker-k10-speech` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

# IBox S31 Audio

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_audio |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 ES8389 audio: play MP3/WAV from SD card or USB drive, record, tones and microphone level.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0) and copy MP3 or WAV files to a FAT32 SD card.
2. Put `iboxs31_audio_init` in `arduino_setup()`, then use `iboxs31_audio_play` with a path such as `/music/song.mp3`; the SD card is mounted automatically.

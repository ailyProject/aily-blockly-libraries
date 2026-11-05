# ES8389 Audio

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-es8389 |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

ESP32 boards (Arduino-ESP32) with an ES8389. Pins and address come from the board’s `audioConfig` (IBox S31); a board with another codec fails to compile.

## Description

ES8389 audio: play MP3/WAV from SD card or USB drive, record, tones and microphone; pins from the board.

## Quick Start

1. Select a board with an ES8389 (IBox S31) and copy MP3 or WAV files to a FAT32 SD card.
2. In `arduino_setup()` power the card if the board needs it (IBox S31: IO39 low), add `es8389_init`, then `es8389_play` a path such as `/music/song.mp3`.

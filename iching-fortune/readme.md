# Iching Fortune

I Ching 64-hexagram data and Xiao Liu Ren divination library for Aily Blockly, ported from the ESP-Handheld project.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iching-fortune |
| Version | 1.0.0 |
| Author | Bryan |
| Source | https://github.com/zistar001/ESP-Handheld |
| License | UNLICENSED |

## Supported Boards

ESP32

## Description

Provides lookup blocks for the 64 I Ching hexagrams (name, judgment, image, six-category advice), Xiao Liu Ren position and six-god texts, plus Gregorian-to-lunar month/day conversion and hour indexing for time-based casting. Pure data/computation, no pins required.

## Quick Start

1. Enable `@aily-project/lib-iching-fortune` in Aily Blockly.
2. In `arduino_setup()` or `arduino_loop()`, call the lookup blocks (e.g. `iching_name`, `liuren_judgment`) with values from your own flow.
3. Pair with NTP time blocks to fill lunar month/day and hour automatically.

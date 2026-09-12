# grokEyes

Animated robot eyes for TFT_eSPI displays.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-grok-eyes |
| Version | 2.2.0 |
| Author | grokEyes contributors |
| Source | [grokEyes](https://github.com/coloz/grokEyes) |
| License | MIT AND BSD-3-Clause; see LICENSE |

## Supported Boards

ESP32 and RP2040 with TFT_eSPI and sufficient sprite memory.

## Description

35 blocks expose 25 expressions, 21 Xiaozhi aliases, 18 shapes and 39 states, plus blinking, gaze, turns, layout and themes. Depends on lib-tft-espi 2.5.54.

## Quick Start

1. Initialize a TFT_eSPI screen with your controller, dimensions and pins.
2. Initialize grokEyes using that screen; enable automatic update.
3. Check initialization success, then select an expression or state.
4. Use the animation wait block between actions to keep eyes moving.

See [examples](examples) and [block reference](readme_ai.md). Hardware verification is pending.

# K10 Screen Display

UNIHIKER K10 screen display library with drawing, text, image, animation, and QR code blocks.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-unihiker-k10-display |
| Version | 0.4.1 |
| Author | Vonweller |
| Source | N/A |
| License | Original license |

## Supported Boards

UNIHIKER:esp32:k10

## Description

UNIHIKER K10 screen display library. Animation blocks convert GIF or MP4 media to RGB565 canvas frames and support blocking, non-blocking, and frame-controlled playback. Each rendered animation frame refreshes the K10 canvas automatically.

## Quick Start

1. Enable `@aily-project/lib-unihiker-k10-display` in Aily Blockly.
2. Initialize the screen in `arduino_setup()`.
3. Connect a `k10_animation` block directly to `k10_play_animation`, then place non-blocking playback in `arduino_loop()` or use blocking playback where a complete one-shot animation is required.

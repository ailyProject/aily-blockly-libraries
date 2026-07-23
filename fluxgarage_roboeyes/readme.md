# FluxGarage RoboEyes

Smoothly animated robot eyes for Adafruit GFX compatible OLED displays.

## Library Info

| Field | Value |
|-------|-------|
| Package | `@aily-project/lib-fluxgarage-roboeyes` |
| Version | 1.1.2 |
| Author | Dennis Hoelscher / FluxGarage |
| Source | [FluxGarage/RoboEyes](https://github.com/FluxGarage/RoboEyes) |
| License | GPL-3.0-or-later |

## Supported Boards

All Arduino architectures supported by the selected Adafruit GFX display driver.

## Description

Configure eye geometry, moods, gaze, visual effects, blinking, idle movement, flicker, and one-shot animations. The init block infers the display type and automatically adds `update()` to the main loop.

## Quick Start

1. Create and initialize an Adafruit GFX compatible display object.
2. Add the RoboEyes init block after the display init block and enter that object's name (`display`, or `tft` for this repository's Adafruit GFX blocks).
3. Add mood or animation blocks. Avoid long blocking delays for smooth animation.

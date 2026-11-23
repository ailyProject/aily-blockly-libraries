# FastLED RGB Light Strip

Blockly blocks for addressable RGB/GRB strips using FastLED.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-fastled` |
| Version | 1.0.5 |
| Author | 奈何col |
| Source | [coloz/FastLED](https://github.com/coloz/FastLED) |
| License | Not specified in package metadata |

## Supported Boards

No core restriction; 3.3 V and 5 V. Follow the strip's electrical requirements.

## Description

Pixels, ranges, bars, brightness, RGB/HSV colours and six animation effects. Supports WS2812B, WS2812, WS2811, NEOPIXEL, WS2801, LPD8806 and APA102.

## Quick Start

1. Wire power, ground and data; use that pin in every block. Toolbox blocks default to the board's onboard LEDs (IBox S31: IO38, 4 LEDs).
2. Initialize the pin, chipset and LED count once in setup.
3. End grouped static changes with `fastled_refresh`. Call animated effects repeatedly in the loop; a loop delay controls frame timing.

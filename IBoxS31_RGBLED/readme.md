# IBox S31 RGB LED

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-iboxs31_rgbled |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | Apache-2.0 |

## Supported Boards

IBox S31 (Aily board IBOX S31, ESP32-S31) only; pins and I2C addresses follow its wiring.

## Description

IBox S31 onboard four WS2812 LEDs (IO38): colours, brightness, bar, rainbow and animations.

## Quick Start

1. Select the IBOX S31 board (Arduino-ESP32 4.0.0).
2. Put `iboxs31_led_init` in `arduino_setup()` (IO38, 4 LEDs by default), then set colours or run `iboxs31_led_effect` in `arduino_loop()`.

# MAX7219 LED Matrix

Blockly driver for MAX7219 8x8 LED matrix modules with cascaded screens, pixels, rotation, brightness, patterns and scrolling text.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-max7219 |
| Version | 0.1.0 |
| Author | wayoda |
| Source | https://github.com/coloz/LedControl |
| License | MIT |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

This package bundles LedControl 1.0.6 and uses its MAX7219 row, brightness and shutdown primitives. Blockly adds cascaded matrix coordinates, rotation, patterns and scrolling text.

## Quick Start

1. Enable `@aily-project/lib-max7219` in Aily Blockly.
2. Add `max7219_matrix_init` in `arduino_setup()`, then use pixel, pattern, brightness or scrolling text blocks in `arduino_loop()`.

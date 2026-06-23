# TVout

Generate PAL or NTSC composite video output from AVR Arduino boards.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-tvout |
| Version | 1.0.0 |
| Author | Myles Metzer, Avamander |
| Source | https://github.com/Avamander/arduino-tvout |
| License | MIT / LGPL-2.1-or-later |

## Supported Boards

Arduino AVR boards such as UNO, Nano, and compatible ATmega boards.

## Description

TVout uses timer interrupts and an SRAM frame buffer to generate monochrome PAL or NTSC composite video. The Blockly wrapper covers startup, font selection, pixels, lines, rectangles, circles, text, timing, and tone output.

## Quick Start

Initialize TVout in `arduino_setup()` with PAL or NTSC, width, height, and a font. Use drawing or text blocks in `arduino_loop()` after initialization. Width should be divisible by 8; common examples use `120 x 96`.

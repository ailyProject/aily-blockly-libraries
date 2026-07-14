# Wio Terminal Infrared Emitter

Controls the Wio Terminal built-in infrared emitter with IRLib2 protocol and raw timing transmission.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-wio-ir |
| Version | 1.0.0 |
| Author | Seeed Studio / Chris Young |
| Source | https://wiki.seeedstudio.com/Wio-Terminal-Infrared-Emitter/ |
| License | GPL-3.0-or-later |

## Supported Boards

Seeeduino:samd:seeed_wio_terminal

## Description

Controls the Wio Terminal built-in infrared emitter with IRLib2 protocol and raw timing transmission.

## Quick Start

1. Enable `@aily-project/lib-seeed-wio-ir` in Aily Blockly.
2. Select the Wio Terminal board and place a send block in an event or `arduino_loop()`.
3. No initialization block or output pin is required: the generator creates the sender and Seeed_Arduino_IR routes it to the built-in `WIO_IR` emitter.

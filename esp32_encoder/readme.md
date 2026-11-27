# ESP32 Rotary Encoder Library

Reads quadrature signals on CLK and DT using the ESP32 pulse counter. SW is an active-low push button.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-esp32-encoder |
| Version | 0.0.2 |
| Author | OpenJumper |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32

## Description

Reads quadrature signals on CLK and DT using the ESP32 pulse counter. SW is an active-low push button.

## Quick Start

1. Enable `@aily-project/lib-esp32-encoder` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Encoder wiring and switch

Connect CLK and DT to GPIO inputs and SW to an input with the internal pull-up. Connect the switch to ground. The PRESSED event fires once per stable press after 50 ms. BUTTON_HELD returns 1 until a stable release and 0 afterwards.

# Wio Terminal Accelerometer

Blockly support for the Wio Terminal built-in LIS3DHTR 3-axis accelerometer, including acceleration reads and single/double-tap detection.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-wio-accel |
| Version | 1.0.0 |
| Author | Seeed Studio |
| Source | https://github.com/Seeed-Studio/Seeed_Arduino_LIS3DHTR |
| License | MIT |

## Supported Boards

Wio Terminal (`Seeeduino:samd:seeed_wio_terminal`)

## Description

The blocks use the built-in `Wire1` bus and `GYROSCOPE_INT1` interrupt pin. Defaults match Seeed's example: 25 Hz and ±2 g. Tap interrupts are safely dispatched to the main loop.

## Quick Start

1. Initialize the accelerometer in `arduino_setup()` with 25 Hz and ±2 g.
2. Read X/Y/Z in `arduino_loop()` and add a delay of at least 50 ms.
3. For taps, add the single/double-tap event and start with threshold 40 at ±2 g.

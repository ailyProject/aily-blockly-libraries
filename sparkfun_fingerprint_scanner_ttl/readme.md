# SparkFun TTL Fingerprint Scanner

Blockly wrapper for GT-511C3/GT-521F TTL fingerprint scanners.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-fingerprint-scanner-ttl |
| Version | 0.0.2 |
| Author | Josh Hawley |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Blockly wrapper for GT-511C3/GT-521F TTL fingerprint scanners.

## Quick Start

1. Enable `@aily-project/lib-sparkfun-fingerprint-scanner-ttl` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Use the hardware UART initialization block to keep the console separate. Select an available UART, wire the controller TX to the scanner RX and wire the controller RX to the scanner TX. The default speed is 9600 baud. ESP32 and STM32 allow explicit pin selection. Boards with fixed UART pins use the selected port's pins.

Coder sketches can pass an initialized Stream to FPS_GT511C3. The caller owns and configures this port. A missing or incomplete reply times out after 4000 ms by default. setResponseTimeout(ms) changes this per instance. GetEnrollCount returns -1 on failure. GT-521F32 uses 200 as the identification failure sentinel. The bundled driver retains Josh Hawley's original non-commercial license notice.

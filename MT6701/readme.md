# MT6701 magnetic rotary encoder

MT6701 magnetic rotary encoder library, supports angle reading, RPM calculation and revolution accumulation, for ESP32 and OJ Nano

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-mt6701 |
| Version | 1.1.1 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

ESP32 and OJ Nano (STM32F103C8)

## Description

MT6701 magnetic rotary encoder library, supports angle reading, RPM calculation and revolution accumulation, for ESP32 and OJ Nano

## Quick Start

1. Enable `@aily-project/lib-mt6701` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The factory 7-bit I²C address is 0x06. Use 0x46 only for a chip already programmed to that address. The three older dropdown values remain loadable and return failure at initialization.

On ESP32 the driver samples in a task. On OJ Nano call `encoder.poll()` on every loop iteration. Both initialization blocks generate this automatically. Reads also poll when due. Set the interval and loop frequency high enough to observe less than half a revolution between samples. Use `encoder.updateCount()` for an immediate sample.

`begin()` reports whether a valid sample was read. A missing device can recover on a later sample. Check `isValid()` before using signed turn counts. A failed read returns −1 for the unsigned shaft count, NaN for floating-point quantities and INT_MIN for signed integer quantities. The first angle after startup or reconnection establishes a reference. Reconnection preserves the accumulated travel measured before disconnection. Call `end()` to release an instance and its sampler from the sketch that owns it.

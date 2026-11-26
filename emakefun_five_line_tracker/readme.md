# Five-way line tracking sensor

Emakefun five-channel line-following sensor module v3 supports analog and digital value reading

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-emakefun-five-line-tracker |
| Version | 1.0.1 |
| Author | Emakefun |
| Source | https://github.com/emakefun-arduino-library/emakefun_five_line_tracker_v3 |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32

## Description

Emakefun five-channel line-following sensor module v3 supports analog and digital value reading

## Quick Start

1. Enable `@aily-project/lib-emakefun-five-line-tracker` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

## Reading errors

Use channels 0 through 4. After a read or write, call `LastError()` to check its I²C status. A successful zero reading reports `kOK`. A failed scalar read returns zero and sets an error. A failed bulk read leaves all five caller values unchanged. Invalid channels return `kInvalidParameter` before addressing the bus.

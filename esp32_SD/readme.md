# ESP32 SD card library

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-esp32-sd |
| Version | 1.0.2 |
| Protocol | SPI |

## Supported Boards

ESP32-family boards supported by Arduino-ESP32 Core 3.x.

## Description

Mount and unmount SPI SD cards, inspect card and sector information, manage files and directories, and read files as text, chunks, or individual bytes. The API and generated code are aligned with Arduino-ESP32 Core 3.3.10.

## Quick Start

1. Add an SD initialization block and configure the SPI bus, CS pin, and frequency in MHz (default: 4 MHz).
2. Use quick blocks for small text files. For large or binary files, open a `File`, loop while data is available, and read bounded chunks or bytes.
3. Close open files and call the unmount block before removing the card.

Paths should begin with `/`. Advanced auto-formatting may erase a card without a mountable filesystem and is disabled by default.

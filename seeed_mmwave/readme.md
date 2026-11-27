# 24GHz millimeter wave radar

Seeed 24GHz millimeter wave radar sensor library supports human presence detection, moving/stationary target recognition and distance measurement

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-seeed-mmwave |
| Version | 1.0.0 |
| Author | SeeedStudio |
| Source | https://github.com/limengdu/mmwave_for_XIAO |
| License | Original license |

## Supported Boards

Arduino AVR, Arduino SAMD, ESP32, RP2040

## Description

Seeed 24GHz millimeter wave radar sensor library supports human presence detection, moving/stationary target recognition and distance measurement

## Quick Start

1. Enable `@aily-project/lib-seeed-mmwave` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### UART and units (1.0.1)

New initialization blocks select Auto (UART). On OJ Nano use MCU TX PA9 and RX PA10; on XIAO ESP32-S3 use TX D6 and RX D7. Cross TX/RX to the module. UART1 (RX/TX) allows explicit routing on STM32 and ESP32. Saved SoftwareSerial, Serial1 and Serial2 selections retain their meaning. SoftwareSerial requires the board's corresponding library.

The Aily block starts the port at 9600 8N1. A physical factory-configured module uses 256000 and must first be configured for the same baud rate. Reported distances are centimetres. Repeated calls to getStatus() assemble fragmented reports and return ErrorFrame until a complete report arrives. The instance owns the buffer returned by sendCommand() until its next command. High-level configuration methods enter and leave configuration mode themselves; a successful module reboot ends that mode.

[Seeed protocol manual](https://files.seeedstudio.com/wiki/mmwave-for-xiao/24GHz_mmWave_for_XIAO-Usermanual-V1.00.pdf)

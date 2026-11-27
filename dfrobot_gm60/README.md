# GM60 QR code scanner

DFRobot GM60 QR code/barcode scanning and recognition sensor control library supports I2C and UART communication and can recognize QRCode, Data Matrix, PDF417, EAN13, Code128 and other code systems.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-dfrobot-gm60 |
| Version | 0.0.1 |
| Author | ailyProject |
| Source | https://github.com/DFRobot/DFRobot_GM60 |
| License | Original license |

## Supported Boards

Arduino AVR, ESP32, RP2040

## Description

DFRobot GM60 QR code/barcode scanning and recognition sensor control library supports I2C and UART communication and can recognize QRCode, Data Matrix, PDF417, EAN13, Code128 and other code systems.

## Quick Start

1. Enable `@aily-project/lib-dfrobot-gm60` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

### UART and scan data

The UART initialization block defaults to Auto. On ESP32 this maps UART1 to the selected RX/TX pins at 9600 baud. Other boards retain pin-based SoftwareSerial in Auto mode. Select UART1 or UART2 to use an available hardware controller. On STM32 select pins associated with that controller. Boards with fixed-function UART pins use their standard hardware pins.

`detection()` returns the complete payload in the configured encoding, or the existing string `"null"` on silence and incomplete frames. An empty payload is a successful empty string. The driver accepts fragmented input, 16-bit payload lengths, and the scanner's seven-byte register-write acknowledgment.

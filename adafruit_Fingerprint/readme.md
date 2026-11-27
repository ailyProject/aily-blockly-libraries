# Fingerprint identification library

Fingerprint recognition support library based on Adafruit_Fingerprint library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-fingerprint |
| Version | 0.0.3 |
| Author | Adafruit |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Fingerprint recognition support library based on Adafruit_Fingerprint library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Quick Start

1. Enable `@aily-project/lib-adafruit-fingerprint` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

The default initialization block uses `Serial`. To keep the console available while using the sensor, place the dedicated UART initialization block in setup after the console initialization. Select a UART present on the board. Connect the controller TX to the sensor RX and the controller RX to the sensor TX. Set both ends to the same baud rate (57600 by default).

On ESP32 and STM32, the RX and TX inputs select the controller pins. On boards with fixed hardware UART pins, wire the selected port's physical pins. Boards with only one hardware UART can use the original initialization block.

# ArduinoOTA

ArduinoOTA network firmware update library for WiFi and Ethernet uploads

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-arduinoota |
| Version | 1.1.1 |
| Author | Arduino, Juraj Andrassy |
| Source | https://github.com/jandrassy/ArduinoOTA |
| License | LGPL-2.1-or-later |

## Supported Boards

Arduino AVR, Arduino SAMD, ESP32, ESP8266, renesas_uno:unor4wifi, RP2040, STMicroelectronics:stm32, nRF5:nRF5

## Description

ArduinoOTA network firmware update library for WiFi and Ethernet uploads

## Quick Start

1. Enable `@aily-project/lib-arduinoota` in Aily Blockly.
2. Connect WiFi first, then place the quick start OTA block in `arduino_setup()` to start OTA and auto-add polling.
3. For manual control, place the normal initialization block in `arduino_setup()` and the poll block in `arduino_loop()`.

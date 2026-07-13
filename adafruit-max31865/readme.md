# MAX31865 RTD Temperature Sensor

Adafruit PT100/PT1000 RTD temperature sensor library via MAX31865 SPI interface.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-adafruit-max31865 |
| Version | 1.0.0 |
| Author | Limor Fried/Ladyada (Adafruit Industries) |
| Source | https://github.com/adafruit/Adafruit_MAX31865 |
| License | BSD |

## Supported Boards

Arduino UNO/Nano, ESP32, ESP8266, Arduino SAMD, UNO R4 WiFi, RP2040

## Description

This library drives the MAX31865 RTD-to-Digital converter, supporting PT100 and PT1000 RTD sensors over SPI. Features include 2/3/4-wire configuration, auto conversion mode, 50/60Hz noise filtering, and fault detection.

## Quick Start

1. Wire the MAX31865 breakout: CS→pin, SCK/MOSI/MISO→SPI pins
2. Use `init MAX31865` block to set CS pin and wire type
3. Use `read temperature` block with RTD nominal (100 for PT100, 1000 for PT1000) and reference resistor (430 for PT100, 4300 for PT1000)

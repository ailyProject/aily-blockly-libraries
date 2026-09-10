# ESP32 WS2812 Strip

Direct-pin Blockly bindings for WS2812/WS2812B RGB strips. Arduino-ESP32 3.x RMT hardware provides timing; no strip object or FastLED is required.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-esp32-ws2812 |
| Version | 2.0.0 |
| Source | Arduino-ESP32 RMT API |
| License | UNLICENSED |

## Supported Boards

ESP32 family boards using Arduino-ESP32 3.x, including ESP32-C3. Other Arduino cores are not supported.

## Description

Initialize each GPIO, update its RGB buffer, then refresh the strip. Up to four pins can be managed independently.

## Quick Start

Connect a common ground and DATA to a GPIO. Initialize the pin and LED count, set a color or brightness, then refresh. Level-shift the 3.3 V signal when a 5 V strip requires it.

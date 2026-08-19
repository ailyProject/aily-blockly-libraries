# ESP32P4 Robot-Lite

## Library Info

| Field | Value |
| --- | --- |
| Package | `@aily-project/lib-esp32p4-robot-lite` |
| Version | 0.0.1 |
| License | MIT |
| Core | Arduino-ESP32 3.3.11 |

## Supported Boards

ESP32P4 Robot-Lite V1.1 using `esp32:esp32:esp32p4`.

## Description

Configures VO1–VO4 at 3.3 V, 1.8 V, 2.5 V and 3.3 V. It maps the ESP32-C6 Hosted SDIO pins to CLK 47, CMD 48, D0 46, D1 45, D2 44, D3 43 and RESET 42 before WiFi or BLE starts.

GPIO41 is reserved but not driven without a verified schematic. Compile validation does not confirm C6 firmware, SDIO pull-ups, power timing or radio operation. ES7243E and acoustic echo cancellation are not included.

## Quick Start

Add the initialization block before WiFi/BLE use, or use the library's WiFi/BLE blocks, which add initialization automatically.

# Korvo Bluetooth Agent

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-deotaland-korvo-ble |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | MIT |

## Supported Boards

ESP32-S3-Korvo-2 V3 (Aily board OJ Korvo S3) only, with its fixed wiring.

## Description

Korvo-2 V3 on the Deotaland platform over Bluetooth: voice chat, photos, TF recording, screen, touch and App controls.

## Quick Start

1. Keep the OJ Korvo S3 defaults (16MB flash, OPI PSRAM, USB CDC On Boot off); Arduino-ESP32 3.3.10+, verified with 3.3.12.
2. Partition: keep the default `app3M_fat9M_16MB` (the firmware is about 1.6MB; App firmware updates need its two app slots).
3. Put `korvo_ble_init` in `arduino_setup()`, then connect from the Agent Link App with the Bluetooth name set there.

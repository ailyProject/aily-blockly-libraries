# Korvo Wi-Fi Agent

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-deotaland-korvo-wifi |
| Version | 1.0.0 |
| Author | OpenJumper |
| Source | N/A |
| License | MIT |

## Supported Boards

ESP32-S3-Korvo-2 V3 (Aily board OJ Korvo S3) only, with its fixed wiring.

## Description

Korvo-2 V3 on the Deotaland platform over Wi-Fi: realtime voice, sessions, CJK screen, touch and servos.

## Quick Start

1. Keep the OJ Korvo S3 defaults (16MB flash, OPI PSRAM, USB CDC On Boot off); Arduino-ESP32 3.3.10+, verified with 3.3.12.
2. The ~4.4MB firmware does not fit `app3M_fat9M_16MB`: set Partition Scheme to Custom and use this table (`src/partitions.csv`):
```
nvs,data,nvs,0x9000,0x5000,
otadata,data,ota,0xe000,0x2000,
app0,app,ota_0,0x10000,0x700000,
app1,app,ota_1,0x710000,0x700000,
spiffs,data,spiffs,0xe10000,0x1f0000,
```
3. Use `korvo_wifi_init` in `arduino_setup()`; set Wi-Fi via the `KorvoCloud-XXXX` hotspot, then activate on the platform.

# Xiaozhi AI

ESP32-S3 voice chat, activation, audio events and MCP.

## Library Info

| Field | Value |
|---|---|
| Package | @aily-project/lib-xiaozhi |
| Version | 0.0.2 |
| Source | Xiaozhi Arduino 2.4.0 |
| License | MIT; dependencies retain their licenses |

## Supported Boards

ESP32-S3, Arduino Core 3.x; audio needs PSRAM and a large app partition.

## Description

53 blocks; OJoy includes tuned audio and PSRAM/TLS settings.

## Quick Start

Select audio, connect WiFi, then start the official service. Requires ESP32 WiFi.
For wake, enable the checkbox and use ESP SR 16M or a dedicated
`model,data,spiffs` partition >=`0x48000`. The bundled “你好小智” model installs
at its actual address; different contents are replaced, matching images are
only verified. Allow ~285 KiB extra app flash. No separate model upload.

See [examples and validation](readme_ai.md) and [model/license](models/README.md).
This update needs a device test.

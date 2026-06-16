# Blynk

Connect Arduino-compatible boards to Blynk Cloud for IoT dashboards, virtual pins, and device events.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-blynk |
| Version | 1.0.0 |
| Author | Blynk |
| Source | https://github.com/blynk-technologies/blynk-library |
| License | MIT |

## Supported Boards

ESP32, ESP8266, Arduino boards with Ethernet shields, and WiFi boards supported by the upstream Blynk library.

## Description

This Blockly wrapper covers the common Blynk workflow: configure template credentials, connect through WiFi or Ethernet, keep `Blynk.run()` active, send virtual pin values, react to virtual pin writes, log events, and schedule periodic updates with `BlynkTimer`.

## Quick Start

Create a Blynk device, copy its template ID, template name, and auth token, then use a WiFi or Ethernet setup block in `arduino_setup()`. Add virtual write blocks or timer callbacks to publish sensor values.

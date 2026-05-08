# SparkFun CAN-Bus

SparkFun CAN-Bus Shield Blockly library for MCP2515 communication.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-sparkfun-can-bus |
| Version | 0.0.1 |
| Author | SparkFun Electronics / Sukking Pang |
| Source | https://github.com/sparkfun/SparkFun_CAN-Bus_Arduino_Library |
| License | BSD / CC-BY-SA |

## Supported Boards

Arduino AVR boards supported by the upstream CAN-Bus Shield library.

## Description

This library wraps the SparkFun CAN-Bus Shield for Blockly. It supports CAN speed setup, ready status, test transmit, custom frame transmit, receive caching, byte access, and common OBD-II PID text requests.

## Quick Start

Call `canbus_init`, then use `canbus_read_message` before reading cached ID, length, or data bytes. Use `canbus_send_message` for custom frames.
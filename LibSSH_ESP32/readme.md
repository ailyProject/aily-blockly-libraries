# LibSSH ESP32

LibSSH-ESP32 provides SSH client, SSH server, and SCP support for ESP32 through a port of libssh.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-libssh-esp32 |
| Version | 5.8.0 |
| Author | Ewan Parker |
| Source | https://github.com/ewpa/LibSSH-ESP32 |
| License | LGPL-2.1-or-later |

## Supported Boards

ESP32, ESP32-C3, ESP32-S2, and ESP32-S3 boards supported by the upstream library and ESP32 Arduino core.

## Description

This Blockly wrapper focuses on common SSH client workflows: initialize libssh, create and connect sessions, password authentication, execute commands over channels, read/write channel data, and transfer text through SCP handles.

## Quick Start

1. Connect WiFi or Ethernet using the board's network blocks.
2. Use the password connect block to create an SSH session.
3. Create a channel, execute a command, read the output, then close the channel and session.

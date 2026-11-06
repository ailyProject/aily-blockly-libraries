# JQ6500 Audio Module

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-jq6500 |
| Version | 0.0.1 |
| Author | Not specified |
| Source | Bundled source archive |
| License | UNLICENSED |

## Supported Boards

Arduino AVR boards with SoftwareSerial; the fixed generator was compiled for Arduino Uno.

## Description

Control a JQ6500 serial audio module through SoftwareSerial: reset, volume, indexed playback and loop mode.

## Quick Start

Cross the serial wires: Arduino RX (default D11) to module TX, and Arduino TX (default D12) to module RX; share GND. Initialize the object in setup. The software serial port runs at 9600 baud. Playback indexes start at 1.

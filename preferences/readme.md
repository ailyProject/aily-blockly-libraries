# Preferences

ESP32 NVS (Non-Volatile Storage) key-value data storage library.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-preferences |
| Version | 1.0.0 |
| Author | Espressif Systems |
| Source | [arduino-esp32 Preferences](https://github.com/espressif/arduino-esp32/tree/master/libraries/Preferences) |
| License | Apache-2.0 |

## Supported Boards

ESP32 series (Xiao ESP32S3, ESP32 DevKit, etc.)

## Description

The Preferences library provides a simple key-value API for storing data in ESP32's NVS flash partition. Data persists across reboots and power cycles. Supports Int, Float, Bool, and String types.

## Quick Start

1. Drag `Preferences begin` block to setup, enter a namespace name
2. Use `put` / `get` blocks to store and read values by key
3. Call `Preferences end` when done

# Cubic Core Car Library

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-cubic_core_car |
| Version | 1.0.0 |
| Author | MZF |
| License | MIT |

## Supported Boards

ESP32 (Cubic Core mainboard, fixed pins).

## Description

All-in-one Cubic Core LEGO car: PS3 controller, I2C 4-motor drive, encoder motors, servos, lights and OLED. Motor-priority shared-I2C arbitration keeps motors real-time while the OLED refreshes.

## Quick Start

1. Enable `@aily-project/lib-cubic_core_car` in Aily Blockly.
2. Call `initialize Cubic Core car` and `connect PS3 controller` in setup.
3. In loop, use drive/servo/light/OLED blocks.


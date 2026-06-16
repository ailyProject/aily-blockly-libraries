# HID-Project

Extended HID functions for Arduino keyboards, mice, consumer keys, system keys, and gamepads.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-hid-project |
| Version | 1.0.0 |
| Upstream Version | 2.8.4 |
| Author | NicoHood |
| Source | https://github.com/NicoHood/HID |
| License | See upstream |

## Supported Boards

Native USB Arduino boards, HoodLoader2 AVR boards, and other HID-Project supported cores.

## Description

This wrapper exposes the common global HID-Project objects: Keyboard, Mouse, Consumer, System, and Gamepad.

## Quick Start

1. Add the setup or begin block for the library.
2. Add the action, status, or event blocks needed by your project.
3. For libraries that need polling, the setup blocks automatically add the required loop call when possible.

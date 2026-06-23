# USB Host Shield Library 2.0

MAX3421E-based USB Host Shield library for USB devices, hubs, HID, Bluetooth, and game controllers.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-usb-host-shield-2-0 |
| Version | 1.0.0 |
| Upstream Version | 1.7.0 |
| Author | Oleg Mazurov, Kristian Sloth Lauszus, Andrew Kroll, Alexei Glushchenko |
| Source | https://github.com/felis/USB_Host_Shield_2.0 |
| License | GPL-2.0 |

## Supported Boards

Arduino-compatible boards supported by the MAX3421E USB Host Shield library.

## Description

This wrapper provides the common USB host initialization/task flow plus PS4 USB controller status, buttons, axes, rumble, and LED helpers.

## Quick Start

1. Add the setup or begin block for the library.
2. Add the action, status, or event blocks needed by your project.
3. For libraries that need polling, the setup blocks automatically add the required loop call when possible.

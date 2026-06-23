# Firmata

Standard serial protocol for communication between microcontrollers and host software.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-firmata |
| Version | 1.0.0 |
| Upstream Version | 2.5.9 |
| Author | Firmata Developers |
| Source | https://github.com/firmata/arduino |
| License | LGPL-2.1 |

## Supported Boards

All Arduino and Genuino boards supported by Firmata.

## Description

This wrapper exposes Firmata begin/process, common send methods, availability, and basic callback registration.

## Quick Start

1. Add the setup or begin block for the library.
2. Add the action, status, or event blocks needed by your project.
3. For libraries that need polling, the setup blocks automatically add the required loop call when possible.

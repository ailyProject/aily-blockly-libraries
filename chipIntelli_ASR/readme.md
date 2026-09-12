# ChipIntelliASR

Offline wake-word, command and semantic recognition for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-asr` |
| Version | 2.4.1 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`) at 3.3 V.

## Description

Text commands allocate IDs; fixed-ID commands reserve IDs and generate vocabulary. Automatic IDs skip fixed definitions and CWSL controls 199–208. Numeric ID references remain unchanged. Fixed ID 1000 is suggested for a learning target; define its text first.

## Quick Start

1. Initialize and set an explicit wake word.
2. Define the learning target with a fixed ID; use separate control commands.
3. Add command events; they call `tick()` in loop. Use polling separately.

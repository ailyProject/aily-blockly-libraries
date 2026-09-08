# ChipIntelliCWSL

Command- and wake-word self-learning blocks for CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-cwsl` |
| Version | 1.1.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303, CI1306, CI-D06GT01D and EasyVoice 1306. Requires the board core's ChipIntelliCWSL 1.1.0 API; no duplicate sources are bundled.

## Description

Learn words, manage persistent templates, poll events and inspect errors. Common actions come first; advanced queue diagnostics follow.

## Quick Start

Select a CWSL profile. Initialize, check success, learn an existing command ID, then drain events in loop. ID 2/group 0 is the default; wake words need a wake-command ID. See readme_ai.md for complete examples. Prefer the minimal example on CI1302.

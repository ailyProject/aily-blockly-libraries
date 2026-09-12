# ChipIntelliAudio

Prompt, local-audio and runtime-number playback for ChipIntelli CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-audio` |
| Version | 1.1.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later; vendor SDK terms also apply |

## Supported Boards

CI1302, CI1303 and CI1306 (`chipintelli:ci13xx`) at 3.3 V.

## Description

Plays prompts, imported audio and numeric variables. CWSL's managed controller guards other playback while learning.

## Quick Start

1. Initialize and select the runtime-number language. Playback volume defaults to 100%.
2. Optionally set prompt voice, volume and speed.
3. Playback is asynchronous; interrupt mode does not wait for completion.
4. Use the completion event only without a managed CWSL controller.

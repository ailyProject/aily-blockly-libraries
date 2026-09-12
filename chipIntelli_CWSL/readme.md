# ChipIntelliCWSL

Command- and wake-word self-learning blocks for CI13XX.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-cwsl` |
| Version | 1.2.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| Source | [ChipIntelli documentation](https://document.chipintelli.com/) |
| License | LGPL-2.1-or-later |

## Supported Boards

CI1302, CI1303, CI1306, CI-D06GT01D and EasyVoice 1306. Requires the board core's ChipIntelliCWSL 1.1.0 API; no duplicate sources are bundled.

## Description

Managed voice learning handles prompts, recording, targeted replacement and failures. Raw CWSL blocks remain available separately.

## Quick Start

1. Set a wake word and add the voice-learning controller with a fixed-ID target.
2. Connect ASR controls to its learning/replacement request blocks.
3. Guard business actions with its busy block. Do not mix raw CWSL reads or Audio completion events.

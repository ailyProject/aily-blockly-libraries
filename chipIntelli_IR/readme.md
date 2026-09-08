# ChipIntelliIR

Infrared learning/replay, NEC decoding and air-conditioner control.

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-chipintelli-ir` |
| Version | 1.2.0 |
| Author | ChipIntelli Arduino contributors / ailyProject |
| License | LGPL-2.1-or-later; vendor terms apply |

## Supported Boards

CI1302/1303/1306, CI-D06GT01D and easyVoice 1306 dev. CI1302 supports raw/NEC only with the standard resource layout.

## Description

Requires CI13XX core 1.0.17+ with ChipIntelliIR 1.1.0 APIs. Raw durations: 200–131070 us, up to 1024 entries.

## Quick Start

Use board-default initialization (easyVoice RX: PA3; others: PA4). Custom pins are under Advanced initialization. Receive, then decode or replay.

Air initialization emits CHIPINTELLI_IR_DATABASE=1; the core prepares and packages the database automatically. Select a brand, send, then wait until idle. Modes are exclusive per boot. See `readme_ai.md` for examples.

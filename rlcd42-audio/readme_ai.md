# @aily-project/lib-rlcd42-audio

## Library Info

- **Name**: @aily-project/lib-rlcd42-audio
- **Version**: 0.0.1
- **Purpose**: On-board ES7210 dual microphone array of the Waveshare ESP32-S3-RLCD-4.2. Configures slave-mode I2S output with MIC1+MIC3 and a selectable PGA gain, plus a runtime mute switch.
- **Wiring**: on-board I2S, no external wiring.
- **License**: UNLICENSED (see package.json). Author: Bryan.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| `rlcd42_audio_init` | Statement | GAIN(dropdown) | `rlcd42_audio_init(30)` | `#include "Es7210Mic.h"`↵`es7210MicBegin(30);` |
| `rlcd42_audio_mute` | Statement | MUTE(dropdown) | `rlcd42_audio_mute(MUTE)` | `#include "Es7210Mic.h"`↵`es7210MicSetMute(true);` |

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| GAIN | 30, 24, 18, 12, 6, 0 | Microphone PGA gain in dB; `30` is the default and the highest gain. |
| MUTE | UNMUTE, MUTE | `UNMUTE` passes audio through, `MUTE` silences the microphone. |

## ABS Examples

### Capture with default gain

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    rlcd42_audio_init(30)
    rlcd42_audio_mute(UNMUTE)

arduino_loop()
    time_delay(math_number(1000))
```

### Mute and unmute at runtime

```abs
arduino_setup()
    rlcd42_audio_init(24)

arduino_loop()
    rlcd42_audio_mute(MUTE)
    time_delay(math_number(2000))
    rlcd42_audio_mute(UNMUTE)
    time_delay(math_number(2000))
```

## Notes

- Call `rlcd42_audio_init` once before any mute call; it is the only block that brings up the ES7210 over I2S.
- `rlcd42_audio_mute` emits `es7210MicSetMute(true)` for `MUTE` and `es7210MicSetMute(false)` for `UNMUTE`.
- Both blocks are statement blocks and must be placed in `arduino_setup()` or `arduino_loop()`.
- The ES7210 is configured as an I2S **slave**. The paired master clock must be produced by the audio output library (for example the Xiaozhi ES8311 blocks); this library alone does not generate MCLK/BCLK/LRCK.
- Gain changes take effect on the next `rlcd42_audio_init` call; the mute block does not alter gain.
- The board schematic places MIC1 and MIC3 on the array; microphone channel mapping is fixed in the driver and cannot be changed from the blocks.

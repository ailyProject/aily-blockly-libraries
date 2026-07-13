# K10 Speech Recognition & Synthesis

UNIHIKER K10 speech recognition and synthesis library, supports Chinese/English speech recognition, command detection and TTS

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-speech
- **Version**: 0.3.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_asr_init` | Statement | MODE(dropdown), LANGUAGE(dropdown), WAKEUP_TIME(input_value) | `k10_asr_init(CONTINUOUS, CN_MODE, math_number(6000))` | `asr.asrInit(CONTINUOUS, CN_MODE, 6000)` plus a bounded 15-second readiness wait |
| `k10_asr_add_command` | Statement | ID(input_value), KEYWORD(input_value) | `k10_asr_add_command(math_number(1), text("kai deng"))` | Adds the command only after ASR is ready |
| `k10_asr_is_wakeup` | Value | (none) | `k10_asr_is_wakeup()` | `k10_asr_ready && asr.isWakeUp()` |
| `k10_asr_is_detected` | Value | ID(input_value) | `k10_asr_is_detected(math_number(1))` | `k10_asr_ready && asr.isDetectCmdID(id)` |
| `k10_asr_speak` | Statement | TEXT(input_value), INTERVAL(field_number) | `k10_asr_speak(text("value"), 1)` | `k10AsrSpeakSafe(asr, text, intervalSeconds, lastSpeakTime)` |
| `k10_asr_set_speed` | Statement | SPEED(dropdown) | `k10_asr_set_speed(1)` | Sets TTS speed only after ASR is ready |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | CONTINUOUS, ONCE | Continuous or one-shot recognition |
| LANGUAGE | CN_MODE, EN_MODE | Chinese or English recognition |
| WAKEUP_TIME | Milliseconds, default 6000 | Length of the active wake window |
| SPEED | 0, 1, 2, 3, 4, 5 | SDK-supported TTS speed range; 3 is the default |
| INTERVAL | Number of seconds, default 1 | Editable field inside the speak block; minimum interval between successful broadcasts from that block |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_asr_init(CONTINUOUS, CN_MODE, math_number(6000))
    k10_asr_add_command(math_number(1), text("kai deng"))
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: k10_asr_is_wakeup()
        @DO0:
            serial_println(Serial, text("wake up"))
    controls_if()
        @IF0: k10_asr_is_detected(math_number(1))
        @DO0:
            serial_println(Serial, text("command 1"))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **TTS initialization**: `k10_asr_speak` automatically initializes TTS after ASR becomes ready, using speed `3` as the default. If the speech model is missing, TTS initialization is skipped so the rest of `setup()` can still finish.
4. **Speech model**: installation sets the K10 board option to `Model=Hi_eps` (Chinese) when no model was selected. Chinese recognition requires `Hi_eps`; English recognition requires `Ni_hao_xiao_zhi`. Change the board model and upload again when switching recognition language because the model is stored outside the sketch partition.
5. **Initialization status**: successful startup reports `[K10-ASR] ready`. Missing model data no longer blocks all later setup code forever; after 15 seconds it reports `[K10-ASR] init timeout` and keeps other K10 functions running.
6. **Command flow**: check `k10_asr_is_wakeup` and `k10_asr_is_detected` in separate `if` blocks, matching the official K10 examples. Command keywords use space-separated pinyin such as `kai deng`.
7. **Repeat interval**: each speak block contains its own editable interval field in seconds, defaulting to 1. A continuously called block repeats after that interval; the timestamp changes only when playback actually starts, so a rejected request cannot postpone playback forever.
8. **Global audio guard**: all speak blocks share a minimum 1000 ms gap to avoid overlapping K10 audio tasks while preserving the one-second default.
9. **Old projects**: projects saved with the former `INTERVAL` value socket load through a hidden compatibility connection; the visible inline interval field defaults to 1 second and generated code uses that field.
10. **Legacy initialization**: a saved `k10_asr_init` block without the new fields still generates `CONTINUOUS`, `CN_MODE`, and `6000`.
11. **TTS language**: the official K10 TTS engine is Chinese-only. `EN_MODE` changes recognition language; it does not add English speech synthesis.
12. **Numeric speech**: `k10_asr_speak` accepts `String` and `Number` values, matching the SDK speech overloads.

# K10 Music & Audio

UNIHIKER K10 music and audio library, supports built-in music, tone playback, TF card recording and playback

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-music
- **Version**: 0.3.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_music_play_builtin` | Statement | MUSIC(dropdown) | `k10_music_play_builtin(BIRTHDAY)` | music.playMusic( |
| `k10_music_stop_builtin` | Statement | (none) | `k10_music_stop_builtin()` | music.stopPlayTone();\n |
| `k10_music_play_tone` | Statement | FREQ(input_value), DURATION(input_value) | `k10_music_play_tone(math_number(440), math_number(8000))` | music.playTone( |
| `k10_music_record` | Statement | FILENAME(input_value), TIME(input_value) | `k10_music_record(text("S:/sound.wav"), math_number(3))` | music.recordSaveToTFCard( |
| `k10_music_play_tf` | Statement | FILENAME(input_value) | `k10_music_play_tf(text("S:/sound.wav"))` | music.playTFCardAudio( |
| `k10_music_stop_tf` | Statement | (none) | `k10_music_stop_tf()` | music.stopPlayAudio();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MUSIC | BIRTHDAY, ODE, AILY_LITTLE_STAR, AILY_JINGLE_BELLS, DADADADUM, ENTERTAINER, PRELUDE, NYAN, RINGTONE, FUNK, BLUES, WEDDING, FUNERAL, PUNCHLINE, BADDY, CHASE, BA_DING, WAWAWAWAA, JUMP_UP, JUMP_DOWN, POWER_UP, POWER_DOWN | k10_music_play_builtin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_music_play_builtin(BIRTHDAY)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Tone beat**: `DURATION` is the SDK sample count; `8000` equals one beat. It is not milliseconds.
4. **TF card paths**: use the LVGL drive prefix, for example `S:/sound.wav`. Record duration is expressed in seconds.
5. **Initialization**: all blocks initialize K10 automatically; record and TF playback blocks also initialize the TF card filesystem.
6. **Preset storage**: SDK presets are note strings compiled into `unihiker_k10.cpp`; no WAV/MP3 files are required. `AILY_LITTLE_STAR` and `AILY_JINGLE_BELLS` generate `playTone()` sequences for compatibility with the former dropdown options.

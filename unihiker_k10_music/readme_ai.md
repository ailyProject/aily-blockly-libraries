# K10 Music & Audio

UNIHIKER K10 music and audio library, supports built-in music, tone playback, TF card recording and playback

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-music
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_music_play_builtin` | Statement | MUSIC(dropdown) | `k10_music_play_builtin(birthday)` | music.playMusic( |
| `k10_music_play_tone` | Statement | FREQ(input_value), DURATION(input_value) | `k10_music_play_tone(math_number(0), math_number(1000))` | music.playTone( |
| `k10_music_record` | Statement | CMD(dropdown), FILENAME(input_value) | `k10_music_record(start, text("value"))` | music.recordSaveToTFCard( |
| `k10_music_play_tf` | Statement | FILENAME(input_value) | `k10_music_play_tf(text("value"))` | music.playTFCardAudio( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MUSIC | birthday, littlestar, jinglebells, odeTojoy | k10_music_play_builtin |
| CMD | start, stop | k10_music_record |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_music_play_builtin(birthday)
    serial_begin(Serial, 9600)

arduino_loop()
    k10_music_play_tone(math_number(0), math_number(1000))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

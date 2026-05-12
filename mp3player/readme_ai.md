# MP3 audio player

The GD3800 audio playback module driver library supports serial communication, multiple audio format playback, volume adjustment, and track switching. It is simple to operate, compatible with multiple platforms, and i...

## Library Info
- **Name**: @aily-project/lib-mp3player-gd3800
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gd3800_init` | Statement | PIN_TX(input_value), PIN_RX(input_value) | `gd3800_init(math_number(2), math_number(2))` | Dynamic code |
| `gd3800_set` | Statement | GD3800_SETSTATE(dropdown) | `gd3800_set(play)` | mp3....();\n |
| `gd3800_play` | Statement | MUSICNUM(input_value) | `gd3800_play(math_number(0))` | mp3.playFileByIndexNumber(...);\n |
| `gd3800_cyclemode` | Statement | GD3800_CYMODE(dropdown) | `gd3800_cyclemode(MP3_LOOP_ALL)` | mp3.setLoopMode(...);\n |
| `gd3800_equalizer` | Statement | GD3800_EQMODE(dropdown) | `gd3800_equalizer(MP3_EQ_NORMAL)` | mp3.setEqualizer(...);\n |
| `gd3800_setvolume` | Statement | SETVOLUME(input_value) | `gd3800_setvolume(math_number(0))` | mp3.setVolume(...);\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GD3800_SETSTATE | play, pause, next, prev, volumeUp, volumeDn | gd3800_set |
| GD3800_CYMODE | MP3_LOOP_ALL, MP3_LOOP_FOLDER, MP3_LOOP_ONE, MP3_LOOP_RAM | gd3800_cyclemode |
| GD3800_EQMODE | MP3_EQ_NORMAL, MP3_EQ_POP, MP3_EQ_ROCK, MP3_EQ_JAZZ, MP3_EQ_CLASSIC, MP3_EQ_BASS | gd3800_equalizer |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gd3800_init(math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    gd3800_set(play)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

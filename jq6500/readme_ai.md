# JQ6500 Audio Module

Control a JQ6500 serial audio module through SoftwareSerial: reset, volume, indexed playback and loop mode.

## Library Info
- **Name**: @aily-project/lib-jq6500
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `jq6500_init` | Statement | NAME(field_input), RX_PIN(dropdown), TX_PIN(dropdown) | `jq6500_init("mp3", RX_PIN, TX_PIN)` | `SoftwareSerial mp3_serial(RX_PIN, TX_PIN); ↵ class JQ6500_Serial mp3(mp3_serial); ↵ mp3_serial.begin(9600);` |
| `jq6500_reset` | Statement | VAR(field_variable) | `jq6500_reset($mp3)` | `mp3.reset();` |
| `jq6500_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `jq6500_set_volume($mp3, math_number(0))` | `mp3.setVolume(0);` |
| `jq6500_play_index` | Statement | VAR(field_variable), INDEX(input_value) | `jq6500_play_index($mp3, math_number(0))` | `mp3.playFileByIndexNumber(0);` |
| `jq6500_set_loop` | Statement | VAR(field_variable), MODE(dropdown) | `jq6500_set_loop($mp3, MP3_LOOP_NONE)` | `mp3.setLoopMode(MP3_LOOP_NONE);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | MP3_LOOP_NONE, MP3_LOOP_ONE, MP3_LOOP_ALL | jq6500_set_loop |

## ABS Examples

### Basic Usage
```abs
# ABS Schema: 2

arduino_setup()
    jq6500_init("mp3", 11, 12)
    jq6500_reset($mp3)
    jq6500_set_volume($mp3, math_number(30))
    jq6500_set_loop($mp3, MP3_LOOP_NONE)

arduino_loop()
    jq6500_play_index($mp3, math_number(1))
    time_delay(math_number(2000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.

3. `jq6500_init` creates a typed JQ6500_Serial object and starts its software serial port at 9600 baud. Connect Arduino RX to module TX, Arduino TX to module RX, and share ground.
4. Store audio on the module before playback. File indexes start at 1; volume is 0-30 and the bundled driver clamps higher values to 30.
5. MP3_LOOP_NONE disables looping, MP3_LOOP_ONE loops one track, and MP3_LOOP_ALL loops all tracks. Module firmware determines the loop-command and no-card behavior.
6. The bundled driver sends frames `0x7E length command parameters 0xEF`; it needs the board SoftwareSerial library.
7. Nine added locale files (zh_hk, ja, ko, de, fr, es, pt, ru, ar) use the English strings as an explicit fallback.

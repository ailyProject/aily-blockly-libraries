# SparkFun Qwiic MP3 Trigger

Blockly wrapper for SparkFun Qwiic MP3 Trigger (I2C MP3 playback control).

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-mp3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_mp3_init` | Statement | VAR(field_input) | `qwiic_mp3_init("mp3")` | Dynamic code |
| `qwiic_mp3_play_track` | Statement | VAR(field_variable), TRACK(input_value) | `qwiic_mp3_play_track(variables_get($mp3), math_number(0))` | Dynamic code |
| `qwiic_mp3_play_file` | Statement | VAR(field_variable), FILENUM(input_value) | `qwiic_mp3_play_file(variables_get($mp3), math_number(0))` | Dynamic code |
| `qwiic_mp3_play_next` | Statement | VAR(field_variable) | `qwiic_mp3_play_next(variables_get($mp3))` | Dynamic code |
| `qwiic_mp3_play_prev` | Statement | VAR(field_variable) | `qwiic_mp3_play_prev(variables_get($mp3))` | Dynamic code |
| `qwiic_mp3_pause` | Statement | VAR(field_variable) | `qwiic_mp3_pause(variables_get($mp3))` | Dynamic code |
| `qwiic_mp3_stop` | Statement | VAR(field_variable) | `qwiic_mp3_stop(variables_get($mp3))` | Dynamic code |
| `qwiic_mp3_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `qwiic_mp3_set_volume(variables_get($mp3), math_number(0))` | Dynamic code |
| `qwiic_mp3_is_playing` | Value | VAR(field_variable) | `qwiic_mp3_is_playing(variables_get($mp3))` | Dynamic code |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwiic_mp3_init("mp3")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwiic_mp3_is_playing(variables_get($mp3)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `qwiic_mp3_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

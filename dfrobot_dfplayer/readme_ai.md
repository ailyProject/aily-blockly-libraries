# DFPlayer

DFPlayer控制库，用于控制DFPlayer Mini模块，实现音频播放、暂停、音量调节及其它功能(测试也可用于MP3-TF-16P模块)

## Library Info
- **Name**: @aily-project/lib-dfplayer
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfplayer_begin` | Statement | VAR(field_input), RX(input_value), TX(input_value) | `dfplayer_begin("dfplayer", math_number(0), math_number(0))` | `` |
| `dfplayer_play` | Statement | VAR(field_variable), FILE(input_value) | `dfplayer_play(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_pause` | Statement | VAR(field_variable) | `dfplayer_pause(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_start` | Statement | VAR(field_variable) | `dfplayer_start(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_stop` | Statement | VAR(field_variable) | `dfplayer_stop(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_next` | Statement | VAR(field_variable) | `dfplayer_next(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_previous` | Statement | VAR(field_variable) | `dfplayer_previous(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `dfplayer_volume(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_volume_up` | Statement | VAR(field_variable) | `dfplayer_volume_up(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_volume_down` | Statement | VAR(field_variable) | `dfplayer_volume_down(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_eq` | Statement | VAR(field_variable), EQ(dropdown) | `dfplayer_eq(variables_get($dfplayer), 0)` | (dynamic code) |
| `dfplayer_output_device` | Statement | VAR(field_variable), DEVICE(dropdown) | `dfplayer_output_device(variables_get($dfplayer), 1)` | (dynamic code) |
| `dfplayer_loop` | Statement | VAR(field_variable), FILE(input_value) | `dfplayer_loop(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_play_folder` | Statement | VAR(field_variable), FOLDER(input_value), FILE(input_value) | `dfplayer_play_folder(variables_get($dfplayer), math_number(0), math_number(0))` | (dynamic code) |
| `dfplayer_enable_loop_all` | Statement | VAR(field_variable) | `dfplayer_enable_loop_all(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_disable_loop_all` | Statement | VAR(field_variable) | `dfplayer_disable_loop_all(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_play_mp3_folder` | Statement | VAR(field_variable), FILE(input_value) | `dfplayer_play_mp3_folder(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_advertise` | Statement | VAR(field_variable), FILE(input_value) | `dfplayer_advertise(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_stop_advertise` | Statement | VAR(field_variable) | `dfplayer_stop_advertise(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_play_large_folder` | Statement | VAR(field_variable), FOLDER(input_value), FILE(input_value) | `dfplayer_play_large_folder(variables_get($dfplayer), math_number(0), math_number(0))` | (dynamic code) |
| `dfplayer_loop_folder` | Statement | VAR(field_variable), FOLDER(input_value) | `dfplayer_loop_folder(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_random_all` | Statement | VAR(field_variable) | `dfplayer_random_all(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_enable_loop` | Statement | VAR(field_variable) | `dfplayer_enable_loop(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_disable_loop` | Statement | VAR(field_variable) | `dfplayer_disable_loop(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_state` | Value | VAR(field_variable) | `dfplayer_read_state(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_volume` | Value | VAR(field_variable) | `dfplayer_read_volume(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_eq` | Value | VAR(field_variable) | `dfplayer_read_eq(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_file_counts` | Value | VAR(field_variable) | `dfplayer_read_file_counts(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_current_file_number` | Value | VAR(field_variable) | `dfplayer_read_current_file_number(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_file_counts_in_folder` | Value | VAR(field_variable), FOLDER(input_value) | `dfplayer_read_file_counts_in_folder(variables_get($dfplayer), math_number(0))` | (dynamic code) |
| `dfplayer_available` | Value | VAR(field_variable) | `dfplayer_available(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read_type` | Value | VAR(field_variable) | `dfplayer_read_type(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_read` | Value | VAR(field_variable) | `dfplayer_read(variables_get($dfplayer))` | (dynamic code) |
| `dfplayer_simple_play` | Statement | RX(input_value), TX(input_value), FILE(input_value) | `dfplayer_simple_play(math_number(0), math_number(0), math_number(0))` | `myDFPlayer.play(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| EQ | 0, 1, 2, 3, 4, 5 | Normal / Pop / Rock / Jazz / Classic / Bass |
| DEVICE | 1, 2 | U盘 / TF卡 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dfplayer_begin("dfplayer", math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dfplayer_read_volume(variables_get($dfplayer)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `dfplayer_begin("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

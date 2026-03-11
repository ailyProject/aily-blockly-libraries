# ES8388音频编解码器

ES8388立体声音频编解码器库，支持录音、播放和实时音频处理

## Library Info
- **Name**: @aily-project/lib-es8388
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `es8388_create` | Statement | VAR(field_input), SDA(input_value), SCL(input_value), SPEED(input_value) | `es8388_create("es8388", math_number(0), math_number(0), math_number(9600))` | `` |
| `es8388_begin` | Statement | VAR(field_variable), SAMPLE_RATE(input_value), MCK_PIN(input_value), BCK_PIN(input_value), WS_PIN(input_value), DATA_OUT_PIN(input_value), DATA_IN_PIN(input_value) | `es8388_begin(variables_get($es8388), math_number(0), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))` | `` |
| `es8388_set_input_gain` | Statement | VAR(field_variable), GAIN(input_value) | `es8388_set_input_gain(variables_get($es8388), math_number(0))` | (dynamic code) |
| `es8388_set_output_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `es8388_set_output_volume(variables_get($es8388), math_number(0))` | (dynamic code) |
| `es8388_dac_mute` | Statement | VAR(field_variable), MUTE(dropdown) | `es8388_dac_mute(variables_get($es8388), TRUE)` | (dynamic code) |
| `es8388_start_recording` | Statement | VAR(field_variable), DURATION(input_value) | `es8388_start_recording(variables_get($es8388), math_number(0))` | (dynamic code) |
| `es8388_stop_recording` | Statement | VAR(field_variable) | `es8388_stop_recording(variables_get($es8388))` | (dynamic code) |
| `es8388_start_playback` | Statement | VAR(field_variable) | `es8388_start_playback(variables_get($es8388))` | (dynamic code) |
| `es8388_stop_playback` | Statement | VAR(field_variable) | `es8388_stop_playback(variables_get($es8388))` | (dynamic code) |
| `es8388_record_and_play` | Statement | VAR(field_variable), DURATION(input_value) | `es8388_record_and_play(variables_get($es8388), math_number(0))` | (dynamic code) |
| `es8388_enable_passthrough` | Statement | VAR(field_variable) | `es8388_enable_passthrough(variables_get($es8388))` | (dynamic code) |
| `es8388_disable_passthrough` | Statement | VAR(field_variable) | `es8388_disable_passthrough(variables_get($es8388))` | (dynamic code) |
| `es8388_process_audio` | Statement | VAR(field_variable) | `es8388_process_audio(variables_get($es8388))` | (dynamic code) |
| `es8388_is_recording` | Value | VAR(field_variable) | `es8388_is_recording(variables_get($es8388))` | (dynamic code) |
| `es8388_is_playing` | Value | VAR(field_variable) | `es8388_is_playing(variables_get($es8388))` | (dynamic code) |
| `es8388_get_recorded_samples` | Value | VAR(field_variable) | `es8388_get_recorded_samples(variables_get($es8388))` | (dynamic code) |
| `es8388_get_recorded_duration` | Value | VAR(field_variable) | `es8388_get_recorded_duration(variables_get($es8388))` | (dynamic code) |
| `es8388_set_input_select` | Statement | VAR(field_variable), INPUT(dropdown) | `es8388_set_input_select(variables_get($es8388), IN1)` | (dynamic code) |
| `es8388_set_output_select` | Statement | VAR(field_variable), OUTPUT(dropdown) | `es8388_set_output_select(variables_get($es8388), OUT1)` | (dynamic code) |
| `es8388_set_alc_mode` | Statement | VAR(field_variable), ALC_MODE(dropdown) | `es8388_set_alc_mode(variables_get($es8388), DISABLE)` | (dynamic code) |
| `es8388_analog_bypass` | Statement | VAR(field_variable), BYPASS(dropdown) | `es8388_analog_bypass(variables_get($es8388), TRUE)` | (dynamic code) |
| `es8388_scan_i2c` | Statement | VAR(field_variable) | `es8388_scan_i2c(variables_get($es8388))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MUTE | TRUE, FALSE | 开启 / 关闭 |
| INPUT | IN1, IN2, IN1DIFF, IN2DIFF | 输入1 / 输入2 / 输入1差分 / 输入2差分 |
| OUTPUT | OUT1, OUT2, OUTALL | 输出1 / 输出2 / 全部输出 |
| ALC_MODE | DISABLE, GENERIC, VOICE, MUSIC | 禁用 / 通用 / 语音 / 音乐 |
| BYPASS | TRUE, FALSE | 开启 / 关闭 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    es8388_create("es8388", math_number(0), math_number(0), math_number(9600))
    es8388_begin(variables_get($es8388), math_number(0), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, es8388_is_recording(variables_get($es8388)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `es8388_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

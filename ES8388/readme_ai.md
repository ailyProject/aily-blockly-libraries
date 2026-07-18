# ES8388 audio codec

ES8388 stereo audio codec library supporting recording, playback and real-time audio processing

## Library Info
- **Name**: @aily-project/lib-es8388
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `es8388_create` | Statement | VAR(field_input), SDA(input_value), SCL(input_value), SPEED(input_value) | `es8388_create("es8388", math_number(0), math_number(0), math_number(9600))` | Dynamic code |
| `es8388_begin` | Statement | VAR(field_variable), SAMPLE_RATE(input_value), MCK_PIN(input_value), BCK_PIN(input_value), WS_PIN(input_value), DATA_OUT_PIN(input_value), DATA_IN_PIN(input_... | `es8388_begin(variables_get($es8388), math_number(0), math_number(2), math_number(2), math_number(2), math_number(2), math_number(2))` | if (! |
| `es8388_set_input_gain` | Statement | VAR(field_variable), GAIN(input_value) | `es8388_set_input_gain(variables_get($es8388), math_number(0))` | Dynamic code |
| `es8388_set_output_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `es8388_set_output_volume(variables_get($es8388), math_number(0))` | Dynamic code |
| `es8388_dac_mute` | Statement | VAR(field_variable), MUTE(dropdown) | `es8388_dac_mute(variables_get($es8388), TRUE)` | Dynamic code |
| `es8388_start_recording` | Statement | VAR(field_variable), DURATION(input_value) | `es8388_start_recording(variables_get($es8388), math_number(1000))` | Dynamic code |
| `es8388_stop_recording` | Statement | VAR(field_variable) | `es8388_stop_recording(variables_get($es8388))` | Dynamic code |
| `es8388_start_playback` | Statement | VAR(field_variable) | `es8388_start_playback(variables_get($es8388))` | Dynamic code |
| `es8388_stop_playback` | Statement | VAR(field_variable) | `es8388_stop_playback(variables_get($es8388))` | Dynamic code |
| `es8388_record_and_play` | Statement | VAR(field_variable), DURATION(input_value) | `es8388_record_and_play(variables_get($es8388), math_number(1000))` | Dynamic code |
| `es8388_enable_passthrough` | Statement | VAR(field_variable) | `es8388_enable_passthrough(variables_get($es8388))` | Dynamic code |
| `es8388_disable_passthrough` | Statement | VAR(field_variable) | `es8388_disable_passthrough(variables_get($es8388))` | Dynamic code |
| `es8388_process_audio` | Statement | VAR(field_variable) | `es8388_process_audio(variables_get($es8388))` | Dynamic code |
| `es8388_is_recording` | Value | VAR(field_variable) | `es8388_is_recording(variables_get($es8388))` | Dynamic code |
| `es8388_is_playing` | Value | VAR(field_variable) | `es8388_is_playing(variables_get($es8388))` | Dynamic code |
| `es8388_get_recorded_samples` | Value | VAR(field_variable) | `es8388_get_recorded_samples(variables_get($es8388))` | Dynamic code |
| `es8388_get_recorded_duration` | Value | VAR(field_variable) | `es8388_get_recorded_duration(variables_get($es8388))` | Dynamic code |
| `es8388_set_input_select` | Statement | VAR(field_variable), INPUT(dropdown) | `es8388_set_input_select(variables_get($es8388), IN1)` | Dynamic code |
| `es8388_set_output_select` | Statement | VAR(field_variable), OUTPUT(dropdown) | `es8388_set_output_select(variables_get($es8388), OUT1)` | Dynamic code |
| `es8388_set_alc_mode` | Statement | VAR(field_variable), ALC_MODE(dropdown) | `es8388_set_alc_mode(variables_get($es8388), DISABLE)` | Dynamic code |
| `es8388_analog_bypass` | Statement | VAR(field_variable), BYPASS(dropdown) | `es8388_analog_bypass(variables_get($es8388), TRUE)` | Dynamic code |
| `es8388_scan_i2c` | Statement | VAR(field_variable) | `es8388_scan_i2c(variables_get($es8388))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MUTE | TRUE, FALSE | es8388_dac_mute |
| INPUT | IN1, IN2, IN1DIFF, IN2DIFF | es8388_set_input_select |
| OUTPUT | OUT1, OUT2, OUTALL | es8388_set_output_select |
| ALC_MODE | DISABLE, GENERIC, VOICE, MUSIC | es8388_set_alc_mode |
| BYPASS | TRUE, FALSE | es8388_analog_bypass |

## ABS Examples

### Basic Usage
```
arduino_setup()
    es8388_create("es8388", math_number(0), math_number(0), math_number(9600))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, es8388_is_recording(variables_get($es8388)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `es8388_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

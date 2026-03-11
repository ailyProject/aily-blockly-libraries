# ESP32蓝牙音频

ESP32蓝牙A2DP音频传输库,支持音频接收器和发送器

## Library Info
- **Name**: @aily-project/lib-esp32-a2dp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `a2dp_sink_create` | Statement | VAR(field_input), OUTPUT_TYPE(dropdown) | `a2dp_sink_create("a2dp_sink", I2S)` | `` |
| `a2dp_sink_start` | Statement | VAR(field_variable), NAME(input_value) | `a2dp_sink_start(variables_get($a2dp_sink), math_number(0))` | (dynamic code) |
| `a2dp_sink_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `a2dp_sink_set_volume(variables_get($a2dp_sink), math_number(0))` | (dynamic code) |
| `a2dp_sink_get_volume` | Value | VAR(field_variable) | `a2dp_sink_get_volume(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_play` | Statement | VAR(field_variable) | `a2dp_sink_play(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_pause` | Statement | VAR(field_variable) | `a2dp_sink_pause(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_stop` | Statement | VAR(field_variable) | `a2dp_sink_stop(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_next` | Statement | VAR(field_variable) | `a2dp_sink_next(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_previous` | Statement | VAR(field_variable) | `a2dp_sink_previous(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_sink_on_metadata` | Statement | VAR(field_variable) | `a2dp_sink_on_metadata(variables_get($a2dp_sink))` | `` |
| `a2dp_sink_on_connection_state` | Statement | VAR(field_variable) | `a2dp_sink_on_connection_state(variables_get($a2dp_sink))` | `` |
| `a2dp_sink_on_audio_state` | Statement | VAR(field_variable) | `a2dp_sink_on_audio_state(variables_get($a2dp_sink))` | `` |
| `a2dp_sink_get_audio_state` | Value | VAR(field_variable) | `a2dp_sink_get_audio_state(variables_get($a2dp_sink))` | (dynamic code) |
| `a2dp_source_create` | Statement | VAR(field_input) | `a2dp_source_create("a2dp_source")` | `` |
| `a2dp_source_start` | Statement | VAR(field_variable), TARGET_NAME(input_value) | `a2dp_source_start(variables_get($a2dp_source), math_number(0))` | (dynamic code) |
| `a2dp_source_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `a2dp_source_set_volume(variables_get($a2dp_source), math_number(0))` | (dynamic code) |
| `a2dp_source_on_data_callback` | Statement | VAR(field_variable) | `a2dp_source_on_data_callback(variables_get($a2dp_source))` | `` |
| `a2dp_source_set_auto_reconnect` | Statement | VAR(field_variable), ENABLE(dropdown) | `a2dp_source_set_auto_reconnect(variables_get($a2dp_source), TRUE)` | (dynamic code) |
| `a2dp_audio_state_started` | Value | (none) | `a2dp_audio_state_started()` | `ESP_A2D_AUDIO_STATE_STARTED` |
| `a2dp_audio_state_stopped` | Value | (none) | `a2dp_audio_state_stopped()` | `ESP_A2D_AUDIO_STATE_STOPPED` |
| `a2dp_audio_state_remote_suspend` | Value | (none) | `a2dp_audio_state_remote_suspend()` | `ESP_A2D_AUDIO_STATE_REMOTE_SUSPEND` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OUTPUT_TYPE | I2S, INTERNAL_DAC | I2S外部DAC / 内置DAC |
| ENABLE | TRUE, FALSE | 启用 / 禁用 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    a2dp_sink_create("a2dp_sink", I2S)
    a2dp_source_create("a2dp_source")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, a2dp_sink_get_volume(variables_get($a2dp_sink)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `a2dp_sink_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

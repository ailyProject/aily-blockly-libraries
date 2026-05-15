# ESP32 Bluetooth Audio

ESP32 Bluetooth A2DP audio transmission library, supports audio receivers and transmitters

## Library Info
- **Name**: @aily-project/lib-esp32-a2dp
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `a2dp_sink_create` | Statement | VAR(field_input), OUTPUT_TYPE(dropdown) | `a2dp_sink_create("a2dp_sink", I2S)` | Dynamic code |
| `a2dp_sink_start` | Statement | VAR(field_variable), NAME(input_value) | `a2dp_sink_start(variables_get($a2dp_sink), text("value"))` | Dynamic code |
| `a2dp_sink_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `a2dp_sink_set_volume(variables_get($a2dp_sink), math_number(0))` | Dynamic code |
| `a2dp_sink_get_volume` | Value | VAR(field_variable) | `a2dp_sink_get_volume(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_play` | Statement | VAR(field_variable) | `a2dp_sink_play(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_pause` | Statement | VAR(field_variable) | `a2dp_sink_pause(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_stop` | Statement | VAR(field_variable) | `a2dp_sink_stop(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_next` | Statement | VAR(field_variable) | `a2dp_sink_next(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_previous` | Statement | VAR(field_variable) | `a2dp_sink_previous(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_sink_on_metadata` | Hat | VAR(field_variable), ID_VAR(field_variable), TEXT_VAR(field_variable), HANDLER(input_statement) | `a2dp_sink_on_metadata(variables_get($a2dp_sink), variables_get($metadata_id), variables_get($metadata_text)) @HANDLER: child_block()` | Dynamic code |
| `a2dp_sink_on_connection_state` | Hat | VAR(field_variable), STATE_VAR(field_variable), HANDLER(input_statement) | `a2dp_sink_on_connection_state(variables_get($a2dp_sink), variables_get($conn_state)) @HANDLER: child_block()` | Dynamic code |
| `a2dp_sink_on_audio_state` | Hat | VAR(field_variable), STATE_VAR(field_variable), HANDLER(input_statement) | `a2dp_sink_on_audio_state(variables_get($a2dp_sink), variables_get($audio_state)) @HANDLER: child_block()` | Dynamic code |
| `a2dp_sink_get_audio_state` | Value | VAR(field_variable) | `a2dp_sink_get_audio_state(variables_get($a2dp_sink))` | Dynamic code |
| `a2dp_source_create` | Statement | VAR(field_input) | `a2dp_source_create("a2dp_source")` | Dynamic code |
| `a2dp_source_start` | Statement | VAR(field_variable), TARGET_NAME(input_value) | `a2dp_source_start(variables_get($a2dp_source), text("value"))` | Dynamic code |
| `a2dp_source_set_volume` | Statement | VAR(field_variable), VOLUME(input_value) | `a2dp_source_set_volume(variables_get($a2dp_source), math_number(0))` | Dynamic code |
| `a2dp_source_on_data_callback` | Hat | VAR(field_variable), FRAME_VAR(field_variable), COUNT_VAR(field_variable), HANDLER(input_statement) | `a2dp_source_on_data_callback(variables_get($a2dp_source), variables_get($frame), variables_get($frame_count)) @HANDLER: child_block()` | Dynamic code |
| `a2dp_source_set_auto_reconnect` | Statement | VAR(field_variable), ENABLE(dropdown) | `a2dp_source_set_auto_reconnect(variables_get($a2dp_source), TRUE)` | Dynamic code |
| `a2dp_audio_state_started` | Value | (none) | `a2dp_audio_state_started()` | ESP_A2D_AUDIO_STATE_STARTED |
| `a2dp_audio_state_stopped` | Value | (none) | `a2dp_audio_state_stopped()` | ESP_A2D_AUDIO_STATE_STOPPED |
| `a2dp_audio_state_remote_suspend` | Value | (none) | `a2dp_audio_state_remote_suspend()` | ESP_A2D_AUDIO_STATE_REMOTE_SUSPEND |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OUTPUT_TYPE | I2S, INTERNAL_DAC | a2dp_sink_create |
| ENABLE | TRUE, FALSE | a2dp_source_set_auto_reconnect |

## ABS Examples

### Basic Usage
```
arduino_setup()
    a2dp_sink_create("a2dp_sink", I2S)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, a2dp_sink_get_volume(variables_get($a2dp_sink)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `a2dp_sink_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

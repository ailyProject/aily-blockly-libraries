# Xiaomi MiMo AI

Xiaomi MiMo AI large model API library. Supports text dialogue, image understanding, audio understanding, video understanding and speech synthesis. Suitable for ESP32 and other WiFi-enabled boards.

## Library Info
- **Name**: @aily-project/lib-xiaomi-mimo
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mimo_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `mimo_config(text("value"), text("value"))` | Dynamic code |
| `mimo_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `mimo_chat(text("value"), mimo-v2.5)` | mimo_simple_request( |
| `mimo_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `mimo_chat_with_history(text("value"), mimo-v2.5)` | mimo_simple_request( |
| `mimo_clear_history` | Statement | (none) | `mimo_clear_history()` | mimo_history = |
| `mimo_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `mimo_set_system_prompt(text("value"))` | mimo_system_prompt = |
| `mimo_image_understand_url` | Value | IMAGE_URL(input_value), MESSAGE(input_value) | `mimo_image_understand_url(text("value"), text("value"))` | mimo_image_url_request( |
| `mimo_image_understand_base64` | Value | IMAGE_BASE64(input_value), MESSAGE(input_value) | `mimo_image_understand_base64(text("value"), text("value"))` | mimo_image_base64_request( |
| `mimo_image_understand_capture` | Value | MESSAGE(input_value) | `mimo_image_understand_capture(text("value"))` | mimo_image_capture_request( |
| `mimo_audio_understand` | Value | AUDIO_URL(input_value), MESSAGE(input_value) | `mimo_audio_understand(text("value"), text("value"))` | mimo_audio_request( |
| `mimo_audio_understand_base64` | Value | AUDIO_BASE64(input_value), MESSAGE(input_value) | `mimo_audio_understand_base64(text("value"), text("value"))` | mimo_audio_base64_request( |
| `mimo_video_understand` | Value | VIDEO_URL(input_value), MESSAGE(input_value), FPS(dropdown) | `mimo_video_understand(text("value"), text("value"), "2")` | mimo_video_request( |
| `mimo_video_understand_base64` | Value | VIDEO_BASE64(input_value), MESSAGE(input_value), FPS(dropdown) | `mimo_video_understand_base64(text("value"), text("value"), "2")` | mimo_video_base64_request( |
| `mimo_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts(text("value"), mimo_default, mimo-v2.5-tts)` | mimo_tts_request( |
| `mimo_tts_with_style` | Value | TEXT(input_value), VOICE(dropdown), STYLE(input_value), MODEL(dropdown) | `mimo_tts_with_style(text("value"), mimo_default, text("value"), mimo-v2.5-tts)` | mimo_tts_with_style_request( |
| `mimo_tts_voice_design` | Value | VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_voice_design(text("value"), text("value"))` | mimo_tts_voice_design_request( |
| `mimo_play_tts` | Statement | VAR(field_variable), BASE64_AUDIO(input_value) | `mimo_play_tts(variables_get($i2s), text("value"))` | mimo_play_base64_wav( |
| `mimo_tts_and_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts_and_play(variables_get($i2s), text("value"), mimo_default, mimo-v2.5-tts)` | Dynamic code |
| `mimo_tts_and_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value), MODEL(dropdown) | `mimo_tts_and_play_with_style(variables_get($i2s), text("value"), mimo_default, text("value"), mimo-v2.5-tts)` | Dynamic code |
| `mimo_tts_and_play_voice_design` | Statement | VAR(field_variable), VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_and_play_voice_design(variables_get($i2s), text("value"), text("value"))` | Dynamic code |
| `mimo_tts_stream_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown) | `mimo_tts_stream_play(variables_get($i2s), text("value"), mimo_default)` | mimo_tts_stream_play_impl( |
| `mimo_tts_stream_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value) | `mimo_tts_stream_play_with_style(variables_get($i2s), text("value"), mimo_default, text("value"))` | mimo_tts_stream_play_with_style_impl( |
| `mimo_get_response_status` | Value | (none) | `mimo_get_response_status()` | mimo_last_success |
| `mimo_get_error_message` | Value | (none) | `mimo_get_error_message()` | mimo_last_error |
| `mimo_set_stream_callback` | Statement | CALLBACK(input_statement) | `mimo_set_stream_callback() @CALLBACK: child_block()` | mimo_stream_callback = mimo_user_stream_callback;\n |
| `mimo_get_stream_chunk` | Value | (none) | `mimo_get_stream_chunk()` | mimo_stream_chunk |
| `mimo_clear_stream_callback` | Statement | (none) | `mimo_clear_stream_callback()` | mimo_stream_callback = NULL;\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | mimo-v2.5, mimo-v2-omni | mimo_chat, mimo_chat_with_history |
| FPS | 2, 1, 5, 10 | mimo_video_understand, mimo_video_understand_base64 |
| VOICE | mimo_default, default_zh, default_en, 冰糖, 茉莉, 苏打, 白桦, Mia, Chloe, Milo, Dean | mimo_tts, mimo_tts_with_style, mimo_tts_and_play |
| MODEL | mimo-v2.5-tts, mimo-v2-tts | mimo_tts, mimo_tts_with_style, mimo_tts_and_play |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mimo_config(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mimo_chat(text("value"), mimo-v2.5))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

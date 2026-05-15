# Tongyi Qianwen

Alibaba Cloud Tongyi Qwen large language model API library supports text dialogue, multi-round dialogue, image understanding, image generation, TTS speech synthesis, omni-modal dialogue (text+audio) and other function...

## Library Info
- **Name**: @aily-project/lib-qwen-omni
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwen_omni_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `qwen_omni_config(text("value"), text("value"))` | Dynamic code |
| `qwen_omni_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat(text("value"), qwen-turbo)` | qwen_simple_request("...", ..., false) |
| `qwen_omni_chat_simple` | Value | MESSAGE(input_value) | `qwen_omni_chat_simple(text("value"))` | qwen_simple_request("qwen-turbo", ..., false) |
| `qwen_omni_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_thinking(text("value"), qwen3-max)` | qwen_simple_request("...", ..., true) |
| `qwen_omni_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_history(text("value"), qwen-turbo)` | qwen_history_request("...", ...) |
| `qwen_omni_clear_history` | Statement | (none) | `qwen_omni_clear_history()` | qwen_chat_history = |
| `qwen_omni_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `qwen_omni_set_system_prompt(text("value"))` | qwen_system_prompt = ...;\n |
| `qwen_omni_get_response_status` | Value | (none) | `qwen_omni_get_response_status()` | qwen_last_success |
| `qwen_omni_get_error_message` | Value | (none) | `qwen_omni_get_error_message()` | qwen_last_error |
| `qwen_omni_set_stream_callback` | Statement | CALLBACK(input_statement) | `qwen_omni_set_stream_callback() @CALLBACK: child_block()` | qwen_stream_callback = qwen_user_stream_callback;\n |
| `qwen_omni_get_stream_chunk` | Value | (none) | `qwen_omni_get_stream_chunk()` | qwen_stream_chunk |
| `qwen_omni_clear_stream_callback` | Statement | (none) | `qwen_omni_clear_stream_callback()` | qwen_stream_callback = NULL;\n |
| `qwen_omni_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat(text("value"), text("value"), qwen3-vl-plus)` | qwen_vision_request("...", ..., ...) |
| `qwen_omni_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat_direct_capture(text("value"), qwen3-vl-plus)` | qwen_vision_direct_capture_request("...", ...) |
| `qwen_omni_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_url_chat(text("value"), text("value"), qwen3-vl-plus)` | qwen_vision_url_request("...", ..., ...) |
| `qwen_omni_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `qwen_omni_image_generate(text("value"), wanx2.1-t2i-turbo, "1024*1024")` | qwen_image_generate("...", ..., "...") |
| `qwen_omni_image_generate_simple` | Value | PROMPT(input_value) | `qwen_omni_image_generate_simple(text("value"))` | qwen_image_generate("wanx2.1-t2i-turbo", ..., "1024*1024") |
| `qwen_omni_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts(text("value"), Cherry, qwen3-tts-flash, Chinese)` | qwen_tts_request_v2(..., "...", "...", "...") |
| `qwen_omni_tts_play` | Statement | VAR(field_variable), BASE64_AUDIO(input_value) | `qwen_omni_tts_play(variables_get($i2s), text("value"))` | qwen_play_base64_pcm(..., ...);\n |
| `qwen_omni_tts_and_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_and_play(variables_get($i2s), text("value"), Cherry, qwen3-tts-flash, Chinese)` | Dynamic code |
| `qwen_omni_tts_stream_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_stream_play(variables_get($i2s), text("value"), Cherry, qwen3-tts-flash, Chinese)` | qwen_tts_stream_play_impl_v2( |
| `qwen_omni_omni_text` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_omni_text(text("value"), qwen3.5-omni-plus)` | qwen_omni_text_request("...", ...) |
| `qwen_omni_omni_and_play` | Statement | VAR(field_variable), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_and_play(variables_get($i2s), text("value"), qwen3.5-omni-plus, Tina)` | qwen_omni_and_play_request_v2( |
| `qwen_omni_omni_stream_play` | Statement | VAR(field_variable), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_stream_play(variables_get($i2s), text("value"), qwen3.5-omni-plus, Tina)` | qwen_omni_stream_play_request_v2( |
| `qwen_omni_omni_get_audio` | Value | (none) | `qwen_omni_omni_get_audio()` | qwen_omni_audio_data |
| `qwen_omni_tts_voice_design` | Statement | VAR(field_variable), TEXT(input_value), VOICE_DESC(input_value) | `qwen_omni_tts_voice_design(variables_get($i2s), text("value"), text("value"))` | qwen_tts_voice_design_request( |
| `qwen_omni_omni_voice_chat` | Statement | VAR(field_variable), DURATION(input_value), MODEL(dropdown), VOICE(dropdown), PROMPT(input_value) | `qwen_omni_omni_voice_chat(variables_get($i2s), math_number(1000), qwen3.5-omni-plus, Chelsie, text("value"))` | qwen_omni_voice_chat_request( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | qwen-turbo, qwen-plus, qwen-max, qwen-long, qwen3-max, qwen-omni-turbo, qwen3-omni-flash | qwen_omni_chat, qwen_omni_chat_with_history |
| MODEL | qwen3-max, qwen3-max-preview | qwen_omni_chat_with_thinking |
| MODEL | qwen3-vl-plus, qwen3-vl-flash, qwen-vl-max, qwen-vl-plus | qwen_omni_vision_chat, qwen_omni_vision_chat_direct_capture, qwen_omni_vision_url_chat |
| MODEL | wanx2.1-t2i-turbo, wanx2.1-t2i-plus, wanx-v1 | qwen_omni_image_generate |
| SIZE | 1024*1024, 720*1280, 1280*720 | qwen_omni_image_generate |
| VOICE | Cherry, Ethan, Chelsie, Serena, Chelsie, Dylan, Jada, Sunny | qwen_omni_tts |
| MODEL | qwen3-tts-flash, qwen3-tts-instruct-flash, qwen-tts | qwen_omni_tts, qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| LANGUAGE | Chinese, English, Japanese, Korean, French, German, Spanish, Russian, Portuguese, Italian | qwen_omni_tts, qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| VOICE | Cherry, Ethan, Chelsie, Serena, Dylan, Jada, Sunny | qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| MODEL | qwen3.5-omni-plus, qwen3-omni-flash, qwen-omni-turbo | qwen_omni_omni_text, qwen_omni_omni_and_play, qwen_omni_omni_stream_play |
| VOICE | Tina, Ethan, Serena, Raymond, Cindy, Liora Mira, Sunnybobi, Theo Calm, Harvey, Maia, Evan, Momo, Dylan, Sunny | qwen_omni_omni_and_play, qwen_omni_omni_stream_play |
| VOICE | Chelsie, Ethan, Aria, Cindy | qwen_omni_omni_voice_chat |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwen_omni_config(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwen_omni_chat(text("value"), qwen-turbo))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

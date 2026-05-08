# 小米MiMo AI

小米MiMo AI大模型API库，支持文字对话、图片理解、音频理解、视频理解和语音合成等功能，适用于ESP32等支持WiFi的开发板

## Library Info
- **Name**: @aily-project/lib-xiaomi-mimo
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mimo_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `mimo_config(text("key"), text("url"))` | (dynamic code) |
| `mimo_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `mimo_chat(text("hello"), mimo-v2.5)` | `mimo_simple_request(` |
| `mimo_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `mimo_chat_with_history(text("hello"), mimo-v2.5)` | `mimo_simple_request(` |
| `mimo_clear_history` | Statement | (none) | `mimo_clear_history()` | `mimo_history =` |
| `mimo_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `mimo_set_system_prompt(text("..."))` | `mimo_system_prompt = ...;\n` |
| `mimo_image_understand_url` | Value | IMAGE_URL(input_value), MESSAGE(input_value) | `mimo_image_understand_url(text("url"), text("describe"))` | `mimo_image_url_request(` |
| `mimo_image_understand_base64` | Value | IMAGE_BASE64(input_value), MESSAGE(input_value) | `mimo_image_understand_base64(text("b64"), text("describe"))` | `mimo_image_base64_request(` |
| `mimo_image_understand_capture` | Value | MESSAGE(input_value) | `mimo_image_understand_capture(text("describe"))` | `mimo_image_capture_request(` |
| `mimo_audio_understand` | Value | AUDIO_URL(input_value), MESSAGE(input_value) | `mimo_audio_understand(text("url"), text("describe"))` | `mimo_audio_request(` |
| `mimo_audio_understand_base64` | Value | AUDIO_BASE64(input_value), MESSAGE(input_value) | `mimo_audio_understand_base64(text("b64"), text("describe"))` | `mimo_audio_base64_request(` |
| `mimo_video_understand` | Value | VIDEO_URL(input_value), MESSAGE(input_value), FPS(dropdown) | `mimo_video_understand(text("url"), text("describe"), 2)` | `mimo_video_request(` |
| `mimo_video_understand_base64` | Value | VIDEO_BASE64(input_value), MESSAGE(input_value), FPS(dropdown) | `mimo_video_understand_base64(text("b64"), text("describe"), 2)` | `mimo_video_base64_request(` |
| `mimo_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts(text("hello"), 冰糖, mimo-v2.5-tts)` | `mimo_tts_request(` |
| `mimo_tts_with_style` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown), STYLE(input_value) | `mimo_tts_with_style(text("hello"), 冰糖, mimo-v2.5-tts, text("happy"))` | `mimo_tts_with_style_request(` |
| `mimo_tts_voice_design` | Value | VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_voice_design(text("young female"), text("hello"))` | `mimo_tts_voice_design_request(` |
| `mimo_play_tts` | Statement | VAR(field_variable), BASE64_AUDIO(input_value) | `mimo_play_tts(i2s, text("base64-audio"))` | `mimo_play_base64_wav(` |
| `mimo_tts_and_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts_and_play(i2s, text("hello"), 冰糖, mimo-v2.5-tts)` | `{ _ttsData = mimo_tts_request(...) ...` |
| `mimo_tts_and_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), STYLE(input_value) | `mimo_tts_and_play_with_style(i2s, text("hello"), 冰糖, mimo-v2.5-tts, text("happy"))` | `{ _ttsData = mimo_tts_with_style_request(...) ...` |
| `mimo_tts_and_play_voice_design` | Statement | VAR(field_variable), VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_and_play_voice_design(i2s, text("young female"), text("hello"))` | `{ _ttsData = mimo_tts_voice_design_request(...) ...` |
| `mimo_tts_stream_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown) | `mimo_tts_stream_play(i2s, text("hello"), mimo_default)` | `mimo_tts_stream_play_impl(` |
| `mimo_tts_stream_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value) | `mimo_tts_stream_play_with_style(i2s, text("hello"), mimo_default, text("happy"))` | `mimo_tts_stream_play_with_style_impl(` |
| `mimo_get_response_status` | Value | (none) | `mimo_get_response_status()` | `mimo_last_success` |
| `mimo_get_error_message` | Value | (none) | `mimo_get_error_message()` | `mimo_last_error` |
| `mimo_set_stream_callback` | Statement | CALLBACK(input_statement) | `mimo_set_stream_callback()` @CALLBACK: ... | `mimo_stream_callback = mimo_user_stream_callback;\n` |
| `mimo_get_stream_chunk` | Value | (none) | `mimo_get_stream_chunk()` | `mimo_stream_chunk` |
| `mimo_clear_stream_callback` | Statement | (none) | `mimo_clear_stream_callback()` | `mimo_stream_callback = NULL;\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | mimo-v2.5, mimo-v2-omni | mimo-v2.5 (多模态) / mimo-v2-omni (全能) |
| MODEL (TTS) | mimo-v2.5-tts, mimo-v2-tts | mimo-v2.5-tts (完整WAV) / mimo-v2-tts (流式PCM16) |
| VOICE | mimo_default, default_zh, default_en, 冰糖, 茉莉, 苏打, 白桦, Mia, Chloe, Milo, Dean | V2/V2.5预置音色 |
| FPS | 2, 1, 5, 10 | 视频抽帧率 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mimo_config(text("your-api-key"), text("https://api.xiaomimimo.com/v1"))

arduino_loop()
    serial_println(Serial, mimo_chat(text("hello"), mimo-v2.5))
    time_delay(math_number(5000))
```

### Image Understanding
```
arduino_loop()
    serial_println(Serial, mimo_image_understand_url(text("https://example.com/image.jpg"), text("describe this image")))
    time_delay(math_number(10000))
```

### Speech Synthesis
```
arduino_loop()
    serial_println(Serial, mimo_tts(text("Hello world"), 冰糖))
    time_delay(math_number(10000))
```

### TTS with I2S Playback
```
arduino_setup()
    i2s_create(i2s)
    i2s_set_pins_std(i2s, 26, 25, 22, -1, -1)
    i2s_begin(i2s, TX, 24000, _16BIT, MONO, LEFT)

arduino_loop()
    mimo_tts_and_play(i2s, text("Hello world"), 冰糖)
    time_delay(math_number(10000))
```

### TTS with Style and I2S Playback
```
arduino_loop()
    mimo_tts_and_play_with_style(i2s, text("今天天气真好"), 冰糖, mimo-v2.5-tts, text("用开心活泼的语气"))
    time_delay(math_number(10000))
```

### Stream TTS with I2S Playback (Low Latency)
```
arduino_loop()
    mimo_tts_stream_play(i2s, text("你好，欢迎使用流式语音合成"), mimo_default)
    time_delay(math_number(10000))
```

### Stream TTS with Style
```
arduino_loop()
    mimo_tts_stream_play_with_style(i2s, text("今天天气真不错"), mimo_default, text("用开心活泼的语气"))
    time_delay(math_number(10000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
3. **WiFi Required**: WiFi must be connected before API calls
4. **API Key**: Requires valid Xiaomi MiMo API Key from platform.xiaomimimo.com
5. **Model Selection**: mimo-v2.5 for general use, mimo-v2-omni for full multimodal
6. **Image Formats**: JPEG, PNG, GIF, WebP, BMP
7. **Audio Formats**: MP3, WAV, FLAC, M4A, OGG
8. **Video Formats**: MP4, MOV, AVI, WMV
9. **TTS Output**: Returns Base64 encoded WAV audio data (24kHz 16bit mono)
10. **TTS I2S Play**: Use `mimo_tts_and_play` blocks to auto-decode Base64 WAV and play via I2S; requires esp32_i2s library and I2S object initialized at 24kHz/16bit/mono
11. **WAV Header Parse**: The play functions auto-parse WAV header to extract sample rate, bit depth, channels, then reconfigure I2S accordingly
12. **Stream Callback**: Use mimo_set_stream_callback to receive text chunks in real-time
13. **Stream TTS Play**: `mimo_tts_stream_play` uses mimo-v2-tts with PCM16 format, receives base64-encoded PCM chunks via SSE and writes directly to I2S - no WAV header parsing needed, lower latency
14. **TTS Model Selection**: `mimo-v2.5-tts` returns complete WAV after synthesis; `mimo-v2-tts` supports streaming with PCM16 chunks for real-time playback

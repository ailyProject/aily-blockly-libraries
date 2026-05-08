# 通义千问

阿里云通义千问Qwen大语言模型API库，支持文字对话、多轮对话、图片理解、图像生成等功能，适用于ESP32等支持WiFi的开发板

## Library Info
- **Name**: @aily-project/lib-qwen-omni
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwen_omni_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `qwen_omni_config(math_number(0), math_number(0))` | (dynamic code) |
| `qwen_omni_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat(text("hello"), qwen-turbo)` | `qwen_simple_request(` |
| `qwen_omni_chat_simple` | Value | MESSAGE(input_value) | `qwen_omni_chat_simple(text("hello"))` | `qwen_simple_request(` |
| `qwen_omni_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_thinking(text("hello"), qwen3-max)` | `qwen_simple_request(` |
| `qwen_omni_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_history(text("hello"), qwen-turbo)` | `qwen_history_request(` |
| `qwen_omni_clear_history` | Statement | (none) | `qwen_omni_clear_history()` | `qwen_chat_history =` |
| `qwen_omni_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `qwen_omni_set_system_prompt(math_number(0))` | `qwen_system_prompt = ...;\n` |
| `qwen_omni_get_response_status` | Value | (none) | `qwen_omni_get_response_status()` | `qwen_last_success` |
| `qwen_omni_get_error_message` | Value | (none) | `qwen_omni_get_error_message()` | `qwen_last_error` |
| `qwen_omni_set_stream_callback` | Statement | CALLBACK(input_statement) | `qwen_omni_set_stream_callback()` @CALLBACK: ... | `qwen_stream_callback = qwen_user_stream_callback;\n` |
| `qwen_omni_get_stream_chunk` | Value | (none) | `qwen_omni_get_stream_chunk()` | `qwen_stream_chunk` |
| `qwen_omni_clear_stream_callback` | Statement | (none) | `qwen_omni_clear_stream_callback()` | `qwen_stream_callback = NULL;\n` |
| `qwen_omni_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat(math_number(0), text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat_direct_capture(text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_url_chat(math_number(0), text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `qwen_omni_image_generate(math_number(0), wanx2.1-t2i-turbo, 1024*1024)` | (dynamic code) |
| `qwen_omni_image_generate_simple` | Value | PROMPT(input_value) | `qwen_omni_image_generate_simple(math_number(0))` | (dynamic code) |
| `qwen_omni_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts(text("hello"), Cherry, qwen3-tts-flash, Chinese)` | `qwen_tts_request(` |
| `qwen_omni_tts_play` | Statement | I2S_OBJ(input_value), AUDIO(input_value) | `qwen_omni_tts_play(math_number(0), text("base64..."))` | `qwen_play_base64_pcm(` |
| `qwen_omni_tts_and_play` | Statement | I2S_OBJ(input_value), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_and_play(math_number(0), text("hello"), Cherry, qwen3-tts-flash, Chinese)` | (dynamic code) |
| `qwen_omni_tts_stream_play` | Statement | I2S_OBJ(input_value), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_stream_play(math_number(0), text("hello"), Cherry, qwen3-tts-flash, Chinese)` | (dynamic code) |
| `qwen_omni_tts_voice_design` | Statement | I2S_OBJ(input_value), TEXT(input_value), VOICE_DESC(input_value) | `qwen_omni_tts_voice_design(math_number(0), text("hello"), text("温柔女声"))` | (dynamic code) |
| `qwen_omni_omni_text` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_omni_text(text("hello"), qwen3.5-omni-plus)` | `qwen_omni_text_request(` |
| `qwen_omni_omni_and_play` | Statement | I2S_OBJ(input_value), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_and_play(math_number(0), text("hello"), qwen3.5-omni-plus, Tina)` | (dynamic code) |
| `qwen_omni_omni_stream_play` | Statement | I2S_OBJ(input_value), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_stream_play(math_number(0), text("hello"), qwen3.5-omni-plus, Tina)` | (dynamic code) |
| `qwen_omni_omni_get_audio` | Value | (none) | `qwen_omni_omni_get_audio()` | `qwen_omni_audio_data` |
| `qwen_omni_omni_voice_chat` | Statement | VAR(field_variable), DURATION(input_value), MODEL(dropdown), VOICE(dropdown), PROMPT(input_value) | `qwen_omni_omni_voice_chat($i2s, math_number(3), qwen2.5-omni-7b, Chelsie, text("描述一下"))` | `qwen_omni_voice_chat_request(i2s, "qwen2.5-omni-7b", "Chelsie", "描述一下", 3);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | qwen-turbo, qwen-plus, qwen-max, qwen-long, qwen3-max, qwen-omni-turbo, qwen3-omni-flash | qwen-turbo (快速) / qwen-plus / qwen-max / qwen-long / qwen3-max / qwen-omni-turbo / qwen3-omni-flash |
| SIZE | 1024*1024, 720*1280, 1280*720 | 1024x1024 / 720x1280 / 1280x720 |
| TTS_MODEL | qwen3-tts-flash, qwen3-tts-instruct-flash, qwen-tts | qwen3-tts-flash (推荐) / qwen3-tts-instruct-flash (指令控制) / qwen-tts |
| TTS_VOICE | Cherry, Ethan, Chelsie, Serena, Dylan, Jada, Sunny | 甜美女声 / 阳光男声 / 温柔女声 / 甜美小姐姐 / 北京话 / 上海话 / 四川话 |
| TTS_LANGUAGE | Chinese, English, Japanese, Korean, French, German, Spanish, Russian, Portuguese, Italian | 语种选择 |
| OMNI_MODEL | qwen3.5-omni-plus, qwen3-omni-flash, qwen-omni-turbo | qwen3.5-omni-plus (推荐) / qwen3-omni-flash / qwen-omni-turbo |
| OMNI_VOICE | Tina, Ethan, Serena, Raymond, Cindy, Liora Mira, Sunnybobi, Theo Calm, Harvey, Maia, Evan, Momo, Dylan, Sunny | 全模态音色 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwen_omni_chat(text("hello"), qwen-turbo))
    time_delay(math_number(1000))
```

### TTS Synthesis & Play (requires I2S object)
```
arduino_setup()
    I2S_OBJ begin()
    qwen_omni_config(sk-key, https://dashscope.aliyuncs.com/compatible-mode/v1)

arduino_loop()
    qwen_omni_tts_stream_play(I2S_OBJ, text("你好世界"), Cherry, qwen3-tts-flash, Chinese)
```

### Omni Dialog with Audio (requires I2S object)
```
arduino_setup()
    I2S_OBJ begin()
    qwen_omni_config(sk-key, https://dashscope.aliyuncs.com/compatible-mode/v1)

arduino_loop()
    qwen_omni_omni_stream_play(I2S_OBJ, text("你好"), qwen3.5-omni-plus, Tina)
```

### TTS Voice Design
```
qwen_omni_tts_voice_design(I2S_OBJ, text("今天天气真好"), text("温柔的年轻女声，语速稍快"))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
3. **I2S**: TTS and Omni audio require an initialized I2S object (24kHz 16bit mono PCM)
4. **Streaming**: TTS stream play decodes and plays PCM chunks in real-time for lower latency

# Xiaomi MiMo AI

MiMo V2.5 API blocks for text and multimodal understanding, speech recognition, speech synthesis, voice design, voice cloning, I2S/ES8311 audio, and UNIHIKER K10 built-in audio.

## Library Info

- **Name**: @aily-project/lib-xiaomi-mimo
- **Version**: 1.2.0
- **Requires**: a WiFi connection and one `mimo_config` call before any MiMo cloud block

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mimo_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `mimo_config(text("api-key"), text("https://api.xiaomimimo.com/v1"))` | Dynamic configuration code |
| `mimo_k10_audio_init` | Statement | VAR(field_variable), SAMPLE_RATE(input_value) | `mimo_k10_audio_init(variables_get($i2s_k10), math_number(16000))` | `mimo_i2s_begin_k10_audio(` |
| `mimo_i2s_speaker_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), DIN(input_value), SAMPLE_RATE(input_value) | `mimo_i2s_speaker_init(variables_get($i2s_spk), math_number(15), math_number(16), math_number(7), math_number(24000))` | `mimo_i2s_begin_speaker(` |
| `mimo_i2s_mic_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), SD(input_value), SAMPLE_RATE(input_value) | `mimo_i2s_mic_init(variables_get($i2s_mic), math_number(5), math_number(4), math_number(6), math_number(16000))` | `mimo_i2s_begin_microphone(` |
| `mimo_pdm_mic_init` | Statement | VAR(field_variable), CLK(input_value), DATA(input_value), SAMPLE_RATE(input_value) | `mimo_pdm_mic_init(variables_get($i2s_mic), math_number(42), math_number(41), math_number(16000))` | `mimo_i2s_begin_pdm_microphone(` |
| `mimo_es8311_mic_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), SDOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value) | `mimo_es8311_mic_init(variables_get($i2s_mic), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(40), math_number(46), math_number(16000), math_number(36))` | `mimo_i2s_begin_es8311_microphone(` |
| `mimo_es8311_audio_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), DAC_DIN(input_value), ADC_DOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value), PA_EN(input_value) | `mimo_es8311_audio_init(variables_get($i2s_audio), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(38), math_number(40), math_number(46), math_number(16000), math_number(36), math_number(-1))` | `mimo_i2s_begin_es8311_audio(` |
| `mimo_i2s_prompt_tone` | Statement | VAR(field_variable), FREQ(input_value), DURATION(input_value) | `mimo_i2s_prompt_tone(variables_get($i2s_spk), math_number(1000), math_number(300))` | `mimo_play_prompt_tone(` |
| `mimo_i2s_record_text` | Value | MIC_VAR(field_variable), DURATION(input_value), MODEL(dropdown), PROMPT(input_value) | `mimo_i2s_record_text(variables_get($i2s_mic), math_number(3), mimo-v2.5, text("请简短回答"))` | `mimo_i2s_record_text_request(` |
| `mimo_i2s_asr` | Value | MIC_VAR(field_variable), DURATION(input_value), LANGUAGE(dropdown) | `mimo_i2s_asr(variables_get($i2s_mic), math_number(3), auto)` | `mimo_i2s_asr_request(` |
| `mimo_voice_chat` | Statement | MIC_VAR(field_variable), SPK_VAR(field_variable), DURATION(input_value), MODEL(dropdown), VOICE(dropdown), TTS_MODEL(dropdown), BEEP(field_checkbox), PROMPT(input_value) | `mimo_voice_chat(variables_get($i2s_mic), variables_get($i2s_spk), math_number(3), mimo-v2.5, mimo_default, mimo-v2.5-tts, TRUE, text("请简短回答"))` | `mimo_voice_chat_request(` |
| `mimo_chat` | Value | MESSAGE(input_value), MODEL(dropdown), THINKING(dropdown) | `mimo_chat(text("你好"), mimo-v2.5, disabled)` | `mimo_simple_request("...", ..., false, "...")` |
| `mimo_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown), THINKING(dropdown) | `mimo_chat_with_history(text("继续"), mimo-v2.5-pro, enabled)` | `mimo_simple_request("...", ..., true, "...")` |
| `mimo_clear_history` | Statement | (none) | `mimo_clear_history()` | `mimo_history = "";` |
| `mimo_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `mimo_set_system_prompt(text("请简短回答"))` | `mimo_system_prompt = ...;` |
| `mimo_image_understand_url` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `mimo_image_understand_url(text("https://example.com/image.jpg"), text("描述图片"), mimo-v2.5)` | `mimo_image_url_request(` |
| `mimo_image_understand_base64` | Value | IMAGE_BASE64(input_value), MESSAGE(input_value), MODEL(dropdown) | `mimo_image_understand_base64(text("base64-data"), text("描述图片"), mimo-v2.5)` | `mimo_image_base64_request(` |
| `mimo_image_understand_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `mimo_image_understand_capture(text("描述图片"), mimo-v2.5)` | `mimo_image_capture_request(` |
| `mimo_audio_understand` | Value | AUDIO_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `mimo_audio_understand(text("https://example.com/audio.wav"), text("总结音频"), mimo-v2.5)` | `mimo_audio_request(` |
| `mimo_audio_understand_base64` | Value | AUDIO_BASE64(input_value), MESSAGE(input_value), MODEL(dropdown) | `mimo_audio_understand_base64(text("base64-data"), text("总结音频"), mimo-v2.5)` | `mimo_audio_base64_request(` |
| `mimo_asr_base64` | Value | AUDIO_BASE64(input_value), FORMAT(dropdown), LANGUAGE(dropdown) | `mimo_asr_base64(text("base64-data"), wav, auto)` | `mimo_asr_base64_request(` |
| `mimo_video_understand` | Value | VIDEO_URL(input_value), MESSAGE(input_value), FPS(dropdown), MODEL(dropdown) | `mimo_video_understand(text("https://example.com/video.mp4"), text("总结视频"), 2, mimo-v2.5)` | `mimo_video_request(` |
| `mimo_video_understand_base64` | Value | VIDEO_BASE64(input_value), MESSAGE(input_value), FPS(dropdown), MODEL(dropdown) | `mimo_video_understand_base64(text("base64-data"), text("总结视频"), 2, mimo-v2.5)` | `mimo_video_base64_request(` |
| `mimo_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts(text("你好"), mimo_default, mimo-v2.5-tts)` | `mimo_tts_request(` |
| `mimo_tts_with_style` | Value | TEXT(input_value), VOICE(dropdown), STYLE(input_value), MODEL(dropdown) | `mimo_tts_with_style(text("你好"), 冰糖, text("开心、轻快地说"), mimo-v2.5-tts)` | `mimo_tts_with_style_request(` |
| `mimo_tts_voice_design` | Value | VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_voice_design(text("温暖清晰的青年女声"), text("你好"))` | `mimo_tts_voice_design_request(` |
| `mimo_tts_voice_clone` | Value | VOICE_AUDIO_BASE64(input_value), FORMAT(dropdown), STYLE(input_value), TEXT(input_value) | `mimo_tts_voice_clone(text("base64-data"), wav, text("自然、平静地说"), text("你好"))` | `mimo_tts_voice_clone_request(` |
| `mimo_play_tts` | Statement | VAR(field_variable), BASE64_AUDIO(input_value) | `mimo_play_tts(variables_get($i2s_spk), text("base64-audio"))` | `mimo_play_base64_audio_to_i2s(` |
| `mimo_tts_and_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `mimo_tts_and_play(variables_get($i2s_spk), text("你好"), mimo_default, mimo-v2.5-tts)` | Dynamic TTS request and playback |
| `mimo_tts_and_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value), MODEL(dropdown) | `mimo_tts_and_play_with_style(variables_get($i2s_spk), text("你好"), 冰糖, text("开心、轻快地说"), mimo-v2.5-tts)` | Dynamic styled TTS request and playback |
| `mimo_tts_and_play_voice_design` | Statement | VAR(field_variable), VOICE_DESC(input_value), TEXT(input_value) | `mimo_tts_and_play_voice_design(variables_get($i2s_spk), text("温暖清晰的青年女声"), text("你好"))` | Dynamic voice-design request and playback |
| `mimo_tts_and_play_voice_clone` | Statement | VAR(field_variable), VOICE_AUDIO_BASE64(input_value), FORMAT(dropdown), STYLE(input_value), TEXT(input_value) | `mimo_tts_and_play_voice_clone(variables_get($i2s_spk), text("base64-data"), wav, text("自然、平静地说"), text("你好"))` | Dynamic voice-clone request and playback |
| `mimo_tts_stream_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown) | `mimo_tts_stream_play(variables_get($i2s_spk), text("你好"), mimo_default)` | `mimo_tts_stream_play_impl(` |
| `mimo_tts_stream_play_with_style` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value) | `mimo_tts_stream_play_with_style(variables_get($i2s_spk), text("你好"), 冰糖, text("开心、轻快地说"))` | `mimo_tts_stream_play_with_style_impl(` |
| `mimo_get_response_status` | Value | (none) | `mimo_get_response_status()` | `mimo_last_success` |
| `mimo_get_error_message` | Value | (none) | `mimo_get_error_message()` | `mimo_last_error` |
| `mimo_set_stream_callback` | Statement | CALLBACK(input_statement) | `mimo_set_stream_callback() @CALLBACK: serial_print(Serial, mimo_get_stream_chunk())` | Installs `mimo_user_stream_callback` |
| `mimo_get_stream_chunk` | Value | (none) | `mimo_get_stream_chunk()` | `mimo_stream_chunk` |
| `mimo_clear_stream_callback` | Statement | (none) | `mimo_clear_stream_callback()` | `mimo_stream_callback = NULL;` |

## Current Model Mapping

| Capability | Model | Used By |
|------------|-------|---------|
| General and multimodal understanding | `mimo-v2.5` | Chat, image, audio, video, recorded voice understanding, voice chat |
| Higher-capability text chat | `mimo-v2.5-pro` | Chat and chat with history |
| Speech recognition | `mimo-v2.5-asr` | `mimo_i2s_asr`, `mimo_asr_base64` |
| Speech synthesis | `mimo-v2.5-tts` | Standard, styled, streaming, and voice-chat TTS |
| Voice design | `mimo-v2.5-tts-voicedesign` | Voice-design TTS blocks |
| Voice cloning | `mimo-v2.5-tts-voiceclone` | Voice-clone TTS blocks |

## Parameter Options

| Parameter | Values | Blocks / Meaning |
|-----------|--------|------------------|
| Chat MODEL | `mimo-v2.5`, `mimo-v2.5-pro` | `mimo_chat`, `mimo_chat_with_history` |
| THINKING | `disabled`, `enabled` | Sends `thinking.type` for chat and history |
| Multimodal MODEL | `mimo-v2.5` | `mimo_image_understand_url`, `mimo_image_understand_base64`, `mimo_image_understand_capture`, `mimo_audio_understand`, `mimo_audio_understand_base64`, `mimo_video_understand`, `mimo_video_understand_base64` |
| Recorded-understanding MODEL | `mimo-v2.5` | `mimo_i2s_record_text`, `mimo_voice_chat` |
| TTS MODEL / TTS_MODEL | `mimo-v2.5-tts` | Standard/styled TTS and voice chat |
| LANGUAGE | `auto`, `zh`, `en` | ASR automatic detection, Chinese, or English |
| FORMAT | `wav`, `mp3` | Base64 ASR and voice-clone sample format |
| FPS | `2`, `1`, `5`, `10` | Video sampling rate; `2` is the default |
| VOICE | `mimo_default`, `冰糖`, `茉莉`, `苏打`, `白桦`, `Mia`, `Chloe`, `Milo`, `Dean` | MiMo V2.5 TTS voices |
| BEEP | `TRUE`, `FALSE` | Play short prompt tones around voice capture |
| MIC_GAIN | `36` by default | Raw ES8311 ADC gain register (`0x24`) |
| PA_EN | `-1` or a GPIO number | `-1` means no GPIO-controlled external amplifier enable |

## ABS Examples

### Basic Chat

```text
arduino_setup()
    wifi_connect(text("ssid"), text("password"))
    mimo_config(text("api-key"), text("https://api.xiaomimimo.com/v1"))
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, mimo_chat(text("你好"), mimo-v2.5, disabled))
    time_delay(math_number(1000))
```

### UNIHIKER K10 Voice Chat

```text
arduino_setup()
    wifi_connect(text("ssid"), text("password"))
    mimo_config(text("api-key"), text("https://api.xiaomimimo.com/v1"))
    mimo_k10_audio_init(variables_get($i2s_k10), math_number(16000))

arduino_loop()
    mimo_voice_chat(variables_get($i2s_k10), variables_get($i2s_k10), math_number(3), mimo-v2.5, mimo_default, mimo-v2.5-tts, TRUE, text("请简短回答"))
```

The microphone and speaker fields intentionally reference the same `i2s_k10` object.

### UNIHIKER K10 Camera + MiMo Vision

This composition uses `@aily-project/lib-unihiker-k10-camera-ai` for capture and this library for understanding:

```text
arduino_setup()
    wifi_connect(text("ssid"), text("password"))
    mimo_config(text("api-key"), text("https://api.xiaomimimo.com/v1"))
    k10_camera_init()

arduino_loop()
    serial_println(Serial, mimo_image_understand_base64(k10_photo_base64(), text("描述画面")))
```

## Notes

1. **Required configuration**: call `mimo_config` exactly once, normally in setup after WiFi is available. All MiMo cloud blocks use that global API key and base URL.
2. **Parameter order**: ABS parameters follow the semantic `block.json` `args0` order exactly. Decorative `inputsInline` entries do not produce ABS parameters.
3. **Input values**: wrap primitives with `math_number(n)`, `text("s")`, or `logic_boolean(TRUE/FALSE)`; use `variables_get($name)` for variable fields.
4. **Thinking**: only text chat exposes `enabled`/`disabled`. Image, audio, video, ASR, and voice workflows use their fixed non-thinking request behavior.
5. **ASR input**: MiMo ASR accepts one `input_audio` item per request. `mimo_i2s_asr` records 16 kHz mono WAV; `mimo_asr_base64` accepts one WAV or MP3 Base64 sample and a language of `auto`, `zh`, or `en`.
6. **K10 audio**: call `mimo_k10_audio_init` once and use the same `i2s_k10` for microphone and speaker fields. Pins are fixed at BCLK `0`, LRCK `38`, mic `39`, speaker `45`, and MCLK `3`; recording converts stereo to 16 kHz mono and playback converts mono to stereo.
7. **K10 camera**: use `k10_camera_init` → `k10_photo_base64` → `mimo_image_understand_base64`. Do not use `mimo_image_understand_capture` for K10; K10 frames may be RGB565 and require the camera library's `frame2jpg` conversion before Base64 encoding.
8. **Styled TTS**: STYLE is a natural-language instruction such as `开心、轻快地说`. It is sent as the user message, while TEXT is sent as the assistant synthesis content; do not wrap the style in `<style>` tags.
9. **Voice design and cloning**: those blocks use their dedicated fixed models. A clone request contains one Base64 voice sample plus its `wav`/`mp3` format; STYLE may be an empty string.
10. **ES8311 shared audio**: initialize with `mimo_es8311_audio_init` and reuse its I2S variable for recording/playback. Address `24` is `0x18`; gain `36` is `0x24`.
11. **Prompt tone and playback**: `mimo_i2s_prompt_tone` and all playback blocks route through the initialized standard I2S, ES8311, or K10 audio mode. Streaming TTS always uses `mimo-v2.5-tts`.
12. **Error handling**: after a cloud block, read `mimo_get_response_status()` and `mimo_get_error_message()`. Stream callbacks read the current piece with `mimo_get_stream_chunk()`.

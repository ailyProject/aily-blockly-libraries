# Tongyi Qianwen

Alibaba Cloud Tongyi Qwen large language model API library supports text dialogue, multi-round dialogue, image understanding, image generation, TTS speech synthesis, omni-modal dialogue (text+audio) and other function...

## Library Info
- **Name**: @aily-project/lib-qwen-omni
- **Version**: 0.0.13

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwen_omni_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `qwen_omni_config(text("value"), text("value"))` | Dynamic code |
| `qwen_omni_k10_audio_init` | Statement | VAR(field_variable), SAMPLE_RATE(input_value) | `qwen_omni_k10_audio_init(variables_get($i2s_k10), math_number(16000))` | qwen_i2s_begin_k10_audio( |
| `qwen_omni_i2s_speaker_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), DIN(input_value), SAMPLE_RATE(input_value) | `qwen_omni_i2s_speaker_init(variables_get($i2s_spk), math_number(15), math_number(16), math_number(7), math_number(24000))` | qwen_i2s_begin_speaker( |
| `qwen_omni_i2s_mic_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), SD(input_value), SAMPLE_RATE(input_value) | `qwen_omni_i2s_mic_init(variables_get($i2s_mic), math_number(5), math_number(4), math_number(6), math_number(16000))` | qwen_i2s_begin_microphone( |
| `qwen_omni_pdm_mic_init` | Statement | VAR(field_variable), CLK(input_value), DATA(input_value), SAMPLE_RATE(input_value) | `qwen_omni_pdm_mic_init(variables_get($i2s_mic), math_number(42), math_number(41), math_number(16000))` | qwen_i2s_begin_pdm_microphone( |
| `qwen_omni_es8311_mic_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), SDOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value) | `qwen_omni_es8311_mic_init(variables_get($i2s_mic), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(40), math_number(46), math_number(16000), math_number(36))` | qwen_i2s_begin_es8311_microphone( |
| `qwen_omni_es8311_audio_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), DAC_DIN(input_value), ADC_DOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value), PA_EN(input_value) | `qwen_omni_es8311_audio_init(variables_get($i2s_audio), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(38), math_number(40), math_number(46), math_number(16000), math_number(36), math_number(-1))` | qwen_i2s_begin_es8311_audio( |
| `qwen_omni_i2s_prompt_tone` | Statement | VAR(field_variable), FREQ(input_value), DURATION(input_value) | `qwen_omni_i2s_prompt_tone(variables_get($i2s_spk), math_number(1000), math_number(300))` | qwen_play_prompt_tone( |
| `qwen_omni_es8311_test_tone` | Statement | VAR(field_variable), FREQ(input_value), DURATION(input_value) | `qwen_omni_es8311_test_tone(variables_get($i2s_audio), math_number(1000), math_number(300))` | qwen_play_prompt_tone( legacy-compatible alias; hidden from toolbox) |
| `qwen_omni_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat(text("value"), qwen3.7-plus)` | qwen_simple_request("...", ..., false) |
| `qwen_omni_chat_simple` | Value | MESSAGE(input_value) | `qwen_omni_chat_simple(text("value"))` | qwen_simple_request("qwen3.7-plus", ..., false) |
| `qwen_omni_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_thinking(text("value"), qwen3.7-max)` | qwen_simple_request("...", ..., true) |
| `qwen_omni_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_history(text("value"), qwen3.7-plus)` | qwen_history_request("...", ...) |
| `qwen_omni_clear_history` | Statement | (none) | `qwen_omni_clear_history()` | qwen_chat_history = |
| `qwen_omni_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `qwen_omni_set_system_prompt(text("value"))` | qwen_system_prompt = ...;\n |
| `qwen_omni_get_response_status` | Value | (none) | `qwen_omni_get_response_status()` | qwen_last_success |
| `qwen_omni_get_error_message` | Value | (none) | `qwen_omni_get_error_message()` | qwen_last_error |
| `qwen_omni_set_stream_callback` | Statement | CALLBACK(input_statement) | `qwen_omni_set_stream_callback() @CALLBACK: child_block()` | qwen_stream_callback = qwen_user_stream_callback;\n |
| `qwen_omni_get_stream_chunk` | Value | (none) | `qwen_omni_get_stream_chunk()` | qwen_stream_chunk |
| `qwen_omni_clear_stream_callback` | Statement | (none) | `qwen_omni_clear_stream_callback()` | qwen_stream_callback = NULL;\n |
| `qwen_omni_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat(text("value"), text("value"), qwen3.7-plus)` | qwen_vision_request("...", ..., ...) |
| `qwen_omni_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat_direct_capture(text("value"), qwen3.7-plus)` | qwen_vision_direct_capture_request("...", ...) |
| `qwen_omni_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_url_chat(text("value"), text("value"), qwen3.7-plus)` | qwen_vision_url_request("...", ..., ...) |
| `qwen_omni_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `qwen_omni_image_generate(text("value"), wanx2.1-t2i-turbo, "1024*1024")` | qwen_image_generate("...", ..., "...") |
| `qwen_omni_image_generate_simple` | Value | PROMPT(input_value) | `qwen_omni_image_generate_simple(text("value"))` | qwen_image_generate("wanx2.1-t2i-turbo", ..., "1024*1024") |
| `qwen_omni_tts` | Value | TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts(text("value"), Cherry, qwen3-tts-flash, Chinese)` | qwen_tts_request_v2(..., "...", "...", "...") |
| `qwen_omni_tts_play` | Statement | VAR(field_variable), BASE64_AUDIO(input_value) | `qwen_omni_tts_play(variables_get($i2s_spk), text("value"))` | qwen_play_base64_audio_to_i2s(..., ...);\n |
| `qwen_omni_tts_and_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_and_play(variables_get($i2s_spk), text("value"), Cherry, qwen3-tts-flash, Chinese)` | Dynamic code |
| `qwen_omni_tts_stream_play` | Statement | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), LANGUAGE(dropdown) | `qwen_omni_tts_stream_play(variables_get($i2s_spk), text("value"), Cherry, qwen3-tts-flash, Chinese)` | qwen_tts_stream_play_impl_v3( |
| `qwen_omni_omni_text` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_omni_text(text("value"), qwen3.5-omni-plus)` | qwen_omni_text_request("...", ...) |
| `qwen_omni_omni_and_play` | Statement | VAR(field_variable), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_and_play(variables_get($i2s_spk), text("value"), qwen3.5-omni-plus, Tina)` | qwen_omni_and_play_request_v3( |
| `qwen_omni_omni_stream_play` | Statement | VAR(field_variable), MESSAGE(input_value), MODEL(dropdown), VOICE(dropdown) | `qwen_omni_omni_stream_play(variables_get($i2s_spk), text("value"), qwen3.5-omni-plus, Tina)` | qwen_omni_stream_play_request_v3( |
| `qwen_omni_omni_record_text` | Value | MIC_VAR(field_variable), DURATION(input_value), MODEL(dropdown), PROMPT(input_value) | `qwen_omni_omni_record_text(variables_get($i2s_mic), math_number(3), qwen3.5-omni-plus, text("value"))` | qwen_omni_record_text_request( |
| `qwen_omni_omni_get_audio` | Value | (none) | `qwen_omni_omni_get_audio()` | qwen_omni_audio_data |
| `qwen_omni_tts_voice_design` | Statement | VAR(field_variable), TEXT(input_value), VOICE_DESC(input_value) | `qwen_omni_tts_voice_design(variables_get($i2s_spk), text("value"), text("value"))` | qwen_tts_voice_design_request( |
| `qwen_omni_omni_voice_chat` | Statement | MIC_VAR(field_variable), SPK_VAR(field_variable), DURATION(input_value), MODEL(dropdown), VOICE(dropdown), BEEP(field_checkbox), PROMPT(input_value) | `qwen_omni_omni_voice_chat(variables_get($i2s_mic), variables_get($i2s_spk), math_number(3), qwen3.5-omni-plus, Tina, TRUE, text("value"))` | qwen_omni_voice_chat_request_dual_i2s( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | qwen3.7-plus, qwen3.7-max | qwen_omni_chat, qwen_omni_chat_with_history |
| MODEL | qwen3.7-plus, qwen3.7-max | qwen_omni_chat_with_thinking |
| MODEL | qwen3.7-plus, qwen3-vl-plus, qwen3-vl-flash, qwen-vl-max, qwen-vl-plus | qwen_omni_vision_chat, qwen_omni_vision_chat_direct_capture, qwen_omni_vision_url_chat |
| MODEL | wanx2.1-t2i-turbo, wanx2.1-t2i-plus, wanx-v1 | qwen_omni_image_generate |
| SIZE | 1024*1024, 720*1280, 1280*720 | qwen_omni_image_generate |
| VOICE | Cherry, Ethan, Chelsie, Serena, Chelsie, Dylan, Jada, Sunny | qwen_omni_tts |
| MODEL | qwen3-tts-flash, qwen3-tts-instruct-flash, qwen-tts | qwen_omni_tts, qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| LANGUAGE | Chinese, English, Japanese, Korean, French, German, Spanish, Russian, Portuguese, Italian | qwen_omni_tts, qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| VOICE | Cherry, Ethan, Chelsie, Serena, Dylan, Jada, Sunny | qwen_omni_tts_and_play, qwen_omni_tts_stream_play |
| MODEL | qwen3.5-omni-plus, qwen3.5-omni-flash, qwen3-omni-flash, qwen-omni-turbo | qwen_omni_omni_text, qwen_omni_omni_and_play, qwen_omni_omni_stream_play |
| VOICE | Tina, Ethan, Serena, Raymond, Cindy, Liora Mira, Sunnybobi, Theo Calm, Harvey, Maia, Evan, Momo, Dylan, Sunny | qwen_omni_omni_and_play, qwen_omni_omni_stream_play, qwen_omni_omni_voice_chat |
| MIC_GAIN | 36 (0x24 default raw ES8311 ADC gain register) | qwen_omni_es8311_mic_init |
| PA_EN | -1 for no GPIO control, or a GPIO number to drive the external amplifier enable pin high | qwen_omni_es8311_audio_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwen_omni_config(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwen_omni_chat(text("value"), qwen3.7-plus))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **UNIHIKER K10 built-in audio**: use `qwen_omni_k10_audio_init` once in setup, then select the same `i2s_k10` variable for both microphone and speaker fields in `qwen_omni_omni_voice_chat`. Pins are fixed by the K10 SDK: BCLK `0`, LRCK `38`, MIC DIN `39`, speaker DOUT `45`, MCLK `3`, and amplifier enable `eAmp_Gain`. K10 mode reuses the SDK-installed I2S driver when available instead of reinstalling it, which avoids disturbing camera preview/audio state.
4. **K10 audio format**: K10 recording is captured from the board I2S bus in SDK-style 6400-byte stereo chunks, converted to 16kHz 16bit mono WAV for Qwen, and protected with the SDK I2S mutex. Qwen mono playback is duplicated to stereo before writing to the built-in speaker.
5. **ES8311 microphone**: use `qwen_omni_es8311_mic_init` before recording-only blocks. The I2C address default is decimal `24` (`0x18`) and the gain register default is decimal `36` (`0x24`).
6. **ES8311 microphone + speaker board**: prefer `qwen_omni_es8311_audio_init` for the board marked Microphone + Audio Amplifier. Use the same I2S variable for microphone and speaker fields in voice-chat/playback blocks, because DI and DO share SCLK/LR/MCK on one ES8311 codec. The tested ESP32 AIOT Basic wiring uses MCK GPIO 46.
7. **ES8311 PA enable**: leave `PA_EN` at `-1` when the amplifier enable is hardwired. If the carrier board exposes an NS4150/PA enable GPIO, set `PA_EN` to that GPIO so generated code drives it high before playback.
8. **Prompt tone**: use the single toolbox block `qwen_omni_i2s_prompt_tone` for normal I2S, K10 built-in audio, and ES8311 speaker objects. `qwen_omni_es8311_test_tone` remains only as a hidden legacy-compatible alias for old projects.
9. **Streaming stability**: audio playback uses a larger stream buffer, a balanced startup prebuffer, a higher-priority pinned playback task with extra stack, and a longer final-drain timeout. K10 stereo conversion uses static scratch storage to avoid playback-task stack overflow. Omni voice-chat audio requests include a short-answer system instruction and `enable_thinking:false` to reduce very long or text-only cloud responses.
10. **Vision streaming diagnostics**: image chat requests use SSE headers and `stream_options`; generated code prints HTTP elapsed time and first stream chunk elapsed time. A slow first chunk usually means the cloud model is still processing the image before it can emit text.
11. **Audio streaming diagnostics**: TTS and omni audio streams print the number of audio chunks, decoded/queued bytes, played bytes, and playback underruns. `audio chunks > 0, queued > 0, played = 0` points to playback/I2S; high `underruns` points to cloud/network audio chunks arriving slower than real-time playback. K10 voice chat also prints expected vs captured PCM bytes; 3 seconds at 16kHz mono should be close to 96000 bytes.

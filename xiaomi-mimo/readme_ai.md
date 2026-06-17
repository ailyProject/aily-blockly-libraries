# Xiaomi MiMo AI

Xiaomi MiMo AI large model API library. Supports text dialogue, image understanding, audio understanding, video understanding and speech synthesis. Suitable for ESP32 and other WiFi-enabled boards.

## Library Info
- **Name**: @aily-project/lib-xiaomi-mimo
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mimo_i2s_speaker_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), DIN(input_value), SAMPLE_RATE(input_value) | `mimo_i2s_speaker_init(variables_get($i2s_spk), math_number(15), math_number(16), math_number(7), math_number(24000))` | mimo_i2s_begin_speaker( |
| `mimo_i2s_mic_init` | Statement | VAR(field_variable), BCLK(input_value), LRCLK(input_value), SD(input_value), SAMPLE_RATE(input_value) | `mimo_i2s_mic_init(variables_get($i2s_mic), math_number(5), math_number(4), math_number(6), math_number(16000))` | mimo_i2s_begin_microphone( |
| `mimo_pdm_mic_init` | Statement | VAR(field_variable), CLK(input_value), DATA(input_value), SAMPLE_RATE(input_value) | `mimo_pdm_mic_init(variables_get($i2s_mic), math_number(42), math_number(41), math_number(16000))` | mimo_i2s_begin_pdm_microphone( |
| `mimo_es8311_mic_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), SDOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value) | `mimo_es8311_mic_init(variables_get($i2s_mic), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(40), math_number(46), math_number(16000), math_number(36))` | mimo_i2s_begin_es8311_microphone( |
| `mimo_es8311_audio_init` | Statement | VAR(field_variable), SDA(input_value), SCL(input_value), I2C_ADDRESS(input_value), BCLK(input_value), LRCLK(input_value), DAC_DIN(input_value), ADC_DOUT(input_value), MCLK(input_value), SAMPLE_RATE(input_value), MIC_GAIN(input_value), PA_EN(input_value) | `mimo_es8311_audio_init(variables_get($i2s_audio), math_number(41), math_number(42), math_number(24), math_number(39), math_number(2), math_number(38), math_number(40), math_number(46), math_number(16000), math_number(36), math_number(-1))` | mimo_i2s_begin_es8311_audio( |
| `mimo_i2s_prompt_tone` | Statement | VAR(field_variable), FREQ(input_value), DURATION(input_value) | `mimo_i2s_prompt_tone(variables_get($i2s_spk), math_number(1000), math_number(300))` | mimo_play_prompt_tone( |
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
| `mimo_i2s_record_text` | Value | MIC_VAR(field_variable), DURATION(input_value), MODEL(dropdown), PROMPT(input_value) | `mimo_i2s_record_text(variables_get($i2s_mic), math_number(3), mimo-v2.5, text("transcribe only"))` | mimo_i2s_record_text_request( |
| `mimo_voice_chat` | Statement | MIC_VAR(field_variable), SPK_VAR(field_variable), DURATION(input_value), MODEL(dropdown), VOICE(dropdown), TTS_MODEL(dropdown), BEEP(checkbox), PROMPT(input_value) | `mimo_voice_chat(variables_get($i2s_mic), variables_get($i2s_spk), math_number(3), mimo-v2.5, mimo_default, mimo-v2.5-tts, TRUE, text("short answer"))` | mimo_voice_chat_request( |
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

### I2S / ES8311 Audio Flow

Use `mimo_i2s_speaker_init` for a regular MAX98357A-style speaker, `mimo_i2s_mic_init` or `mimo_pdm_mic_init` for microphones, and `mimo_es8311_audio_init` when one ES8311 codec handles both microphone and speaker. ES8311 default pins follow the tested Microphone + Audio Amplifier board: SDA 41, SCL 42, BCLK/SCLK 39, LR 2, DI/DAC input 38, DO/ADC output 40, MCK 46, address 24, gain 36, PA_EN -1.

TTS playback blocks now use buffered playback helpers copied from the stabilized Qwen Omni audio path, so base64 WAV and stream PCM playback share one I2S/ES8311-aware output path.


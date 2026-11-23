# Pocket Translator

ESP32-S3 pocket translator library: INMP441 I2S microphone recording (press-and-hold), SiliconFlow speech-to-text, Chinese-to-English translation, SiliconFlow TTS read-aloud through a MAX98357A amplifier, and 16x16 GB2312 Chinese font rendering on ST7789.

## Library Info

- **Name**: @aily-project/lib-pocket-translator
- **Version**: 0.1.0
- **Purpose**: record (INMP441 I2S) → speech-to-text (SiliconFlow) → translate Chinese to English (SiliconFlow chat) → read the English aloud (SiliconFlow TTS via I2S amplifier) → display Chinese/English text with an embedded 16x16 GB2312 font.
- **Dependencies**: `ESP_I2S`, `WiFi`, `NetworkClientSecure`, `HTTPClient`, `TFT_eSPI` (provided by the ESP32 Arduino SDK or this library's `block.json`). MP3 fallback decoding uses the helix decoder prebuilt into arduino-esp32 (`mp3dec.h`).

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pt_init` | Statement | BTN1(dropdown), BTN2(dropdown), WS(dropdown), SCK(dropdown), SD(dropdown), RATE(dropdown), BITS(dropdown), CH(dropdown), SPK_BCLK(dropdown), SPK_LRC(dropdown), SPK_DIN(dropdown) | `pt_init("38", "39", "4", "5", "6", "16000", "32", PT_CH_LEFT, "15", "16", "7")` | `ptInit(38, 39, 4, 5, 6, 16000, 32, PT_CH_LEFT); ptEnableSpeaker(15, 16, 7);` |
| `pt_button_edge` | Value (Boolean) | (none) | `pt_button_edge()` | `ptButtonJustPressed()` |
| `pt_button_down` | Value (Boolean) | (none) | `pt_button_down()` | `ptButtonDown()` |
| `pt_record_hold` | Statement | SECONDS(input_value) | `pt_record_hold(math_number(10))` | `ptRecordHold(10);` |
| `pt_record_ms` | Value (Number) | (none) | `pt_record_ms()` | `ptRecordMs()` |
| `pt_speech_to_text` | Value (String) | URL(input_value), TOKEN(input_value), MODEL(input_value) | `pt_speech_to_text(variables_get($sfAsrUrl), variables_get($sfApiKey), variables_get($sfAsrModel))` | `ptSpeechToText(String(sfAsrUrl), String(sfApiKey), String(sfAsrModel))` |
| `pt_translate` | Value (String) | URL(input_value), TOKEN(input_value), MODEL(input_value), TEXT(input_value) | `pt_translate(variables_get($sfChatUrl), variables_get($sfApiKey), variables_get($sfTranslateModel), variables_get($asrText))` | `ptTranslate(String(sfChatUrl), String(sfApiKey), String(sfTranslateModel), String(asrText))` |
| `pt_speak` | Statement | URL(input_value), TOKEN(input_value), MODEL(input_value), VOICE(input_value), TEXT(input_value), RATE(dropdown) | `pt_speak(variables_get($sfTtsUrl), variables_get($sfApiKey), variables_get($sfTtsModel), variables_get($sfTtsVoice), variables_get($enText), "44100")` | `ptSpeak(String(sfTtsUrl), String(sfApiKey), String(sfTtsModel), String(sfTtsVoice), String(enText), 44100);` |
| `pt_speak_ok` | Value (Boolean) | (none) | `pt_speak_ok()` | `ptSpeakOk()` |
| `pt_speak_ms` | Value (Number) | (none) | `pt_speak_ms()` | `ptSpeakMs()` |
| `pt_set_volume` | Statement | VOLUME(input_value) | `pt_set_volume(math_number(40))` | `ptSetVolume(40);` |
| `pt_last_error` | Value (String) | (none) | `pt_last_error()` | `ptLastError()` |
| `pt_draw_text` | Statement | TFT(field_variable), X(input_value), Y(input_value), TEXT(input_value), FG(input_value), BG(input_value) | `pt_draw_text($tft, math_number(10), math_number(10), text("text"), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))` | `ptDrawTextCN(tft, 10, 10, String("text"), TFT_WHITE, TFT_BLACK);` |
| `pt_free_buffer` | Statement | (none) | `pt_free_buffer()` | `ptFreeRecordBuffer();` |

`pt_draw_text` takes `TFT` as a `field_variable` limited to `TFT_eSPI`; pass the variable created by `tftespi_setup` (for example `$tft`).

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BTN1, BTN2, WS, SCK, SD, SPK_BCLK, SPK_LRC, SPK_DIN | `${board.digitalPins}` | GPIO numbers; keep the `${board.digitalPins}` binding in block.json |
| RATE (pt_init) | 16000, 8000, 44100 | Microphone I2S sample rate (16000 recommended) |
| BITS | 32 (INMP441 24-bit in 32-bit frame), 16, 24 | I2S frame width |
| CH | PT_CH_LEFT (L/R grounded), PT_CH_RIGHT, PT_CH_STEREO | Microphone slot |
| RATE (pt_speak) | 16000, 24000, 32000, 44100 | Requested TTS sample rate; playback follows the rate in the WAV header, so a mismatch never changes pitch |

## ABS Examples

### Complete Program

```abs
arduino_global()
    variable_define("wifiSsid", String, text("YourWiFi"))
    variable_define("wifiPass", String, text("YourPassword"))
    variable_define("sfApiKey", String, text("sk-xxxxxxxx"))
    variable_define("sfAsrUrl", String, text("https://api.siliconflow.cn/v1/audio/transcriptions"))
    variable_define("sfAsrModel", String, text("FunAudioLLM/SenseVoiceSmall"))
    variable_define("sfChatUrl", String, text("https://api.siliconflow.cn/v1/chat/completions"))
    variable_define("sfTranslateModel", String, text("Qwen/Qwen2.5-7B-Instruct"))
    variable_define("sfTtsUrl", String, text("https://api.siliconflow.cn/v1/audio/speech"))
    variable_define("sfTtsModel", String, text("FunAudioLLM/CosyVoice2-0.5B"))
    variable_define("sfTtsVoice", String, text("FunAudioLLM/CosyVoice2-0.5B:anna"))
    variable_define("asrText", String, text(""))
    variable_define("enText", String, text(""))
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, "240", "240", "-1", "47", "21", "41", "40", "45", "42", HIGH, TFT_RGB, "40000000", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    pt_init("38", "39", "4", "5", "6", "16000", "32", PT_CH_LEFT, "15", "16", "7")
    pt_set_volume(math_number(40))
    serial_begin(Serial, "115200")
    esp32_wifi_set_auto_reconnect(TRUE)
    esp32_wifi_begin(variables_get($wifiSsid), variables_get($wifiPass))
arduino_loop()
    controls_if()
        @IF0: pt_button_edge()
        @DO0:
            pt_record_hold(math_number(10))
            variables_set($asrText, pt_speech_to_text(variables_get($sfAsrUrl), variables_get($sfApiKey), variables_get($sfAsrModel)))
            pt_free_buffer()
            controls_if()
                @IF0: logic_compare(text_length(variables_get($asrText)), GT, math_number(0))
                @DO0:
                    pt_draw_text($tft, math_number(10), math_number(10), variables_get($asrText), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))
                    variables_set($enText, pt_translate(variables_get($sfChatUrl), variables_get($sfApiKey), variables_get($sfTranslateModel), variables_get($asrText)))
                    pt_draw_text($tft, math_number(10), math_number(142), variables_get($enText), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))
                    pt_speak(variables_get($sfTtsUrl), variables_get($sfApiKey), variables_get($sfTtsModel), variables_get($sfTtsVoice), variables_get($enText), "44100")
            pt_draw_text($tft, math_number(10), math_number(204), text("Done"), tftespi_color(TFT_GREEN), tftespi_color(TFT_BLACK))
```

## Notes

1. **Init order**: call `pt_init` in `setup()` before anything uses the buttons or microphone. It configures `pinMode(INPUT_PULLUP)`, starts I2S RX (`dout = -1`), and `ptEnableSpeaker` registers the amplifier pins ( playback starts lazily on the first `ptSpeak`).
2. **Recording**: `pt_record_hold` blocks until the button is pressed, records while held (debounced), and stops on release or after SECONDS. Query the duration with `pt_record_ms`; call `pt_free_buffer` after uploading.
3. **Speech-to-text**: `pt_speech_to_text` POSTs the recorded WAV as `multipart/form-data` (`model` + `file` fields) with `Authorization: Bearer`. Returns the `text` field of the JSON response; on failure returns an empty string and `pt_last_error` explains why.
4. **Translation**: `pt_translate` POSTs to `/v1/chat/completions` with a system prompt that asks for short, direct, spoken-style English only. Returns `choices[0].message.content`; 60 s read timeout.
5. **TTS platform facts (measured)**: the `/v1/audio/speech` endpoint answers with `Transfer-Encoding: chunked` regardless of the `stream` flag, and `HTTPClient::getStreamPtr()` is the raw socket, so the library downloads the whole body through `HTTPClient::writeToStream()` (SDK-proven de-chunking) into PSRAM before playing.
6. **TTS models**: `fnlp/MOSS-TTSD-v0.5` honors `response_format=wav` (16-bit PCM, 16000-44100 Hz) but is a dialogue model that may append extra utterances; `FunAudioLLM/CosyVoice2-0.5B` ignores `wav` and always returns MP3 (32000/44100 Hz only) with clean single-speaker output. Recommended: CosyVoice2. Voice format is `modelId:voiceName` (for example `FunAudioLLM/CosyVoice2-0.5B:anna`); invalid voices return code 20047.
7. **Playback**: the full audio is buffered first, then played from memory, so network jitter cannot cause stutter. The microphone I2S RX channel is suspended during playback and restored afterwards. Volume is applied as PCM scaling (`pt_set_volume`, 0-100) because the MAX98357A gain pin is hardware-only.
8. **MP3 fallback**: if the payload is not WAV, the library decodes MP3 with the helix decoder prebuilt into arduino-esp32 (`mp3dec.h`); decode buffers live in PSRAM/heap, never on the 8 KB `loopTask` stack.
9. **TLS**: `WiFiClientSecure::setInsecure()` is used for out-of-the-box reliability; prefer `setCACert` in production.
10. **Fonts/display**: `pt_draw_text` renders UTF-8 through an embedded HZK16 GB2312 font (8178 glyphs) plus an ASC16 ASCII font, with automatic wrapping; it needs the large APP partition (this project uses 16 MB flash / 3 MB APP).
11. **Wiring (MAX98357A)**: BCLK=GPIO15, LRC=GPIO16, DIN=GPIO7, VIN=5V; microphone uses WS=4/SCK=5/SD=6 so the two I2S buses stay independent.
12. **Verified on hardware** in the source course project: recording, ASR, translation, buffered TTS playback, volume scaling. Speech quality and recognition accuracy still depend on the real environment and a valid API key.

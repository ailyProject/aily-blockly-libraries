# Huoshan AI Voice

ESP32 voice conversation blocks for WiFi, I2S microphone/speaker, Doubao ASR/TTS, Coze multi-turn chat, and an optional LVGL touch screen panel.

## Library Info
- **Name**: @aily-project/lib-huoshan-ai-voice
- **Version**: 0.2.5
- **Runtime**: ESP32/ESP32-S3, WiFi, ArduinoJson, WebSockets, legacy ESP-IDF I2S; optional ST7789/TFT_eSPI + LVGL screen with direct FT6336U-compatible I2C touch reads

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `huoshan_ai_config` | Statement | DOUBAO_APP_ID(input_value), DOUBAO_TOKEN(input_value), COZE_TOKEN(input_value), COZE_BOT_ID(input_value), USER_ID(input_value) | `huoshan_ai_config(text("doubao-app-id"), text("doubao-token"), text("coze-token"), text("coze-bot-id"), text(""))` | `HuoshanAIVoice.config(appId, doubaoToken, cozeToken, cozeBotId, userId);` |
| `huoshan_ai_wifi_connect` | Statement | SSID(input_value), PASSWORD(input_value), TIMEOUT(input_value) | `huoshan_ai_wifi_connect(text("ssid"), text("password"), math_number(20000))` | `HuoshanAIVoice.connectWiFi(ssid, password, timeoutMs);` |
| `huoshan_ai_mic_config` | Statement | PORT(field_dropdown), BCLK(input_value), WS(input_value), DIN(input_value), GAIN(input_value), MAX_SECONDS(input_value) | `huoshan_ai_mic_config(I2S_NUM_1, math_number(42), math_number(2), math_number(1), math_number(4), math_number(15))` | `HuoshanAIVoice.configMic(port, bclk, ws, din, gain, maxSeconds);` |
| `huoshan_ai_speaker_config` | Statement | PORT(field_dropdown), BCLK(input_value), WS(input_value), DOUT(input_value), VOLUME(input_value) | `huoshan_ai_speaker_config(I2S_NUM_0, math_number(39), math_number(40), math_number(38), math_number(0.9))` | `HuoshanAIVoice.configSpeaker(port, bclk, ws, dout, volume);` |
| `huoshan_ai_begin` | Statement | none | `huoshan_ai_begin()` | `HuoshanAIVoice.begin();` |
| `huoshan_ai_start_listening` | Statement | none | `huoshan_ai_start_listening()` | `HuoshanAIVoice.startListening();` |
| `huoshan_ai_stop_listening_and_chat` | Statement | none | `huoshan_ai_stop_listening_and_chat()` | `HuoshanAIVoice.stopListeningAndChat();` |
| `huoshan_ai_send_text` | Statement | TEXT(input_value), SPEAK(field_dropdown) | `huoshan_ai_send_text(text("你好"), true)` | `HuoshanAIVoice.sendText(text, speakReply);` |
| `huoshan_ai_tts_speak` | Statement | TEXT(input_value) | `huoshan_ai_tts_speak(text("你好"))` | `HuoshanAIVoice.speak(text);` |
| `huoshan_ai_stop_audio` | Statement | none | `huoshan_ai_stop_audio()` | `HuoshanAIVoice.stopAudio();` |
| `huoshan_ai_clear_conversation` | Statement | none | `huoshan_ai_clear_conversation()` | `HuoshanAIVoice.clearConversation();` |
| `huoshan_ai_set_voice` | Statement | VOICE(field_dropdown) | `huoshan_ai_set_voice(zh_female_wanwanxiaohe_moon_bigtts)` | `HuoshanAIVoice.setVoice("zh_female_wanwanxiaohe_moon_bigtts");` |
| `huoshan_ai_set_volume` | Statement | VOLUME(input_value) | `huoshan_ai_set_volume(math_number(0.9))` | `HuoshanAIVoice.setVolume(volume);` |
| `huoshan_ai_set_speed` | Statement | SPEED(input_value) | `huoshan_ai_set_speed(math_number(1.0))` | `HuoshanAIVoice.setSpeed(speed);` |
| `huoshan_ai_get_state` | Value | none | `huoshan_ai_get_state()` | `HuoshanAIVoice.state()` |
| `huoshan_ai_is_wifi_connected` | Value | none | `huoshan_ai_is_wifi_connected()` | `HuoshanAIVoice.isWiFiConnected()` |
| `huoshan_ai_get_last_asr_text` | Value | none | `huoshan_ai_get_last_asr_text()` | `HuoshanAIVoice.lastAsrText()` |
| `huoshan_ai_get_last_reply_text` | Value | none | `huoshan_ai_get_last_reply_text()` | `HuoshanAIVoice.lastReplyText()` |
| `huoshan_ai_get_last_error` | Value | none | `huoshan_ai_get_last_error()` | `HuoshanAIVoice.lastError()` |
| `huoshan_ai_screen_config` | Statement | WIDTH(field_number), HEIGHT(field_number), ROTATION(dropdown), BRIGHTNESS(field_number), BL(field_number), MISO(field_number), MOSI(field_number), SCLK(field_number), CS(field_number), DC(field_number), RST(field_number), TOUCH_SDA(field_number), TOUCH_SCL(field_number), TOUCH_RST(field_number), TOUCH_INT(field_number) | `huoshan_ai_screen_config(240, 320, LV_DISPLAY_ROTATION_0, 80, 8, 15, 17, 16, 5, 7, 6, 10, 13, 9, 12)` | `HuoshanAIVoice.configScreen(width, height, brightness);` |
| `huoshan_ai_screen_begin` | Statement | TOUCH_TO_TALK(dropdown), AUTO_MESSAGES(dropdown) | `huoshan_ai_screen_begin(true, true)` | `HuoshanAIVoice.beginScreen(touchToTalk, autoMessages);` |
| `huoshan_ai_screen_set_brightness` | Statement | VALUE(input_value) | `huoshan_ai_screen_set_brightness(math_number(80))` | `HuoshanAIVoice.setScreenBrightness(value);` |
| `huoshan_ai_screen_set_status` | Statement | TEXT(input_value) | `huoshan_ai_screen_set_status(text("准备就绪"))` | `HuoshanAIVoice.setScreenStatus(text);` |
| `huoshan_ai_screen_add_message` | Statement | ROLE(dropdown), TEXT(input_value) | `huoshan_ai_screen_add_message(system, text("Ready"))` | `HuoshanAIVoice.addScreenMessage(role, text);` |
| `huoshan_ai_screen_clear_messages` | Statement | none | `huoshan_ai_screen_clear_messages()` | `HuoshanAIVoice.clearScreenMessages();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | `I2S_NUM_0`, `I2S_NUM_1` | ESP32 I2S peripheral port. Do not use the same port for microphone and speaker. |
| SPEAK | `true`, `false` | Whether Coze replies are played with Doubao TTS. |
| ROTATION | `LV_DISPLAY_ROTATION_0`, `LV_DISPLAY_ROTATION_90`, `LV_DISPLAY_ROTATION_180`, `LV_DISPLAY_ROTATION_270` | LVGL display rotation for the optional screen panel. |
| TOUCH_TO_TALK, AUTO_MESSAGES | `true`, `false` | Enable touch press/release voice chat and automatic ASR/Coze message display. |
| ROLE | `user`, `assistant`, `system` | Screen message role. |
| VOICE | `zh_female_wanwanxiaohe_moon_bigtts`, `zh_male_silang_mars_bigtts`, `zh_female_tianmeixiaoyuan_moon_bigtts`, `ICL_zh_male_nuanxintitie_tob`, `ICL_zh_female_chengshujiejie_tob`, `ICL_zh_female_wumeiyujie_tob`, `ICL_zh_female_xingganyujie_tob`, `ICL_zh_female_aojiaonvyou_tob`, `zh_male_sunwukong_mars_bigtts`, `zh_male_xionger_mars_bigtts`, `zh_female_peiqi_mars_bigtts`, `zh_female_wuzetian_mars_bigtts`, `zh_female_daimengchuanmei_moon_bigtts`, `zh_male_beijingxiaoye_moon_bigtts`, `zh_male_shaonianzixin_moon_bigtts`, `zh_female_meilinvyou_moon_bigtts`, `zh_male_shenyeboke_moon_bigtts`, `zh_female_sajiaonvyou_moon_bigtts`, `zh_female_yuanqinvyou_moon_bigtts`, `zh_male_guangxiyuanzhou_moon_bigtts`, `zh_female_meituojieer_moon_bigtts`, `zh_male_yuzhouzixuan_moon_bigtts`, `zh_female_linjianvhai_moon_bigtts`, `zh_female_gaolengyujie_moon_bigtts`, `zh_male_yuanboxiaoshu_moon_bigtts`, `zh_male_yangguangqingnian_moon_bigtts`, `zh_female_shuangkuaisisi_moon_bigtts`, `zh_male_wennuanahu_moon_bigtts` | Doubao TTS voice_type. |

## ABS Examples

### Serial-Controlled Voice Chat

This mirrors the current test project pattern: send serial character `1` to start recording, then `2` to stop recording, recognize, chat, and speak the reply.

```abs
arduino_global()
    variable_define("isListening", bool, logic_boolean(false))

arduino_setup()
    serial_begin(Serial, 115200)
    serial_println(Serial, text("Starting Voice Chat..."))
    huoshan_ai_config(text("doubao-app-id"), text("doubao-access-token"), text("coze-token"), text("coze-bot-id"), text(""))
    huoshan_ai_wifi_connect(text("wifi-ssid"), text("wifi-password"), math_number(20000))
    huoshan_ai_mic_config(I2S_NUM_1, math_number(42), math_number(2), math_number(1), math_number(4), math_number(15))
    huoshan_ai_speaker_config(I2S_NUM_0, math_number(39), math_number(40), math_number(38), math_number(0.9))
    huoshan_ai_set_voice(zh_female_daimengchuanmei_moon_bigtts)
    huoshan_ai_begin()
    serial_println(Serial, text("Voice Chat Ready!"))

arduino_loop()
    controls_if()
        @IF0: logic_operation(logic_negate(variables_get($isListening)), AND, logic_compare(serial_read(Serial, read()), EQ, math_number(49)))
        @DO0:
            serial_println(Serial, text("Start listening..."))
            huoshan_ai_start_listening()
            variables_set($isListening, logic_boolean(true))
    controls_if()
        @IF0: logic_operation(variables_get($isListening), AND, logic_compare(serial_read(Serial, read()), EQ, math_number(50)))
        @DO0:
            serial_println(Serial, text("Stop and chat..."))
            huoshan_ai_stop_listening_and_chat()
            variables_set($isListening, logic_boolean(false))
```

Microphone gain is limited to 1-16. Start with 4. If the serial log warns that microphone audio is clipping, reduce the gain; only increase it after enabling verbose diagnostics and confirming that `peak` and `avgAbs` remain consistently low. The microphone task captures 10ms PCM frames, while the ASR task follows the source PIO ring-buffer model and aggregates them into 1280-byte upload packets. This keeps each binary WebSocket payload on the Aily WebSockets single-write path. On ESP32-S3 with PSRAM the ASR buffer is 512KB, enough for a full 15-second 16kHz PCM16 mono recording; boards without PSRAM fall back to 32KB. Network backpressure never blocks I2S capture.

### Touch Screen Voice Panel

This enables the optional ST7789/LVGL/FT6336U panel. Press and hold the bottom button to record; release it to run ASR, Coze chat, and optional TTS from a background task while LVGL keeps refreshing.

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    huoshan_ai_config(text("doubao-app-id"), text("doubao-access-token"), text("coze-token"), text("coze-bot-id"), text(""))
    huoshan_ai_wifi_connect(text("wifi-ssid"), text("wifi-password"), math_number(20000))
    huoshan_ai_mic_config(I2S_NUM_1, math_number(42), math_number(2), math_number(1), math_number(4), math_number(15))
    huoshan_ai_speaker_config(I2S_NUM_0, math_number(39), math_number(40), math_number(38), math_number(0.9))
    huoshan_ai_begin()
    huoshan_ai_screen_config(240, 320, LV_DISPLAY_ROTATION_0, 80, 8, 15, 17, 16, 5, 7, 6, 10, 13, 9, 12)
    huoshan_ai_screen_begin(true, true)
    huoshan_ai_screen_add_message(system, text("触摸按钮开始对话"))

arduino_loop()
```

### Text-Only Coze Chat With Optional Speech

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    huoshan_ai_config(text("doubao-app-id"), text("doubao-access-token"), text("coze-token"), text("coze-bot-id"), text(""))
    huoshan_ai_wifi_connect(text("wifi-ssid"), text("wifi-password"), math_number(20000))
    huoshan_ai_speaker_config(I2S_NUM_0, math_number(39), math_number(40), math_number(38), math_number(0.9))
    huoshan_ai_begin()
    huoshan_ai_send_text(text("你好，请简单介绍你自己"), true)
```

## Notes

1. **Initialization order**: call `huoshan_ai_config`, WiFi, I2S pin config, optional voice/volume/speed, then `huoshan_ai_begin`. For the screen panel, call `huoshan_ai_screen_config` and `huoshan_ai_screen_begin` after `huoshan_ai_begin`.
2. **Credentials**: use `text("...")` for all tokens and IDs, including numeric-looking App ID or Bot ID values.
3. **User ID**: pass `text("")` to use the ESP32 chip ID automatically. Configure USER_ID only if Coze requires a stable custom user id.
4. **I2S defaults from the source project**: microphone `I2S_NUM_1/BCLK=42/WS=2/DIN=1`, speaker `I2S_NUM_0/BCLK=39/WS=40/DOUT=38`.
5. **Screen defaults from the source project**: `240x320`, `LV_DISPLAY_ROTATION_0`, brightness `80`, LCD `BL=8/MISO=15/MOSI=17/SCLK=16/CS=5/DC=7/RST=6`, touch `SDA=10/SCL=13/RST=9/INT=12`.
6. **Screen dependencies are optional**: audio-only projects do not inject LVGL, TFT_eSPI, FT6336U, or screen build macros. Any screen block enables `HUOSHAN_AI_SCREEN_ENABLED=1`, `LV_USE_TFT_ESPI=1`, ST7789/TFT_eSPI macros, and the screen runtime.
7. **Screen font**: the screen runtime uses the bundled compressed `HuoshanAI_CN_15` LVGL font generated from Source Han Sans SC with ASCII, Latin-1, common symbols, Chinese punctuation, full-width forms, CJK Extension A `0x3400-0x4DBF`, and full basic CJK `0x4E00-0x9FFF` coverage. The project LVGL config must keep `LV_USE_FONT_COMPRESSED=1` for this font; otherwise labels render as blank even though the screen background and widgets are drawn. Screen strings are sanitized before display to drop emoji, control characters, variation selectors, private-use glyphs, and invalid UTF-8 bytes that the bundled font cannot render.
8. **Audio format**: ASR input is 16kHz PCM16 mono; TTS output is 16kHz PCM converted to I2S 32-bit samples for MAX98357-style amplifiers.
9. **Streaming behavior**: `huoshan_ai_start_listening` starts recording and opens a streaming ASR task. `huoshan_ai_stop_listening_and_chat` finalizes ASR, sends the recognized text to Coze, and sends each completed Coze sentence to WebSocket TTS while later text is still arriving.
10. **Screen auto messages**: when `AUTO_MESSAGES` is true, recognized ASR text is appended as a user message and the Coze reply updates the active assistant message as streaming fragments arrive.
11. **Board/project config**: the package includes `partitions.csv` and a postinstall helper that sets a 16MB custom partition, OPI PSRAM, QIO flash mode, and 921600 upload speed for ESP32-S3 projects when installed in Aily. The helper also ensures the project root `package.json` directly lists ArduinoJson, WebSockets, TFT_eSPI, and LVGL, because Aily preprocessing copies only direct project dependencies into `.temp/libraries`. It pre-unpacks the bundled screen font source when Aily's `7za.exe` is available, enables `LV_FONT_FMT_TXT_LARGE` and `LV_USE_FONT_COMPRESSED` in local/temp LVGL config for the bundled full Chinese font, and removes stale project-level screen/font macros from older `huoshan-ai-voice` builds before the current screen blocks add their active macros.
12. **Streaming ASR model**: ASR follows the source PIO project model. The recording task writes PCM into a FreeRTOS ring buffer, the ASR task sends small PCM packets, and after recording stops it sends the final audio marker and waits for the final `sequence < 0` recognition result. Full-recording retry is not used as the normal path; it is only used as a bounded recovery path when streaming ASR fails before producing final text.
13. **Diagnostics**: default serial logs are concise: state changes, WiFi/IP, I2S readiness, recognized ASR text, warnings, and runtime errors. Detailed timing and packet metrics are still in the generated runtime behind `HUOSHAN_AI_VERBOSE_LOG`; set it to `true` temporarily when diagnosing capture percentage, ASR send timing, Coze/TTS latency, queue underruns, or reconnect counts. Pure punctuation or control-only Coze fragments are skipped instead of being sent to TTS. Use `huoshan_ai_get_last_error()` for the latest runtime error.
14. **Common ABS error**: do not write bare strings for input_value slots. Use `text("ssid")`, `math_number(20000)`, and dropdown enum values exactly as listed.

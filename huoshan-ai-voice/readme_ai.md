# Huoshan AI Voice

ESP32 voice conversation blocks for WiFi, I2S microphone/speaker, Doubao ASR/TTS, and Coze multi-turn chat.

## Library Info
- **Name**: @aily-project/lib-huoshan-ai-voice
- **Version**: 0.1.0
- **Runtime**: ESP32/ESP32-S3, WiFi, ArduinoJson, WebSockets, legacy ESP-IDF I2S

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

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | `I2S_NUM_0`, `I2S_NUM_1` | ESP32 I2S peripheral port. Do not use the same port for microphone and speaker. |
| SPEAK | `true`, `false` | Whether Coze replies are played with Doubao TTS. |
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

1. **Initialization order**: call `huoshan_ai_config`, WiFi, I2S pin config, optional voice/volume/speed, then `huoshan_ai_begin`.
2. **Credentials**: use `text("...")` for all tokens and IDs, including numeric-looking App ID or Bot ID values.
3. **User ID**: pass `text("")` to use the ESP32 chip ID automatically. Configure USER_ID only if Coze requires a stable custom user id.
4. **I2S defaults from the source project**: microphone `I2S_NUM_1/BCLK=42/WS=2/DIN=1`, speaker `I2S_NUM_0/BCLK=39/WS=40/DOUT=38`.
5. **Audio format**: ASR input is 16kHz PCM16 mono; TTS output is 16kHz PCM converted to I2S 32-bit samples for MAX98357-style amplifiers.
6. **Streaming behavior**: `huoshan_ai_start_listening` starts recording and opens a streaming ASR task. `huoshan_ai_stop_listening_and_chat` finalizes ASR, sends the recognized text to Coze, and sends each completed Coze sentence to WebSocket TTS while later text is still arriving.
7. **Board/project config**: the package includes `partitions.csv` and a postinstall helper that sets a 16MB custom partition, OPI PSRAM, QIO flash mode, and 921600 upload speed for ESP32-S3 projects when installed in Aily.
8. **Streaming ASR model**: ASR follows the source PIO project model. The recording task writes PCM into a FreeRTOS ring buffer, the ASR task sends small PCM packets, and after recording stops it sends the final audio marker and waits for the final `sequence < 0` recognition result. Full-recording retry is not used as the normal path; it is only used as a bounded recovery path when streaming ASR fails before producing final text.
9. **Diagnostics**: default serial logs are concise: state changes, WiFi/IP, I2S readiness, recognized ASR text, warnings, and runtime errors. Detailed timing and packet metrics are still in the generated runtime behind `HUOSHAN_AI_VERBOSE_LOG`; set it to `true` temporarily when diagnosing capture percentage, ASR send timing, Coze/TTS latency, queue underruns, or reconnect counts. Pure punctuation or control-only Coze fragments are skipped instead of being sent to TTS. Use `huoshan_ai_get_last_error()` for the latest runtime error.
10. **Common ABS error**: do not write bare strings for input_value slots. Use `text("ssid")`, `math_number(20000)`, and dropdown enum values exactly as listed.

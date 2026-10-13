# Xiaozhi AI

ESP32 voice sessions, activation, audio, callbacks and MCP tools.

## Library Info

- **Name**: @aily-project/lib-xiaozhi
- **Version**: 1.0.0
- **Upstream**: Xiaozhi Arduino 2.4.0; bundled sources and licenses are in src.7z.
- **Required dependency**: @aily-project/lib-esp32-wifi ^1.0.3 (esp32_wifi).

## 与 esp32_wifi 配合使用

本库必须配合 **ESP32 WiFi（esp32_wifi）** 使用，package.json 已声明依赖。导入或安装小智库时应同时加载该依赖。WiFi 库负责 STA 联网、连接状态和断线重连，小智库负责服务激活、WebSocket、语音和 MCP。安装依赖本身不会连接网络，仍需放置联网积木。

1. 在 arduino_setup 中依次放置 esp32_wifi_set_mode(WIFI_STA)、esp32_wifi_set_auto_reconnect(TRUE)、esp32_wifi_begin(SSID, PASSWORD)，然后调用一次 xiaozhi_begin_official 或 xiaozhi_begin_websocket。音频和功能设置也必须在启动前完成。
2. WiFi.begin 是异步操作；小智启动积木只提交启动请求，自动 loop 会等到 WiFi 已连接再获取服务配置。无需无限等待联网，也不要在 arduino_loop 中反复执行 WiFi.begin 或小智启动积木。
3. 用 esp32_wifi_is_connected 检查路由器连接；用 xiaozhi_ready(ready) 检查本地运行时可用。这两者不能代替彼此。发送对话指令前建议同时检查；sessionReady 表示语音通道的服务端握手已完成，首次 toggle_chat 前无需等它为真。
4. 首次激活通过 xiaozhi_on_activation 获取激活码；未激活或启动失败会自动重试。WiFi 掉线后由 esp32_wifi 的自动重连恢复路由器连接，已运行的小智服务使用底层传输重连。可按需调用 esp32_wifi_reconnect，但不要在每次 loop 中连续调用。
5. 仅创建 WIFI_AP 热点不会让设备获得外网；官方服务需要可访问互联网和 NTP 的 STA 网络。自建服务使用能访问对应服务器的网络。
6. xiaozhi_wifi_begin 为旧项目保留，等价于设置 STA、启用自动重连并连接 WiFi。新项目优先使用 esp32_wifi 的上述三个积木；两种连接方式选一种，避免重复发起连接。连接状态、IP 和重连仍使用 esp32_wifi。
7. MCP HANDLER 在服务任务执行，不要在其中调用任何 WiFi 配置/重连积木。网络配置放在 setup 或普通主循环中。旧的 xiaozhi_wifi_begin 在 MCP HANDLER 中会被生成器拒绝。

完整配合示例见下方 ABS Examples；WiFi 积木参数见 [esp32_wifi/readme_ai.md](../esp32_wifi/readme_ai.md)。

## Block Definitions

Generated Code includes every include, object, setup registration and loop service emitted by each representative block. Comments identify placement; value expressions go in a value input. MCP child fragments use the enclosing tool's lexical variables. All callbacks below have an empty representative body.

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `xiaozhi_create` | Statement | (none) | `xiaozhi_create()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_wifi_begin` | Statement | SSID(input_value), PASSWORD(input_value) | `xiaozhi_wifi_begin(text("YOUR_WIFI_SSID"), text("YOUR_WIFI_PASSWORD"))` | `#include <WiFi.h> ↵ // Statement body ↵ WiFi.mode(WIFI_STA); ↵ WiFi.setAutoReconnect(true); ↵ WiFi.begin(String("YOUR_WIFI_SSID").c_str(), String("YOUR_WIFI_PASSWORD").c_str());` |
| `xiaozhi_begin_official` | Statement | (none) | `xiaozhi_begin_official()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.beginOfficial(); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_begin_websocket` | Statement | URL(input_value), TOKEN(input_value), CA(input_value), PROTOCOL(dropdown) | `xiaozhi_begin_websocket(text("wss://your-server.example/xiaozhi/v1/"), text("YOUR_TOKEN"), text(""), 1)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.beginWebSocket(String("wss://your-server.example/xiaozhi/v1/"), String("YOUR_TOKEN"), String(""), 1); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_features` | Statement | AEC(field_checkbox), BARGE_IN(field_checkbox), RAW_JSON(field_checkbox) | `xiaozhi_features(TRUE, TRUE, FALSE)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.setFeatures(true, true, false); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_timeouts` | Statement | HANDSHAKE(input_value), CHANNEL(input_value) | `xiaozhi_timeouts(math_number(10000), math_number(120000))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.setTimeouts(10000, 120000); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_identity` | Statement | DEVICE(input_value), CLIENT(input_value) | `xiaozhi_identity(text(""), text(""))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.setIdentity(String(""), String("")); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_stop` | Statement | (none) | `xiaozhi_stop()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.stop(); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_audio_preset` | Statement | BOARD(dropdown), WAKE(field_checkbox) | `xiaozhi_audio_preset(NULLLAB_AI_VOX3, FALSE)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ #if !defined(CONFIG_IDF_TARGET_ESP32S3) ↵ #error "Bundled Xiaozhi Opus audio requires ESP32-S3" ↵ #endif ↵ #include <EspressifOpus.h> ↵ #define XIAOZHI_BOARD NULLLAB_AI_VOX3 ↵ #include <xiaozhi/boards/BoardPresets.h> ↵ #undef XIAOZHI_AUDIO_ENABLE_WAKE_ESP_SR ↵ #define XIAOZHI_AUDIO_ENABLE_WAKE_ESP_SR 0 ↵ #include <Wire.h> ↵ #include <EspressifEs8311.h> ↵ #include <xiaozhi/audio/AudioBoard.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ if (!xiaozhiClient.running()) { ↵   static I2sOpusAudioPort xiaozhiAudio([&]() { ↵     auto config = xiaozhi_audio_board::makeConfig(); ↵     config.enableWakeDetection = false; ↵     return config; ↵   }()); ↵   xiaozhiClient.attachAudio(&xiaozhiAudio); ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_audio_es8311` | Statement | MCLK(field_number), BCLK(field_number), WS(field_number), DOUT(field_number), DIN(field_number), SDA(field_number), SCL(field_number), PA(field_number), GAIN(field_number), VOLUME(field_number) | `xiaozhi_audio_es8311(11, 10, 8, 7, 9, 13, 12, -1, 30, -12)` | `#if !defined(CONFIG_IDF_TARGET_ESP32S3) ↵ #error "Bundled Xiaozhi Opus audio requires ESP32-S3" ↵ #endif ↵ #include <EspressifOpus.h> ↵ #include <Wire.h> ↵ #include <EspressifEs8311.h> ↵ #include <xiaozhi/audio/Es8311Audio.h> ↵ #include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ if (!xiaozhiClient.running()) { ↵   static I2sOpusAudioPort xiaozhiAudio([&]() { ↵     auto config = I2sOpusAudioPort::Config::forCompiledProfile(); ↵     auto& output = config.hardware.output; ↵     output.sampleRate = 16000; ↵     output.mclk = 11; ↵     output.bclk = 10; ↵     output.ws = 8; ↵     output.data = 7; ↵     config.hardware.input = output; ↵     config.hardware.input.data = 9; ↵     config.captureChannel = I2sOpusAudioPort::CaptureChannel::Left; ↵     auto& codec = config.hardware.es8311; ↵     codec.wire = &Wire; ↵     codec.i2cSda = 13; ↵     codec.i2cScl = 12; ↵     codec.paPin = -1; ↵     codec.noDacReference = false; ↵     codec.microphoneGainDb = 30; ↵     codec.outputVolumeDb = -12; ↵     config.enableWakeDetection = false; ↵     return config; ↵   }()); ↵   xiaozhiClient.attachAudio(&xiaozhiAudio); ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_audio_i2s` | Statement | BUS(dropdown), OUT_BCLK(field_number), OUT_WS(field_number), DOUT(field_number), IN_BCLK(field_number), IN_WS(field_number), DIN(field_number), CHANNEL(dropdown), SHIFT(field_number), AMP(field_number), VOLUME(field_number) | `xiaozhi_audio_i2s(SIMPLEX, 13, 14, 1, 5, 2, 4, Left, 12, -1, 70)` | `#if !defined(CONFIG_IDF_TARGET_ESP32S3) ↵ #error "Bundled Xiaozhi Opus audio requires ESP32-S3" ↵ #endif ↵ #include <EspressifOpus.h> ↵ #include <xiaozhi/audio/I2sSimplexAudio.h> ↵ #include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ if (!xiaozhiClient.running()) { ↵   static I2sOpusAudioPort xiaozhiAudio([&]() { ↵     auto config = I2sOpusAudioPort::Config::forCompiledProfile(); ↵     config.hardware.output.bclk = 13; ↵     config.hardware.output.ws = 14; ↵     config.hardware.output.data = 1; ↵     config.hardware.input.bclk = 5; ↵     config.hardware.input.ws = 2; ↵     config.hardware.input.data = 4; ↵     config.hardware.amplifier.enablePin = -1; ↵     config.hardware.input.slot = I2sOpusAudioPort::I2sSlot::Left; ↵     config.captureChannel = I2sOpusAudioPort::CaptureChannel::Left; ↵     config.hardware.input.rightShift = 12; ↵     config.hardware.amplifier.volumePercent = 70; ↵     config.enableWakeDetection = false; ↵     return config; ↵   }()); ↵   xiaozhiClient.attachAudio(&xiaozhiAudio); ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_audio_pdm` | Statement | CLK(field_number), DIN(field_number), BCLK(field_number), WS(field_number), DOUT(field_number), AMP(field_number), VOLUME(field_number) | `xiaozhi_audio_pdm(5, 4, 13, 14, 1, -1, 70)` | `#if !defined(CONFIG_IDF_TARGET_ESP32S3) ↵ #error "Bundled Xiaozhi Opus audio requires ESP32-S3" ↵ #endif ↵ #include <EspressifOpus.h> ↵ #include <xiaozhi/audio/PdmAudio.h> ↵ #include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ if (!xiaozhiClient.running()) { ↵   static I2sOpusAudioPort xiaozhiAudio([&]() { ↵     auto config = I2sOpusAudioPort::Config::forCompiledProfile(); ↵     config.hardware.pdmInput.clock = 5; ↵     config.hardware.pdmInput.data = 4; ↵     config.hardware.output.bclk = 13; ↵     config.hardware.output.ws = 14; ↵     config.hardware.output.data = 1; ↵     config.hardware.amplifier.enablePin = -1; ↵     config.hardware.amplifier.volumePercent = 70; ↵     config.enableWakeDetection = false; ↵     return config; ↵   }()); ↵   xiaozhiClient.attachAudio(&xiaozhiAudio); ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_start_listening` | Statement | MODE(dropdown) | `xiaozhi_start_listening(AutoStop)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.startListening(xiaozhi::ListeningMode::AutoStop); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_stop_listening` | Statement | (none) | `xiaozhi_stop_listening()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.stopListening(); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_toggle_chat` | Statement | (none) | `xiaozhi_toggle_chat()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.toggleChat(); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_abort_speaking` | Statement | REASON(dropdown) | `xiaozhi_abort_speaking(None)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.abortSpeaking(xiaozhi::AbortReason::None); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_wake_word` | Statement | WORD(input_value) | `xiaozhi_wake_word(text("你好小智"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.wakeWord(String("你好小智")); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_mute` | Statement | MUTED(input_value) | `xiaozhi_mute(logic_boolean(TRUE))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.mute(true); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_close_session` | Statement | (none) | `xiaozhi_close_session()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.closeSession(); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_send_mcp` | Statement | JSON(input_value) | `xiaozhi_send_mcp(text("{\"jsonrpc\":\"2.0\",\"method\":\"notifications/initialized\"}"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Statement body ↵ xiaozhiClient.sendMcp(String("{\"jsonrpc\":\"2.0\",\"method\":\"notifications/initialized\"}")); ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_last_operation` | Value (Boolean) | (none) | `xiaozhi_last_operation()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.lastOperation ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_ready` | Value (Boolean) | STATUS(dropdown) | `xiaozhi_ready(ready)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.ready() ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_state` | Value (String) | (none) | `xiaozhi_state()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ String(xiaozhiClient.stateName()) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_is_state` | Value (Boolean) | STATE(dropdown) | `xiaozhi_is_state(Unknown)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ (xiaozhiClient.state() == xiaozhi::State::Unknown) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_event_is` | Value (Boolean) | EVENT(dropdown) | `xiaozhi_event_is(Stt)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ (xiaozhiClient.event.type == xiaozhi::EventType::Stt) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_event_text` | Value (String) | FIELD(dropdown) | `xiaozhi_event_text(text)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ String(xiaozhiClient.event.text.c_str()) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_emotion_id` | Value (Number) | (none) | `xiaozhi_emotion_id()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ static_cast<int>(xiaozhiClient.event.emotion_type) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_activation` | Value (String) | FIELD(dropdown) | `xiaozhi_activation(activationCode)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.activationCode ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_error` | Value (String) | FIELD(dropdown) | `xiaozhi_error(lastError)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.lastError ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_state_event` | Value (String) | FIELD(dropdown) | `xiaozhi_state_event(eventState)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ String(xiaozhi::stateName(xiaozhiClient.eventState)) ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_capture_enabled` | Value (Boolean) | (none) | `xiaozhi_capture_enabled()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.captureEnabled ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_detected_wake_word` | Value (String) | (none) | `xiaozhi_detected_wake_word()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.detectedWakeWord ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_audio_meta` | Value (Number) | FIELD(dropdown) | `xiaozhi_audio_meta(opus_bytes)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.audioMeta.opus_bytes ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_stats` | Value (Number) | FIELD(dropdown) | `xiaozhi_stats(commands_rejected)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // Value expression ↵ xiaozhiClient.stats().commands_rejected ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_event` | Hat | EVENT(dropdown), HANDLER(input_statement) | `xiaozhi_on_event(ALL)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onEvent; ↵   xiaozhiClient.onEvent = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_state` | Hat | HANDLER(input_statement) | `xiaozhi_on_state()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onState; ↵   xiaozhiClient.onState = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_error` | Hat | HANDLER(input_statement) | `xiaozhi_on_error()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onError; ↵   xiaozhiClient.onError = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_activation` | Hat | HANDLER(input_statement) | `xiaozhi_on_activation()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onActivation; ↵   xiaozhiClient.onActivation = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_capture` | Hat | HANDLER(input_statement) | `xiaozhi_on_capture()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onCapture; ↵   xiaozhiClient.onCapture = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_wake` | Hat | HANDLER(input_statement) | `xiaozhi_on_wake()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onWake; ↵   xiaozhiClient.onWake = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_on_audio` | Hat | HANDLER(input_statement) | `xiaozhi_on_audio()` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   auto xiaozhiPrevious = xiaozhiClient.onAudio; ↵   xiaozhiClient.onAudio = [xiaozhiPrevious]() { ↵     if (xiaozhiPrevious) xiaozhiPrevious(); ↵   }; ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_tool` | Hat | NAME(input_value), DESCRIPTION(input_value), PROPERTIES(input_statement), HANDLER(input_statement) | `xiaozhi_tool(text("device.set_volume"), text("Set speaker volume"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ SET_LOOP_TASK_STACK_SIZE(16 * 1024); ↵ AilyXiaozhi xiaozhiClient; ↵ // setup() ↵ { ↵   xiaozhi::McpTool xiaozhiTool; ↵   xiaozhiTool.name = String("device.set_volume").c_str(); ↵   xiaozhiTool.description = String("Set speaker volume").c_str(); ↵   xiaozhiTool.handler = [](const xiaozhi::McpArguments& xiaozhiArguments) -> xiaozhi::McpResult { ↵     (void)xiaozhiArguments; ↵     return xiaozhi::McpResult::Text("OK"); ↵   }; ↵   xiaozhiClient.addTool(std::move(xiaozhiTool)); ↵ } ↵  ↵ // loop() ↵ xiaozhiClient.loop();` |
| `xiaozhi_property_string` | Statement | NAME(field_input), REQUIRED(field_checkbox), DEFAULT(input_value) | `xiaozhi_property_string("text", TRUE, text(""))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ xiaozhiTool.properties.push_back(xiaozhi::McpProperty::String("text"));` |
| `xiaozhi_property_number` | Statement | NAME(field_input), REQUIRED(field_checkbox), DEFAULT(input_value), MIN(field_number), MAX(field_number) | `xiaozhi_property_number("volume", FALSE, math_number(50), 0, 100)` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ xiaozhiTool.properties.push_back(xiaozhi::McpProperty::Integer("volume", static_cast<int32_t>(50), 0, 100));` |
| `xiaozhi_property_boolean` | Statement | NAME(field_input), REQUIRED(field_checkbox), DEFAULT(input_value) | `xiaozhi_property_boolean("enabled", TRUE, logic_boolean(TRUE))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ xiaozhiTool.properties.push_back(xiaozhi::McpProperty::Boolean("enabled"));` |
| `xiaozhi_argument_string` | Value (String) | NAME(input_value) | `xiaozhi_argument_string(text("text"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Value expression ↵ AilyXiaozhi::argumentString(xiaozhiArguments, String("text"))` |
| `xiaozhi_return_string` | Statement | VALUE(input_value) | `xiaozhi_return_string(text("OK"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ return xiaozhi::McpResult::Text(std::string(String("OK").c_str()));` |
| `xiaozhi_argument_number` | Value (Number) | NAME(input_value) | `xiaozhi_argument_number(text("volume"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Value expression ↵ AilyXiaozhi::argumentNumber(xiaozhiArguments, String("volume"))` |
| `xiaozhi_return_number` | Statement | VALUE(input_value) | `xiaozhi_return_number(math_number(0))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ return xiaozhi::McpResult::Integer(static_cast<int32_t>(0));` |
| `xiaozhi_argument_boolean` | Value (Boolean) | NAME(input_value) | `xiaozhi_argument_boolean(text("enabled"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Value expression ↵ AilyXiaozhi::argumentBoolean(xiaozhiArguments, String("enabled"))` |
| `xiaozhi_return_boolean` | Statement | VALUE(input_value) | `xiaozhi_return_boolean(logic_boolean(TRUE))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ return xiaozhi::McpResult::Boolean(true);` |
| `xiaozhi_return_json` | Statement | VALUE(input_value) | `xiaozhi_return_json(text("{\"ok\":true}"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ return xiaozhi::McpResult::Json(std::string(String("{\"ok\":true}").c_str()));` |
| `xiaozhi_return_error` | Statement | VALUE(input_value) | `xiaozhi_return_error(text("Operation failed"))` | `#include <ArduinoWebsockets.h> ↵ #include <AilyXiaozhi.h> ↵ // Statement body ↵ return xiaozhi::McpResult::Error(std::string(String("Operation failed").c_str()));` |

## Parameter Options

- `xiaozhi_begin_websocket.PROTOCOL`: `1`, `2`, `3`.
- `xiaozhi_audio_preset.BOARD`: `NULLLAB_AI_VOX3`, `NULLLAB_AI_VOX`, `OJ_ESP32S3_BASIC`, `OJ_ESP32S3_OJOY`.
- `xiaozhi_audio_i2s.BUS`: `SIMPLEX`, `DUPLEX`.
- `xiaozhi_audio_i2s.CHANNEL`: `Left`, `Right`.
- `xiaozhi_start_listening.MODE`: `AutoStop`, `ManualStop`, `Realtime`.
- `xiaozhi_abort_speaking.REASON`: `None`, `WakeWordDetected`.
- `xiaozhi_ready.STATUS`: `ready`, `running`, `sessionReady`.
- `xiaozhi_is_state.STATE`: `Unknown`, `Starting`, `WifiConfiguring`, `Idle`, `Connecting`, `Listening`, `Speaking`, `Upgrading`, `Activating`, `AudioTesting`, `FatalError`.
- `xiaozhi_event_is.EVENT`: `Stt`, `TtsSentence`, `Emotion`, `Alert`, `Custom`, `RebootRequested`, `UnknownMessage`.
- `xiaozhi_event_text.FIELD`: `text`, `emotion`, `status`, `json`.
- `xiaozhi_activation.FIELD`: `activationCode`, `activationMessage`.
- `xiaozhi_error.FIELD`: `lastError`, `errorName`.
- `xiaozhi_state_event.FIELD`: `eventState`, `previousState`.
- `xiaozhi_audio_meta.FIELD`: `opus_bytes`, `timestamp`, `sample_rate`, `frame_duration_ms`, `channels`.
- `xiaozhi_stats.FIELD`: `commands_rejected`, `callbacks_dropped`, `playback_first_audio_timeouts`, `playback_inter_packet_timeouts`, `service_cycle_overruns`.
- `xiaozhi_on_event.EVENT`: `ALL`, `Stt`, `TtsSentence`, `Emotion`, `Alert`, `Custom`, `RebootRequested`, `UnknownMessage`.

## Audio Wiring

Preset GPIO numbers below come from the bundled board headers. DATA directions are from the ESP32: speaker DATA is an output, microphone DATA is an input. -1 means unused. These are audio connections only.

| BOARD | Codec | I2C SDA/SCL | MCLK | Speaker BCLK/WS/DATA | Microphone BCLK/WS/DATA | PA enable | Input/output rate |
|---|---|---|---|---|---|---|---|
| NULLLAB_AI_VOX3 | ES8311 | 13/12 | 11 | 10/8/7 | 10/8/9 | -1 | 16/16 kHz |
| NULLLAB_AI_VOX | Direct I2S | unused | -1 | 13/14/1 | 5/2/4 | -1 | 16/24 kHz |
| OJ_ESP32S3_BASIC | ES8311 | 41/42 | 46 | 39/2/38 | 39/2/40 | -1 | 24/24 kHz |
| OJ_ESP32S3_OJOY | ES8311 | 5/4 | 6 | 14/12/11 | 14/12/13 | 9 | 24/24 kHz |

## ABS Examples

### Official voice conversation (NULLLAB AI-VOX3)

Set the correct audio board and WiFi credentials. Read the activation code on Serial and complete device activation with the service. After startup, send lowercase t from the serial monitor to toggle a conversation. Event blocks are top-level; their order relative to setup does not affect registration.

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    xiaozhi_create()
    xiaozhi_audio_preset(NULLLAB_AI_VOX3, FALSE)
    esp32_wifi_set_mode(WIFI_STA)
    esp32_wifi_set_auto_reconnect(TRUE)
    esp32_wifi_begin(text("YOUR_WIFI_SSID"), text("YOUR_WIFI_PASSWORD"))
    xiaozhi_begin_official()

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_read(Serial, "read()"), EQ, math_number(116))
        @DO0:
            controls_if()
                @IF0: logic_operation(esp32_wifi_is_connected(), AND, xiaozhi_ready(ready))
                @DO0:
                    xiaozhi_toggle_chat()
    time_delay(math_number(1))

xiaozhi_on_activation()
    serial_println(Serial, xiaozhi_activation(activationCode))

xiaozhi_on_error()
    serial_println(Serial, xiaozhi_error(lastError))

xiaozhi_on_event(Stt)
    serial_println(Serial, xiaozhi_event_text(text))

xiaozhi_on_event(TtsSentence)
    serial_println(Serial, xiaozhi_event_text(text))

xiaozhi_on_event(Emotion)
    serial_println(Serial, xiaozhi_event_text(emotion))
```

### Headless MCP tool with a Boolean argument

This registers a tool that echoes its Boolean argument. Add bounded GPIO control in HANDLER when needed. The audio-free example does not capture or play speech.

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    xiaozhi_create()
    esp32_wifi_set_mode(WIFI_STA)
    esp32_wifi_set_auto_reconnect(TRUE)
    esp32_wifi_begin(text("YOUR_WIFI_SSID"), text("YOUR_WIFI_PASSWORD"))
    xiaozhi_begin_official()

arduino_loop()
    controls_if()
        @IF0: logic_compare(serial_read(Serial, "read()"), EQ, math_number(116))
        @DO0:
            controls_if()
                @IF0: logic_operation(esp32_wifi_is_connected(), AND, xiaozhi_ready(ready))
                @DO0:
                    xiaozhi_toggle_chat()
    time_delay(math_number(1))

xiaozhi_on_activation()
    serial_println(Serial, xiaozhi_activation(activationCode))

xiaozhi_on_error()
    serial_println(Serial, xiaozhi_error(lastError))

xiaozhi_tool(text("device.echo"), text("Return the enabled argument"))
    @PROPERTIES:
        xiaozhi_property_boolean("enabled", TRUE, logic_boolean(TRUE))
    @HANDLER:
        xiaozhi_return_boolean(xiaozhi_argument_boolean(text("enabled")))
```

## Notes

**AEC 与语音打断**：未使用 xiaozhi_features 时，协议 v2 默认启用服务器 AEC 和语音打断；v1/v3 默认关闭两者，toggle_chat 使用 AutoStop，避免没有播放时间戳时产生回声自打断。显式设置 xiaozhi_features 会覆盖此策略，启用前需确认服务器支持相应协议的 AEC；BARGE_IN=TRUE 要求 AEC=TRUE，否则立即拒绝并可通过 last_operation/error 读取原因。显式选择 Realtime 也应先确认回声消除条件。

**I2S 声道**：CHANNEL=Left/Right 选择麦克风在线路上的时隙；SIMPLEX/DUPLEX 都以单声道 DMA 接收，后续始终读取唯一的第 0 路采样。不会把 Right 错当成 DMA 缓冲区的第二路。

1. **Default client and lifecycle**: xiaozhi_create() initializes the shared default client. Every client block uses the same internal global AilyXiaozhi xiaozhiClient, registered through generator.addVariable; there is no object-name field or Blockly client variable. Setup, loop and independent event hats share this client regardless of root traversal order. Its declaration and automatic loop() call are emitted once, even with repeated initialization blocks. Do not add manual Client::loop() or ClientRuntime::loop() calls. No begin() call is made before Arduino setup.
2. **Setup order**: initialize Xiaozhi, select audio, configure features/timeouts, connect WiFi, then choose exactly one startup route. Calls to beginOfficial()/beginWebSocket() request startup; the next Arduino loop starts it after WiFi connects. ready is local runtime readiness; sessionReady means the server hello handshake completed. Beginning a runtime does not itself start listening; request listening, toggle chat, or signal a wake word. Accepted controls are queued, not confirmation of server completion. ManualStop requires stop_listening. AutoStop delegates endpointing to the server; Realtime keeps capture active during playback. toggleChat/wake entry can use Realtime when server AEC and voice barge-in are enabled.
3. **Activation and errors**: official provisioning uses the endpoint and CA bundled by upstream, stable device identity and NTP. It may synchronously wait for HTTP/NTP on the Arduino task during startup. Activation-only responses and startup failures retry after 30 seconds. on_activation exposes code/message; complete activation externally. Protocol/audio tasks are separate once running. A server-closed conversation returns to idle; a later request starts a new one. Connection attempts retain bounded retries. on_error runs for startup and runtime errors; synchronous configuration failures are available in lastError/lastOperation. A later successful operation does not erase historical errors except successful startup.
4. **Custom service**: use begin_websocket instead of begin_official. Replace the URL/token and provide the actual PEM root CA for wss://; the empty toolbox CA intentionally fails validation until filled. Certificate storage belongs to the client and remains valid during connection. Secure custom startup waits for a valid clock via NTP; ws:// is plain transport. Blank custom IDs use MAC/persistent UUID; official provisioning overrides custom IDs. Protocol 1/2/3 is selected explicitly.
5. **Stopping**: stop cancels pending retries and defers nonblocking teardown to loop, including when called in an ordinary event callback. Continue running the main loop. Reconfigure only after shutdown completes. Configuration while running is rejected. close_session closes the voice channel while keeping the runtime available for a later listening request.
6. **Audio target and dependencies**: use ESP32 Arduino Core 3.x (compiled here against 3.3.11). Bundled Opus is precompiled for ESP32-S3 only; audio blocks reject other targets. Headless core use does not include the audio dependencies. Sources bundle ArduinoJson 7.4.3, ArduinoWebsockets 0.5.4, EspressifOpus 2.2.1 and EspressifEs8311 1.5.6. An ESP32-S3 with PSRAM is recommended for audio. For AI-VOX3 choose OPI PSRAM, 16 MB flash and Huge APP without wake; select flash/PSRAM settings that match the actual board. A 3.3 V compatibility entry refers to logic levels, not a speaker power supply.
7. **One audio block per sketch**: choose audio_preset, audio_es8311, audio_i2s or audio_pdm in setup, before startup. Audio configuration is copied into a static object on first execution. Profiles are compile-time exclusive; changing wiring requires regenerating/uploading the sketch. The same I2S peripheral must not be initialized by another audio library. Presets configure audio only, leaving display/button/LED control to other libraries.
8. **Manual audio**: ES8311 uses shared I2S0 at 16 kHz, stereo 16-bit slots, left capture, I2C address 0x18 and active-high PA (-1 disables PA control). Default pins match AI-VOX3. I2S SIMPLEX uses output I2S0 at 24 kHz/input I2S1 at 16 kHz. DUPLEX uses shared I2S0 at 24 kHz and ignores IN_BCLK/IN_WS in favor of OUT_BCLK/OUT_WS; connect the microphone to those shared clocks. I2S uses 32-bit slots/24-bit mic data and configurable shift. PDM input uses I2S0 at 16 kHz and speaker output I2S1 at 24 kHz. Manual audio disables local wake detection.
9. **Wake and gains**: audio_preset WAKE=FALSE is the default. WAKE=TRUE emits useBundledWakeModel(), includes ESP_SR.h and selects wn9_nihaoxiaozhi_tts. The library embeds the verified ESP-SR 2.4.6 model (291,042 bytes) into the application. Before starting audio it requires PSRAM and a dedicated model/data/spiffs partition, compares its contents, writes a differing model and verifies it. Matching images are not erased; failed/interrupted writes retry. Select ESP SR 16M on 16 MB hardware, or provide a custom model partition >=0x48000; its offset is read dynamically (including 0x610000 and 0xC10000). No partition table is generated or modified. This replaces other contents in that dedicated partition. Budget roughly 285 KiB extra application flash. Wake-disabled sketches do not link or install the model. wake_word only submits an external wake event; on_wake observes accepted events. OJoy additionally uses output -12 dB, playback microphone gain 12 dB (normal 24 dB), speech conditioning (gate 40, target 2200, maximum gain 16), local AEC during playback, wake interruption and threshold 0.55. Other presets retain their board-specific gains. See models/README.md and its ESPRESSIF MIT license.
10. **Event snapshots**: event_text, event_is and emotion_id refer to the last protocol event, which is replaced on each event. Read them in the corresponding on_event handler; save values in your own variables if needed later. RAW_JSON=FALSE leaves json empty; retention is bounded to 2048 bytes by upstream default. State event fields are captured old/new states; state queries the current runtime snapshot. Capture, wake and audio metadata are latest callback snapshots. Multiple event hats are chained in generation order; ALL receives every event. RebootRequested is only an event and does not reboot automatically. Emotion IDs map to upstream Emotion (0 unknown, 1 neutral, 2 happy through 21 confused); the raw emotion string is preserved.
11. **MCP scope**: put property blocks only in a tool's PROPERTIES input; argument/return blocks only in HANDLER. Tool registrations run at the end of setup, after user variable initialization and before the first automatic loop starts the runtime. Tool names must be unique. REQUIRED=TRUE ignores DEFAULT and requires a supplied argument; FALSE passes the default to the upstream property factory. Integers have inclusive MIN/MAX constraints. Missing or mismatched reads return empty string, 0, or false. Each handler defaults to Text("OK") if no return executes. JSON/error returns use their dedicated McpResult factories.
12. **MCP task boundary**: handlers execute synchronously on the runtime service task. Keep work bounded; do not delay, perform HTTP/display I/O, mutate client configuration or access client snapshots. Xiaozhi client blocks inside HANDLER are rejected by the generator. For slow device work, publish a bounded command to application code and return an acceptance result. Generic shared Blockly variables need application-level synchronization across tasks. This library does not wrap camera, display rendering, firmware flashing, raw Opus buffers, custom codec callbacks or upstream internal task/ISR APIs.
13. **Validation**: the 0.0.2 update adds generator/model-byte regression tests and native C++ model-installer tests covering installation, no-write reuse, both partition offsets, missing PSRAM/partition, undersized partitions, I/O errors, corrupted readback and interrupted-write recovery. Compile/link checks cover ESP32-S3 wake-enabled and wake-disabled generated sketches on Arduino Core 3.3.11. Actual acoustic wake, playback and TLS operation need a device test of this package; tested remains false. See SOURCE.md for reproduction.

**Runtime memory**: generated sketches set the Arduino loop stack to 16 KiB. Startup installs a PSRAM-first TLS allocator with internal-memory fallback, makes allocations >=1 KiB prefer PSRAM when present, disables WiFi sleep, limits JSON/audio payloads to 4096/1275 bytes and uses bounded transport pools. Network task stacks use PSRAM when BOARD_HAS_PSRAM is selected. These allocator changes affect the application globally. With local wake selected, default server voice barge-in is disabled so AutoStop leaves RX available for wake interruption; explicit feature blocks can override this choice.

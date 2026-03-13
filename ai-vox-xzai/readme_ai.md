# 小智AI

Arduino版小智AI，基于AI Vox语音交互引擎支持库，适用于ESP32、ESP32S3开发板。

## Library Info
- **Name**: @aily-project/lib-esp32-xzai
- **Version**: 0.0.7

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task` | Statement | TASK(dropdown), CORE(dropdown), INTERVAL(input_value) | `esp32_task(1, 0, math_number(1000))` | `` |
| `esp32_serial_init` | Statement | SERIAL_PORT(dropdown), RX_PIN(dropdown), TX_PIN(dropdown), BAUDRATE(dropdown) | `esp32_serial_init(Serial, RX_PIN, TX_PIN, 9600)` | `` |
| `esp32ai_button_setup` | Statement | PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `esp32ai_button_setup(PIN, INPUT, TRUE)` | `` |
| `esp32ai_init_wifi` | Statement | MODE(dropdown) | `esp32ai_init_wifi(Manual)` | `` |
| `esp32ai_button_click` | Statement | (none) | `esp32ai_button_click()` | `` |
| `esp32ai_button_double_click` | Statement | (none) | `esp32ai_button_double_click()` | `` |
| `esp32ai_button_long_pressing` | Statement | (none) | `esp32ai_button_long_pressing()` | `` |
| `esp32_i2s_mic_setup` | Statement | MIC_TYPE(dropdown) | `esp32_i2s_mic_setup(AUDIO_INPUT_DEVICE_TYPE_I2S_STD)` | `` |
| `esp32ai_i2s_speaker_setup` | Statement | SCK_PIN(dropdown), WS_PIN(dropdown), SD_PIN(dropdown) | `esp32ai_i2s_speaker_setup(SCK_PIN, WS_PIN, SD_PIN)` | `` |
| `esp32ai_init_display` | Statement | DISPLAY_TYPE(dropdown) | `esp32ai_init_display(ST7789)` | `` |
| `esp32ai_init_nlvgl_display` | Statement | DISPLAY_TYPE(dropdown), ROTATION(dropdown) | `esp32ai_init_nlvgl_display(nST7789, LV_DISPLAY_ROTATION_0)` | `` |
| `aivox_config_ota_url` | Statement | ai_vox_ota_url(input_value) | `aivox_config_ota_url(math_number(0))` | `ai_vox_engine.SetOtaUrl(...);\n` |
| `aivox_config_websocket` | Statement | ai_vox_websocket_url(input_value) | `aivox_config_websocket(math_number(0))` | `ai_vox_engine.ConfigWebsocket(..., ...);\n` |
| `esp32ai_start_engine` | Statement | (none) | `esp32ai_start_engine()` | (dynamic code) |
| `aivox_display_mode` | Statement | display_mode(dropdown) | `aivox_display_mode(normal)` | `` |
| `aivox3_set_es8311_volume` | Statement | aivox3_es8311_volume(input_value) | `aivox3_set_es8311_volume(math_number(0))` | `g_audio_output_device->set_volume(...);\n` |
| `aivox3_set_screen_light` | Statement | aivox3_screen_light(input_value) | `aivox3_set_screen_light(math_number(0))` | `` |
| `esp32ai_wake_engine` | Statement | (none) | `esp32ai_wake_engine()` | `ai_vox::Engine::GetInstance().Advance();\n` |
| `esp32ai_sendtext` | Statement | sendmessage(input_value) | `esp32ai_sendtext(text("hello"))` | (dynamic code) |
| `aivox_lcd_show_status` | Statement | location(dropdown), ai_vox_content(input_value) | `aivox_lcd_show_status(ShowStatus, math_number(0))` | (dynamic code) |
| `esp32ai_state_change_root` | Statement | (none) | `esp32ai_state_change_root()` | `` |
| `esp32ai_state_change_case` | Statement | STATE(dropdown) | `esp32ai_state_change_case(kIdle)` | `case ai_vox::ChatState::...:\n` |
| `aivox3_ST77789TurnOnBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOnBacklight_engine()` | `g_display->TurnOnBacklight();\n` |
| `aivox3_ST77789TurnOffBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOffBacklight_engine()` | `g_display->TurnOffBacklight();\n` |
| `esp32ai_loop_activation` | Hat | (none) | `esp32ai_loop_activation()` | `` |
| `get_aivox_activation_message` | Value | activation_type(dropdown) | `get_aivox_activation_message(code)` | `...` |
| `esp32ai_loop_emotion` | Hat | (none) | `esp32ai_loop_emotion()` | `` |
| `get_aivox_emotion_result` | Value | (none) | `get_aivox_emotion_result()` | (dynamic code) |
| `aivox_emotion` | Value | emotion(dropdown) | `aivox_emotion(happy)` | `emotion ==` |
| `aivox_emotion_list` | Value | emotion(dropdown) | `aivox_emotion_list(happy)` | (dynamic code) |
| `esp32ai_loop_chat_message` | Hat | (none) | `esp32ai_loop_chat_message()` | `` |
| `aivox_loop_chat_message_role_var` | Value | chat_role(dropdown) | `aivox_loop_chat_message_role_var(Assistant)` | `role == ai_vox::ChatRole::k...` |
| `aivox_mcp_register_control_command` | Statement | MODE(dropdown), NAME(input_value) | `aivox_mcp_register_control_command(regular, math_number(0))` | `` |
| `aivox_mcp_control_param` | Value | VAR(field_input), TYPE(dropdown) | `aivox_mcp_control_param("state", Boolean)` | (dynamic code) |
| `esp32ai_mcp_control_param` | Statement | VAR(field_input), TYPE(dropdown) | `esp32ai_mcp_control_param("state", Boolean)` | (dynamic code) |
| `aivox_mcp_control` | Value | VAR(field_input), DESC(input_value) | `aivox_mcp_control("led", math_number(0))` | `\` |
| `aivox_loop_chat_message_msg_var` | Value | (none) | `aivox_loop_chat_message_msg_var()` | (dynamic code) |
| `esp32ai_loop_mcp` | Hat | (none) | `esp32ai_loop_mcp()` | `` |
| `esp32ai_loop_mcp_new` | Hat | MODE(dropdown) | `esp32ai_loop_mcp_new(regular)` | `cJSON_AddItemToObject(root,` |
| `aivox_get_iot_message_event_name` | Value | ai_vox_mcp_control_name(input_value) | `aivox_get_iot_message_event_name(math_number(0))` | — |
| `aivox_get_iot_message_event_name_new` | Value | VAR(field_variable) | `aivox_get_iot_message_event_name_new($led)` | (dynamic code) |
| `aivox_state_control_message_event_fuction` | Value | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_state(input_value) | `aivox_state_control_message_event_fuction(math_number(0), math_number(0))` | — |
| `aivox_control_message_event_fuction` | Value | VAR(field_variable), PVAR(field_variable) | `aivox_control_message_event_fuction($led, $state)` | `(event.param<...>(` |
| `aivox_response_mcp_control_result` | Statement | ai_vox_mcp_control_name(input_value) | `aivox_response_mcp_control_result(math_number(0))` | — |
| `aivox_response_mcp_control_result_new` | Statement | VAR(field_variable) | `aivox_response_mcp_control_result_new($led)` | `ai_vox_engine.SendMcpCallResponse(id, true);\n` |
| `aivox_update_mcp_control_state_new` | Statement | VAR(field_variable), PVAR(field_variable), STATE(input_value) | `aivox_update_mcp_control_state_new($led, $state, math_number(0))` | `// Error: Parameter` |
| `aivox_calculateupdate_mcp_control_state` | Statement | VAR(field_variable), PVAR(field_variable) | `aivox_calculateupdate_mcp_control_state($led, $state)` | (dynamic code) |
| `esp32ai_selget_mcp_control` | Statement | VAR(field_variable) | `esp32ai_selget_mcp_control($led)` | (dynamic code) |
| `lvgl_port_lock` | Value | TIMEOUT_MS(field_number) | `lvgl_port_lock(1000)` | `lvgl_port_lock(` |
| `lvgl_port_unlock` | Statement | (none) | `lvgl_port_unlock()` | `lvgl_port_unlock();\n` |
| `esp32ai_lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `esp32ai_lvgl_obj_set_style_text_font($obj, font_puhui_14_1)` | `lv_obj_set_style_text_font(..., ..., 0);\n` |
| `esp32ai_emotion_select` | Value | CATEGORY(dropdown) | `esp32ai_emotion_select(EMOJI)` | (dynamic code) |
| `lvgl_label_set_text_emotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_emotion($label, text("hello"))` | `lv_label_set_text(` |
| `lvgl_label_set_text_cpemotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_cpemotion($label, text("hello"))` | `😶` |
| `aivox3_init_es8311` | Statement | (none) | `aivox3_init_es8311()` | `` |
| `esp32ai_init_es8388` | Statement | (none) | `esp32ai_init_es8388()` | `` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TASK | 1, 2, 3, 4, 5, 6, 7, 8 | 任务1 / 任务2 / 任务3 / 任务4 / 任务5 / 任务6 / 任务7 / 任务8 |
| CORE | 0, 1 | 核心0 / 核心1 |
| SERIAL_PORT | Serial, Serial1, Serial2 | Serial / Serial1 / Serial2 |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200, 256000, 500000 | 9600 / 19200 / 38400 / 57600 / 115200 / 256000 / 500000 |
| PIN_MODE | INPUT, INPUT_PULLUP | 普通输入 / 上拉输入 |
| ACTIVE_LOW | TRUE, FALSE | 是 / 否 |
| MODE | Manual | 手动配网 |
| MIC_TYPE | AUDIO_INPUT_DEVICE_TYPE_I2S_STD, AUDIO_INPUT_DEVICE_TYPE_PDM | I2S标准 / PDM |
| DISPLAY_TYPE | ST7789, SSD1306 | ST7789 (SPI，240x240) / SSD1306 (I2C, 128x64) |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DISPLAY_ROTATION_270 | 0° / 90° / 180° / 270° |
| display_mode | normal, wechat | 普通 / 微信对话 |
| location | ShowStatus, SetEmotion, SetChatMessage | 状态框 / 表情框 / 内容框 |
| STATE | kIdle, kInitted, kLoading, kLoadingFailed, kStandby, kConnecting, kListening, kSpeaking | 空闲 (Idle) / 已初始化 (Initted) / 加载中 (Loading) / 加载失败 (LoadingFailed) / 待命 (Standby) / 连接中 (Connecting) / 聆听中 (Listening) / 说话中 (Speaking) |
| activation_type | code, message | 激活码 / 激活网址 |
| emotion | happy, cool, laughing, funny, sad, angry, crying, loving, embarrassed, surprised, shocked, thinking, winking, relaxed, delicious, kissy, confident, sleepy, silly, confused | 高兴 / 酷炫 / 大笑 / 搞笑 / 忧伤 / 生气 / 哭泣 / 喜欢 / 尴尬 / 惊讶 / 震惊 / 思考 / 调皮 / 放松 / 享受 / 亲亲 / 自信 / 困倦 / 搞怪 / 困惑 |
| chat_role | Assistant, User | 助手回复 / 用户询问 |
| TYPE | Boolean, Number, String | 布尔值 (Boolean) / 数值 (Number) / 字符串 (String) |
| FONT | font_puhui_14_1, font_awesome_30_1, font_awesome_14_1, font_puhui_16_4, font_awesome_30_4, font_awesome_16_4, font_emoji_32_init() | 单色屏文本14号字体 / 单色屏30号大图标 / 单色屏14号小图标 / 彩屏文本16号字体 / 彩屏黑色功能图标30号 / 彩屏黑色功能图标16号 / 彩屏情绪32号 |
| CATEGORY | EMOJI, BATTERY, WIFI, SIGNAL, VOLUME, MEDIA, ARROW, FUNCTION | 表情类 / 电池类 / WiFi类 / 信号类 / 音量类 / 媒体控制类 / 箭头类 / 功能图标类 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_serial_init(Serial, RX_PIN, TX_PIN, 9600)
    esp32ai_button_setup(PIN, INPUT, TRUE)
    esp32ai_init_wifi(Manual)
    esp32_i2s_mic_setup(AUDIO_INPUT_DEVICE_TYPE_I2S_STD)
    esp32ai_i2s_speaker_setup(SCK_PIN, WS_PIN, SD_PIN)
    esp32ai_init_display(ST7789)
    esp32ai_init_nlvgl_display(nST7789, LV_DISPLAY_ROTATION_0)
    aivox3_init_es8311()
    esp32ai_init_es8388()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, get_aivox_activation_message(code))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

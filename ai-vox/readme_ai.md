# AI语音交互

Arduino版小智AI，AI Vox语音交互引擎支持库，用于ESP32系列开发板。

## Library Info
- **Name**: @aily-project/lib-ai-vox
- **Version**: 2.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `aivox3_init_wifi` | Statement | MODE(dropdown) | `aivox3_init_wifi(Manual)` | `` |
| `aivox3_get_wifi_state` | Value | (none) | `aivox3_get_wifi_state()` | — |
| `aivox3_wifi_state` | Value | STATE(dropdown) | `aivox3_wifi_state(kConnecting)` | `wifi_configurator->WaitStateChanged() == WifiConfigurator::State::...` |
| `aivox3_init_es8311` | Statement | (none) | `aivox3_init_es8311()` | `` |
| `aivox3_set_es8311_volume` | Statement | aivox3_es8311_volume(input_value) | `aivox3_set_es8311_volume(math_number(0))` | `g_audio_output_device->set_volume(...);\n` |
| `aivox3_set_screen_light` | Statement | aivox3_screen_light(input_value) | `aivox3_set_screen_light(math_number(0))` | `analogWrite(kDisplayBacklightPin, ...);\n` |
| `aivox_init_mic` | Statement | (none) | `aivox_init_mic()` | `` |
| `aivox_init_audio` | Statement | (none) | `aivox_init_audio()` | `` |
| `aivox_init_lcd` | Statement | backLight(dropdown), MOSI(dropdown), CLK(dropdown), DC(dropdown), RST(dropdown), CS(dropdown) | `aivox_init_lcd(16, 21, 17, 14, -1, 15)` | `` |
| `aivox_display_mode` | Statement | display_mode(dropdown) | `aivox_display_mode(normal)` | `` |
| `aivox_lcd_show_status` | Statement | location(dropdown), ai_vox_content(input_value) | `aivox_lcd_show_status(ShowStatus, math_number(0))` | (dynamic code) |
| `aivox_config_ota_url` | Statement | ai_vox_ota_url(input_value) | `aivox_config_ota_url(math_number(0))` | `ai_vox_engine.SetObserver(g_observer);\nai_vox_engine.SetOtaUrl(...);\n` |
| `aivox_config_websocket` | Statement | ai_vox_websocket_url(input_value), ai_vox_websocket_param(input_value) | `aivox_config_websocket(math_number(0), math_number(0))` | `ai_vox_engine.ConfigWebsocket(..., ...);\n` |
| `aivox3_start_engine` | Statement | (none) | `aivox3_start_engine()` | (dynamic code) |
| `aivox_lcd_show_chat_message` | Statement | ai_vox_display_role(dropdown), ai_vox_chat_message(input_value) | `aivox_lcd_show_chat_message(Display::Role::kSystem, text("hello"))` | — |
| `aivox_lcd_show_emotion` | Statement | ai_vox_emotion(input_value) | `aivox_lcd_show_emotion(math_number(0))` | — |
| `aivox_mcp_register_state_control_command` | Statement | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_desc(input_value), ai_vox_mcp_control_param(input_value) | `aivox_mcp_register_state_control_command(math_number(0), math_number(0), math_number(0))` | — |
| `aivox_mcp_register_value_control_command` | Statement | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_desc(input_value), ai_vox_mcp_control_param(input_value), ai_vox_mcp_control_value_min(input_value), ai_vox_mcp_control_value_max(input_value) | `aivox_mcp_register_value_control_command(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | — |
| `aivox_mcp_register_control_command` | Statement | NAME(input_value) | `aivox_mcp_register_control_command(math_number(0))` | `` |
| `aivox_mcp_control` | Value | VAR(field_input), DESC(input_value) | `aivox_mcp_control("led", math_number(0))` | `\` |
| `aivox_mcp_control_param` | Value | VAR(field_input), TYPE(dropdown) | `aivox_mcp_control_param("state", Boolean)` | (dynamic code) |
| `aivox_loop_activation` | Hat | DO(input_statement) | `aivox_loop_activation()` @DO: ... | `` |
| `get_aivox_activation_message` | Value | activation_type(dropdown) | `get_aivox_activation_message(code)` | `...` |
| `aivox_loop_emotion` | Hat | DO(input_statement) | `aivox_loop_emotion()` @DO: ... | `` |
| `get_aivox_emotion_result` | Value | (none) | `get_aivox_emotion_result()` | (dynamic code) |
| `aivox_emotion` | Value | emotion(dropdown) | `aivox_emotion(happy)` | `emotion ==` |
| `aivox_emotion_list` | Value | emotion(dropdown) | `aivox_emotion_list(happy)` | (dynamic code) |
| `aivox_loop_state_change` | Hat | chat_state(dropdown), DO(input_statement) | `aivox_loop_state_change(Idle)` @DO: ... | `` |
| `aivox_state` | Value | STATEVAR(field_variable), state(dropdown) | `aivox_state(variables_get($state), ai_vox::ChatState::kIdle)` | — |
| `aivox_loop_chat_message` | Hat | DO(input_statement) | `aivox_loop_chat_message()` @DO: ... | `` |
| `aivox_loop_chat_message_role_var` | Value | chat_role(dropdown) | `aivox_loop_chat_message_role_var(assistant)` | `role ==` |
| `aivox_loop_chat_message_msg_var` | Value | (none) | `aivox_loop_chat_message_msg_var()` | (dynamic code) |
| `aivox_loop_mcp` | Hat | DO(input_statement) | `aivox_loop_mcp()` @DO: ... | `` |
| `aivox_get_iot_message_event_name` | Value | ai_vox_mcp_control_name(input_value) | `aivox_get_iot_message_event_name(math_number(0))` | — |
| `aivox_get_iot_message_event_name_new` | Value | VAR(field_variable) | `aivox_get_iot_message_event_name_new(variables_get($led))` | (dynamic code) |
| `aivox_state_control_message_event_fuction` | Value | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_state(input_value) | `aivox_state_control_message_event_fuction(math_number(0), math_number(0))` | — |
| `aivox_control_message_event_fuction` | Value | VAR(field_variable), PVAR(field_variable) | `aivox_control_message_event_fuction(variables_get($led), variables_get($state))` | (dynamic code) |
| `aivox_response_mcp_control_result` | Statement | ai_vox_mcp_control_name(input_value) | `aivox_response_mcp_control_result(math_number(0))` | — |
| `aivox_response_mcp_control_result_new` | Statement | VAR(field_variable) | `aivox_response_mcp_control_result_new(variables_get($led))` | `ai_vox_engine.SendMcpCallResponse(id, true);\n` |
| `aivox_update_mcp_control_state_new` | Statement | VAR(field_variable), PVAR(field_variable), STATE(input_value) | `aivox_update_mcp_control_state_new(variables_get($led), variables_get($state), math_number(0))` | `if (` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | Manual | 手动配网 |
| STATE | kConnecting, kFinished |  WIFI连接中 /  WIFI连接完成 |
| backLight | 16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | GPIO16 / GPIO0 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| MOSI | 21, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | GPIO21 / GPIO0 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| CLK | 17, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | GPIO17 / GPIO0 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| DC | 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | GPIO14 / GPIO0 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| RST | -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | 无 / GPIO0 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| CS | 15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, -1 | GPIO15 / GPIO1 / GPIO2 / GPIO3 / GPIO4 / GPIO5 / GPIO6 / GPIO7 / GPIO8 / GPIO9 / GPIO10 / GPIO11 / GPIO12 / GPIO13 / GPIO14 / GPIO15 / GPIO16 / GPIO17 / GPIO18 / GPIO19 / GPIO20 / GPIO21 / GPIO35 / GPIO36 / GPIO37 / GPIO38 / GPIO39 / GPIO40 / GPIO41 / GPIO42 / GPIO43 / GPIO44 / GPIO45 / GPIO46 / GPIO47 / GPIO48 / 无 |
| display_mode | normal, wechat | 普通 / 微信对话 |
| location | ShowStatus, SetEmotion, SetChatMessage | 状态框 / 表情框 / 内容框 |
| ai_vox_display_role | Display::Role::kSystem, Display::Role::kAssistant, Display::Role::kUser | 系统 (System) / 助手 (Assistant) / 用户 (User) |
| TYPE | Boolean, Number | 布尔值 (Boolean) / 数值 (Number) |
| activation_type | code, message | 激活码 / 激活网址 |
| emotion | happy, cool, laughing, funny, sad, angry, crying, loving, embarrassed, surprised, shocked, thinking, winking, relaxed, delicious, kissy, confident, sleepy, silly, confused | 高兴 / 酷炫 / 大笑 / 搞笑 / 忧伤 / 生气 / 哭泣 / 喜欢 / 尴尬 / 惊讶 / 震惊 / 思考 / 调皮 / 放松 / 享受 / 亲亲 / 自信 / 困倦 / 搞怪 / 困惑 |
| chat_state | Idle, Initted, Loading, LoadingFailed, Standby, Connecting, Listening, Speaking | 空闲中 / 初始化完成 / 加载协议中 / 加载协议失败 / 待命 / 连接中 / 聆听中 / 说话中 |
| state | ai_vox::ChatState::kIdle, ai_vox::ChatState::kInitted, ai_vox::ChatState::kLoading, ai_vox::ChatState::kLoadingFailed, ai_vox::ChatState::kStandby, ai_vox::ChatState::kConnecting, ai_vox::ChatState::kListening, ai_vox::ChatState::kSpeaking | 空闲中 / 初始化完成 / 加载协议中 / 加载协议失败 / 待命 / 连接中 / 聆听中 / 说话中 |
| chat_role | assistant, user | 助手回复 / 用户询问 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    aivox3_init_wifi(Manual)
    aivox3_init_es8311()
    aivox_init_mic()
    aivox_init_audio()
    aivox_init_lcd(16, 21, 17, 14, -1, 15)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, aivox_mcp_control("led", math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# AI voice interaction

Arduino version of Xiaozhi AI, AI Vox voice interaction engine support library, used for ESP32 series development boards.

## Library Info
- **Name**: @aily-project/lib-ai-vox
- **Version**: 2.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `aivox3_init_wifi` | Statement | MODE(dropdown) | `aivox3_init_wifi(Manual)` | See generator |
| `aivox3_get_wifi_state` | Value | (none) | `aivox3_get_wifi_state()` | See generator |
| `aivox3_wifi_state` | Value | STATE(dropdown) | `aivox3_wifi_state(kConnecting)` | wifi_configurator->WaitStateChanged() == WifiConfigurator::State::... |
| `aivox3_init_es8311` | Statement | (none) | `aivox3_init_es8311()` | Dynamic code |
| `aivox3_set_es8311_volume` | Statement | aivox3_es8311_volume(input_value) | `aivox3_set_es8311_volume(math_number(0))` | g_audio_output_device->set_volume(...);\n |
| `aivox3_set_screen_light` | Statement | aivox3_screen_light(input_value) | `aivox3_set_screen_light(math_number(0))` | analogWrite(kDisplayBacklightPin, ...);\n |
| `aivox_init_mic` | Statement | (none) | `aivox_init_mic()` | Dynamic code |
| `aivox_init_audio` | Statement | (none) | `aivox_init_audio()` | Dynamic code |
| `aivox_init_lcd` | Statement | backLight(dropdown), MOSI(dropdown), CLK(dropdown), DC(dropdown), RST(dropdown), CS(dropdown) | `aivox_init_lcd("16", "21", "17", "14", "-1", "15")` | Dynamic code |
| `aivox_display_mode` | Statement | display_mode(dropdown) | `aivox_display_mode(normal)` | Dynamic code |
| `aivox_lcd_show_status` | Statement | location(dropdown), ai_vox_content(input_value) | `aivox_lcd_show_status(ShowStatus, math_number(0))` | Dynamic code |
| `aivox_config_ota_url` | Statement | ai_vox_ota_url(input_value) | `aivox_config_ota_url(text("value"))` | ai_vox_engine.SetObserver(g_observer);\nai_vox_engine.SetOtaUrl(...);\n |
| `aivox_config_websocket` | Statement | ai_vox_websocket_url(input_value), ai_vox_websocket_param(input_value) | `aivox_config_websocket(text("value"), math_number(0))` | ai_vox_engine.ConfigWebsocket(..., ...);\n |
| `aivox3_start_engine` | Statement | (none) | `aivox3_start_engine()` | ai_vox_engine.Start(...);\n ESP_ERROR_CHECK(iot_button_register_cb( g_button_boot_handle, |
| `aivox_lcd_show_chat_message` | Statement | ai_vox_display_role(dropdown), ai_vox_chat_message(input_value) | `aivox_lcd_show_chat_message(Display::Role::kSystem, text("value"))` | See generator |
| `aivox_lcd_show_emotion` | Statement | ai_vox_emotion(input_value) | `aivox_lcd_show_emotion(math_number(0))` | See generator |
| `aivox_mcp_register_state_control_command` | Statement | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_desc(input_value), ai_vox_mcp_control_param(input_value) | `aivox_mcp_register_state_control_command(math_number(0), math_number(0), math_number(0))` | See generator |
| `aivox_mcp_register_value_control_command` | Statement | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_desc(input_value), ai_vox_mcp_control_param(input_value), ai_vox_mcp_control_value_min(input_value),... | `aivox_mcp_register_value_control_command(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `aivox_mcp_register_control_command` | Statement | NAME(input_value), INPUT0(input_value) | `aivox_mcp_register_control_command(math_number(0), math_number(0))` | Dynamic code |
| `aivox_mcp_control` | Value | VAR(field_input), DESC(input_value) | `aivox_mcp_control("led", math_number(0))` | Dynamic code |
| `aivox_mcp_control_param` | Value | VAR(field_input), TYPE(dropdown) | `aivox_mcp_control_param("state", Boolean)` | Dynamic code |
| `aivox_loop_activation` | Hat | DO(input_statement) | `aivox_loop_activation() @DO: child_block()` | Dynamic code |
| `get_aivox_activation_message` | Value | activation_type(dropdown) | `get_aivox_activation_message(code)` | Dynamic code |
| `aivox_loop_emotion` | Hat | DO(input_statement) | `aivox_loop_emotion() @DO: child_block()` | Dynamic code |
| `get_aivox_emotion_result` | Value | (none) | `get_aivox_emotion_result()` | Dynamic code |
| `aivox_emotion` | Value | emotion(dropdown) | `aivox_emotion(happy)` | emotion == "..." |
| `aivox_emotion_list` | Value | emotion(dropdown) | `aivox_emotion_list(happy)` | Dynamic code |
| `aivox_loop_state_change` | Hat | chat_state(dropdown), DO(input_statement) | `aivox_loop_state_change(Idle) @DO: child_block()` | Dynamic code |
| `aivox_state` | Value | STATEVAR(field_variable), state(dropdown) | `aivox_state(variables_get($state), ai_vox::ChatState::kIdle)` | See generator |
| `aivox_loop_chat_message` | Hat | DO(input_statement) | `aivox_loop_chat_message() @DO: child_block()` | Dynamic code |
| `aivox_loop_chat_message_role_var` | Value | chat_role(dropdown) | `aivox_loop_chat_message_role_var(assistant)` | role == "..." |
| `aivox_loop_chat_message_msg_var` | Value | (none) | `aivox_loop_chat_message_msg_var()` | Dynamic code |
| `aivox_loop_mcp` | Hat | DO(input_statement) | `aivox_loop_mcp() @DO: child_block()` | Dynamic code |
| `aivox_get_iot_message_event_name` | Value | ai_vox_mcp_control_name(input_value) | `aivox_get_iot_message_event_name(math_number(0))` | See generator |
| `aivox_get_iot_message_event_name_new` | Value | VAR(field_variable) | `aivox_get_iot_message_event_name_new(variables_get($led))` | "..." == name |
| `aivox_state_control_message_event_fuction` | Value | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_state(input_value) | `aivox_state_control_message_event_fuction(math_number(0), math_number(0))` | See generator |
| `aivox_control_message_event_fuction` | Value | VAR(field_variable), PVAR(field_variable) | `aivox_control_message_event_fuction(variables_get($led), variables_get($state))` | Dynamic code |
| `aivox_response_mcp_control_result` | Statement | ai_vox_mcp_control_name(input_value) | `aivox_response_mcp_control_result(math_number(0))` | See generator |
| `aivox_response_mcp_control_result_new` | Statement | VAR(field_variable) | `aivox_response_mcp_control_result_new(variables_get($led))` | ai_vox_engine.SendMcpCallResponse(id, true);\n |
| `aivox_update_mcp_control_state_new` | Statement | VAR(field_variable), PVAR(field_variable), STATE(input_value) | `aivox_update_mcp_control_state_new(variables_get($led), variables_get($state), math_number(0))` | if ("self.....get" == name) {\n ai_vox_engine.SendMcpCallResponse(id, ...);\n} |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | Manual | aivox3_init_wifi |
| STATE | kConnecting, kFinished | aivox3_wifi_state |
| backLight | 16, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ... | aivox_init_lcd |
| MOSI | 21, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ... | aivox_init_lcd |
| CLK | 17, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ... | aivox_init_lcd |
| DC | 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ... | aivox_init_lcd |
| RST | -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ... | aivox_init_lcd |
| CS | 15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, ... | aivox_init_lcd |
| display_mode | normal, wechat | aivox_display_mode |
| location | ShowStatus, SetEmotion, SetChatMessage | aivox_lcd_show_status |
| ai_vox_display_role | Display::Role::kSystem, Display::Role::kAssistant, Display::Role::kUser | aivox_lcd_show_chat_message |
| TYPE | Boolean, Number | aivox_mcp_control_param |
| activation_type | code, message | get_aivox_activation_message |
| emotion | happy, cool, laughing, funny, sad, angry, crying, loving, embarrassed, surprised, shocked, thinking, winking, relaxed, delicious, kissy, confident, sleepy, silly, confused | aivox_emotion, aivox_emotion_list |
| chat_state | Idle, Initted, Loading, LoadingFailed, Standby, Connecting, Listening, Speaking | aivox_loop_state_change |
| state | ai_vox::ChatState::kIdle, ai_vox::ChatState::kInitted, ai_vox::ChatState::kLoading, ai_vox::ChatState::kLoadingFailed, ai_vox::ChatState::kStandby, ai_vox::ChatState::kConnecting, ai_vox::ChatState::kListening, ai_vox... | aivox_state |
| chat_role | assistant, user | aivox_loop_chat_message_role_var |

## ABS Examples

### Basic Usage
```
arduino_setup()
    aivox3_init_wifi(Manual)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, aivox3_get_wifi_state())
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `aivox_mcp_control("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `aivox3_init_wifi`, `aivox3_init_es8311`, `aivox_init_mic`, `aivox_init_audio`, `aivox_mcp_control_param` may add fields at runtime through Blockly extensions.

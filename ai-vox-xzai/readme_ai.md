# Xiaozhi AI

Xiaozhi AI for Arduino is based on the AI ​​Vox voice interaction engine support library and is suitable for ESP32 and ESP32S3 development boards.

## Library Info
- **Name**: @aily-project/lib-esp32-xzai
- **Version**: 0.0.7

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_task` | Hat | TASK(dropdown), CORE(dropdown), INTERVAL(input_value), csCALLBACK(input_statement), CALLBACK(input_statement) | `esp32_task("1", "0", math_number(1000)) @csCALLBACK: child_block() @CALLBACK: child_block()` | Dynamic code |
| `esp32_serial_init` | Statement | SERIAL_PORT(dropdown), RX_PIN(dropdown), TX_PIN(dropdown), BAUDRATE(dropdown) | `esp32_serial_init(Serial, RX_PIN, TX_PIN, "9600")` | Dynamic code |
| `esp32ai_button_setup` | Statement | PIN(dropdown), PIN_MODE(dropdown), ACTIVE_LOW(dropdown) | `esp32ai_button_setup(PIN, INPUT, TRUE)` | Dynamic code |
| `esp32ai_init_wifi` | Statement | MODE(dropdown) | `esp32ai_init_wifi(Manual)` | See generator |
| `esp32ai_button_click` | Hat | HANDLER(input_statement) | `esp32ai_button_click() @HANDLER: child_block()` | Dynamic code |
| `esp32ai_button_double_click` | Hat | HANDLER(input_statement) | `esp32ai_button_double_click() @HANDLER: child_block()` | Dynamic code |
| `esp32ai_button_long_pressing` | Hat | HANDLER(input_statement) | `esp32ai_button_long_pressing() @HANDLER: child_block()` | Dynamic code |
| `esp32_i2s_mic_setup` | Statement | MIC_TYPE(dropdown) | `esp32_i2s_mic_setup(AUDIO_INPUT_DEVICE_TYPE_I2S_STD)` | Dynamic code |
| `esp32ai_i2s_speaker_setup` | Statement | SCK_PIN(dropdown), WS_PIN(dropdown), SD_PIN(dropdown) | `esp32ai_i2s_speaker_setup(SCK_PIN, WS_PIN, SD_PIN)` | Dynamic code |
| `esp32ai_init_display` | Statement | DISPLAY_TYPE(dropdown) | `esp32ai_init_display(ST7789)` | Dynamic code |
| `esp32ai_init_nlvgl_display` | Statement | DISPLAY_TYPE(dropdown), ROTATION(dropdown) | `esp32ai_init_nlvgl_display(nST7789, LV_DISPLAY_ROTATION_0)` | Dynamic code |
| `aivox_config_ota_url` | Statement | ai_vox_ota_url(input_value) | `aivox_config_ota_url(text("value"))` | ai_vox_engine.SetOtaUrl(...);\n |
| `aivox_config_websocket` | Statement | ai_vox_websocket_url(input_value), ai_vox_websocket_param(input_value) | `aivox_config_websocket(text("value"), math_number(0))` | ai_vox_engine.ConfigWebsocket(..., ...);\n |
| `esp32ai_start_engine` | Statement | (none) | `esp32ai_start_engine()` | Dynamic code |
| `aivox_display_mode` | Statement | display_mode(dropdown) | `aivox_display_mode(normal)` | Dynamic code |
| `aivox3_set_es8311_volume` | Statement | aivox3_es8311_volume(input_value) | `aivox3_set_es8311_volume(math_number(0))` | g_audio_output_device->set_volume(...);\n |
| `aivox3_set_screen_light` | Statement | aivox3_screen_light(input_value) | `aivox3_set_screen_light(math_number(0))` | See generator |
| `esp32ai_wake_engine` | Statement | (none) | `esp32ai_wake_engine()` | ai_vox::Engine::GetInstance().Advance();\n |
| `esp32ai_sendtext` | Statement | sendmessage(input_value) | `esp32ai_sendtext(text("value"))` | Dynamic code |
| `aivox_lcd_show_status` | Statement | location(dropdown), ai_vox_content(input_value) | `aivox_lcd_show_status(ShowStatus, math_number(0))` | Dynamic code |
| `esp32ai_state_change_root` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_state_change_root() @STATE_HANDLERS: child_block()` | Dynamic code |
| `esp32ai_state_change_case` | Statement | STATE(dropdown), DO(input_statement) | `esp32ai_state_change_case(kIdle) @DO: child_block()` | case ai_vox::ChatState::...:\n |
| `aivox3_ST77789TurnOnBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOnBacklight_engine()` | g_display->TurnOnBacklight();\n |
| `aivox3_ST77789TurnOffBacklight_engine` | Statement | (none) | `aivox3_ST77789TurnOffBacklight_engine()` | g_display->TurnOffBacklight();\n |
| `esp32ai_loop_activation` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_activation() @STATE_HANDLERS: child_block()` | Dynamic code |
| `get_aivox_activation_message` | Value | activation_type(dropdown) | `get_aivox_activation_message(code)` | Dynamic code |
| `esp32ai_loop_emotion` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_emotion() @STATE_HANDLERS: child_block()` | Dynamic code |
| `get_aivox_emotion_result` | Value | (none) | `get_aivox_emotion_result()` | Dynamic code |
| `aivox_emotion` | Value | emotion(dropdown) | `aivox_emotion(happy)` | emotion == "..." |
| `aivox_emotion_list` | Value | emotion(dropdown) | `aivox_emotion_list(happy)` | Dynamic code |
| `esp32ai_loop_chat_message` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_chat_message() @STATE_HANDLERS: child_block()` | Dynamic code |
| `aivox_loop_chat_message_role_var` | Value | chat_role(dropdown) | `aivox_loop_chat_message_role_var(Assistant)` | role == ai_vox::ChatRole::k... |
| `aivox_mcp_register_control_command` | Statement | MODE(dropdown), NAME(input_value), INPUT0(input_value) | `aivox_mcp_register_control_command(regular, math_number(0), math_number(0))` | Dynamic code |
| `aivox_mcp_control_param` | Value | VAR(field_input), TYPE(dropdown) | `aivox_mcp_control_param("state", Boolean)` | Dynamic code |
| `esp32ai_mcp_control_param` | Statement | VAR(field_input), TYPE(dropdown) | `esp32ai_mcp_control_param("state", Boolean)` | Dynamic code |
| `aivox_mcp_control` | Value | VAR(field_input), DESC(input_value) | `aivox_mcp_control("led", math_number(0))` | Dynamic code |
| `aivox_loop_chat_message_msg_var` | Value | (none) | `aivox_loop_chat_message_msg_var()` | Dynamic code |
| `esp32ai_loop_mcp` | Hat | STATE_HANDLERS(input_statement) | `esp32ai_loop_mcp() @STATE_HANDLERS: child_block()` | Dynamic code |
| `esp32ai_loop_mcp_new` | Hat | MODE(dropdown), VAR(field_input), DESC(input_value), params_list(input_statement) | `esp32ai_loop_mcp_new(regular, "led", math_number(0)) @params_list: child_block()` | cJSON_AddItemToObject(root, "...", cJSON_CreateBool(...)); |
| `aivox_get_iot_message_event_name` | Value | ai_vox_mcp_control_name(input_value) | `aivox_get_iot_message_event_name(math_number(0))` | See generator |
| `aivox_get_iot_message_event_name_new` | Value | VAR(field_variable) | `aivox_get_iot_message_event_name_new(variables_get($led))` | "..." == name |
| `aivox_state_control_message_event_fuction` | Value | ai_vox_mcp_control_name(input_value), ai_vox_mcp_control_state(input_value) | `aivox_state_control_message_event_fuction(math_number(0), math_number(0))` | See generator |
| `aivox_control_message_event_fuction` | Value | VAR(field_variable), PVAR(field_variable) | `aivox_control_message_event_fuction(variables_get($led), variables_get($state))` | (event.param<...>("...") != nullptr) ? *event.param<...>("...") : ... |
| `aivox_response_mcp_control_result` | Statement | ai_vox_mcp_control_name(input_value) | `aivox_response_mcp_control_result(math_number(0))` | See generator |
| `aivox_response_mcp_control_result_new` | Statement | VAR(field_variable) | `aivox_response_mcp_control_result_new(variables_get($led))` | ai_vox_engine.SendMcpCallResponse(id, true);\n |
| `aivox_update_mcp_control_state_new` | Statement | VAR(field_variable), PVAR(field_variable), STATE(input_value) | `aivox_update_mcp_control_state_new(variables_get($led), variables_get($state), math_number(0))` | // Error: Parameter '...' not found. Cannot update MCP control state. |
| `aivox_calculateupdate_mcp_control_state` | Statement | VAR(field_variable), PVAR(field_variable), CODE_BLOCK(input_statement) | `aivox_calculateupdate_mcp_control_state(variables_get($led), variables_get($state)) @CODE_BLOCK: child_block()` | if ("self.....get" == name) { ... ...; ... ... } |
| `esp32ai_selget_mcp_control` | Statement | VAR(field_variable) | `esp32ai_selget_mcp_control(variables_get($led))` | Dynamic code |
| `lvgl_port_lock` | Value | TIMEOUT_MS(field_number) | `lvgl_port_lock(1000)` | lvgl_port_lock( |
| `lvgl_port_unlock` | Statement | (none) | `lvgl_port_unlock()` | lvgl_port_unlock();\n |
| `esp32ai_lvgl_obj_set_style_text_font` | Statement | VAR(field_variable), FONT(dropdown) | `esp32ai_lvgl_obj_set_style_text_font(variables_get($obj), font_puhui_14_1)` | lv_obj_set_style_text_font(..., ..., 0);\n |
| `esp32ai_emotion_select` | Value | CATEGORY(dropdown) | `esp32ai_emotion_select(EMOJI)` | Dynamic code |
| `lvgl_label_set_text_emotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_emotion(variables_get($label), text("value"))` | lv_label_set_text( |
| `lvgl_label_set_text_cpemotion` | Statement | VAR(field_variable), TEXT(input_value) | `lvgl_label_set_text_cpemotion(variables_get($label), text("value"))` | lv_label_set_text(..., ...);\n |
| `aivox3_init_es8311` | Statement | (none) | `aivox3_init_es8311()` | Dynamic code |
| `esp32ai_init_es8388` | Statement | (none) | `esp32ai_init_es8388()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TASK | 1, 2, 3, 4, 5, 6, 7, 8 | esp32_task |
| CORE | 0, 1 | esp32_task |
| SERIAL_PORT | Serial, Serial1, Serial2 | esp32_serial_init |
| BAUDRATE | 9600, 19200, 38400, 57600, 115200, 256000, 500000 | esp32_serial_init |
| PIN_MODE | INPUT, INPUT_PULLUP | esp32ai_button_setup |
| ACTIVE_LOW | TRUE, FALSE | esp32ai_button_setup |
| MODE | Manual | esp32ai_init_wifi |
| MIC_TYPE | AUDIO_INPUT_DEVICE_TYPE_I2S_STD, AUDIO_INPUT_DEVICE_TYPE_PDM | esp32_i2s_mic_setup |
| DISPLAY_TYPE | ST7789, SSD1306 | esp32ai_init_display |
| DISPLAY_TYPE | nST7789, nSSD1306 | esp32ai_init_nlvgl_display |
| ROTATION | LV_DISPLAY_ROTATION_0, LV_DISPLAY_ROTATION_90, LV_DISPLAY_ROTATION_180, LV_DISPLAY_ROTATION_270 | esp32ai_init_nlvgl_display |
| display_mode | normal, wechat | aivox_display_mode |
| location | ShowStatus, SetEmotion, SetChatMessage | aivox_lcd_show_status |
| STATE | kIdle, kInitted, kLoading, kLoadingFailed, kStandby, kConnecting, kListening, kSpeaking | esp32ai_state_change_case |
| activation_type | code, message | get_aivox_activation_message |
| emotion | happy, cool, laughing, funny, sad, angry, crying, loving, embarrassed, surprised, shocked, thinking, winking, relaxed, delicious, kissy, confident, sleepy, silly, confused | aivox_emotion, aivox_emotion_list |
| chat_role | Assistant, User | aivox_loop_chat_message_role_var |
| MODE | regular, set_only, report_only | aivox_mcp_register_control_command, esp32ai_loop_mcp_new |
| TYPE | Boolean, Number, String | aivox_mcp_control_param, esp32ai_mcp_control_param |
| FONT | font_puhui_14_1, font_awesome_30_1, font_awesome_14_1, font_puhui_16_4, font_awesome_30_4, font_awesome_16_4, font_emoji_32_init() | esp32ai_lvgl_obj_set_style_text_font |
| CATEGORY | EMOJI, BATTERY, WIFI, SIGNAL, VOLUME, MEDIA, ARROW, FUNCTION | esp32ai_emotion_select |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_serial_init(Serial, RX_PIN, TX_PIN, "9600")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, get_aivox_activation_message(code))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `aivox_mcp_control_param("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `esp32ai_init_wifi`, `esp32_i2s_mic_setup`, `esp32ai_init_display`, `esp32ai_init_nlvgl_display`, `aivox_mcp_control_param`, `esp32ai_mcp_control_param`, `esp32ai_loop_mcp_new`, `esp32ai_selget_mcp_control`, `esp32ai_emotion_select`, `aivox3_init_es8311`, `esp32ai_init_es8388` may add fields at runtime through Blockly extensions.

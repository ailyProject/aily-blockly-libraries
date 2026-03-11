# 智谱AI

智谱AI GLM大语言模型API库，支持文字对话、深度思考、图片理解等功能，适用于ESP32等支持WiFi的开发板

## Library Info
- **Name**: @aily-project/lib-zhipu-glm
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zhipu_glm_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `zhipu_glm_config(math_number(0), math_number(0))` | (dynamic code) |
| `zhipu_glm_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat(text("hello"), glm-4.5-flash)` | `zhipu_simple_request(` |
| `zhipu_glm_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat_with_thinking(text("hello"), glm-4.7)` | `zhipu_simple_request(` |
| `zhipu_glm_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat_with_history(text("hello"), glm-4.5-flash)` | `zhipu_simple_request(` |
| `zhipu_glm_clear_history` | Statement | (none) | `zhipu_glm_clear_history()` | `zhipu_history =` |
| `zhipu_glm_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `zhipu_glm_set_system_prompt(math_number(0))` | `zhipu_system_prompt = ...;\n` |
| `zhipu_glm_get_response_status` | Value | (none) | `zhipu_glm_get_response_status()` | `zhipu_last_success` |
| `zhipu_glm_get_error_message` | Value | (none) | `zhipu_glm_get_error_message()` | `zhipu_last_error` |
| `zhipu_glm_set_stream_callback` | Statement | CALLBACK(input_statement) | `zhipu_glm_set_stream_callback()` @CALLBACK: ... | `zhipu_stream_callback = zhipu_user_stream_callback;\n` |
| `zhipu_glm_get_stream_chunk` | Value | (none) | `zhipu_glm_get_stream_chunk()` | `zhipu_stream_chunk` |
| `zhipu_glm_clear_stream_callback` | Statement | (none) | `zhipu_glm_clear_stream_callback()` | `zhipu_stream_callback = NULL;\n` |
| `zhipu_glm_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_chat(math_number(0), text("hello"), glm-4.6v-flash)` | (dynamic code) |
| `zhipu_glm_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_chat_direct_capture(text("hello"), glm-4.6v-flash)` | (dynamic code) |
| `zhipu_glm_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_url_chat(math_number(0), text("hello"), glm-4.6v-flash)` | (dynamic code) |
| `zhipu_glm_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `zhipu_glm_image_generate(math_number(0), cogview-4, 1024x1024)` | (dynamic code) |
| `zhipu_glm_image_generate_simple` | Value | PROMPT(input_value) | `zhipu_glm_image_generate_simple(math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | glm-4.5-flash, glm-4.7 | glm-4.5-flash (免费) / glm-4.7 (收费) |
| SIZE | 1024x1024, 768x1344, 1344x768, 864x1152, 1152x864, 1440x720, 720x1440 | 1024x1024 / 768x1344 / 1344x768 / 864x1152 / 1152x864 / 1440x720 / 720x1440 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, zhipu_glm_chat(text("hello"), glm-4.5-flash))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

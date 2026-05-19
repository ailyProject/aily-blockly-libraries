# Wisdom spectrum AI

Zhipu AI GLM large language model API library supports text dialogue, in-depth thinking, picture understanding and other functions, and is suitable for ESP32 and other WiFi-enabled development boards.

## Library Info
- **Name**: @aily-project/lib-zhipu-glm
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `zhipu_glm_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `zhipu_glm_config(text("value"), text("value"))` | Dynamic code |
| `zhipu_glm_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat(text("value"), glm-5.1)` | zhipu_simple_request("...", ..., false, false) |
| `zhipu_glm_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat_with_thinking(text("value"), glm-5.1)` | zhipu_simple_request("...", ..., true, false) |
| `zhipu_glm_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_chat_with_history(text("value"), glm-5.1)` | zhipu_simple_request("...", ..., false, true) |
| `zhipu_glm_clear_history` | Statement | (none) | `zhipu_glm_clear_history()` | zhipu_history = |
| `zhipu_glm_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `zhipu_glm_set_system_prompt(text("value"))` | zhipu_system_prompt = ...;\n |
| `zhipu_glm_get_response_status` | Value | (none) | `zhipu_glm_get_response_status()` | zhipu_last_success |
| `zhipu_glm_get_error_message` | Value | (none) | `zhipu_glm_get_error_message()` | zhipu_last_error |
| `zhipu_glm_set_stream_callback` | Statement | CALLBACK(input_statement) | `zhipu_glm_set_stream_callback() @CALLBACK: child_block()` | zhipu_stream_callback = zhipu_user_stream_callback;\n |
| `zhipu_glm_get_stream_chunk` | Value | (none) | `zhipu_glm_get_stream_chunk()` | zhipu_stream_chunk |
| `zhipu_glm_clear_stream_callback` | Statement | (none) | `zhipu_glm_clear_stream_callback()` | zhipu_stream_callback = NULL;\n |
| `zhipu_glm_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_chat(text("value"), text("value"), glm-5v-turbo)` | zhipu_vision_request("...", ..., ...) |
| `zhipu_glm_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_chat_direct_capture(text("value"), glm-5v-turbo)` | zhipu_vision_direct_capture_request("...", ...) |
| `zhipu_glm_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `zhipu_glm_vision_url_chat(text("value"), text("value"), glm-5v-turbo)` | zhipu_vision_url_request("...", ..., ...) |
| `zhipu_glm_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `zhipu_glm_image_generate(text("value"), glm-image, "1024x1024")` | zhipu_image_generate("...", ..., "...") |
| `zhipu_glm_image_generate_simple` | Value | PROMPT(input_value) | `zhipu_glm_image_generate_simple(text("value"))` | zhipu_image_generate("glm-image", ..., "1024x1024") |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | glm-5.1, glm-5, glm-5-turbo, glm-5-air, glm-4.7, glm-4.7-flash, glm-4.7-flashx, glm-4.5-flash | zhipu_glm_chat, zhipu_glm_chat_with_history |
| MODEL | glm-5.1, glm-5, glm-5-air, glm-4.7 | zhipu_glm_chat_with_thinking |
| MODEL | glm-5v-turbo, glm-4.6v, glm-4.6v-flash, glm-4.6v-flashx | zhipu_glm_vision_chat, zhipu_glm_vision_chat_direct_capture, zhipu_glm_vision_url_chat |
| MODEL | glm-image, cogview-4-250304, cogview-4, cogview-3-flash | zhipu_glm_image_generate |
| SIZE | 1024x1024, 768x1344, 1344x768, 864x1152, 1152x864, 1440x720, 720x1440 | zhipu_glm_image_generate |

## ABS Examples

### Basic Usage
```
arduino_setup()
    zhipu_glm_config(text("value"), text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, zhipu_glm_chat(text("value"), glm-5.1))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

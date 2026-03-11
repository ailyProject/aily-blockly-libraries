# 通义千问

阿里云通义千问Qwen大语言模型API库，支持文字对话、多轮对话、图片理解、图像生成等功能，适用于ESP32等支持WiFi的开发板

## Library Info
- **Name**: @aily-project/lib-qwen-omni
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwen_omni_config` | Statement | API_KEY(input_value), BASE_URL(input_value) | `qwen_omni_config(math_number(0), math_number(0))` | (dynamic code) |
| `qwen_omni_chat` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat(text("hello"), qwen-turbo)` | `qwen_simple_request(` |
| `qwen_omni_chat_simple` | Value | MESSAGE(input_value) | `qwen_omni_chat_simple(text("hello"))` | `qwen_simple_request(` |
| `qwen_omni_chat_with_thinking` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_thinking(text("hello"), qwen3-max)` | `qwen_simple_request(` |
| `qwen_omni_chat_with_history` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_chat_with_history(text("hello"), qwen-turbo)` | `qwen_history_request(` |
| `qwen_omni_clear_history` | Statement | (none) | `qwen_omni_clear_history()` | `qwen_chat_history =` |
| `qwen_omni_set_system_prompt` | Statement | SYSTEM_PROMPT(input_value) | `qwen_omni_set_system_prompt(math_number(0))` | `qwen_system_prompt = ...;\n` |
| `qwen_omni_get_response_status` | Value | (none) | `qwen_omni_get_response_status()` | `qwen_last_success` |
| `qwen_omni_get_error_message` | Value | (none) | `qwen_omni_get_error_message()` | `qwen_last_error` |
| `qwen_omni_set_stream_callback` | Statement | CALLBACK(input_statement) | `qwen_omni_set_stream_callback()` @CALLBACK: ... | `qwen_stream_callback = qwen_user_stream_callback;\n` |
| `qwen_omni_get_stream_chunk` | Value | (none) | `qwen_omni_get_stream_chunk()` | `qwen_stream_chunk` |
| `qwen_omni_clear_stream_callback` | Statement | (none) | `qwen_omni_clear_stream_callback()` | `qwen_stream_callback = NULL;\n` |
| `qwen_omni_vision_chat` | Value | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat(math_number(0), text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_vision_chat_direct_capture` | Value | MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_chat_direct_capture(text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_vision_url_chat` | Value | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `qwen_omni_vision_url_chat(math_number(0), text("hello"), qwen3-vl-plus)` | (dynamic code) |
| `qwen_omni_image_generate` | Value | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `qwen_omni_image_generate(math_number(0), wanx2.1-t2i-turbo, 1024*1024)` | (dynamic code) |
| `qwen_omni_image_generate_simple` | Value | PROMPT(input_value) | `qwen_omni_image_generate_simple(math_number(0))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODEL | qwen-turbo, qwen-plus, qwen-max, qwen-long, qwen3-max, qwen-omni-turbo, qwen3-omni-flash | qwen-turbo (快速) / qwen-plus / qwen-max / qwen-long / qwen3-max / qwen-omni-turbo / qwen3-omni-flash |
| SIZE | 1024*1024, 720*1280, 1280*720 | 1024x1024 / 720x1280 / 1280x720 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwen_omni_chat(text("hello"), qwen-turbo))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

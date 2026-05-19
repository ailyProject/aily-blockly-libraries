# DeepSeek AI 积木库说明

这是 Aily 的 DeepSeek 官方 API Blockly 库。

## 必要配置

先使用：

- `deepseek_ai_config`

该积木会生成 ESP32 HTTPS 请求所需的 `WiFi.h`、`HTTPClient.h`、`WiFiClientSecure.h` 引用，以及 API Key、Base URL、状态、历史、流式回调等全局变量。

默认 Base URL：

```text
https://api.deepseek.com
```

## 主要积木

- `deepseek_ai_chat`：非流式单轮对话，返回 `String`
- `deepseek_ai_thinking_chat`：非流式思考模式，返回最终回答，思考内容通过 `deepseek_ai_get_reasoning` 获取
- `deepseek_ai_history_chat`：非流式多轮对话，自动追加 user/assistant 历史
- `deepseek_ai_json_chat`：非流式 JSON 输出模式，提示词必须说明输出 JSON
- `deepseek_ai_stream_chat`：流式对话，触发流式回调
- `deepseek_ai_set_stream_callback`：设置流式片段到达时执行的代码
- `deepseek_ai_get_stream_chunk`：读取当前流式片段
- `deepseek_ai_get_response_status`：读取上次请求成功状态
- `deepseek_ai_get_error_message`：读取上次错误
- `deepseek_ai_clear_history`：清空多轮历史

## 生成逻辑

非流式请求使用：

```cpp
deepseek_ai_request(model, message, enableThinking, reasoningEffort, useHistory, jsonMode)
```

流式请求使用：

```cpp
deepseek_ai_stream_request(model, message, enableThinking, reasoningEffort, useHistory, jsonMode)
```

两者分开，避免流式和非流式行为互相影响。

## 注意

- ESP32 上默认跳过 TLS 证书校验，使用 `WiFiClientSecure::setInsecure()`，便于 Aily 积木直接运行。
- 为避免 ESP32 内存压力，默认设置 `max_tokens`：普通请求 2048，思考模式 4096。
- v4 模型在普通对话中会显式关闭 thinking；思考对话中会启用 thinking。

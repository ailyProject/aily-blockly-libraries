# DeepSeek AI

DeepSeek AI 是一个面向 Aily Blockly 的 DeepSeek 官方 API 积木库，适用于 ESP32 等支持 WiFi 的开发板。

## 功能

- 配置 DeepSeek API Key 和 Base URL
- 单轮文本对话
- 多轮对话，本地保存上下文
- 流式对话回调，可实时处理文本片段
- 思考模式，支持读取 reasoning_content
- JSON 输出模式
- 上次请求状态和错误消息读取

## 使用步骤

1. 连接 WiFi。
2. 放置“配置 DeepSeek API Key”积木，Base URL 默认使用 `https://api.deepseek.com`。
3. 可选：设置系统提示词。
4. 使用“DeepSeek 对话”“DeepSeek 思考对话”“DeepSeek 多轮对话”或“DeepSeek 流式对话”积木。
5. 请求后可读取“DeepSeek 上次请求成功”和“DeepSeek 上次错误消息”调试。

## 模型

默认推荐：

- `deepseek-v4-flash`
- `deepseek-v4-pro`

兼容旧模型：

- `deepseek-chat`
- `deepseek-reasoner`

DeepSeek 官方文档说明旧模型会逐步退役，新项目建议优先使用 v4 系列模型。

## 参考

- DeepSeek 官方文档：https://api-docs.deepseek.com/zh-cn/
- Chat Completions：https://api-docs.deepseek.com/zh-cn/api/create-chat-completion
- 思考模式：https://api-docs.deepseek.com/zh-cn/guides/thinking_mode
- JSON 输出：https://api-docs.deepseek.com/zh-cn/guides/json_mode

# 通义千问 Qwen API 库

阿里云通义千问大语言模型API库，支持文本对话、图片理解和图像生成

## 库信息
- **库名**: @aily-project/lib-qwen-omni
- **版本**: 0.0.2
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `qwen_omni_config` | 语句块 | API_KEY(input_value), BASE_URL(input_value) | 无字段 | 配置API密钥和URL |
| `qwen_omni_chat` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "qwen-turbo"` | 发送消息获取回复 |
| `qwen_omni_chat_simple` | 值块 | MESSAGE(input_value) | 无字段 | 简易对话(默认qwen-turbo) |
| `qwen_omni_chat_with_thinking` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "qwen3-max"` | 深度思考对话 |
| `qwen_omni_chat_with_history` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "qwen-turbo"` | 多轮对话(保存历史) |
| `qwen_omni_vision_chat` | 值块 | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "qwen3-vl-plus"` | Base64图片对话 |
| `qwen_omni_vision_url_chat` | 值块 | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "qwen3-vl-plus"` | 图片URL对话 |
| `qwen_omni_image_generate` | 值块 | PROMPT(input_value), MODEL(dropdown), SIZE(dropdown) | `"MODEL": "wanx2.1-t2i-turbo"` | 生成图片返回URL |
| `qwen_omni_image_generate_simple` | 值块 | PROMPT(input_value) | 无字段 | 简易图片生成 |
| `qwen_omni_clear_history` | 语句块 | 无 | 无字段 | 清空对话历史 |
| `qwen_omni_set_system_prompt` | 语句块 | SYSTEM_PROMPT(input_value) | 无字段 | 设置系统提示词 |
| `qwen_omni_get_response_status` | 值块 | 无 | 无字段 | 获取响应状态 |
| `qwen_omni_get_error_message` | 值块 | 无 | 无字段 | 获取错误信息 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"MODEL": "qwen-turbo"` |
| input_value | 块连接 | `"inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "你好"}}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **input_value**: 建议配置影子块提供默认值

## 使用示例

### 配置API
```json
{
  "type": "qwen_omni_config",
  "id": "unique_id",
  "inputs": {
    "API_KEY": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "sk-your-api-key"}
      }
    },
    "BASE_URL": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "https://dashscope.aliyuncs.com/compatible-mode/v1"}
      }
    }
  }
}
```

### 文本对话
```json
{
  "type": "qwen_omni_chat",
  "id": "unique_id",
  "fields": {
    "MODEL": "qwen-turbo"
  },
  "inputs": {
    "MESSAGE": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "你好"}
      }
    }
  }
}
```

### 图片对话
```json
{
  "type": "qwen_omni_vision_chat",
  "id": "unique_id",
  "fields": {
    "MODEL": "qwen3-vl-plus"
  },
  "inputs": {
    "IMAGE": {
      "block": {
        "type": "esp32_camera_capture_and_encode_base64",
        "id": "image_id"
      }
    },
    "MESSAGE": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "图中描绘的是什么?"}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 每个块的ID必须唯一
2. **连接限制**: 值块不能有next字段
3. **WiFi要求**: 使用前必须连接WiFi
4. **API Key**: 需要有效的阿里云API Key
5. **图片格式**: Base64图片对话需要JPEG格式的Base64编码

## 支持的模型

### 文本模型
- qwen-turbo (快速，推荐)
- qwen-plus, qwen-max, qwen-long
- qwen3-max, qwen3-max-preview (支持深度思考)
- qwen-omni-turbo, qwen3-omni-flash

### 视觉模型
- qwen3-vl-plus (推荐)
- qwen3-vl-flash (快速)
- qwen-vl-max, qwen-vl-plus

### 图像生成模型 (通义万相)
- wanx2.1-t2i-turbo (快速，推荐)
- wanx2.1-t2i-plus
- wanx-v1

### 图像生成尺寸
- 1024x1024 (默认，正方形)
- 720x1280, 1280x720 (竖版/横版)

## 特殊说明

- 多轮对话会自动保存对话历史，使用`清空对话历史`块重置
- 深度思考模式会启用`enable_thinking`参数
- 超时时间: 对话60秒，图像生成120秒
- 响应状态通过`qwen_last_success`变量检查
- 错误信息通过`qwen_last_error`变量获取
- 图像生成使用异步API，会自动轮询等待结果

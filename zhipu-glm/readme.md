# 智谱AI GLM API 库

智谱AI大语言模型API库，支持文本对话、深度思考和图片理解

## 库信息
- **库名**: @aily-project/lib-zhipu-glm
- **版本**: 0.0.2
- **兼容**: esp32:esp32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `zhipu_glm_config` | 语句块 | API_KEY(input_value), BASE_URL(input_value) | 无字段 | 配置API密钥和URL |
| `zhipu_glm_chat` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "glm-4.5-flash"` | 发送消息获取回复 |
| `zhipu_glm_chat_with_thinking` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "glm-4.7"` | 深度思考对话 |
| `zhipu_glm_chat_with_history` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "glm-4.5-flash"` | 多轮对话 |
| `zhipu_glm_vision_chat` | 值块 | IMAGE(input_value), MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "glm-4.6v-flash"` | Base64图片对话 |
| `zhipu_glm_vision_url_chat` | 值块 | IMAGE_URL(input_value), MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "glm-4.6v-flash"` | 图片URL对话 |
| `zhipu_glm_clear_history` | 语句块 | 无 | 无字段 | 清空对话历史 |
| `zhipu_glm_set_system_prompt` | 语句块 | SYSTEM_PROMPT(input_value) | 无字段 | 设置系统提示词 |
| `zhipu_glm_get_response_status` | 值块 | 无 | 无字段 | 获取响应状态 |
| `zhipu_glm_get_error_message` | 值块 | 无 | 无字段 | 获取错误信息 |
| `zhipu_glm_image_generate` | 值块 | PROMPT(input_value), SIZE(dropdown) | `"SIZE": "1024x1024"` | 生成图片返回URL |
| `zhipu_glm_image_generate_simple` | 值块 | PROMPT(input_value) | 无字段 | 简易图片生成 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"MODEL": "glm-4.5-flash"` |
| input_value | 块连接 | `"inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "你好"}}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **input_value**: 建议配置影子块提供默认值

## 使用示例

### 配置API
```json
{
  "type": "zhipu_glm_config",
  "id": "unique_id",
  "inputs": {
    "API_KEY": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "your-api-key"}
      }
    },
    "BASE_URL": {
      "shadow": {
        "type": "text",
        "fields": {"TEXT": "https://open.bigmodel.cn/api/paas/v4"}
      }
    }
  }
}
```

### 文本对话
```json
{
  "type": "zhipu_glm_chat",
  "id": "unique_id",
  "fields": {
    "MODEL": "glm-4.5-flash"
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

## 重要规则

1. **必须遵守**: 每个块的ID必须唯一
2. **连接限制**: 值块不能有next字段
3. **WiFi要求**: 使用前必须连接WiFi
4. **API Key**: 需要有效的智谱AI API Key
5. **图片格式**: Base64图片对话需要JPEG格式的Base64编码

## 支持的模型

### 文本模型
- glm-4.5-flash (免费，快速，推荐)
- glm-4.7 (收费，支持深度思考)

### 视觉模型
- glm-4.6v-flash (免费，快速，推荐)
- glm-4.6v (收费，支持深度思考)
- glm-4.6v-flashx (收费，快速)

### 图像生成模型
- CogView-4 (高清美感图片)
- CogView-3-Flash (完全免费)

### 图像生成尺寸
- 1024x1024 (默认，正方形)
- 768x1344, 1344x768 (竖版/横版)
- 864x1152, 1152x864
- 720x1440, 1440x720

## 特殊说明

- 深度思考模式会自动设置`thinking.type`为`enabled`
- 超时时间: 对话60秒，图像生成120秒
- 响应状态通过`zhipu_last_success`变量检查
- 错误信息通过`zhipu_last_error`变量获取
- 支持通过URL直接传入网络图片进行分析
- 图像生成返回图片URL，有效期有限
- 图片URL可配合adafruit_GFX库的"下载URL图片并显示"积木在TFT屏幕上显示

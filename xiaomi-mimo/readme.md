# 小米MiMo AI 库

小米MiMo AI大模型API库，支持文字对话、图片理解、音频理解、视频理解和语音合成等功能，适用于ESP32等支持WiFi的开发板

## 库信息
- **库名**: @aily-project/lib-xiaomi-mimo
- **版本**: 1.0.0
- **兼容**: esp32:esp32 / esp32:esp32c3 / esp32:esp32s3 / esp32:esp32c6 / esp32:esp32h2

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `mimo_config` | 语句块 | API_KEY(input_value), BASE_URL(input_value) | 无字段 | 配置API密钥和URL |
| `mimo_chat` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "mimo-v2.5"` | 发送消息获取回复 |
| `mimo_chat_with_history` | 值块 | MESSAGE(input_value), MODEL(dropdown) | `"MODEL": "mimo-v2.5"` | 多轮对话 |
| `mimo_clear_history` | 语句块 | 无 | 无字段 | 清空对话历史 |
| `mimo_set_system_prompt` | 语句块 | SYSTEM_PROMPT(input_value) | 无字段 | 设置系统提示词 |
| `mimo_image_understand_url` | 值块 | IMAGE_URL(input_value), MESSAGE(input_value) | 无字段 | 图片URL理解 |
| `mimo_image_understand_base64` | 值块 | IMAGE_BASE64(input_value), MESSAGE(input_value) | 无字段 | Base64图片理解 |
| `mimo_image_understand_capture` | 值块 | MESSAGE(input_value) | 无字段 | 摄像头拍照理解 |
| `mimo_audio_understand` | 值块 | AUDIO_URL(input_value), MESSAGE(input_value) | 无字段 | 音频URL理解 |
| `mimo_audio_understand_base64` | 值块 | AUDIO_BASE64(input_value), MESSAGE(input_value) | 无字段 | Base64音频理解 |
| `mimo_video_understand` | 值块 | VIDEO_URL(input_value), MESSAGE(input_value), FPS(dropdown) | `"FPS": "2"` | 视频URL理解 |
| `mimo_video_understand_base64` | 值块 | VIDEO_BASE64(input_value), MESSAGE(input_value), FPS(dropdown) | `"FPS": "2"` | Base64视频理解 |
| `mimo_tts` | 值块 | TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `"VOICE": "冰糖", "MODEL": "mimo-v2.5-tts"` | 语音合成 |
| `mimo_tts_with_style` | 值块 | TEXT(input_value), VOICE(dropdown), MODEL(dropdown), STYLE(input_value) | `"VOICE": "冰糖", "MODEL": "mimo-v2.5-tts"` | 带风格语音合成 |
| `mimo_tts_voice_design` | 值块 | VOICE_DESC(input_value), TEXT(input_value) | 无字段 | 音色设计合成 |
| `mimo_play_tts` | 语句块 | VAR(field_variable), BASE64_AUDIO(input_value) | 无字段 | Base64解码并I2S播放WAV |
| `mimo_tts_and_play` | 语句块 | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown) | `"VOICE": "冰糖", "MODEL": "mimo-v2.5-tts"` | 语音合成并I2S播放 |
| `mimo_tts_and_play_with_style` | 语句块 | VAR(field_variable), TEXT(input_value), VOICE(dropdown), MODEL(dropdown), STYLE(input_value) | `"VOICE": "冰糖", "MODEL": "mimo-v2.5-tts"` | 带风格语音合成并I2S播放 |
| `mimo_tts_and_play_voice_design` | 语句块 | VAR(field_variable), VOICE_DESC(input_value), TEXT(input_value) | 无字段 | 音色设计合成并I2S播放 |
| `mimo_tts_stream_play` | 语句块 | VAR(field_variable), TEXT(input_value), VOICE(dropdown) | `"VOICE": "mimo_default"` | 流式语音合成并I2S播放(PCM16) |
| `mimo_tts_stream_play_with_style` | 语句块 | VAR(field_variable), TEXT(input_value), VOICE(dropdown), STYLE(input_value) | `"VOICE": "mimo_default"` | 带风格流式语音合成并I2S播放 |
| `mimo_get_response_status` | 值块 | 无 | 无字段 | 获取响应状态 |
| `mimo_get_error_message` | 值块 | 无 | 无字段 | 获取错误信息 |
| `mimo_set_stream_callback` | 语句块 | CALLBACK(input_statement) | 无字段 | 设置流式回调 |
| `mimo_get_stream_chunk` | 值块 | 无 | 无字段 | 获取流式片段 |
| `mimo_clear_stream_callback` | 语句块 | 无 | 无字段 | 清除流式回调 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"MODEL": "mimo-v2.5"`, `"VOICE": "冰糖"` |
| input_value | 块连接 | `"inputs": {"MESSAGE": {"shadow": {"type": "text", "fields": {"TEXT": "你好"}}}}` |
| input_statement | 块连接 | `"inputs": {"CALLBACK": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **input_value**: 建议配置影子块提供默认值

## 使用示例

### 配置API
```json
{
  "type": "mimo_config",
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
        "fields": {"TEXT": "https://api.xiaomimimo.com/v1"}
      }
    }
  }
}
```

### 文本对话
```json
{
  "type": "mimo_chat",
  "id": "unique_id",
  "fields": {
    "MODEL": "mimo-v2.5"
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
4. **API Key**: 需要有效的小米MiMo API Key
5. **图片格式**: 支持JPEG、PNG、GIF、WebP、BMP格式
6. **音频格式**: 支持MP3、WAV、FLAC、M4A、OGG格式
7. **视频格式**: 支持MP4、MOV、AVI、WMV格式

## 支持的模型

### 理解模型
- mimo-v2.5 (多模态理解)
- mimo-v2-omni (全能理解)

### 语音合成模型
- mimo-v2.5-tts (预置音色，非流式，返回完整WAV)
- mimo-v2-tts (预置音色，支持流式播放，返回PCM16)
- mimo-v2.5-tts-voicedesign (音色设计)

### 预置音色

#### MiMo-V2-TTS 音色
| 音色 | 标识 | 说明 |
|------|------|------|
| MiMo默认 | mimo_default | V2默认音色 |
| 中文女声 | default_zh | V2中文女声 |
| 英文女声 | default_en | V2英文女声 |

#### MiMo-V2.5-TTS 音色
| 音色 | 语言 | 性别 |
|------|------|------|
| 冰糖 | 中文 | 女声 |
| 茉莉 | 中文 | 女声 |
| 苏打 | 中文 | 男声 |
| 白桦 | 中文 | 男声 |
| Mia | 英文 | 女声 |
| Chloe | 英文 | 女声 |
| Milo | 英文 | 男声 |
| Dean | 英文 | 男声 |

## 特殊说明

- 流式输出支持实时回调
- 超时时间: 对话60秒，图片理解60秒，视频理解120秒，语音合成120秒
- 响应状态通过`mimo_last_success`变量检查
- 错误信息通过`mimo_last_error`变量获取
- 语音合成返回Base64编码的WAV音频数据(24kHz 16bit 单声道)
- I2S播放积木需要配合ESP32 I2S库使用，自动解析WAV头信息(采样率、位深、声道)并配置I2S参数
- "合成并播放"类积木为语句块，需先使用ESP32 I2S积木创建并初始化I2S对象
- 流式播放积木(`mimo_tts_stream_play`)使用PCM16格式，边接收边播放，延迟更低
- 流式播放使用mimo-v2-tts模型，通过SSE返回base64编码的PCM16音频块
- 流式播放不需要解析WAV头，直接将解码后的PCM16数据写入I2S

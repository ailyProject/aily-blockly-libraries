# OpenJumper TTS 语音合成模块

OpenJumper TTS语音合成模块，将文本实时转换为语音输出，支持数字播报、内置音效、参数调节

## 库信息
- **库名**: @aily-project/lib-tts
- **版本**: 0.0.1
- **兼容**: 通用（Arduino UNO/Nano、ESP32/ESP8266等支持软串口的板卡）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `openjumper_tts_init` | 语句块 | RX_PIN(dropdown), TX_PIN(dropdown) | `"RX_PIN":"2", "TX_PIN":"3"` | `TTS.begin(115200);` |
| `openjumper_tts_play_invoice` | 语句块 | VOICE_TYPE(dropdown), VOICE_NUM(input) | `"VOICE_TYPE":"VOICE_Ringtones"` | `TTS.PlayPromptSound(type,num);` |
| `openjumper_tts_play_control` | 语句块 | CONTROL_ACTION(dropdown) | `"CONTROL_ACTION":"PLAY_STOP"` | `TTS.playcontrol(0);` |
| `openjumper_tts_play_number` | 语句块 | NUMBER(input) | 无字段 | `TTS.PlayNumber(123);` |
| `openjumper_tts_play_text` | 语句块 | TEXT(input) | 无字段 | `TTS.PlayText("你好");` |
| `openjumper_tts_setcfg` | 语句块 | SP_TYPE(dropdown), CFGV(input) | `"SP_TYPE":"setVolume"` | `TTS.setVolume(5);` |
| `openjumper_tts_restore_defaults` | 语句块 | 无 | 无字段 | `TTS.RestoreDefaultValues();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown(引脚) | 字符串 | `"RX_PIN": "2"` |
| field_dropdown(音效类型) | 字符串 | `"VOICE_TYPE": "VOICE_Ringtones"` (铃声/提示音/警示音) |
| field_dropdown(控制动作) | 字符串 | `"CONTROL_ACTION": "PLAY_STOP"` (停止/暂停/继续) |
| field_dropdown(参数类型) | 字符串 | `"SP_TYPE": "setVolume"` (语速/语调/音量) |
| input_value(数字) | 块连接 | `"inputs": {"NUMBER": {"block": {...}}}` |
| input_value(文本) | 块连接 | `"inputs": {"TEXT": {"block": {...}}}` |

## 连接规则

- **语句块**: 所有块均为语句块，有previousStatement/nextStatement，通过`next`字段连接
- **输入连接**: `VOICE_NUM`、`NUMBER`、`TEXT`、`CFGV`通过`inputs`字段连接值块
- **初始化顺序**: 必须先调用`openjumper_tts_init`初始化，再使用其他功能块
- **参数范围**: 
  - 内置音效编号：1-5
  - 语速/语调/音量：0-10

### 动态选项处理
`RX_PIN`和`TX_PIN`字段使用`"options": "${board.digitalPins}"`，需从board.json获取数字引脚选项

## 使用示例

### TTS初始化
```json
{
  "type": "openjumper_tts_init",
  "id": "init1",
  "fields": {
    "RX_PIN": "2",
    "TX_PIN": "3"
  }
}
```

### 播放文本
```json
{
  "type": "openjumper_tts_play_text",
  "id": "play1",
  "inputs": {
    "TEXT": {
      "block": {
        "type": "text",
        "fields": {"TEXT": "欢迎使用语音合成模块"}
      }
    }
  }
}
```

### 播放数字
```json
{
  "type": "openjumper_tts_play_number",
  "id": "num1",
  "inputs": {
    "NUMBER": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 123}
      }
    }
  }
}
```

### 设置音量
```json
{
  "type": "openjumper_tts_setcfg",
  "id": "cfg1",
  "fields": {"SP_TYPE": "setVolume"},
  "inputs": {
    "CFGV": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 8}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**
   - 所有块的`id`字段必须唯一
   - 初始化块必须在setup中调用，其他功能块在loop或条件语句中调用
   - 参数取值必须在有效范围内

2. **连接限制**
   - 所有块均为语句块，必须通过`next`字段连接
   - 输入字段（NUMBER、TEXT等）通过`inputs`字段连接值块，不能直接赋值字符串

3. **常见错误**
   - ❌ 语句块不能作为输入值：`{"inputs": {"VALUE": {"block": {"type": "openjumper_tts_play_text"}}}}`
   - ❌ 未初始化就使用：直接使用功能块而没有先调用`openjumper_tts_init`
   - ❌ 参数超出范围：`"NUM": 15`（音量最大10）

## 支持的功能

| 功能分类 | 支持项 | 参数范围 |
|---------|--------|----------|
| 文本播报 | 中文文本、数字、组合文本 | 任意文本 |
| 内置音效 | 铃声(1-5)、提示音(1-5)、警示音(1-5) | 1-5 |
| 播放控制 | 停止、暂停、继续 | - |
| 参数设置 | 语速、语调、音量 | 0-10 |

**特殊格式标识符**:
- `[n1]文本`: 数字播报模式
- `[n2]文本`: 数值播报模式
- `[n3]文本`: 电话号码播报模式
- `[w0]`: 停顿符

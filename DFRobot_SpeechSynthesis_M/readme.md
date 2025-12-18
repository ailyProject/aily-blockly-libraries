# 语音合成模块

DFRobot语音合成模块库，支持中英文混合播报，多种发音人选择。

## 库信息
- **库名**: @aily-project/lib-speech-synthesis
- **版本**: 1.0.0
- **兼容**: 通用（Arduino AVR、ESP32、ESP8266等）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `speech_init_i2c` | 语句块 | VAR(field_input), WIRE/VERSION(dropdown) | `"VAR":"tts"` | `tts.begin(eV1);` |
| `speech_init_uart` | 语句块 | VAR(field_input), SERIAL/VERSION(dropdown) | `"VAR":"tts"` | `tts.begin(eV1, Serial1);` |
| `speech_speak` | 语句块 | VAR(field_variable), TEXT(input) | `"VAR":{"id":"..."}` | `tts.speak("文字");` |
| `speech_set_volume` | 语句块 | VAR(field_variable), VOLUME(dropdown) | `"VAR":{"id":"..."}` | `tts.setVolume(5);` |
| `speech_set_speed` | 语句块 | VAR(field_variable), SPEED(dropdown) | `"VAR":{"id":"..."}` | `tts.setSpeed(5);` |
| `speech_set_tone` | 语句块 | VAR(field_variable), TONE(dropdown) | `"VAR":{"id":"..."}` | `tts.setTone(5);` |
| `speech_set_sound_type` | 语句块 | VAR(field_variable), TYPE(dropdown) | `"VAR":{"id":"..."}` | `tts.setSoundType(eFemale1);` |
| `speech_set_english_pron` | 语句块 | VAR(field_variable), PRON(dropdown) | `"VAR":{"id":"..."}` | `tts.setEnglishPron(eWord);` |
| `speech_set_language` | 语句块 | VAR(field_variable), LANG(dropdown) | `"VAR":{"id":"..."}` | `tts.setLanguage(eAutoJudgel);` |
| `speech_set_digital_pron` | 语句块 | VAR(field_variable), PRON(dropdown) | `"VAR":{"id":"..."}` | `tts.setDigitalPron(eAutoJudged);` |
| `speech_set_style` | 语句块 | VAR(field_variable), STYLE(dropdown) | `"VAR":{"id":"..."}` | `tts.setSpeechStyle(eSmooth);` |
| `speech_enable_rhythm` | 语句块 | VAR(field_variable), ENABLE(dropdown) | `"VAR":{"id":"..."}` | `tts.enableRhythm(true);` |
| `speech_enable_pinyin` | 语句块 | VAR(field_variable), ENABLE(dropdown) | `"VAR":{"id":"..."}` | `tts.enablePINYIN(true);` |
| `speech_stop` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.stopSynthesis();` |
| `speech_pause` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.pauseSynthesis();` |
| `speech_resume` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.recoverSynthesis();` |
| `speech_wait` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.wait();` |
| `speech_reset` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.reset();` |
| `speech_sleep` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.sleep();` |
| `speech_wakeup` | 语句块 | VAR(field_variable) | `"VAR":{"id":"..."}` | `tts.wakeup();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "tts"` |
| field_dropdown | 字符串 | `"WIRE": "Wire"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"TEXT": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **初始化块**: 使用field_input创建新变量
- **方法块**: 使用field_variable引用已创建的变量

## 发音人类型

| 类型 | 说明 |
|------|------|
| eFemale1 | 女声1（推荐） |
| eMale1 | 男声1（推荐） |
| eMale2 | 男声2 |
| eFemale2 | 女声2 |
| eDonaldDuck | 唐老鸭 |
| eFemale3 | 女声3 |

## 参数范围

| 参数 | 范围 | 默认值 |
|------|------|--------|
| 音量 | 0-9 | 5 |
| 语速 | 0-9 | 5 |
| 语调 | 0-9 | 5 |

## 使用示例

### 基本播报
```
[初始化语音合成模块 tts I2C接口 Wire 版本 V1]
[语音合成 tts 播报 "你好世界"]
[语音合成 tts 等待播报完成]
```

### 设置发音人和音量
```
[初始化语音合成模块 tts I2C接口 Wire 版本 V1]
[语音合成 tts 设置发音人 女声1]
[语音合成 tts 设置音量 7]
[语音合成 tts 设置语速 6]
[语音合成 tts 播报 "欢迎使用语音合成模块"]
```

### 中英文混合播报
```
[初始化语音合成模块 tts I2C接口 Wire 版本 V1]
[语音合成 tts 英文发音方式 单词]
[语音合成 tts 播报 "Hello你好World世界"]
```

## 重要规则

1. **初始化顺序**: 必须先初始化模块，再进行其他操作
2. **版本选择**: V1和V2版本的模块初始化参数不同，请根据实际模块选择
3. **I2C地址**: 默认I2C地址为0x40
4. **等待播报**: 如需确保播报完成后再执行下一步，请使用"等待播报完成"块

## 连接方式

### I2C连接
- VCC → 3.3V/5V
- GND → GND
- SDA → SDA
- SCL → SCL

### 串口连接
- VCC → 3.3V/5V
- GND → GND
- TX → RX
- RX → TX

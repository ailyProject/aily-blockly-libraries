# arduino_tone

发声函数库，控制无源蜂鸣器发出指定频率的声音和预设音乐

## 库信息
- **库名**: @aily-project/lib-core-tone
- **版本**: 0.0.2
- **兼容**: Arduino全系列平台，支持3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `io_tone` | 语句块 | TONEPIN(field_dropdown), FREQUENCY(input_value) | `"fields":{"TONEPIN":"8"},"inputs":{"FREQUENCY":{"block":{...}}}` | `tone(8, frequency);` |
| `io_tone_duration` | 语句块 | TONEPIN(field_dropdown), FREQUENCY(input_value), DURATION(input_value) | `"fields":{"TONEPIN":"8"},"inputs":{"FREQUENCY":{"block":{...}},"DURATION":{"block":{...}}}` | `tone(8, frequency, duration);` |
| `io_system_sound` | 语句块 | TONEPIN(field_dropdown), SOUND_TYPE(field_dropdown) | `"fields":{"TONEPIN":"8","SOUND_TYPE":"startup"}` | `playSystemSound(8, "startup");` |
| `io_note` | 值块 | NOTE(field_dropdown) | `"fields":{"NOTE":"440"}` | `440` |
| `io_music` | 语句块 | TONEPIN(field_dropdown), MUSIC_TYPE(field_dropdown) | `"fields":{"TONEPIN":"8","MUSIC_TYPE":"twinkle"}` | `playMusic(8, "twinkle");` |
| `io_notone` | 语句块 | TONEPIN(field_dropdown) | `"fields":{"TONEPIN":"8"}` | `noTone(8);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"TONEPIN": "8"` |
| input_value | 块连接 | `"inputs": {"FREQUENCY": {"block": {...}}}` |

## 连接规则

- **语句块**: io_tone、io_tone_duration、io_system_sound、io_music、io_notone有previousStatement/nextStatement，通过`next`字段连接
- **值块**: io_note有output，连接到`inputs`中，返回音符对应的频率值
- **特殊规则**: 
  - tone()函数使用定时器，某些引脚可能与PWM功能冲突
  - Arduino UNO同时只能在一个引脚播放音调
  - 系统音效和音乐自动生成播放序列代码
  - noTone()停止指定引脚的音调播放

## 使用示例

### 播放指定频率音调
```json
{
  "type": "io_tone",
  "id": "play_tone",
  "fields": {"TONEPIN": "8"},
  "inputs": {
    "FREQUENCY": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": "1000"}
      }
    }
  }
}
```

### 播放音符
```json
{
  "type": "io_tone_duration",
  "id": "play_note",
  "fields": {"TONEPIN": "8"},
  "inputs": {
    "FREQUENCY": {
      "block": {
        "type": "io_note",
        "fields": {"NOTE": "440"}
      }
    },
    "DURATION": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": "500"}
      }
    }
  }
}
```

### 播放系统音效
```json
{
  "type": "io_system_sound",
  "id": "play_system_sound",
  "fields": {
    "TONEPIN": "8",
    "SOUND_TYPE": "success"
  }
}
```

### 播放简短音乐
```json
{
  "type": "io_music",
  "id": "play_music",
  "fields": {
    "TONEPIN": "8",
    "MUSIC_TYPE": "twinkle"
  }
}
```

## 重要规则

1. **必须遵守**: Arduino UNO同时只能在一个引脚播放音调，多引脚播放需要轮流进行
2. **连接限制**: 音调块是语句块用于播放控制，音符块是值块用于频率选择
3. **引脚选择**: 建议使用数字引脚，避免与其他PWM功能冲突
4. **频率范围**: 人耳可听范围20-20000Hz，蜂鸣器有效范围通常100-5000Hz
5. **常见错误**: ❌ 频率为0或负数，❌ 持续时间过长阻塞程序，❌ 同时多引脚播放音调

## 支持的字段选项
- **TONEPIN(音调引脚)**: 动态生成，支持所有数字引脚
- **SOUND_TYPE(系统音效)**: "startup"(开机), "success"(成功), "error"(错误), "warning"(警告), "notification"(通知), "beep"(短嘟), "doorbell"(门铃), "alarm"(警报), "coin"(金币), "powerdown"(关机)
- **NOTE(音符)**: C4-B5音阶，覆盖261-988Hz范围，包含升半音
- **MUSIC_TYPE(音乐类型)**: "twinkle"(小星星), "birthday"(生日快乐), "castle"(天空之城), "mary"(玛丽有只小羊羔), "joy"(欢乐颂), "mother"(世上只有妈妈好), "bee"(小蜜蜂), "tiger"(两只老虎)

## 技术规格
- **音调函数**: 基于Arduino内置tone()和noTone()函数
- **频率精度**: ±1Hz，受晶振精度影响
- **占空比**: 固定50%方波输出
- **最大频率**: 理论65535Hz，实际受硬件限制
- **定时器使用**: UNO使用Timer2，可能与其他功能冲突
- **功耗**: 播放时约5-20mA额外电流消耗
- **蜂鸣器类型**: 适用于无源蜂鸣器，有源蜂鸣器只需开关控制
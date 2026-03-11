# Emakefun TTS20 语音合成模块

易创空间TTS20语音合成模块，通过I2C接口将文本转换为语音播放，支持15种内置提示音效。

## Library Info
- **Name**: @aily-project/lib-emakefun_tts20
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_tts20_init` | Statement | VAR(field_input), I2C_ADDRESS(dropdown), WIRE(dropdown) | `emakefun_tts20_init("tts20", 0x40, Wire)` | `em::Tts20 tts20(0x40, Wire); tts20.Init();` |
| `emakefun_tts20_play` | Statement | VAR(field_variable), TEXT(input_value) | `emakefun_tts20_play($tts20, text("你好"))` | `tts20.Play("你好");` |
| `emakefun_tts20_play_sound` | Statement | VAR(field_variable), SOUND(dropdown) | `emakefun_tts20_play_sound($tts20, ring_1)` | `tts20.Play(F("ring_1"));` |
| `emakefun_tts20_is_busy` | Value(Boolean) | VAR(field_variable) | `emakefun_tts20_is_busy($tts20)` | `tts20.IsBusy()` |
| `emakefun_tts20_wait_finish` | Statement | VAR(field_variable) | `emakefun_tts20_wait_finish($tts20)` | `while (tts20.IsBusy());` |
| `emakefun_tts20_stop` | Statement | VAR(field_variable) | `emakefun_tts20_stop($tts20)` | `tts20.Stop();` |
| `emakefun_tts20_pause` | Statement | VAR(field_variable) | `emakefun_tts20_pause($tts20)` | `tts20.Pause();` |
| `emakefun_tts20_resume` | Statement | VAR(field_variable) | `emakefun_tts20_resume($tts20)` | `tts20.Resume();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDRESS | 0x40 | I2C从机地址，默认0x40 |
| WIRE | Wire, Wire1, ... | I2C接口选择（由开发板决定） |
| SOUND | ring_1~ring_5, message_1~message_5, alert_1~alert_5 | 15种内置提示音效 |

## ABS Examples

### 基本文本播放
```
arduino_setup()
    emakefun_tts20_init("tts20", 0x40, Wire)

arduino_loop()
    emakefun_tts20_play(variables_get($tts20), text("你好世界"))
    emakefun_tts20_wait_finish(variables_get($tts20))
    time_delay(math_number(2000))
```

### 播放内置提示音
```
arduino_setup()
    emakefun_tts20_init("tts20", 0x40, Wire)

arduino_loop()
    emakefun_tts20_play_sound(variables_get($tts20), ring_1)
    emakefun_tts20_wait_finish(variables_get($tts20))
    time_delay(math_number(2000))
```

### 播放流程控制
```
arduino_setup()
    emakefun_tts20_init("tts20", 0x40, Wire)

arduino_loop()
    emakefun_tts20_play(variables_get($tts20), text("一二三四五六七八九十"))
    time_delay(math_number(1000))
    emakefun_tts20_pause(variables_get($tts20))
    time_delay(math_number(1000))
    emakefun_tts20_resume(variables_get($tts20))
    time_delay(math_number(1000))
    emakefun_tts20_stop(variables_get($tts20))
```

### 使用播放状态判断
```
arduino_setup()
    emakefun_tts20_init("tts20", 0x40, Wire)

arduino_loop()
    emakefun_tts20_play(variables_get($tts20), text("你好"))
    controls_whileUntil(emakefun_tts20_is_busy(variables_get($tts20)), WHILE)
        time_delay(math_number(100))
```

## Notes

1. **初始化**: 必须在 `arduino_setup()` 中调用 `emakefun_tts20_init`
2. **I2C**: 初始化块会自动调用 `Wire.begin()`
3. **音量控制**: 可在文本前加 `[v*]` 标注控制音量（*范围0-9，默认5，9为最大音量）
4. **语速控制**: 可在文本前加 `[s*]` 标注控制语速（*范围0-9，默认5）
5. **语调控制**: 可在文本前加 `[t*]` 标注控制语调（*范围0-9，默认5）
6. **内置提示音**: 共15种，铃声(ring_1~5)、信息提示(message_1~5)、警示音(alert_1~5)
7. **提示音与文本**: 音效和文本数据不要放在同一次Play中，需分开执行

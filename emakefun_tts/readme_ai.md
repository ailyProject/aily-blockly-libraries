# Emakefun TTS 语音合成模块

易创空间语音合成模块(V2.0)，通过I2C接口将文本转换为语音播放。

## Library Info
- **Name**: @aily-project/lib-emakefun_tts
- **Version**: 2.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_tts_init` | Statement | VAR(field_input), I2C_ADDRESS(dropdown), WIRE(dropdown) | `emakefun_tts_init("tts", 0x40, Wire)` | `emakefun::Tts tts(0x40, Wire); tts.Initialize();` |
| `emakefun_tts_play` | Statement | VAR(field_variable), TEXT(input_value) | `emakefun_tts_play($tts, text("你好"))` | `tts.Play("你好");` |
| `emakefun_tts_push_cache` | Statement | VAR(field_variable), TEXT(input_value), CACHE_INDEX(input_value) | `emakefun_tts_push_cache($tts, text("一二三"), math_number(0))` | `tts.PushTextToCache("一二三", 0);` |
| `emakefun_tts_play_cache` | Statement | VAR(field_variable), COUNT(input_value) | `emakefun_tts_play_cache($tts, math_number(1))` | `tts.PlayFromCache(emakefun::Tts::kUtf8, 1);` |
| `emakefun_tts_stop` | Statement | VAR(field_variable) | `emakefun_tts_stop($tts)` | `tts.Stop();` |
| `emakefun_tts_pause` | Statement | VAR(field_variable) | `emakefun_tts_pause($tts)` | `tts.Pause();` |
| `emakefun_tts_resume` | Statement | VAR(field_variable) | `emakefun_tts_resume($tts)` | `tts.Resume();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDRESS | 0x40 | I2C从机地址，默认0x40 |
| WIRE | Wire, Wire1, ... | I2C接口选择（由开发板决定） |
| CACHE_INDEX | 0~15 | 缓存块索引 |
| COUNT | 1~15 | 从缓存播放的次数 |

## ABS Examples

### 基本文本播放
```
arduino_setup()
    emakefun_tts_init("tts", 0x40, Wire)

arduino_loop()
    emakefun_tts_play($tts, text("你好世界"))
    time_delay(math_number(2000))
```

### 缓存播放
```
arduino_setup()
    emakefun_tts_init("tts", 0x40, Wire)

arduino_loop()
    emakefun_tts_push_cache($tts, text("一二三四五"), math_number(0))
    emakefun_tts_push_cache($tts, text("六七八九十"), math_number(1))
    emakefun_tts_play_cache($tts, math_number(1))
    time_delay(math_number(3000))
```

### 播放流程控制
```
arduino_setup()
    emakefun_tts_init("tts", 0x40, Wire)

arduino_loop()
    emakefun_tts_play($tts, text("一二三四五六七八九十"))
    time_delay(math_number(1000))
    emakefun_tts_pause($tts)
    time_delay(math_number(1000))
    emakefun_tts_resume($tts)
    time_delay(math_number(1000))
    emakefun_tts_stop($tts)
```

## Notes

1. **初始化**: 必须在 `arduino_setup()` 中调用 `emakefun_tts_init`
2. **I2C**: 初始化块会自动调用 `Wire.begin()`
3. **文本长度**: 单次播放文本最大250字节
4. **缓存块**: 索引范围0~15，超出将返回参数错误
5. **播放次数**: 从缓存播放次数范围1~15
6. **音量控制**: 可通过在文本前加 `[v*]` 标注控制音量（*范围0~10，默认5）

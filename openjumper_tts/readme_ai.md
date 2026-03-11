# TTS语音合成模块

适配openjumperTTS语音合成模块（编号ojmoBhp4035 ），通过串口将文本内容实时转换为语音输出，简化语音播报功能的实现，适配多种开发板，支持播放铃声、提示音、警告音、数字和文本。

## Library Info
- **Name**: @aily-project/lib-tts
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `openjumper_tts_init` | Statement | RX_PIN(dropdown), TX_PIN(dropdown) | `openjumper_tts_init(RX_PIN, TX_PIN)` | `` |
| `openjumper_tts_play_invoice` | Statement | VOICE_TYPE(dropdown), VOICE_NUM(input_value) | `openjumper_tts_play_invoice(VOICE_Ringtones, math_number(0))` | (dynamic code) |
| `openjumper_tts_play_control` | Statement | CONTROL_ACTION(dropdown) | `openjumper_tts_play_control(PLAY_STOP)` | `TTS.playcontrol(` |
| `openjumper_tts_play_number` | Statement | NUMBER(input_value) | `openjumper_tts_play_number(math_number(0))` | `TTS.PlayNumber(` |
| `openjumper_tts_play_text` | Statement | TEXT(input_value) | `openjumper_tts_play_text(text("hello"))` | `TTS.PlayText(...);\n` |
| `openjumper_tts_setcfg` | Statement | SP_TYPE(dropdown), CFGV(input_value) | `openjumper_tts_setcfg(setspeechSpeed, math_number(0))` | (dynamic code) |
| `openjumper_tts_restore_defaults` | Statement | (none) | `openjumper_tts_restore_defaults()` | `TTS.RestoreDefaultValues();\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOICE_TYPE | VOICE_Ringtones, VOICE_PromptSound, VOICE_WarningSound | 铃声 / 提示音 / 警示音 |
| CONTROL_ACTION | PLAY_STOP, PLAY_PAUSE, PLAY_CONTINUE | 停止 / 暂停 / 继续 |
| SP_TYPE | setspeechSpeed, setIntonation, setVolume | 语速 / 语调 / 音量 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    openjumper_tts_init(RX_PIN, TX_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

# 语音合成模块

DFRobot语音合成模块库，支持中英文混合播报、多种发音人、音量/语速/语调调节，支持I2C和串口通信

## Library Info
- **Name**: @aily-project/lib-speech-synthesis
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `speech_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), VERSION(dropdown) | `speech_init_i2c("tts", WIRE, eV1)` | (dynamic code) |
| `speech_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), VERSION(dropdown) | `speech_init_uart("tts", SERIAL, eV1)` | `` |
| `speech_speak` | Statement | VAR(field_variable), TEXT(input_value) | `speech_speak($tts, text("hello"))` | (dynamic code) |
| `speech_set_volume` | Statement | VAR(field_variable), VOLUME(dropdown) | `speech_set_volume($tts, 0)` | (dynamic code) |
| `speech_set_speed` | Statement | VAR(field_variable), SPEED(dropdown) | `speech_set_speed($tts, 0)` | (dynamic code) |
| `speech_set_tone` | Statement | VAR(field_variable), TONE(dropdown) | `speech_set_tone($tts, 0)` | (dynamic code) |
| `speech_set_sound_type` | Statement | VAR(field_variable), TYPE(dropdown) | `speech_set_sound_type($tts, eFemale1)` | (dynamic code) |
| `speech_set_english_pron` | Statement | VAR(field_variable), PRON(dropdown) | `speech_set_english_pron($tts, eWord)` | (dynamic code) |
| `speech_set_language` | Statement | VAR(field_variable), LANG(dropdown) | `speech_set_language($tts, eAutoJudgel)` | (dynamic code) |
| `speech_set_digital_pron` | Statement | VAR(field_variable), PRON(dropdown) | `speech_set_digital_pron($tts, eAutoJudged)` | (dynamic code) |
| `speech_set_style` | Statement | VAR(field_variable), STYLE(dropdown) | `speech_set_style($tts, eSmooth)` | (dynamic code) |
| `speech_enable_rhythm` | Statement | VAR(field_variable), ENABLE(dropdown) | `speech_enable_rhythm($tts, true)` | (dynamic code) |
| `speech_enable_pinyin` | Statement | VAR(field_variable), ENABLE(dropdown) | `speech_enable_pinyin($tts, true)` | (dynamic code) |
| `speech_stop` | Statement | VAR(field_variable) | `speech_stop($tts)` | (dynamic code) |
| `speech_pause` | Statement | VAR(field_variable) | `speech_pause($tts)` | (dynamic code) |
| `speech_resume` | Statement | VAR(field_variable) | `speech_resume($tts)` | (dynamic code) |
| `speech_wait` | Statement | VAR(field_variable) | `speech_wait($tts)` | (dynamic code) |
| `speech_reset` | Statement | VAR(field_variable) | `speech_reset($tts)` | (dynamic code) |
| `speech_sleep` | Statement | VAR(field_variable) | `speech_sleep($tts)` | (dynamic code) |
| `speech_wakeup` | Statement | VAR(field_variable) | `speech_wakeup($tts)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VERSION | eV1, eV2 | V1 / V2 |
| VOLUME | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | 0 (静音) / 1 / 2 / 3 / 4 / 5 (默认) / 6 / 7 / 8 / 9 (最大) |
| SPEED | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | 0 (最慢) / 1 / 2 / 3 / 4 / 5 (默认) / 6 / 7 / 8 / 9 (最快) |
| TONE | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | 0 (最低) / 1 / 2 / 3 / 4 / 5 (默认) / 6 / 7 / 8 / 9 (最高) |
| TYPE | eFemale1, eMale1, eMale2, eFemale2, eDonaldDuck, eFemale3 | 女声1 (推荐) / 男声1 (推荐) / 男声2 / 女声2 / 唐老鸭 / 女声3 |
| PRON | eWord, eAlphabet | 单词 / 字母 |
| LANG | eAutoJudgel, eChinesel, eEnglishl | 自动判断 / 中文 / 英文 |
| STYLE | eSmooth, eCaton | 流畅 / 逐字 |
| ENABLE | true, false | 启用 / 禁用 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    speech_init_i2c("tts", WIRE, eV1)
    speech_init_uart("tts", SERIAL, eV1)
    serial_begin(Serial, 9600)

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `speech_init_i2c("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order

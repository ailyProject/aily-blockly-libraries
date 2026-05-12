# Speech synthesis module

DFRobot speech synthesis module library supports Chinese and English mixed broadcasting, multiple speakers, volume/speed/intonation adjustment, and supports I2C and serial communication.

## Library Info
- **Name**: @aily-project/lib-speech-synthesis
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `speech_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), VERSION(dropdown) | `speech_init_i2c("tts", WIRE, eV1)` | Dynamic code |
| `speech_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), VERSION(dropdown) | `speech_init_uart("tts", SERIAL, eV1)` | Dynamic code |
| `speech_speak` | Statement | VAR(field_variable), TEXT(input_value) | `speech_speak(variables_get($tts), text("value"))` | Dynamic code |
| `speech_set_volume` | Statement | VAR(field_variable), VOLUME(dropdown) | `speech_set_volume(variables_get($tts), "0")` | Dynamic code |
| `speech_set_speed` | Statement | VAR(field_variable), SPEED(dropdown) | `speech_set_speed(variables_get($tts), "0")` | Dynamic code |
| `speech_set_tone` | Statement | VAR(field_variable), TONE(dropdown) | `speech_set_tone(variables_get($tts), "0")` | Dynamic code |
| `speech_set_sound_type` | Statement | VAR(field_variable), TYPE(dropdown) | `speech_set_sound_type(variables_get($tts), eFemale1)` | Dynamic code |
| `speech_set_english_pron` | Statement | VAR(field_variable), PRON(dropdown) | `speech_set_english_pron(variables_get($tts), eWord)` | Dynamic code |
| `speech_set_language` | Statement | VAR(field_variable), LANG(dropdown) | `speech_set_language(variables_get($tts), eAutoJudgel)` | Dynamic code |
| `speech_set_digital_pron` | Statement | VAR(field_variable), PRON(dropdown) | `speech_set_digital_pron(variables_get($tts), eAutoJudged)` | Dynamic code |
| `speech_set_style` | Statement | VAR(field_variable), STYLE(dropdown) | `speech_set_style(variables_get($tts), eSmooth)` | Dynamic code |
| `speech_enable_rhythm` | Statement | VAR(field_variable), ENABLE(dropdown) | `speech_enable_rhythm(variables_get($tts), true)` | Dynamic code |
| `speech_enable_pinyin` | Statement | VAR(field_variable), ENABLE(dropdown) | `speech_enable_pinyin(variables_get($tts), true)` | Dynamic code |
| `speech_stop` | Statement | VAR(field_variable) | `speech_stop(variables_get($tts))` | Dynamic code |
| `speech_pause` | Statement | VAR(field_variable) | `speech_pause(variables_get($tts))` | Dynamic code |
| `speech_resume` | Statement | VAR(field_variable) | `speech_resume(variables_get($tts))` | Dynamic code |
| `speech_wait` | Statement | VAR(field_variable) | `speech_wait(variables_get($tts))` | Dynamic code |
| `speech_reset` | Statement | VAR(field_variable) | `speech_reset(variables_get($tts))` | Dynamic code |
| `speech_sleep` | Statement | VAR(field_variable) | `speech_sleep(variables_get($tts))` | Dynamic code |
| `speech_wakeup` | Statement | VAR(field_variable) | `speech_wakeup(variables_get($tts))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VERSION | eV1, eV2 | speech_init_i2c, speech_init_uart |
| VOLUME | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | speech_set_volume |
| SPEED | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | speech_set_speed |
| TONE | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | speech_set_tone |
| TYPE | eFemale1, eMale1, eMale2, eFemale2, eDonaldDuck, eFemale3 | speech_set_sound_type |
| PRON | eWord, eAlphabet | speech_set_english_pron |
| LANG | eAutoJudgel, eChinesel, eEnglishl | speech_set_language |
| PRON | eAutoJudged, eNumber, eNumeric | speech_set_digital_pron |
| STYLE | eSmooth, eCaton | speech_set_style |
| ENABLE | true, false | speech_enable_rhythm, speech_enable_pinyin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    speech_init_i2c("tts", WIRE, eV1)
    serial_begin(Serial, 9600)

arduino_loop()
    speech_init_uart("tts", SERIAL, eV1)
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `speech_init_i2c("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

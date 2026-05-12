# TTS speech synthesis module

Adapted to the openjumperTTS speech synthesis module (No. ojmoBhp4035), the text content is converted into speech output in real time through the serial port, simplifying the implementation of the voice broadcast func...

## Library Info
- **Name**: @aily-project/lib-tts
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `openjumper_tts_init` | Statement | RX_PIN(dropdown), TX_PIN(dropdown) | `openjumper_tts_init(RX_PIN, TX_PIN)` | Dynamic code |
| `openjumper_tts_play_invoice` | Statement | VOICE_TYPE(dropdown), VOICE_NUM(input_value) | `openjumper_tts_play_invoice(VOICE_Ringtones, math_number(0))` | Dynamic code |
| `openjumper_tts_play_control` | Statement | CONTROL_ACTION(dropdown) | `openjumper_tts_play_control(PLAY_STOP)` | TTS.playcontrol( |
| `openjumper_tts_play_number` | Statement | NUMBER(input_value) | `openjumper_tts_play_number(math_number(0))` | TTS.PlayNumber( |
| `openjumper_tts_play_text` | Statement | TEXT(input_value) | `openjumper_tts_play_text(text("value"))` | TTS.PlayText(...);\n |
| `openjumper_tts_setcfg` | Statement | SP_TYPE(dropdown), CFGV(input_value) | `openjumper_tts_setcfg(setspeechSpeed, math_number(0))` | Dynamic code |
| `openjumper_tts_restore_defaults` | Statement | (none) | `openjumper_tts_restore_defaults()` | TTS.RestoreDefaultValues();\n |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOICE_TYPE | VOICE_Ringtones, VOICE_PromptSound, VOICE_WarningSound | openjumper_tts_play_invoice |
| CONTROL_ACTION | PLAY_STOP, PLAY_PAUSE, PLAY_CONTINUE | openjumper_tts_play_control |
| SP_TYPE | setspeechSpeed, setIntonation, setVolume | openjumper_tts_setcfg |

## ABS Examples

### Basic Usage
```
arduino_setup()
    openjumper_tts_init(RX_PIN, TX_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    openjumper_tts_play_invoice(VOICE_Ringtones, math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

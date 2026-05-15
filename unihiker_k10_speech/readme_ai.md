# K10 Speech Recognition & Synthesis

UNIHIKER K10 speech recognition and synthesis library, supports Chinese/English speech recognition, command detection and TTS

## Library Info
- **Name**: @aily-project/lib-unihiker-k10-speech
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `k10_asr_init` | Statement | (none) | `k10_asr_init()` | Dynamic code |
| `k10_asr_add_command` | Statement | ID(input_value), KEYWORD(input_value) | `k10_asr_add_command(math_number(0), text("value"))` | asr.addASRCommand( |
| `k10_asr_is_wakeup` | Value | (none) | `k10_asr_is_wakeup()` | asr.isWakeUp() |
| `k10_asr_is_detected` | Value | ID(input_value) | `k10_asr_is_detected(math_number(0))` | asr.isDetectCmdID( |
| `k10_asr_speak` | Statement | TEXT(input_value) | `k10_asr_speak(text("value"))` | asr.speak( |
| `k10_asr_set_speed` | Statement | SPEED(dropdown) | `k10_asr_set_speed("1")` | asr.setAsrSpeed( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPEED | 1, 3, 5, 7, 9 | k10_asr_set_speed |

## ABS Examples

### Basic Usage
```
arduino_setup()
    k10_asr_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, k10_asr_is_wakeup())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

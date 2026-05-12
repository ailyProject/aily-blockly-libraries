# LD3320D speech recognition

Emakefun LD3320D speech recognition module library supports multiple modes such as automatic recognition, key triggering, keyword triggering, etc.

## Library Info
- **Name**: @aily-project/lib-emakefun-speech-recognizer
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `speech_recognizer_setup` | Statement | VAR(field_input), I2C_ADDRESS(field_input) | `speech_recognizer_setup("speechRecognizer", "0x30")` | if ( |
| `speech_recognizer_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `speech_recognizer_set_mode(variables_get($speechRecognizer), kRecognitionAuto)` | Dynamic code |
| `speech_recognizer_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `speech_recognizer_set_timeout(variables_get($speechRecognizer), math_number(1000))` | Dynamic code |
| `speech_recognizer_add_keyword` | Statement | KEYWORD(input_value), INDEX(input_value), VAR(field_variable) | `speech_recognizer_add_keyword(text("value"), math_number(0), variables_get($speechRecognizer))` | Dynamic code |
| `speech_recognizer_recognize` | Value | VAR(field_variable) | `speech_recognizer_recognize(variables_get($speechRecognizer))` | Dynamic code |
| `speech_recognizer_get_event` | Value | VAR(field_variable) | `speech_recognizer_get_event(variables_get($speechRecognizer))` | Dynamic code |
| `speech_recognizer_event_handler` | Hat | VAR(field_variable), EVENT(dropdown), HANDLER(input_statement) | `speech_recognizer_event_handler(variables_get($speechRecognizer), kEventStartWaitingForTrigger) @HANDLER: child_block()` | Dynamic code |
| `speech_recognizer_check_result` | Value | RESULT(input_value), INDEX(input_value) | `speech_recognizer_check_result(math_number(0), math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | kRecognitionAuto, kButtonTrigger, kKeywordTrigger, kKeywordOrButtonTrigger | speech_recognizer_set_mode |
| EVENT | kEventStartWaitingForTrigger, kEventButtonTriggered, kEventKeywordTriggered, kEventStartRecognizing, kEventSpeechRecognized, kEventSpeechRecognitionTimedOut | speech_recognizer_event_handler |

## ABS Examples

### Basic Usage
```
arduino_setup()
    speech_recognizer_setup("speechRecognizer", "0x30")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, speech_recognizer_recognize(variables_get($speechRecognizer)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `speech_recognizer_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

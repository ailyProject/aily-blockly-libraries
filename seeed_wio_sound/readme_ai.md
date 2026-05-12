# Wio Terminal Microphone & Buzzer

Library for Wio Terminal built-in microphone and passive buzzer, supporting sound detection and tone playback

## Library Info
- **Name**: @aily-project/lib-seeed-wio-sound
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wio_mic_read` | Value | (none) | `wio_mic_read()` | analogRead(WIO_MIC) |
| `wio_mic_is_loud` | Value | THRESHOLD(input_value) | `wio_mic_is_loud(math_number(0))` | analogRead(WIO_MIC) > |
| `wio_buzzer_on` | Statement | DUTY(input_value) | `wio_buzzer_on(math_number(0))` | analogWrite(WIO_BUZZER, |
| `wio_buzzer_off` | Statement | (none) | `wio_buzzer_off()` | analogWrite(WIO_BUZZER, 0);\n |
| `wio_buzzer_tone` | Statement | FREQUENCY(input_value) | `wio_buzzer_tone(math_number(0))` | tone(WIO_BUZZER, |
| `wio_buzzer_tone_duration` | Statement | FREQUENCY(input_value), DURATION(input_value) | `wio_buzzer_tone_duration(math_number(0), math_number(1000))` | tone(WIO_BUZZER, |
| `wio_buzzer_no_tone` | Statement | (none) | `wio_buzzer_no_tone()` | noTone(WIO_BUZZER);\n |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wio_buzzer_on(math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wio_mic_read())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

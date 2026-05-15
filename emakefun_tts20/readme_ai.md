# TTS20 speech synthesis module

Easy Space TTS20 speech synthesis module library supports text-to-speech playback, built-in prompt tone playback, playback process control, and communicates through I2C interface

## Library Info
- **Name**: @aily-project/lib-emakefun-tts20
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_tts20_init` | Statement | VAR(field_input), I2C_ADDRESS(dropdown), WIRE(dropdown) | `emakefun_tts20_init("tts20", "0x40", WIRE)` | Dynamic code |
| `emakefun_tts20_play` | Statement | VAR(field_variable), TEXT(input_value) | `emakefun_tts20_play(variables_get($tts20), text("value"))` | Dynamic code |
| `emakefun_tts20_play_sound` | Statement | VAR(field_variable), SOUND(dropdown) | `emakefun_tts20_play_sound(variables_get($tts20), ring_1)` | Dynamic code |
| `emakefun_tts20_is_busy` | Value | VAR(field_variable) | `emakefun_tts20_is_busy(variables_get($tts20))` | Dynamic code |
| `emakefun_tts20_wait_finish` | Statement | VAR(field_variable) | `emakefun_tts20_wait_finish(variables_get($tts20))` | while ( |
| `emakefun_tts20_stop` | Statement | VAR(field_variable) | `emakefun_tts20_stop(variables_get($tts20))` | Dynamic code |
| `emakefun_tts20_pause` | Statement | VAR(field_variable) | `emakefun_tts20_pause(variables_get($tts20))` | Dynamic code |
| `emakefun_tts20_resume` | Statement | VAR(field_variable) | `emakefun_tts20_resume(variables_get($tts20))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDRESS | 0x40 | emakefun_tts20_init |
| SOUND | ring_1, ring_2, ring_3, ring_4, ring_5, message_1, message_2, message_3, message_4, message_5, alert_1, alert_2, alert_3, alert_4, alert_5 | emakefun_tts20_play_sound |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emakefun_tts20_init("tts20", "0x40", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, emakefun_tts20_is_busy(variables_get($tts20)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emakefun_tts20_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

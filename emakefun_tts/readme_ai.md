# speech synthesis module (TTS)

Easy Space speech synthesis module library (V2.0) supports text-to-speech playback, cache playback, playback process control, and communicates through I2C interface

## Library Info
- **Name**: @aily-project/lib-emakefun-tts
- **Version**: 2.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `emakefun_tts_init` | Statement | VAR(field_input), I2C_ADDRESS(dropdown), WIRE(dropdown) | `emakefun_tts_init("tts", "0x40", WIRE)` | Dynamic code |
| `emakefun_tts_play` | Statement | VAR(field_variable), TEXT(input_value) | `emakefun_tts_play(variables_get($tts), text("value"))` | Dynamic code |
| `emakefun_tts_push_cache` | Statement | VAR(field_variable), TEXT(input_value), CACHE_INDEX(input_value) | `emakefun_tts_push_cache(variables_get($tts), text("value"), math_number(0))` | Dynamic code |
| `emakefun_tts_play_cache` | Statement | VAR(field_variable), COUNT(input_value) | `emakefun_tts_play_cache(variables_get($tts), math_number(0))` | Dynamic code |
| `emakefun_tts_stop` | Statement | VAR(field_variable) | `emakefun_tts_stop(variables_get($tts))` | Dynamic code |
| `emakefun_tts_pause` | Statement | VAR(field_variable) | `emakefun_tts_pause(variables_get($tts))` | Dynamic code |
| `emakefun_tts_resume` | Statement | VAR(field_variable) | `emakefun_tts_resume(variables_get($tts))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| I2C_ADDRESS | 0x40 | emakefun_tts_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    emakefun_tts_init("tts", "0x40", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    emakefun_tts_play(variables_get($tts), text("value"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `emakefun_tts_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

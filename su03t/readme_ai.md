# SU-03T speech recognition

SU-03T speech recognition module library supports voice command recognition and voice broadcast functions

## Library Info
- **Name**: @aily-project/lib-su03t
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `su03t_init` | Statement | MODE(dropdown), RX_PIN(input_value), TX_PIN(input_value) | `su03t_init(software, math_number(2), math_number(2))` | Dynamic code |
| `su03t_refresh` | Statement | MODE(dropdown) | `su03t_refresh(software)` | if (....available() > 0) { su03tResult = ....read(); Serial.println(su03tResult, HEX); } |
| `su03t_clear_result` | Statement | (none) | `su03t_clear_result()` | su03tResult = 0;\n |
| `su03t_recognized` | Value | COMMAND(input_value) | `su03t_recognized(math_number(0))` | su03tResult == |
| `su03t_command` | Value | COMMAND(dropdown) | `su03t_command("1")` | Dynamic code |
| `su03t_speak_integer` | Statement | VALUE(input_value) | `su03t_speak_integer(math_number(0))` | su03t_speak_integer( |
| `su03t_speak_decimal` | Statement | VALUE(input_value) | `su03t_speak_decimal(math_number(0))` | su03t_speak_decimal( |
| `su03t_speak_text` | Statement | TEXT(dropdown) | `su03t_speak_text("1")` | su03t_speak_text_ |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | software, hardware | su03t_init, su03t_refresh |
| COMMAND | 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 32, ... | su03t_command |
| TEXT | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ... | su03t_speak_text |

## ABS Examples

### Basic Usage
```
arduino_setup()
    su03t_init(software, math_number(2), math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, su03t_recognized(math_number(0)))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

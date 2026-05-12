# MAX7219 display driver library

Segment LED display support library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-max7219
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max7219_begin` | Statement | (none) | `max7219_begin()` | display.Begin(); |
| `max7219_set_brightness` | Statement | BRIGHTNESS(field_number) | `max7219_set_brightness(8)` | display.MAX7219_SetBrightness( |
| `max7219_display_char` | Statement | DIGIT(field_number), CHARACTER(field_input), DP(dropdown) | `max7219_display_char(0, "A", "1")` | display.DisplayChar( |
| `max7219_clear` | Statement | (none) | `max7219_clear()` | display.clearDisplay(); |
| `max7219_display_test_start` | Statement | (none) | `max7219_display_test_start()` | display.MAX7219_DisplayTestStart(); |
| `max7219_display_test_stop` | Statement | (none) | `max7219_display_test_stop()` | display.MAX7219_DisplayTestStop(); |
| `max7219_display_text` | Statement | TEXT(field_input), JUSTIFY(dropdown) | `max7219_display_text("HELLO", "0")` | display.DisplayText( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DP | 1, 0 | max7219_display_char |
| JUSTIFY | 0, 1, 2 | max7219_display_text |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max7219_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    max7219_set_brightness(8)
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

# TM1650 Four-Digit Display

ABS-first reference for TM1650 I2C seven-segment displays with text, numbers, decimal points, scrolling, and raw controls.

## Library Info
- **Name**: @aily-project/lib-tm1650
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tm1650_init_hardware` | Statement | VAR(field_input), DIGITS(field_number), BRIGHTNESS(input_value Number) | `tm1650_init_hardware("display", 4, math_number(3))` | `AilyTM1650 display(4); Wire.begin(); display.init();` |
| `tm1650_init` | Statement | VAR(field_input), DIGITS(field_number), SDA(input_value Number), SCL(input_value Number), BRIGHTNESS(input_value Number) | `tm1650_init("display", 4, math_number(8), math_number(9), math_number(3))` | `AilyTM1650 display(4); Wire.begin(...); display.init();` |
| `tm1650_show_text` | Statement | VAR(field_variable), TEXT(input_value String) | `tm1650_show_text($display, text("12.34"))` | `display.displayValue(String("12.34"));` |
| `tm1650_show_number` | Statement | VAR(field_variable), NUMBER(input_value Number), DECIMALS(field_number) | `tm1650_show_number($display, math_number(12.34), 2)` | `display.displayNumber(12.34, 2);` |
| `tm1650_clear` | Statement | VAR(field_variable) | `tm1650_clear($display)` | `display.clear();` |
| `tm1650_set_dot` | Statement | VAR(field_variable), POSITION(input_value Number), STATE(input_value Boolean) | `tm1650_set_dot($display, math_number(2), logic_boolean(TRUE))` | `display.setDecimalPoint(2, true);` |
| `tm1650_set_brightness` | Statement | VAR(field_variable), MODE(dropdown), BRIGHTNESS(input_value Number) | `tm1650_set_brightness($display, IMMEDIATE, math_number(3))` | `display.setBrightness(constrain(3, 0, 7));` |
| `tm1650_set_power` | Statement | VAR(field_variable), STATE(input_value Boolean) | `tm1650_set_power($display, logic_boolean(TRUE))` | `display.displayState(true);` |
| `tm1650_scroll_start` | Value Number | VAR(field_variable), TEXT(input_value String) | `tm1650_scroll_start($display, text("HELLO"))` | `display.startScroll(String("HELLO"))` |
| `tm1650_scroll_next` | Value Number | VAR(field_variable) | `tm1650_scroll_next($display)` | `display.scrollNext()` |
| `tm1650_scroll_text` | Statement | VAR(field_variable), TEXT(input_value String), DELAY(input_value Number) | `tm1650_scroll_text($display, text("HELLO"), math_number(500))` | `ailyTm1650Scroll(display, String("HELLO"), 500);` |
| `tm1650_set_segments` | Statement | VAR(field_variable), POSITION(input_value Number), SEGMENTS(input_value Number) | `tm1650_set_segments($display, math_number(1), math_number(63))` | `display.setSegments(1, 63);` |
| `tm1650_set_control` | Statement | VAR(field_variable), POSITION(input_value Number), VALUE(input_value Number) | `tm1650_set_control($display, math_number(1), math_number(49))` | `display.setControl(1, 49);` |
| `tm1650_get_segments` | Value Number | VAR(field_variable), POSITION(input_value Number) | `tm1650_get_segments($display, math_number(1))` | `display.getSegments(1)` |
| `tm1650_get_brightness` | Value Number | VAR(field_variable) | `tm1650_get_brightness($display)` | `display.getBrightness()` |
| `tm1650_get_digits` | Value Number | VAR(field_variable) | `tm1650_get_digits($display)` | `display.getNumPositions()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | `IMMEDIATE`, `GRADUAL` | Change brightness immediately or step every 50 ms |
| DIGITS | 1-16 | Physical display positions; use 4 for common modules |
| BRIGHTNESS | 0-7 | Clamped by generated code |
| POSITION | 1-DIGITS | Left-to-right position; invalid positions are ignored |
| DECIMALS | 0-6 | Decimal places used before display truncation |
| SEGMENTS / VALUE | 0-255 | Raw display or control register byte |

## ABS Example

```text
arduino_setup()
    tm1650_init_hardware("display", 4, math_number(3))
    tm1650_show_text($display, text("12.34"))

arduino_loop()
    tm1650_set_dot($display, math_number(4), logic_boolean(TRUE))
    time_delay(math_number(1000))
```

## Notes

- `tm1650_init_hardware` and `tm1650_init` both create typed variable `$display`; use exactly one initialization method. The toolbox labels explain the choice.
- The custom/software-I2C block is compile-compatible with hardware-I2C boards: ESP32/ESP8266 use the selected SDA/SCL, while other cores automatically use default `Wire.begin()` and ignore the pin values for compilation safety.
- `Wire` setup, 100 kHz clock, includes, objects, and the scroll helper are deduplicated.
- Text accepts up to the configured positions; a dot attaches to its previous character. Leading dots are ignored. Seven-segment hardware cannot represent every letter.
- Showing new text clears old dots. Call `tm1650_set_dot` after the show block for additional dots.
- `tm1650_scroll_text` blocks until all frames finish. For responsive programs, store the result of `tm1650_scroll_start` and call `tm1650_scroll_next` on a timer.
- Every `input_value` requires a value block such as `math_number`, `text`, or `logic_boolean`; do not pass a bare number in an ABS value slot.
- The bundled dependency is arkhipenko/TM1650 1.1.0, BSD-4-Clause, under `src/tm1650/`. Arduino Core `Wire` is a platform prerequisite, not a third-party dependency.

# MAX7219 LED Matrix

Blockly driver for MAX7219 8x8 LED matrix modules with cascaded screens, pixel control, rotation, brightness, preset patterns, custom patterns and scrolling text.

## Library Info
- **Name**: @aily-project/lib-max7219
- **Version**: 0.1.0
- **Bundled Source**: LedControl 1.0.6 from https://github.com/wayoda/LedControl
- **License**: MIT

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max7219_matrix_init` | Statement | DATA_PIN(dropdown), CS_PIN(dropdown), CLK_PIN(dropdown), HORIZONTAL(field_number), VERTICAL(field_number) | `max7219_matrix_init(23, 0, 18, 1, 1)` | `max7219Begin(5);` |
| `max7219_set_pixel` | Statement | TYPE(dropdown), X(field_number), Y(field_number), STATE(dropdown) | `max7219_set_pixel(MAX7219, 0, 0, true)` | `max7219SetPixel(x, y, state);` |
| `max7219_set_rotation` | Statement | TYPE(dropdown), DEVICE(field_number), ROTATION(dropdown) | `max7219_set_rotation(MAX7219, 0, 0)` | `max7219SetRotation(device, rotation);` |
| `max7219_draw_screen_pixel` | Statement | TYPE(dropdown), DEVICE(field_number), X(field_number), Y(field_number) | `max7219_draw_screen_pixel(MAX7219, 0, 0, 0)` | `max7219SetDevicePixel(device, x, y, true);` |
| `max7219_scroll_text` | Statement | TYPE(dropdown), TEXT(input_value), SPEED(input_value) | `max7219_scroll_text(MAX7219, text("Mixly"), math_number(300))` | `max7219ScrollText(String(text), speed);` |
| `max7219_display_pattern` | Statement | TYPE(dropdown), DEVICE(field_number), PATTERN(input_value) | `max7219_display_pattern(MAX7219, 0, max7219_matrix_pattern($LedArray1, ...))` | `max7219DrawBitmap(device, pattern);` |
| `max7219_matrix_pattern` | Value | VAR(field_variable), MATRIX(field_led_matrix) | `max7219_matrix_pattern(variables_get($LedArray1), matrix)` | returns a generated `const uint8_t[8]` pattern name |
| `max7219_preset_pattern` | Value | PATTERN(dropdown) | `max7219_preset_pattern(ARROW_UP)` | returns a generated preset pattern name |
| `max7219_fill` | Statement | TYPE(dropdown), STATE(dropdown) | `max7219_fill(MAX7219, true)` | `max7219Fill(state);` |
| `max7219_set_brightness` | Statement | TYPE(dropdown), BRIGHTNESS(field_number) | `max7219_set_brightness(MAX7219, 5)` | `max7219SetIntensity(brightness);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | MAX7219 | Fixed matrix type label |
| STATE | true, false | Pixel/fill on or off |
| ROTATION | 0, 1, 2, 3 | 0, 90, 180, 270 degrees |
| PATTERN | ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, HEART, SMILE, CHECK, CROSS | Preset pattern |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max7219_matrix_init(23, 0, 18, 1, 1)

arduino_loop()
    max7219_set_brightness(MAX7219, 5)
    max7219_display_pattern(MAX7219, 0, max7219_preset_pattern(ARROW_UP))
    max7219_scroll_text(MAX7219, text("Mixly"), math_number(300))
```

## Notes

1. Screen index starts at `0`; a 2 by 1 chain has screens `0` and `1`.
2. Global pixel coordinates in `max7219_set_pixel` span all cascaded screens.
3. `max7219_matrix_pattern` converts the 8x8 editor into one `const uint8_t pattern[8]`.
4. Generated Arduino code includes `LedControl.h` and creates one `LedControl max7219Matrix(...)` instance.
5. Parameter order follows `block.json` args order.

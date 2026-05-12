# R4 WiFi LED Matrix Library

For Arduino UNO R4 Wifi LED matrix, supports display of text, pattern and animation

## Library Info
- **Name**: @aily-project/lib-r4-led-matrix
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `led_matrix_init` | Statement | (none) | `led_matrix_init()` | matrix.begin();\n |
| `led_matrix_clear` | Statement | (none) | `led_matrix_clear()` | matrix.clear();\n |
| `led_matrix_display_text` | Statement | TEXT(input_value), DIRECTION(dropdown), SPEED(input_value) | `led_matrix_display_text(text("value"), SCROLL_LEFT, math_number(9600))` | matrix.beginDraw();\n |
| `led_matrix_display_frame` | Statement | FRAME(input_value) | `led_matrix_display_frame(math_number(0))` | Dynamic code |
| `led_matrix_preset_pattern` | Value | PATTERN(field_led_pattern_selector) | `led_matrix_preset_pattern()` | Dynamic code |
| `led_matrix_preset_animation` | Statement | PATTERN(field_led_pattern_selector) | `led_matrix_preset_animation()` | Dynamic code |
| `led_matrix_display_frame_set` | Statement | MATRIX(field_led_matrix) | `led_matrix_display_frame_set()` | matrix.loadFrame( |
| `led_matrix_display_animation` | Statement | DELAY(field_input), ADD0(input_value), ADD1(input_value) | `led_matrix_display_animation("100", math_number(0), math_number(0))` | // 没有动画帧\n |
| `led_matrix_custom_pattern` | Value | MATRIX(field_led_matrix) | `led_matrix_custom_pattern()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | SCROLL_LEFT, SCROLL_RIGHT | led_matrix_display_text |

## ABS Examples

### Basic Usage
```
arduino_setup()
    led_matrix_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, led_matrix_preset_pattern())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `led_matrix_display_animation` may add fields at runtime through Blockly extensions.

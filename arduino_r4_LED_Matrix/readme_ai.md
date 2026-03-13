# R4 WiFi LED矩阵库

用于Arduino UNO R4 Wifi LED矩阵，支持显示文本、图案和动画

## Library Info
- **Name**: @aily-project/lib-r4-led-matrix
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `led_matrix_init` | Statement | (none) | `led_matrix_init()` | `matrix.begin();\n` |
| `led_matrix_clear` | Statement | (none) | `led_matrix_clear()` | `matrix.clear();\n` |
| `led_matrix_display_text` | Statement | TEXT(input_value), DIRECTION(dropdown), SPEED(input_value) | `led_matrix_display_text(text("hello"), SCROLL_LEFT, math_number(100))` | `matrix.beginDraw();\n` |
| `led_matrix_display_frame` | Statement | FRAME(input_value) | `led_matrix_display_frame(math_number(0))` | (dynamic code) |
| `led_matrix_preset_pattern` | Value | PATTERN(field_led_pattern_selector) | `led_matrix_preset_pattern()` | (dynamic code) |
| `led_matrix_preset_animation` | Statement | PATTERN(field_led_pattern_selector) | `led_matrix_preset_animation()` | (dynamic code) |
| `led_matrix_display_frame_set` | Statement | MATRIX(field_led_matrix) | `led_matrix_display_frame_set()` | `matrix.loadFrame(` |
| `led_matrix_display_animation` | Statement | DELAY(field_input), ADD0(input_value) | `led_matrix_display_animation("100", math_number(0))` | `// 没有动画帧\n` |
| `led_matrix_custom_pattern` | Value | MATRIX(field_led_matrix) | `led_matrix_custom_pattern()` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIRECTION | SCROLL_LEFT, SCROLL_RIGHT | 左滚动 / 右滚动 |

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

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

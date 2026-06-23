# Monochrome display

The monochrome display driver library based on u8g2 can drive a variety of OLED and LCD monochrome displays, and supports common driver chips such as SSD1306, SSD1309, SH1106, SH1107, ST7305, and ST7920.

## Library Info
- **Name**: @aily-project/lib-u8g2
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `u8g2_begin` | Statement | TYPE(dropdown), MODE(dropdown) | `u8g2_begin(SSD1306, FULL_BUFFER)` | u8g2.begin();\n |
| `u8g2_page_buffer` | Statement | DO(input_statement) | `u8g2_page_buffer() @DO: child_block()` | Dynamic code |
| `u8g2_clear` | Statement | (none) | `u8g2_clear()` | u8g2.clear();\n |
| `u8g2_draw_pixel` | Statement | X(input_value), Y(input_value) | `u8g2_draw_pixel(math_number(0), math_number(0))` | u8g2.drawPixel(..., ...);\n |
| `u8g2_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value) | `u8g2_draw_line(math_number(0), math_number(0), math_number(0), math_number(0))` | u8g2.drawLine(..., ..., ..., ...);\n |
| `u8g2_draw_rectangle` | Statement | X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), FILL(field_checkbox) | `u8g2_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), FALSE)` | Dynamic code |
| `u8g2_draw_circle` | Statement | X(input_value), Y(input_value), RADIUS(input_value), FILL(field_checkbox) | `u8g2_draw_circle(math_number(0), math_number(0), math_number(0), FALSE)` | Dynamic code |
| `u8g2_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `u8g2_draw_str(math_number(0), math_number(0), text("value"))` | Dynamic code |
| `u8g2_draw_bitmap` | Statement | X(input_value), Y(input_value), BITMAP(input_value) | `u8g2_draw_bitmap(math_number(0), math_number(0), math_number(0))` | // No bitmap data\n |
| `u8g2_bitmap` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_bitmap()` | Dynamic code |
| `u8g2_icon_16x16` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_16x16()` | Dynamic code |
| `u8g2_icon_32x32` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_32x32()` | Dynamic code |
| `u8g2_icon_64x64` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_64x64()` | Dynamic code |
| `u8g2_set_flip_mode` | Statement | MODE(dropdown) | `u8g2_set_flip_mode("0")` | u8g2.setFlipMode(...);\n |
| `u8g2_set_display_mirror` | Statement | MODE(dropdown) | `u8g2_set_display_mirror("U8G2_MIRROR")` | u8g2.setDisplayRotation(...);\n |
| `u8g2_set_power_save` | Statement | MODE(dropdown) | `u8g2_set_power_save("0")` | u8g2.setPowerSave(...);\n |
| `u8g2_set_contrast` | Statement | VALUE(input_value) | `u8g2_set_contrast(math_number(0))` | u8g2.setContrast(...);\n |
| `u8g2_set_bus_clock` | Statement | SPEED(dropdown) | `u8g2_set_bus_clock("100000")` | u8g2.setBusClock(...);\n |
| `u8g2_set_font` | Statement | SIZE(dropdown) | `u8g2_set_font("8")` | u8g2.setFont(...);\n |
| `u8g2_set_draw_color` | Statement | COLOR(dropdown) | `u8g2_set_draw_color("1")` | u8g2.setDrawColor(...);\n |
| `u8g2_set_font_mode` | Statement | MODE(dropdown) | `u8g2_set_font_mode("1")` | u8g2.setFontMode(...);\n |
| `u8g2_clear_buffer` | Statement | (none) | `u8g2_clear_buffer()` | u8g2.clearBuffer();\n |
| `u8g2_send_buffer` | Statement | (none) | `u8g2_send_buffer()` | u8g2.sendBuffer();\n |
| `u8x8_begin` | Statement | TYPE(dropdown) | `u8x8_begin(SSD1306)` | u8x8.begin();\n |
| `u8x8_clear` | Statement | (none) | `u8x8_clear()` | u8x8.clear();\n |
| `u8x8_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value), INVERSE(field_checkbox) | `u8x8_draw_str(math_number(0), math_number(0), text("value"), FALSE)` | u8x8.setFont( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | SSD1306, SSD1309, SH1106, SH1107, ST7305, ST7920 | u8g2_begin |
| MODE | FULL_BUFFER, PAGE_BUFFER | u8g2_begin |
| MODE | 0, 1 | u8g2_set_flip_mode, u8g2_set_power_save |
| MODE | U8G2_R0, U8G2_MIRROR, U8G2_MIRROR_VERTICAL | u8g2_set_display_mirror |
| SPEED | 100000, 400000, 1000000 | u8g2_set_bus_clock |
| SIZE | 8, 14, 19, 25, 34, 42, 50, 58 | u8g2_set_font |
| COLOR | 1, 0, 2 | u8g2_set_draw_color |
| MODE | 1, 0 | u8g2_set_font_mode |
| TYPE | SSD1306, SSD1309, SH1106, SH1107, ST7920 | u8x8_begin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, u8g2_bitmap())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Dynamic fields**: `u8g2_begin`, `u8g2_set_font`, `u8x8_begin` may add fields at runtime through Blockly extensions.
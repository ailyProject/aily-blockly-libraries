# 单色显示屏

基于u8g2的单色显示屏驱动库，可驱动多种OLED、LCD单色显示屏，支持SSD1306、SSD1309、SH1106、SH1107、ST7305、ST7920等常用驱动芯片。

## Library Info
- **Name**: @aily-project/lib-u8g2
- **Version**: 1.0.2

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `u8g2_begin` | Statement | TYPE(dropdown), MODE(dropdown) | `u8g2_begin(SSD1306, FULL_BUFFER)` | `u8g2.begin();\n` |
| `u8g2_page_buffer` | Statement | (none) | `u8g2_page_buffer()` | (dynamic code) |
| `u8g2_clear` | Statement | (none) | `u8g2_clear()` | `u8g2.clear();\n` |
| `u8g2_draw_pixel` | Statement | X(input_value), Y(input_value) | `u8g2_draw_pixel(math_number(0), math_number(0))` | `u8g2.drawPixel(..., ...);\n` |
| `u8g2_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value) | `u8g2_draw_line(math_number(0), math_number(0), math_number(0), math_number(0))` | `u8g2.drawLine(..., ..., ..., ...);\n` |
| `u8g2_draw_rectangle` | Statement | X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), FILL(field_checkbox) | `u8g2_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), FALSE)` | (dynamic code) |
| `u8g2_draw_circle` | Statement | X(input_value), Y(input_value), RADIUS(input_value), FILL(field_checkbox) | `u8g2_draw_circle(math_number(0), math_number(0), math_number(0), FALSE)` | (dynamic code) |
| `u8g2_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `u8g2_draw_str(math_number(0), math_number(0), text("hello"))` | (dynamic code) |
| `u8g2_draw_bitmap` | Statement | X(input_value), Y(input_value), BITMAP(input_value) | `u8g2_draw_bitmap(math_number(0), math_number(0), math_number(0))` | `// No bitmap data\n` |
| `u8g2_bitmap` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_bitmap()` | (dynamic code) |
| `u8g2_icon_16x16` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_16x16()` | (dynamic code) |
| `u8g2_icon_32x32` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_32x32()` | (dynamic code) |
| `u8g2_icon_64x64` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_64x64()` | (dynamic code) |
| `u8g2_set_flip_mode` | Statement | MODE(dropdown) | `u8g2_set_flip_mode(0)` | `u8g2.setFlipMode(...);\n` |
| `u8g2_set_power_save` | Statement | MODE(dropdown) | `u8g2_set_power_save(0)` | `u8g2.setPowerSave(...);\n` |
| `u8g2_set_contrast` | Statement | VALUE(input_value) | `u8g2_set_contrast(math_number(0))` | `u8g2.setContrast(...);\n` |
| `u8g2_set_bus_clock` | Statement | SPEED(dropdown) | `u8g2_set_bus_clock(100000)` | `u8g2.setBusClock(...);\n` |
| `u8g2_set_font` | Statement | SIZE(dropdown) | `u8g2_set_font(8)` | `u8g2.setFont(...);\n` |
| `u8g2_set_draw_color` | Statement | COLOR(dropdown) | `u8g2_set_draw_color(1)` | `u8g2.setDrawColor(...);\n` |
| `u8g2_set_font_mode` | Statement | MODE(dropdown) | `u8g2_set_font_mode(1)` | `u8g2.setFontMode(...);\n` |
| `u8g2_clear_buffer` | Statement | (none) | `u8g2_clear_buffer()` | `u8g2.clearBuffer();\n` |
| `u8g2_send_buffer` | Statement | (none) | `u8g2_send_buffer()` | `u8g2.sendBuffer();\n` |
| `u8x8_begin` | Statement | TYPE(dropdown) | `u8x8_begin(SSD1306)` | `u8x8.begin();\n` |
| `u8x8_clear` | Statement | (none) | `u8x8_clear()` | `u8x8.clear();\n` |
| `u8x8_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value), INVERSE(field_checkbox) | `u8x8_draw_str(math_number(0), math_number(0), text("hello"), FALSE)` | `u8x8.setFont(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | SSD1306, SSD1309, SH1106, SH1107, ST7305, ST7920 | SSD1306 / SSD1309 / SH1106 / SH1107 / ST7305 / ST7920 |
| MODE | FULL_BUFFER, PAGE_BUFFER | 全缓冲区 / 页面缓冲区 |
| SPEED | 100000, 400000, 1000000 | 100kHz（标准） / 400kHz（快速） / 1MHz（超快） |
| SIZE | 8, 14, 19, 25, 34, 42, 50, 58 | 8px / 14px / 19px / 25px / 34px / 42px / 50px / 58px |
| COLOR | 1, 0, 2 | 白色（绘制） / 黑色（擦除） / 反色（异或） |

## ABS Examples

### Basic Usage
```
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER)
    u8x8_begin(SSD1306)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, u8g2_bitmap())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order

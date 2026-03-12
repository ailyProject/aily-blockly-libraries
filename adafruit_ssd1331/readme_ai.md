# SSD1331 彩色OLED

Adafruit SSD1331 0.96寸16位彩色OLED显示屏驱动库（96x64像素），基于Adafruit GFX，支持SPI接口，支持文本、图形绘制。

## Library Info
- **Name**: @aily-project/lib-adafruit-ssd1331
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ssd1331_init` | Statement | CS(input_value), DC(input_value), RST(input_value) | `ssd1331_init(math_number(10), math_number(9), math_number(8))` | `Adafruit_SSD1331 oled(...); oled.begin();` |
| `ssd1331_set_rotation` | Statement | ROTATION(dropdown) | `ssd1331_set_rotation(0)` | `oled.setRotation(0);` |
| `ssd1331_enable_display` | Statement | ENABLE(dropdown) | `ssd1331_enable_display(true)` | `oled.enableDisplay(true);` |
| `ssd1331_fill_screen` | Statement | COLOR(input_value) | `ssd1331_fill_screen(ssd1331_preset_color())` | `oled.fillScreen(color);` |
| `ssd1331_clear_screen` | Statement | (none) | `ssd1331_clear_screen()` | `oled.fillScreen(0x0000);` |
| `ssd1331_preset_color` | Value | COLOR(field_colour_hsv_sliders) | `ssd1331_preset_color()` | `oled.color565(r, g, b)` |
| `ssd1331_set_text_color` | Statement | COLOR(input_value), BG_COLOR(input_value) | `ssd1331_set_text_color(ssd1331_preset_color(), ssd1331_preset_color())` | `oled.setTextColor(c, bg);` |
| `ssd1331_set_text_size` | Statement | SIZE(input_value) | `ssd1331_set_text_size(math_number(1))` | `oled.setTextSize(1);` |
| `ssd1331_print` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `ssd1331_print(math_number(0), math_number(0), text("Hello"))` | `oled.setCursor(x, y); oled.print(text);` |
| `ssd1331_draw_pixel` | Statement | X(input_value), Y(input_value), COLOR(input_value) | `ssd1331_draw_pixel(math_number(0), math_number(0), ssd1331_preset_color())` | `oled.drawPixel(x, y, c);` |
| `ssd1331_draw_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), COLOR(input_value) | `ssd1331_draw_line(math_number(0), math_number(0), math_number(95), math_number(63), ssd1331_preset_color())` | `oled.drawLine(x0, y0, x1, y1, c);` |
| `ssd1331_draw_fast_h_line` | Statement | X(input_value), Y(input_value), W(input_value), COLOR(input_value) | `ssd1331_draw_fast_h_line(math_number(0), math_number(0), math_number(96), ssd1331_preset_color())` | `oled.drawFastHLine(x, y, w, c);` |
| `ssd1331_draw_fast_v_line` | Statement | X(input_value), Y(input_value), H(input_value), COLOR(input_value) | `ssd1331_draw_fast_v_line(math_number(0), math_number(0), math_number(64), ssd1331_preset_color())` | `oled.drawFastVLine(x, y, h, c);` |
| `ssd1331_draw_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ssd1331_draw_rect(math_number(0), math_number(0), math_number(40), math_number(30), ssd1331_preset_color())` | `oled.drawRect(x, y, w, h, c);` |
| `ssd1331_fill_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ssd1331_fill_rect(math_number(0), math_number(0), math_number(40), math_number(30), ssd1331_preset_color())` | `oled.fillRect(x, y, w, h, c);` |
| `ssd1331_draw_round_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), R(input_value), COLOR(input_value) | `ssd1331_draw_round_rect(math_number(0), math_number(0), math_number(50), math_number(30), math_number(5), ssd1331_preset_color())` | `oled.drawRoundRect(x, y, w, h, r, c);` |
| `ssd1331_fill_round_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), R(input_value), COLOR(input_value) | `ssd1331_fill_round_rect(math_number(0), math_number(0), math_number(50), math_number(30), math_number(5), ssd1331_preset_color())` | `oled.fillRoundRect(x, y, w, h, r, c);` |
| `ssd1331_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `ssd1331_draw_circle(math_number(48), math_number(32), math_number(15), ssd1331_preset_color())` | `oled.drawCircle(x, y, r, c);` |
| `ssd1331_fill_circle` | Statement | X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `ssd1331_fill_circle(math_number(48), math_number(32), math_number(15), ssd1331_preset_color())` | `oled.fillCircle(x, y, r, c);` |
| `ssd1331_draw_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `ssd1331_draw_triangle(math_number(48), math_number(5), math_number(10), math_number(58), math_number(86), math_number(58), ssd1331_preset_color())` | `oled.drawTriangle(x0, y0, x1, y1, x2, y2, c);` |
| `ssd1331_fill_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `ssd1331_fill_triangle(math_number(48), math_number(5), math_number(10), math_number(58), math_number(86), math_number(58), ssd1331_preset_color())` | `oled.fillTriangle(x0, y0, x1, y1, x2, y2, c);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROTATION | 0, 1, 2, 3 | 0度 / 90度 / 180度 / 270度 |
| ENABLE | true, false | 开启 / 关闭显示 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ssd1331_init(math_number(10), math_number(9), math_number(8))
    ssd1331_clear_screen()
    ssd1331_set_text_size(math_number(1))
    ssd1331_set_text_color(ssd1331_preset_color(), ssd1331_preset_color())
    ssd1331_print(math_number(0), math_number(0), text("Hello SSD1331!"))
    ssd1331_draw_circle(math_number(48), math_number(40), math_number(15), ssd1331_preset_color())
```

## Notes

1. **Initialization**: Place `ssd1331_init` inside `arduino_setup()`
2. **Screen size**: 96x64 pixels, coordinate range X: 0-95, Y: 0-63
3. **Rotation**: Call `ssd1331_clear_screen()` before changing rotation to avoid display artifacts
4. **SPI**: Uses hardware SPI, connect MOSI and SCLK to the board's SPI pins

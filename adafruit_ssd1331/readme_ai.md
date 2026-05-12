# SSD1331 color OLED

Adafruit SSD1331 0.96-inch 16-bit color OLED display driver library (96x64 pixels), based on Adafruit GFX, supports SPI interface, supports text, graphic drawing (points, lines, rectangles, circles, triangles, etc.),...

## Library Info
- **Name**: @aily-project/lib-adafruit-ssd1331
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ssd1331_init` | Statement | CS(input_value), DC(input_value), RST(input_value) | `ssd1331_init(math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `ssd1331_set_rotation` | Statement | ROTATION(dropdown) | `ssd1331_set_rotation("0")` | oled.setRotation( |
| `ssd1331_enable_display` | Statement | ENABLE(dropdown) | `ssd1331_enable_display(true)` | oled.enableDisplay( |
| `ssd1331_fill_screen` | Statement | COLOR(input_value) | `ssd1331_fill_screen(math_number(0))` | oled.fillScreen( |
| `ssd1331_clear_screen` | Statement | (none) | `ssd1331_clear_screen()` | oled.fillScreen(0x0000);\n |
| `ssd1331_preset_color` | Value | COLOR(field_colour_hsv_sliders) | `ssd1331_preset_color()` | oled.color565( |
| `ssd1331_set_text_color` | Statement | COLOR(input_value), BG_COLOR(input_value) | `ssd1331_set_text_color(math_number(0), math_number(0))` | oled.setTextColor( |
| `ssd1331_set_text_size` | Statement | SIZE(input_value) | `ssd1331_set_text_size(math_number(0))` | oled.setTextSize( |
| `ssd1331_print` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `ssd1331_print(math_number(0), math_number(0), text("value"))` | oled.setCursor( |
| `ssd1331_draw_pixel` | Statement | X(input_value), Y(input_value), COLOR(input_value) | `ssd1331_draw_pixel(math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_line` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), COLOR(input_value) | `ssd1331_draw_line(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_fast_h_line` | Statement | X(input_value), Y(input_value), W(input_value), COLOR(input_value) | `ssd1331_draw_fast_h_line(math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_fast_v_line` | Statement | X(input_value), Y(input_value), H(input_value), COLOR(input_value) | `ssd1331_draw_fast_v_line(math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ssd1331_draw_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_fill_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `ssd1331_fill_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_round_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), R(input_value), COLOR(input_value) | `ssd1331_draw_round_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_fill_round_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), R(input_value), COLOR(input_value) | `ssd1331_fill_round_rect(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_circle` | Statement | X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `ssd1331_draw_circle(math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_fill_circle` | Statement | X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `ssd1331_fill_circle(math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_draw_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `ssd1331_draw_triangle(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |
| `ssd1331_fill_triangle` | Statement | X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `ssd1331_fill_triangle(math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | See generator |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ROTATION | 0, 1, 2, 3 | ssd1331_set_rotation |
| ENABLE | true, false | ssd1331_enable_display |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ssd1331_init(math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ssd1331_preset_color())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
